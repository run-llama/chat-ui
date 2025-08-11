import asyncio
import json
import uuid
from typing import Any, AsyncGenerator, Dict, Union
from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse

router = APIRouter(prefix="/chat")

DATA_PREFIX = "data: "
TOKEN_DELAY = 0.03  # 30ms delay between tokens
PART_DELAY = 1.0  # 1s delay between parts


class SSEStreamResponse(StreamingResponse):
    """
    New SSE format compatible with the updated Next.js chat handler.
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


@router.post("/")
async def chat(request: Request) -> StreamingResponse:
    data = await request.json()
    messages = data.get("messages", [])
    last_message = messages[-1] if messages else {}
    
    # Handle new message format with parts
    if "parts" in last_message and last_message["parts"]:
        # Extract text from the first part
        first_part = last_message["parts"][0]
        if isinstance(first_part, dict) and "text" in first_part:
            content = first_part["text"]
        else:
            content = ""
    else:
        # Fallback to old format
        content = last_message.get("content", "")
    
    query_text = f'User query: "{content}".\n'
    
    # Advanced sample parts matching the Next.js advanced route
    sample_parts = [
        "Welcome to the demo of @llamaindex/chat-ui. Let me show you the different types of components that can be triggered from the server.",
        
        """
### Text Part
Text part is used to display text in the chat. It is in markdown format.
You can use markdown syntax to format the text. Some examples:

- **bold** -> this is bold text
- *italic* -> this is italic text
- [link](https://www.google.com) -> this is a link

You can also display a code block inside markdown.

```js
const a = 1
const b = 2
const c = a + b
console.log(c)
```""",

        """
### Parts

Beside text, you can also display parts in the chat. Parts can be displayed before or after the text.

**Built-in parts**

@llamaindex/chat-ui provides some built-in parts for you to use

- **file** -> display a file with name and url
- **event** -> display a event with title, status, and data
- **artifact** -> display a code artifact
- **sources** -> display a list of sources
- **suggested-questions** -> display a list of suggested questions

**Custom parts**

You can also create your own custom parts.

- **weather** -> display a weather card
- **wiki** -> display a wiki card
""",

        "**file**: Here is the demo of a file part",
        {
            "type": "file",
            "data": {
                "filename": "upload.pdf",
                "mediaType": "application/pdf",
                "url": "https://pdfobject.com/pdf/sample.pdf"
            }
        },

        "**event**: Here is the demo of event parts. The second event part will override the first one because they have the same id",
        {
            "id": "demo_sample_event_id",
            "type": "event",
            "data": {
                "title": "Calling tool `get_weather` with input `San Francisco, CA`",
                "status": "pending"
            }
        },
        {
            "id": "demo_sample_event_id",  # Same id to override previous part
            "type": "event",
            "data": {
                "title": "Got response from tool `get_weather` with input `San Francisco, CA`",
                "status": "success",
                "data": {
                    "location": "San Francisco, CA",
                    "temperature": 22,
                    "condition": "sunny",
                    "humidity": 65,
                    "windSpeed": 12
                }
            }
        },

        "**weather**: Here is the demo of a weather part. It is a custom part",
        {
            "type": "weather",
            "data": {
                "location": "San Francisco, CA",
                "temperature": 22,
                "condition": "sunny",
                "humidity": 65,
                "windSpeed": 12
            }
        },

        "**wiki**: Here is the demo of a wiki part",
        {
            "type": "wiki",
            "data": {
                "title": "LlamaIndex",
                "summary": "LlamaIndex is a framework for building AI applications.",
                "url": "https://www.llamaindex.ai",
                "category": "AI",
                "lastUpdated": "2025-06-02"
            }
        },

        "**artifact**: Here is the demo of a artifact part",
        {
            "type": "artifact",
            "data": {
                "type": "code",
                "data": {
                    "file_name": "code.py",
                    "code": 'print("Hello, world!")',
                    "language": "python"
                }
            }
        },

        "**sources**: Here is the demo of a sources part",
        {
            "type": "sources",
            "data": {
                "nodes": [
                    {"id": "1", "url": "/sample.pdf"},
                    {"id": "2", "url": "/sample.pdf"}
                ]
            }
        },

        "**suggested-questions**: Here is the demo of a suggested-questions part",
        {
            "type": "suggested-questions",
            "data": [
                "I think you should go to the beach",
                "I think you should go to the mountains",
                "I think you should go to the city"
            ]
        }
    ]

    return SSEStreamResponse(parts=sample_parts, query=query_text)
