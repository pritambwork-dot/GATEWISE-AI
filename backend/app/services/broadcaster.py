"""
GATEWISE AI — Real-Time Event Broadcaster
=========================================
Pub-sub dispatcher for Desktop Command Centre SSE feeds.
Ensures zero-delay event propagation to administrators immediately after
database commit.
"""

import asyncio
from typing import Set, Dict, Any
from ..core.logging import logger


class EventBroadcaster:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(EventBroadcaster, cls).__new__(cls)
            cls._instance.subscribers: Set[asyncio.Queue] = set()
        return cls._instance

    def subscribe(self) -> asyncio.Queue:
        q: asyncio.Queue = asyncio.Queue(maxsize=100)
        self.subscribers.add(q)
        return q

    def unsubscribe(self, q: asyncio.Queue):
        self.subscribers.discard(q)

    def publish_event(self, event_data: Dict[str, Any]):
        """Dispatches event payload to all active SSE listener queues."""
        stale_subscribers = []
        for q in list(self.subscribers):
            try:
                q.put_nowait(event_data)
            except asyncio.QueueFull:
                stale_subscribers.append(q)
            except Exception:
                stale_subscribers.append(q)

        for stale in stale_subscribers:
            self.unsubscribe(stale)


broadcaster = EventBroadcaster()
