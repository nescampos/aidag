import "dotenv/config";
import * as readline from "readline";
import { createOpenAIClient } from "./openai/openaiClientFactory.js";
import { tools } from "../tools/allTools.js";

import type { Thread } from "openai/resources/beta/threads/threads";
import type { Assistant } from "openai/resources/beta/assistants";

const client = createOpenAIClient();

// Create interface for reading from command line
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Type-safe promise-based question function
const question = (query: string): Promise<string> => {
  return new Promise((resolve) => rl.question(query, resolve));
};

async function chatAgent(): Promise<void> {
  while (true) {
    const userInput = await question("\nYou: ");
    if (userInput.toLowerCase() === "exit") {
      rl.close();
      break;
    }
    // Detectar si la entrada es una tool (por nombre exacto al inicio)
    const [toolName, ...argPairs] = userInput.trim().split(/\s+/);
    const tool = tools[toolName];
    if (tool) {
      // Parseo simple: arg1=val1 arg2=val2
      const args: Record<string, any> = {};
      for (const pair of argPairs) {
        const [k, v] = pair.split("=");
        if (k && v !== undefined) args[k] = v;
      }
      try {
        const result = await tool.handler(args);
        console.log("\nResult:", result);
      } catch (error) {
        console.error("Error ejecutando tool:", error instanceof Error ? error.message : error);
      }
    } else {
      // Respuesta genérica de agente (sin assistant)
      console.log("Soy un agente blockchain. Puedes ejecutar las siguientes tools:", Object.keys(tools).join(", "));
    }
  }
}

async function chatWithTools(): Promise<void> {
  while (true) {
    const userInput = await question("\nTool> ");
    if (userInput.toLowerCase() === "exit") {
      rl.close();
      break;
    }
    // Espera: toolName arg1=val1 arg2=val2 ...
    const [toolName, ...argPairs] = userInput.trim().split(/\s+/);
    const tool = tools[toolName];
    if (!tool) {
      console.log("Tool no encontrada. Usa uno de:", Object.keys(tools).join(", "));
      continue;
    }
    // Parseo simple: arg1=val1 arg2=val2
    const args: Record<string, any> = {};
    for (const pair of argPairs) {
      const [k, v] = pair.split("=");
      if (k && v !== undefined) args[k] = v;
    }
    try {
      const result = await tool.handler(args);
      console.log("\nResult:", result);
    } catch (error) {
      console.error("Error ejecutando tool:", error instanceof Error ? error.message : error);
    }
  }
}

async function main(): Promise<void> {
  try {
    console.log('Agente listo. Escribe el nombre de una tool o "exit" para salir.');
    await chatAgent();
  } catch (error) {
    console.error(
      "Error in main:",
      error instanceof Error ? error.message : "Unknown error"
    );
    rl.close();
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(
    "Unhandled error:",
    error instanceof Error ? error.message : "Unknown error"
  );
  process.exit(1);
});
