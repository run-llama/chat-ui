import asyncio
import json
import uuid
from typing import Any, AsyncGenerator, Dict, Union
from fastapi.responses import StreamingResponse

DATA_PREFIX = "data: "
TOKEN_DELAY = 0.03  # 30ms delay between tokens
PART_DELAY = 1.0  # 1s delay between parts


class SSEStreamResponse(StreamingResponse):
    """
    New SSE format compatible with Vercel/AI SDK 5 useChat
    """

    def __init__(self, parts: list[Union[str, Dict[str, Any]]], query: str = "", **kwargs):
        stream = self._create_stream(query, parts)
        super().__init__(
            stream,
            media_type="text/event-stream",
            headers={"Connection": "keep-alive"},
            **kwargs
        )

    async def _create_stream(self, query: str, parts: list[Union[str, Dict[str, Any]]]) -> AsyncGenerator[str, None]:
        """Create SSE stream with new format"""

        async def write_text(content: str) -> AsyncGenerator[str, None]:
            """Write text content with token-by-token streaming"""
            # Generate unique message id
            message_id = str(uuid.uuid4())

            # Start text chunk
            start_chunk = {"id": message_id, "type": "text-start"}
            yield f"{DATA_PREFIX}{json.dumps(start_chunk)}\n\n"

            # Stream tokens
            for token in content.split(' '):
                if token:  # Skip empty tokens
                    delta_chunk = {
                        "id": message_id,
                        "type": "text-delta",
                        "delta": token + " "
                    }
                    yield f"{DATA_PREFIX}{json.dumps(delta_chunk)}\n\n"
                    await asyncio.sleep(TOKEN_DELAY)

            # End text chunk
            end_chunk = {"id": message_id, "type": "text-end"}
            yield f"{DATA_PREFIX}{json.dumps(end_chunk)}\n\n"

        async def write_data(data: Dict[str, Any]) -> AsyncGenerator[str, None]:
            """Write data part"""
            chunk = {
                "type": f"data-{data['type']}",  # Add data- prefix
                "data": data.get("data", {})
            }
            
            # Only include id if it exists
            if data.get("id"):
                chunk["id"] = data["id"]
                
            yield f"{DATA_PREFIX}{json.dumps(chunk)}\n\n"
            await asyncio.sleep(PART_DELAY)

        # Stream the query first
        if query:
            async for chunk in write_text(query):
                yield chunk

        # Stream all parts
        for item in parts:
            if isinstance(item, str):
                async for chunk in write_text(item):
                    yield chunk
            elif isinstance(item, dict):
                async for chunk in write_data(item):
                    yield chunk

def get_text(message: Any) -> str:
    return "\n\n".join(
        part["text"]
        for part in message["parts"]
        if part.get("type") == "text" and "text" in part
    )