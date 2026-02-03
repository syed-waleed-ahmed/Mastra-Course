import { Agent } from '@mastra/core/agent'
import { Memory } from '@mastra/memory'
import { LibSQLStore } from '@mastra/libsql'
import { MCPClient } from '@mastra/mcp'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import { getTransactionsTool } from '../tools/get-transactions-tool'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const resolveProjectRoot = () => {
  const candidates = [process.cwd(), __dirname]
  for (const start of candidates) {
    let current = start
    // Walk up until we find a package.json or reach filesystem root
    while (true) {
      if (fs.existsSync(path.join(current, 'package.json'))) {
        return current
      }
      const parent = path.dirname(current)
      if (parent === current) break
      current = parent
    }
  }
  return process.cwd()
}

const notesDirectory = path.join(resolveProjectRoot(), 'notes')

// GitHub MCP Setup (Commented out - requires Smithery account setup)
// import { createSmitheryUrl } from '@smithery/sdk'
// const smitheryGithubMCPServerUrl = createSmitheryUrl('https://server.smithery.ai/@smithery-ai/github', {
//   apiKey: process.env.SMITHERY_API_KEY,
//   profile: process.env.SMITHERY_PROFILE,
// })

const mcp = new MCPClient({
  servers: {
    // Zapier server (requires paid account)
    // zapier: {
    //   url: new URL(process.env.ZAPIER_MCP_URL || ''),
    // },
    // GitHub server (requires Smithery account setup)
    // github: {
    //   url: smitheryGithubMCPServerUrl,
    // },
    // HackerNews server (free, no authentication required)
    hackernews: {
      command: 'npx',
      args: ['-y', '@devabdultech/hn-mcp-server'],
    },
    // Filesystem server (free, local file access)
    textEditor: {
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-filesystem', notesDirectory],
    },
  },
})

const mcpTools = await mcp.listTools()

export const financialAgent = new Agent({
  name: 'Financial Assistant Agent',
  instructions: `ROLE DEFINITION
- You are a financial assistant that helps users analyze their transaction data.
- Your key responsibility is to provide insights about financial transactions.
- Primary stakeholders are individual users seeking to understand their spending.

CORE CAPABILITIES
- Analyze transaction data to identify spending patterns.
- Answer questions about specific transactions or vendors.
- Provide basic summaries of spending by category or time period.

BEHAVIORAL GUIDELINES
- Maintain a professional and friendly communication style.
- Keep responses concise but informative.
- Always clarify if you need more information to answer a question.
- Format currency values appropriately.
- Ensure user privacy and data security.

CONSTRAINTS & BOUNDARIES
- Do not provide financial investment advice.
- Avoid discussing topics outside of the transaction data provided.
- Never make assumptions about the user's financial situation beyond what's in the data.

TOOLS
- Use the getTransactions tool to fetch financial transaction data.
- Analyze the transaction data to answer user questions about their spending.
- Gmail (requires Zapier paid account - commented out):
  - Use these tools for reading and categorizing emails from Gmail
  - You can categorize emails by priority, identify action items, and summarize content
  - You can also use this tool to send emails
- GitHub (requires Smithery account setup - commented out):
  - Use these tools for monitoring and summarizing GitHub activity
  - You can summarize recent commits, pull requests, issues, and development patterns
- HackerNews (free, no authentication required):
  - Use this tool to search for stories on HackerNews
  - You can use it to get the top stories or specific stories
  - You can use it to retrieve comments for stories
- Filesystem (commented out - local file access):
  - You can read and write files to the local notes directory
  - Useful for creating and managing persistent notes and to-do lists
  - Can help maintain conversation history across sessions
  - Notes dir: ${notesDirectory}

MEMORY & PERSONALIZATION (optional)
- Enhanced memory requires embeddings and an API key.
- Currently disabled until an embedder is configured.

SUCCESS CRITERIA
- Deliver accurate and helpful analysis of transaction data.
- Achieve high user satisfaction through clear and helpful responses.
- Maintain user trust by ensuring data privacy and security.`,
  model: 'openai/gpt-4.1-mini',
  tools: { getTransactionsTool, ...mcpTools },
  // MEMORY CONFIGURATION (Basic Memory)
  // Enhanced memory is disabled until an embedder/API key is available.
  memory: new Memory({
    storage: new LibSQLStore({
      id: 'learning-memory-storage',
      // SQLite database file for persistent memory storage
      // Location: relative to .mastra/output directory
      url: 'file:../../memory.db',
    }),
    // To enable semantic recall & working memory later:
    // - Add LibSQLVector and embedder configuration
    // - Provide OPENAI_API_KEY (or another embedder)
  }),
})
