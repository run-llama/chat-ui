import asyncio
import json
from typing import Any, AsyncGenerator, Iterable, Union

from fastapi.responses import StreamingResponse


class VercelStreamResponse(StreamingResponse):
    """
    Converts preprocessed events into Vercel-compatible streaming response format.
    """

    TEXT_PREFIX = "0:"
    DATA_PREFIX = "8:"
    ERROR_PREFIX = "3:"

    def __init__(
        self,
        events: Iterable[Any],
        *args: Any,
        **kwargs: Any,
    ):
        stream = self._stream_event(events=events)
        super().__init__(stream, *args, **kwargs)

    async def _stream_event(self, events: Iterable[Any]) -> AsyncGenerator[str, None]:
        stream_started = False
        for event in events:
            if not stream_started:
                yield self.convert_text("")
                stream_started = True
            # Simulate a small delay between events
            await asyncio.sleep(0.1)
            if isinstance(event, str):
                yield self.convert_text(event)
            elif isinstance(event, dict):
                yield self.convert_data(event)
            else:
                raise ValueError(f"Unknown event type: {type(event)}")

    @classmethod
    def convert_text(cls, token: str) -> str:
        """Convert text event to Vercel format."""
        # Escape newlines and double quotes to avoid breaking the stream
        token = json.dumps(token)
        return f"{cls.TEXT_PREFIX}{token}\n"

    @classmethod
    def convert_data(cls, data: Union[dict, str]) -> str:
        """Convert data event to Vercel format."""
        data_str = json.dumps(data) if isinstance(data, dict) else data
        return f"{cls.DATA_PREFIX}[{data_str}]\n"

    @classmethod
    def convert_error(cls, error: str) -> str:
        """Convert error event to Vercel format."""
        error_str = json.dumps(error)
        return f"{cls.ERROR_PREFIX}{error_str}\n"
