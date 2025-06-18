import '@testing-library/jest-dom'
import { beforeAll, afterEach, afterAll } from 'vitest'
import { setupServer } from 'msw/node'
import { mockLlamaDeployServer } from './mocks/llama-deploy-server'

// Setup MSW server
export const server = setupServer(...mockLlamaDeployServer)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

// Mock fetch globally
global.fetch = global.fetch || (() => Promise.resolve({} as Response))
