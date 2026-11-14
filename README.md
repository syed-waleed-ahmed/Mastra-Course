# Mastra Course

My hands-on work from the [Mastra](https://mastra.ai) course, written in TypeScript. It covers the main building blocks of a Mastra application: agents, tools, workflows, memory, MCP servers, evaluation scorers and tracing, all registered in a single Mastra instance in [`src/mastra/index.ts`](src/mastra/index.ts).

## What is inside

### Agents

| Agent | File | What it demonstrates |
| --- | --- | --- |
| Weather Agent | [`agents/weather-agent.ts`](src/mastra/agents/weather-agent.ts) | A starter agent that calls a weather tool |
| Financial Assistant | [`agents/financial-agent.ts`](src/mastra/agents/financial-agent.ts) | A custom `getTransactions` tool that reads a CSV of transactions, MCP tools from a Hacker News server and a filesystem server, and memory with semantic recall and working memory |
| Content Agent | [`agents/content-agent.ts`](src/mastra/agents/content-agent.ts) | Analyzes text for clarity, themes and quality, and suggests improvements |
| Memory Agent | [`agents/index.ts`](src/mastra/agents/index.ts) | Working memory with a user-profile template that persists across conversations |
| Learning Assistant | [`agents/learning-assistant.ts`](src/mastra/agents/learning-assistant.ts) | Tracks a learner profile (topics, skill level, goals, progress) in working memory |

### Workflows

| Workflow | File | What it demonstrates |
| --- | --- | --- |
| `weatherWorkflow` | [`workflows/weather-workflow.ts`](src/mastra/workflows/weather-workflow.ts) | A basic multi-step workflow |
| `contentWorkflow` | [`workflows/content-workflow.ts`](src/mastra/workflows/content-workflow.ts) | Validate, enhance and summarize content with typed (Zod) step inputs and outputs |
| `aiContentWorkflow` | same file | Adds an AI analysis step that calls the Content Agent |
| `parallelAnalysisWorkflow` | same file | SEO, readability and sentiment analyses running in parallel |
| `conditionalWorkflow` | same file | Branches to different steps depending on the content type |

### Evaluation, storage and tracing

- **Scorers** in [`scorers/weather-scorer.ts`](src/mastra/scorers/weather-scorer.ts): tool-call appropriateness, completeness and translation quality.
- **Storage** with libSQL: in-memory for development, with memory and vector stores on disk for the agents that remember.
- **Tracing** through Mastra observability, with a filter that redacts sensitive data from spans.

## Run it

Requirements: Node.js 22.13 or newer and an OpenAI API key.

```bash
npm install
echo "OPENAI_API_KEY=sk-..." > .env
npm run dev
```

`npm run dev` starts Mastra Studio, where you can chat with each agent, run the workflows step by step and inspect traces. It prints the local URL when it starts.

To run the content workflow from code instead of Studio:

```bash
npx tsx --env-file=.env src/run-workflow.ts
```

The Financial Assistant starts its MCP servers with `npx`, so the first run downloads them. The GitHub and Zapier MCP servers in that file are left commented out because they need separate accounts.

## Stack

TypeScript · Mastra (`@mastra/core`, `memory`, `mcp`, `evals`, `libsql`, `observability`) · Zod · OpenAI models
