"""
GATEWISE AI — Performance Benchmark & Profiling Suite
=====================================================
Executes empirical micro-benchmarks, end-to-end endpoint profiling,
vector scaling benchmarks, and multi-threaded concurrency load tests.
Outputs reproducible statistical metrics (p50, p95, p99, min, max, throughput).
"""

import time
import base64
import uuid
import json
import concurrent.futures
from typing import List, Dict, Any
import numpy as np
import cv2

from fastapi.testclient import TestClient
from backend.app.main import app, seed_initial_data
from backend.app.computer_vision.face_pipeline import cv_pipeline
from backend.app.services.verification_service import compute_crypto_signature
from backend.app.services.drive_sync_service import generate_deterministic_embedding
from backend.app.services.embedding_cache import embedding_cache
from backend.app.core.database import SessionLocal


def benchmark_cv_components(num_trials: int = 100) -> Dict[str, Any]:
    """Micro-benchmarks individual computer vision algorithms."""
    # 1. Image Quality / Blur
    img = np.random.randint(50, 200, (320, 320, 3), dtype=np.uint8)
    blur_latencies = []
    for _ in range(num_trials):
        t0 = time.perf_counter()
        cv_pipeline.assess_image_quality(img)
        blur_latencies.append((time.perf_counter() - t0) * 1000)

    # 2. Vector Cosine Similarity (Scalar Python vs Vectorized NumPy)
    v1 = np.random.randn(128).tolist()
    v2 = np.random.randn(128).tolist()
    scalar_sim_latencies = []
    for _ in range(num_trials):
        t0 = time.perf_counter()
        cv_pipeline.cosine_similarity(v1, v2)
        scalar_sim_latencies.append((time.perf_counter() - t0) * 1000)

    # 3. HMAC-SHA256 Crypto Seal
    hmac_latencies = []
    for _ in range(num_trials):
        t0 = time.perf_counter()
        compute_crypto_signature("evt-test", "2026-11-10T12:00:00Z", "gate-01", "guard-01", "VERIFIED_AUTHORIZED", "GRANT_ENTRY")
        hmac_latencies.append((time.perf_counter() - t0) * 1000)

    return {
        "blur_assessment": {
            "p50": float(np.percentile(blur_latencies, 50)),
            "p95": float(np.percentile(blur_latencies, 95)),
            "p99": float(np.percentile(blur_latencies, 99)),
        },
        "cosine_similarity_scalar": {
            "p50": float(np.percentile(scalar_sim_latencies, 50)),
            "p95": float(np.percentile(scalar_sim_latencies, 95)),
            "p99": float(np.percentile(scalar_sim_latencies, 99)),
        },
        "hmac_sha256_seal": {
            "p50": float(np.percentile(hmac_latencies, 50)),
            "p95": float(np.percentile(hmac_latencies, 95)),
            "p99": float(np.percentile(hmac_latencies, 99)),
        }
    }


def benchmark_vector_search_scaling(sizes: List[int] = [100, 1000, 10000], num_trials: int = 50) -> Dict[str, Any]:
    """Benchmarks exact cosine similarity search scaling with dataset size."""
    results = {}
    query_vec = np.random.randn(128).astype(np.float32)
    query_vec /= np.linalg.norm(query_vec)

    for n in sizes:
        # Generate N normalized 128-D vectors
        mat = np.random.randn(n, 128).astype(np.float32)
        mat /= np.linalg.norm(mat, axis=1, keepdims=True)

        # 1. Vectorized NumPy search
        vec_times = []
        for _ in range(num_trials):
            t0 = time.perf_counter()
            dots = np.dot(mat, query_vec)
            _ = np.argmax(dots)
            vec_times.append((time.perf_counter() - t0) * 1000)

        # 2. Linear Python search
        mat_list = mat.tolist()
        q_list = query_vec.tolist()
        py_times = []
        for _ in range(min(num_trials, 10)): # Fewer trials for slow Python loop
            t0 = time.perf_counter()
            best_sim = -1.0
            best_idx = -1
            for i, row in enumerate(mat_list):
                sim = cv_pipeline.cosine_similarity(q_list, row)
                if sim > best_sim:
                    best_sim = sim
                    best_idx = i
            py_times.append((time.perf_counter() - t0) * 1000)

        results[f"N_{n}"] = {
            "dataset_size": n,
            "numpy_vectorized_p50_ms": float(np.percentile(vec_times, 50)),
            "numpy_vectorized_p95_ms": float(np.percentile(vec_times, 95)),
            "python_linear_p50_ms": float(np.percentile(py_times, 50)),
            "speedup_factor": float(np.percentile(py_times, 50) / np.percentile(vec_times, 50))
        }

    return results


