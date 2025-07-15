import { LlamaIndexServer } from '@llamaindex/server'

new LlamaIndexServer({
  uiConfig: {
    componentsDir: 'components',
    layoutDir: 'layout',
    llamaDeploy: { deployment: 'chat', workflow: 'workflow' },
  },
  llamaCloud: {
    outputDir: "output/llamacloud",
  },
  port: 3000,
}).start()
