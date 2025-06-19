import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio";
import { z } from "zod";

const server: McpServer = new McpServer({
  name: "test-server",
  version: "0.0.1",
  capabilities: {
    resources: {},
    tools: {}
  }
});

server.tool(
  "get-phone-number",
  "Gets the phone number of a user or person, using their name.",
  {
    name: z.string().describe("The name of the person to get the phone number for.")
  },
  async ({ name: string }) => {
    return {
      content: [
        {
          type: "text",
          text: `123-456-7890`
        }
      ]
    }
  }
);

async function main(): Promise<void> {
  const transport: StdioServerTransport = new StdioServerTransport();
  await server.connect(transport);
  console.log("Server is running and listening for requests...");
}

main().catch((error) => {
  console.error("Error starting server:", error);
  process.exit(1);
});