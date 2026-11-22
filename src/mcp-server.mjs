#!/usr/bin/env node
/**
 * Apify External Business Intelligence MCP Server (stdio, v2.0.0)
 * Exposes 7 zero-proxy 128MB-256MB Apify Actors + 5 one-click workflow Prompts.
 * Note: initialize, tools/list, prompts/list, and prompts/get work with NO APIFY_TOKEN
 * so MCP clients and automated indexers (e.g. Glama.ai) inspect schemas cleanly.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  GetPromptRequestSchema,
  ListPromptsRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import {
  SERVER_INSTRUCTIONS,
  SERVER_NAME,
  SERVER_VERSION,
  buildPromptResult,
  executeApifyTool,
  listPromptsResponse,
  listToolsResponse,
} from './mcp-catalog.mjs';

const server = new Server(
  {
    name: SERVER_NAME,
    version: SERVER_VERSION,
  },
  {
    capabilities: {
      tools: {},
      prompts: {},
    },
    instructions: SERVER_INSTRUCTIONS,
  },
);

server.setRequestHandler(ListToolsRequestSchema, async () => listToolsResponse());

server.setRequestHandler(ListPromptsRequestSchema, async () => listPromptsResponse());

server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;
  const result = buildPromptResult(name, args);
  if (!result) {
    throw new Error(`Unknown prompt: ${name}`);
  }
  return result;
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;
  return executeApifyTool(name, args, process.env.APIFY_TOKEN, 180_000);
});

const transport = new StdioServerTransport();
await server.connect(transport);
