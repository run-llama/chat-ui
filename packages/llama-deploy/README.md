# @llamaindex/llama-deploy

This package provides a TypeScript API client generated from the OpenAPI specification using `@hey-api/openapi-ts`.

## Installation

```bash
npm install @llamaindex/llama-deploy
```

## Development

### Generate API Client

To generate the API client from the OpenAPI specification:

```bash
npm run generate
```

This will read the OpenAPI JSON file from `../chat-ui/src/hook/openapi.json` and generate TypeScript client code in `src/generated/`.

### Build

To build the package:

```bash
npm run build
```

This will run the generator and compile TypeScript to the `dist/` directory.

### Clean

To clean generated files:

```bash
npm run clean
```

## Usage

```typescript
import { client, DeploymentsService } from '@llamaindex/llama-deploy';

// Configure the client
client.setConfig({
  baseUrl: 'https://your-api-base-url.com'
});

// Use the API services
const deployments = await DeploymentsService.readDeploymentsDeploymentsGet();
```

## API Services

The generated client includes services for:

- **DeploymentsService**: Manage deployments
- **TasksService**: Create and manage tasks
- **SessionsService**: Handle sessions
- **EventsService**: Stream and send events

## Generated Files

The following files are generated and should not be edited manually:

- `src/generated/client.ts` - HTTP client configuration
- `src/generated/services.ts` - API service methods
- `src/generated/types.ts` - TypeScript type definitions
- `src/generated/index.ts` - Main exports

## Configuration

The generation is configured in `openapi-ts.config.ts`. Key settings:

- **Input**: `../chat-ui/src/hook/openapi.json`
- **Output**: `./src/generated`
- **Client**: `@hey-api/client-fetch`
- **Format**: Prettier formatting applied 