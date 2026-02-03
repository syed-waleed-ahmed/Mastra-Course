import { Agent } from '@mastra/core/agent'
import { Memory } from '@mastra/memory'
import { LibSQLStore, LibSQLVector } from '@mastra/libsql'

// Create a basic memory instance
const memory = new Memory({
  storage: new LibSQLStore({
    id: 'learning-memory-storage',
    url: 'file:../../memory.db', // relative path from the `.mastra/output` directory
  }),
  vector: new LibSQLVector({
    id: 'learning-memory-vector',
    url: 'file:../../vector.db', // relative path from the `.mastra/output` directory
  }),
  // Semantic recall requires an embedder and API key.
  // Uncomment once OPENAI_API_KEY is available:
  // embedder: 'openai/text-embedding-3-small',
  options: {
    lastMessages: 20, // Include the last 20 messages in context
    // Enable semantic recall once an embedder is configured:
    // semanticRecall: true,
    // Advanced semantic recall configuration (requires embedder):
    // semanticRecall: {
    //   topK: 3,
    //   messageRange: {
    //     before: 2,
    //     after: 1,
    //   },
    // },
    // Working memory (requires embedder/API key in this setup):
    // workingMemory: {
    //   enabled: true,
    // },
    // Custom working memory template (requires embedder/API key):
    // workingMemory: {
    //   enabled: true,
    //   template: `
    // # User Profile
    //
    // ## Personal Info
    //
    // - Name:
    // - Location:
    // - Timezone:
    //
    // ## Preferences
    //
    // - Communication Style: [e.g., Formal, Casual]
    // - Interests:
    // - Favorite Topics:
    //
    // ## Session State
    //
    // - Current Topic:
    // - Open Questions:
    //   - [Question 1]
    //   - [Question 2]
    // `,
    // },
  },
})

// Create an agent with memory
export const memoryAgent = new Agent({
  name: 'MemoryAgent',
  instructions: `
    You are a helpful assistant with memory capabilities.
    You can remember previous conversations and user preferences.
    When a user shares information about themselves, acknowledge it and remember it for future reference.
    If asked about something mentioned earlier in the conversation, recall it accurately.

    IMPORTANT: Working memory is optional and currently disabled until an embedder is configured.
    When enabled, store persistent user info like name, location, preferences, and interests.
  `,
  model: 'openai/gpt-4.1-mini',
  memory: memory,
})
