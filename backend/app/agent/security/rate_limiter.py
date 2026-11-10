import time
import threading
from typing import Dict, List
from fastapi import HTTPException, status
from ..config import agent_settings

class SlidingWindowRateLimiter:
    """Thread-safe sliding-window rate limiter per user."""

    def __init__(self):
        self._user_timestamps: Dict[str, List[float]] = {}
        self._lock = threading.Lock()

    def check_rate_limit(self, user_id: str):
        """
        Enforces per-minute and daily rate limits for assistant requests.
        Raises HTTP 429 if limit is exceeded.
        """
        now = time.time()
        max_per_minute = agent_settings.GEMINI_MAX_REQUESTS_PER_MINUTE
        daily_limit = agent_settings.GEMINI_DAILY_REQUEST_LIMIT

        with self._lock:
            if user_id not in self._user_timestamps:
                self._user_timestamps[user_id] = []

            # Purge timestamps older than 24 hours (86,400s)
            cutoff_day = now - 86400
            timestamps = [t for t in self._user_timestamps[user_id] if t > cutoff_day]

            # Check 1-minute window
            cutoff_minute = now - 60
            recent_minute = [t for t in timestamps if t > cutoff_minute]

            if len(recent_minute) >= max_per_minute:
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail=f"Assistant rate limit exceeded: Maximum {max_per_minute} requests per minute permitted."
                )

            if len(timestamps) >= daily_limit:
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail=f"Daily assistant request quota reached: Maximum {daily_limit} requests per day permitted."
                )

            timestamps.append(now)
            self._user_timestamps[user_id] = timestamps

    def reset(self):
        """Clears all in-memory rate-limiting timestamps (useful for test resets)."""
        with self._lock:
            self._user_timestamps.clear()

rate_limiter = SlidingWindowRateLimiter()
