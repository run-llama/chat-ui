from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse

from app.vercel import VercelStreamResponse

router = APIRouter(prefix="/chat")


@router.post("/")
async def chat(request: Request) -> StreamingResponse:
    text_stream = [
        "Hi",
        " !",
        " Let",
        " me",
        " show",
        " some",
        " example",
        " components",
        " to",
        " the",
        " UI",
        ".",
    ]
    events = [
        *text_stream,
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
            "type": "sources",
            "data": {
                "nodes": [
                    {
                        "id": "1",
                        "url": "/sample.pdf",
                    },
                    {
                        "id": "2",
                        "url": "/sample.pdf",
                    },
                ]
            },
        },
    ]

    return VercelStreamResponse(events=events)
