
// ============================================================
// MASTRA PROJECT CONFIGURATION
// ============================================================
// This file exports the main Mastra instance that includes:
// - Agents: AI assistants with tools and memory
// - Workflows: Multi-step state-machine processes
// - Storage: Data persistence layer
// - Observability: Tracing and monitoring
// ============================================================

import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { Observability, DefaultExporter, CloudExporter, SensitiveDataFilter } from '@mastra/observability';
import { weatherWorkflow } from './workflows/weather-workflow';
import { contentWorkflow } from './workflows/content-workflow';
import { weatherAgent } from './agents/weather-agent';
import { financialAgent } from './agents/financial-agent';
import { contentAgent } from './agents/content-agent';
import { memoryAgent } from './agents';
import { learningAssistantAgent } from './agents/learning-assistant';
import { toolCallAppropriatenessScorer, completenessScorer, translationScorer } from './scorers/weather-scorer';

// ============================================================
// MASTRA INSTANCE
// ============================================================
export const mastra = new Mastra({
  // AGENTS: AI assistants created in Lesson 1 & 2
  // - weatherAgent: Example agent from setup
  // - financialAgent: Your new agent with:
  //   * Custom getTransactions tool
  //   * HackerNews MCP integration
  //   * Memory for conversation history
  //   * Commented examples: Zapier, GitHub MCPs
  // - contentAgent: Content analysis agent from Lesson 4
  agents: { weatherAgent, financialAgent, contentAgent, memoryAgent, learningAssistantAgent },
  
  // WORKFLOWS: Multi-step processes from Lesson 4
  // - weatherWorkflow: Example workflow
  // - contentWorkflow: Content validation and enhancement workflow
  workflows: { weatherWorkflow, contentWorkflow },
  
  // SCORERS: Quality metrics for evaluations (Lesson with evals)
  scorers: { toolCallAppropriatenessScorer, completenessScorer, translationScorer },
  
  // STORAGE: Persistent data layer
  // Stores:
  // - Agent memory and conversations
  // - Workflow execution history
  // - Traces and observability data
  storage: new LibSQLStore({
    id: "mastra-storage",
    // Using in-memory (:memory:) for development
    // For production: change to 'file:../mastra.db'
    url: ":memory:",
  }),
  
  // LOGGING: System logging configuration
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
  
  // OBSERVABILITY: Tracing and monitoring
  // Tracks agent operations for debugging and performance analysis
  observability: new Observability({
    configs: {
      default: {
        serviceName: 'mastra',
        exporters: [
          new DefaultExporter(), // Persists traces to storage for Mastra Studio
          new CloudExporter(), // Sends traces to Mastra Cloud (if MASTRA_CLOUD_ACCESS_TOKEN is set)
        ],
        spanOutputProcessors: [
          new SensitiveDataFilter(), // Redacts sensitive data like passwords, tokens, keys
        ],
      },
    },
  }),
});

// ============================================================
// HOW TO USE THIS FILE
// ============================================================
//
// 1. REGISTER NEW AGENTS:
//    agents: { weatherAgent, financialAgent, yourNewAgent }
//
// 2. ADD WORKFLOWS:
//    workflows: { weatherWorkflow, monthlyReportWorkflow }
//
// 3. ENABLE CLOUD TRACING:
//    Set environment variable: MASTRA_CLOUD_ACCESS_TOKEN=your_token
//    Traces automatically sent to Mastra Cloud dashboard
//
// 4. SWITCH STORAGE:
//    Change url from ":memory:" to "file:../mastra.db"
//    Persists all data to disk between sessions
//
