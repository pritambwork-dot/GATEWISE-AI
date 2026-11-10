"""
GATEWISE AI — In-Memory Reference Embedding Cache
=================================================
Optimizes vector search from O(N) database queries to sub-millisecond in-memory
vectorized matrix dot products.

Thread-safe, versioned, and automatically invalidated upon:
1. Google Drive reference repository sync completion.
2. Administrative enrollment referral approval.
3. Manual identity activation/deactivation.
"""

import threading
import time
from typing import List, Dict, Any, Optional, Tuple
import numpy as np
from sqlalchemy.orm import Session, joinedload
from ..models.entities import FaceEmbedding, InstitutionalIdentity
from ..core.logging import logger


class ReferenceEmbeddingCache:
    _instance = None
    _lock = threading.Lock()

    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super(ReferenceEmbeddingCache, cls).__new__(cls)
                    cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if getattr(self, "_initialized", False):
            return

        self.matrix: Optional[np.ndarray] = None # Shape (N, 128) float32 L2-normalized
        self.identities: List[Dict[str, Any]] = []
        self.version: int = 1
        self.last_refreshed: float = 0.0
        self.cache_lock = threading.RLock()
        self._initialized = True

    def invalidate(self):
        """Signals that the cache must be reloaded from the database on next read."""
        with self.cache_lock:
            self.version += 1
            self.matrix = None
            self.identities = []
            logger.info(f"ReferenceEmbeddingCache invalidated -> version {self.version}")

    def ensure_loaded(self, db: Session) -> Tuple[np.ndarray, List[Dict[str, Any]], int]:
        """Loads all ACTIVE reference embeddings into contiguous float32 memory if not cached."""
        with self.cache_lock:
            if self.matrix is not None and len(self.identities) > 0:
                return self.matrix, self.identities, self.version

            # Eager load embeddings with their parent identities to avoid N+1 queries
            t0 = time.perf_counter()
            active_records = (
                db.query(FaceEmbedding)
                .options(joinedload(FaceEmbedding.identity))
                .filter(FaceEmbedding.status == "ACTIVE")
                .all()
            )

            vectors: List[List[float]] = []
            identity_metadata: List[Dict[str, Any]] = []

            for emb in active_records:
                if emb.embedding_vector and len(emb.embedding_vector) == 128 and emb.identity:
                    vectors.append(emb.embedding_vector)
                    identity_metadata.append({
                        "identity_id": emb.identity.id,
                        "institutional_id": emb.identity.institutional_id,
                        "full_name": emb.identity.full_name,
                        "category": emb.identity.category,
                        "department": emb.identity.department,
                        "identity_status": emb.identity.identity_status,
                        "embedding_id": emb.id
                    })

            if len(vectors) > 0:
                mat = np.array(vectors, dtype=np.float32)
                # Ensure each row is unit L2-normalized
                norms = np.linalg.norm(mat, axis=1, keepdims=True)
                norms[norms == 0] = 1.0
                mat = mat / norms
                self.matrix = mat
            else:
                self.matrix = np.zeros((0, 128), dtype=np.float32)

            self.identities = identity_metadata
            self.last_refreshed = time.time()
            load_ms = (time.perf_counter() - t0) * 1000
            logger.info(
                f"ReferenceEmbeddingCache loaded {len(self.identities)} active vectors (version {self.version}) in {load_ms:.2f}ms"
            )
            return self.matrix, self.identities, self.version

    def search_nearest(
        self, query_vector: List[float], db: Session
    ) -> Tuple[Optional[Dict[str, Any]], float, float]:
        """
        Executes vectorized exact cosine similarity search across in-memory matrix:
        sim = Dot(Matrix, Query) / (||Matrix|| * ||Query||)
        Since both are L2-normalized, sim = Dot(Matrix, Query).

        Returns: (best_identity_dict, best_similarity_score, search_duration_ms)
        """
        t0 = time.perf_counter()
        mat, id_list, _ = self.ensure_loaded(db)

        if mat.shape[0] == 0 or not query_vector:
            duration_ms = (time.perf_counter() - t0) * 1000
            return None, 0.0, duration_ms

        q = np.array(query_vector, dtype=np.float32)
        q_norm = np.linalg.norm(q)
        if q_norm > 0:
            q = q / q_norm
        else:
            return None, 0.0, (time.perf_counter() - t0) * 1000

        # Vectorized dot product against all N enrolled references simultaneously
        similarities = np.dot(mat, q)
        best_idx = int(np.argmax(similarities))
        best_sim = float(similarities[best_idx])
        best_meta = id_list[best_idx]

        duration_ms = (time.perf_counter() - t0) * 1000
        return best_meta, best_sim, duration_ms


embedding_cache = ReferenceEmbeddingCache()
