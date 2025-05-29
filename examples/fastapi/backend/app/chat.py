from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse

from app.vercel import VercelStreamResponse

router = APIRouter(prefix="/chat")


@router.post("/")
async def chat(request: Request) -> StreamingResponse:
    data = await request.json()
    messages = data.get("messages", [])
    last_message = messages[-1] if messages else {"content": ""}
    
    query_text = f'User query: "{last_message.get("content", "")}".\\n'
    
    sample_text = """
Welcome to the demo of @llamaindex/chat-ui. Let me show you the different types of components that can be triggered from the server.

### Markdown with code block

```js
const a = 1
const b = 2
const c = a + b
console.log(c)
```

### Annotations

"""
    
    text_tokens = sample_text.split(' ')
    
    sample_annotations = [
        {
            "type": "sources",
            "data": {
                "nodes": [
                    {"id": "1", "url": "/sample.pdf"},
                    {"id": "2", "url": "/sample.pdf"},
                ],
            },
        },
        {
            "type": "artifact",
            "data": {
                "type": "code",
                "data": {
                    "file_name": "sample.ts",
                    "language": "typescript",
                    "code": 'console.log("Hello, world!");',
                },
            },
        },
        {
            "type": "weather",
            "data": {
                "location": "San Francisco, CA",
                "temperature": 22,
                "condition": "sunny",
                "humidity": 65,
                "windSpeed": 12,
            },
        },
    ]
    
    events = [
        query_text,
        *[f"{token} " for token in text_tokens],
        *sample_annotations,
    ]

    return VercelStreamResponse(events=events)