def benchmark_api_endpoints(client: TestClient, num_trials: int = 50) -> Dict[str, Any]:
    """Benchmarks actual HTTP endpoint latencies through TestClient."""
    # Authenticate Guard
    auth_times = []
    token = None
    for _ in range(20):
        t0 = time.perf_counter()
        res = client.post("/api/v1/auth/login", json={"employee_id": "SEC-G014", "password": "guard123"})
        auth_times.append((time.perf_counter() - t0) * 1000)
        if res.status_code == 200 and not token:
            token = res.json()["access_token"]

    assert token is not None, "Failed to get guard token for benchmark"

    # Verification Payload
    img = np.random.randint(60, 200, (320, 320, 3), dtype=np.uint8)
    # Add face-like oval so quality check passes
    cv2.ellipse(img, (160, 160), (70, 90), 0, 0, 360, (140, 160, 220), -1)
    noise = np.random.randint(0, 30, (320, 320, 3), dtype=np.uint8)
    img = cv2.add(img, noise)
    _, buf = cv2.imencode(".jpg", img)
    b64 = base64.b64encode(buf).decode("utf-8")

    # Benchmark POST /verification/verify
    verify_times = []
    event_ids = []
    for _ in range(num_trials):
        t0 = time.perf_counter()
        res = client.post(
            "/api/v1/verification/verify",
            headers={"Authorization": f"Bearer {token}"},
            json={"gate_id": "gate-main-02", "image_base64": b64}
        )
        assert res.status_code == 200
        verify_times.append((time.perf_counter() - t0) * 1000)
        event_ids.append(res.json()["event_id"])

    # Benchmark POST /verification/decision
    decision_times = []
    for evt_id in event_ids[:min(len(event_ids), 30)]:
        t0 = time.perf_counter()
        res = client.post(
            "/api/v1/verification/decision",
            headers={"Authorization": f"Bearer {token}"},
            json={"event_id": evt_id, "guard_decision": "GRANT_ENTRY", "decision_reason": "Benchmark verify"}
        )
        if res.status_code == 200:
            decision_times.append((time.perf_counter() - t0) * 1000)

    # Benchmark GET /activity/recent
    recent_times = []
    for _ in range(num_trials):
        t0 = time.perf_counter()
        res = client.get("/api/v1/activity/recent?limit=25", headers={"Authorization": f"Bearer {token}"})
        assert res.status_code == 200
        recent_times.append((time.perf_counter() - t0) * 1000)

    return {
        "auth_login": {
            "p50": float(np.percentile(auth_times, 50)),
            "p95": float(np.percentile(auth_times, 95)),
            "p99": float(np.percentile(auth_times, 99)),
        },
        "verification_verify": {
            "p50": float(np.percentile(verify_times, 50)),
            "p95": float(np.percentile(verify_times, 95)),
            "p99": float(np.percentile(verify_times, 99)),
            "min": float(min(verify_times)),
            "max": float(max(verify_times))
        },
        "guard_decision": {
            "p50": float(np.percentile(decision_times, 50)) if decision_times else 0.0,
            "p95": float(np.percentile(decision_times, 95)) if decision_times else 0.0,
            "p99": float(np.percentile(decision_times, 99)) if decision_times else 0.0,
        },
        "activity_recent": {
            "p50": float(np.percentile(recent_times, 50)),
            "p95": float(np.percentile(recent_times, 95)),
            "p99": float(np.percentile(recent_times, 99)),
        }
    }


