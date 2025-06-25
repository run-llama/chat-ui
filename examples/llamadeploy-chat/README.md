# LlamaDeploy + Chat-UI Example

This example demonstrates how to use the **chat-ui** library to create a custom chat interface for workflows deployed with [LlamaDeploy](https://github.com/run-llama/llama_deploy).

LlamaDeploy is a system for deploying and managing LlamaIndex workflows as microservices. This example shows how you can build a React-based chat interface that connects to and interacts with your deployed workflows using the `useChatWorkflow` hook.

## useChatWorkflow Hook

The `useChatWorkflow` hook is a specialized version of `useWorkflow` designed specifically for chat interfaces. It provides a chat-compatible API that integrates seamlessly with chat components while handling workflow communication in the background.

### Key Features:

- **Chat Interface**: Provides standard chat interface methods (`append`, `reload`, `stop`)
- **Message Management**: Automatically manages chat messages and conversation history
- **Event Processing**: Converts workflow events into chat messages and annotations

## Installation

Both the SDK and the CLI are part of the LlamaDeploy Python package. To install, just run:

```bash
pip install -U llama-deploy
```

## Running the Deployment

At this point we have all we need to run this deployment. Ideally, we would have the API server already running
somewhere in the cloud, but to get started let's start an instance locally. Run the following python script
from a shell:

```
$ python -m llama_deploy.apiserver
INFO:     Started server process [10842]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:4501 (Press CTRL+C to quit)
```

From another shell, use the CLI, `llamactl`, to create the deployment:

```
$ llamactl deploy llama_deploy.yml
Deployment successful: QuickStart
```

### UI Interface

LlamaDeploy will serve the UI through the apiserver, at the address `http://localhost:4501/ui/<deployment name>`. In
this case, point the browser to [http://localhost:4501/deployments/QuickStart/ui](http://localhost:4501/deployments/QuickStart/ui) to interact
with your deployment through a user-friendly interface.

### Workflow Events

Your LlamaDeploy workflows can send three main types of events to enhance the chat experience:

#### 1. SourceNodesEvent - Citations and References

Send source nodes to display citations and references for generated content:

```python
from llama_index.server.models import SourceNodesEvent
from llama_index.core.schema import NodeWithScore
from llama_index.core.data_structs import Node

ctx.write_event_to_stream(
    SourceNodesEvent(
        nodes=[
            NodeWithScore(
                node=Node(
                    text="sample node content",
                    metadata={"URL": "https://example.com/document.pdf"},
                ),
                score=0.8,
            ),
        ],
    )
)
```

#### 2. ArtifactEvent - Code and Artifacts

Send code snippets, documents, or other artifacts that can be displayed in a dedicated canvas:

```python
from llama_index.server.models import ArtifactEvent
import time

ctx.write_event_to_stream(
    ArtifactEvent(
        data={
            "type": "code",
            "created_at": int(time.time()),
            "data": {
                "language": "typescript",
                "file_name": "example.ts",
                "code": 'console.log("Hello, world!");',
            },
        }
    )
)
```

#### 3. UIEvent - Custom UI Components

Send custom data to render specialized UI components:

```python
from llama_index.server.models import UIEvent
from pydantic import BaseModel

class WeatherData(BaseModel):
    location: str
    temperature: float
    condition: str
    humidity: int
    windSpeed: int

weather_data = WeatherData(
    location="San Francisco, CA",
    temperature=22,
    condition="sunny",
    humidity=65,
    windSpeed=12,
)

ctx.write_event_to_stream(
    UIEvent(type="weather", data=weather_data)
)
```

These events will be automatically processed by `useChatWorkflow` and rendered as annotations in the chat interface.

## Learn More

- [LlamaDeploy GitHub Repository](https://github.com/run-llama/llama_deploy)
- [Chat-UI Documentation](../../docs/chat-ui/)
