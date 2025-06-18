# LlamaDeploy + Chat-UI Example

This example demonstrates how to use the **chat-ui** library to create a custom interface for workflows deployed with [LlamaDeploy](https://github.com/run-llama/llama_deploy).

LlamaDeploy is a system for deploying and managing LlamaIndex workflows as microservices. This example shows how you can build a React-based chat interface that connects to and interacts with your deployed workflows using the `useWorkflow` hook.

## useWorkflow Hook

The `useWorkflow` hook is a React hook provided by chat-ui that simplifies interaction with LlamaDeploy workflows. It handles:

- **Client Management**: Automatically creates and manages the LlamaDeploy client connection
- **Task Lifecycle**: Creates new tasks, manages existing tasks, and handles task sessions
- **Event Streaming**: Real-time streaming of workflow events and responses
- **State Management**: Tracks workflow status (running, complete, error) and event history
- **Error Handling**: Provides callbacks for handling errors and stop events

### Key Features:

- Start new workflow tasks with custom event data
- Send events to running workflows
- Stream real-time events from workflows
- Manage workflow state and session persistence
- Handle workflow completion and error states

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

## Learn More

- [LlamaDeploy GitHub Repository](https://github.com/run-llama/llama_deploy)
- [Chat-UI Documentation](../../docs/chat-ui/)
