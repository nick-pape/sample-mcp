import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { FileSystem, FolderItem } from "@rushstack/node-core-library";

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

server.tool(
  "get-files",
  "Gets a list of all files that are available.",
  {
    dir: z.string().describe("The path or directory to list files from, Unix or Windows style.")
  },
  async ({ dir }) => {
    if (!FileSystem.exists(dir)) {
      return {
        content: [
          {
            type: "text",
            text: `Path does not exist: ${dir}`
          }
        ]
      };
    }

    const items: FolderItem[] = await FileSystem.readFolderItemsAsync(dir);
    
    if (items.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: "No files found."
          }
        ]
      };
    }

    const filesString: string = items
      .filter(file => file.isFile())
      .map(file => file.name)
      .join("\n");
    const foldersString: string = items
      .filter(file => file.isDirectory())
      .map(folder => `${folder.name}/`)
      .join("\n");
    return {
      content: [
        {
          type: "text",
          text: `Found files:\n`
          + filesString
          + `\nFound directories:\n`
          + foldersString
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