def benchmark_concurrency(concurrency_levels: List[int] = [1, 5, 10, 20], requests_per_worker: int = 5) -> Dict[str, Any]:
    """Simulates concurrent guard terminals hitting the backend simultaneously."""
    results = {}
    client = TestClient(app)
    res = client.post("/api/v1/auth/login", json={"employee_id": "SEC-G014", "password": "guard123"})
    token = res.json()["access_token"]

    img = np.random.randint(60, 200, (320, 320, 3), dtype=np.uint8)
    cv2.ellipse(img, (160, 160), (70, 90), 0, 0, 360, (140, 160, 220), -1)
    noise = np.random.randint(0, 30, (320, 320, 3), dtype=np.uint8)
    img = cv2.add(img, noise)
    _, buf = cv2.imencode(".jpg", img)
    b64 = base64.b64encode(buf).decode("utf-8")

    def make_request(guard_idx: int) -> float:
        t0 = time.perf_counter()
        r = client.post(
            "/api/v1/verification/verify",
            headers={"Authorization": f"Bearer {token}", "X-Guard-ID": f"guard-{guard_idx}"},
            json={"gate_id": "gate-main-02", "image_base64": b64}
        )
        assert r.status_code == 200
        return (time.perf_counter() - t0) * 1000

    for c in concurrency_levels:
        total_requests = c * requests_per_worker
        latencies = []
        t_batch_start = time.perf_counter()

        with concurrent.futures.ThreadPoolExecutor(max_workers=c) as executor:
            futures = [executor.submit(make_request, i % c) for i in range(total_requests)]
            for f in concurrent.futures.as_completed(futures):
                latencies.append(f.result())

        total_wall_time = time.perf_counter() - t_batch_start
        throughput = total_requests / total_wall_time if total_wall_time > 0 else 0

        results[f"concurrency_{c}"] = {
            "concurrent_guards": c,
            "total_requests": total_requests,
            "throughput_req_per_sec": round(throughput, 1),
            "p50_latency_ms": round(float(np.percentile(latencies, 50)), 2),
            "p95_latency_ms": round(float(np.percentile(latencies, 95)), 2),
            "p99_latency_ms": round(float(np.percentile(latencies, 99)), 2),
            "min_latency_ms": round(float(min(latencies)), 2),
            "max_latency_ms": round(float(max(latencies)), 2),
        }

    return results


def main():
    print("Initializing benchmark environment...")
    seed_initial_data()
    client = TestClient(app)

    print("\n1. Running Computer Vision Micro-Benchmarks...")
    cv_metrics = benchmark_cv_components()
    print(json.dumps(cv_metrics, indent=2))

    print("\n2. Running Vector Search Scaling Benchmarks (Exact vs In-Memory)...")
    vec_metrics = benchmark_vector_search_scaling()
    print(json.dumps(vec_metrics, indent=2))

    print("\n3. Running API Endpoint Benchmarks...")
    api_metrics = benchmark_api_endpoints(client)
    print(json.dumps(api_metrics, indent=2))

    print("\n4. Running Multi-Worker Concurrency Load Testing...")
    concurrency_metrics = benchmark_concurrency()
    print(json.dumps(concurrency_metrics, indent=2))

    full_results = {
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "cv_micro_benchmarks": cv_metrics,
        "vector_scaling": vec_metrics,
        "api_endpoints": api_metrics,
        "concurrency_testing": concurrency_metrics
    }

    with open("docs/performance/benchmark_results.json", "w") as f:
        json.dump(full_results, f, indent=2)

    print("\nAll benchmarks completed and persisted to docs/performance/benchmark_results.json")


if __name__ == "__main__":
    main()
