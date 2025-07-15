import "dotenv/config";
import * as readline from "readline";
import { createOpenAIClient } from "./openai/openaiClientFactory.js";
import { tools } from "../tools/allTools.js";
import { assistantPrompt } from "./constants/prompt.js";
import { ChatCompletionMessageParam } from "openai/resources/index.js";

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
  const history: ChatCompletionMessageParam[] = [];
  const model = process.env.OPENAI_MODEL || "gpt-4o";
  const maxTokens = 512;
  const modelTemperature = 0.2;

  while (true) {
    const userInput = await question("\nYou: ");
    if (userInput.toLowerCase() === "exit") {
      rl.close();
      break;
    }
    history.push({ role: "user", content: userInput });
    let messages: ChatCompletionMessageParam[] = [
      { role: "system", content: assistantPrompt },
      ...history,
      { role: 'user', content: userInput }
    ];
    let response = await client.chat.completions.create({
      model,
      messages,
      max_tokens: maxTokens,
      temperature: modelTemperature
    });
    let content = response.choices[0].message?.content ?? "";
    // Detectar tool-call: [TOOL_CALL] toolName(arg1=val1,arg2=val2)
    const toolCallMatch = content.match(/^\[TOOL_CALL\]\s*(\w+)\((.*)\)$/);
    if (toolCallMatch) {
      const [, toolName, paramsRaw] = toolCallMatch;
      const tool = tools[toolName];
      if (!tool) {
        console.log(`Tool ${toolName} not found`);
        continue;
      }
      // Parsear argumentos: arg1=val1,arg2=val2
      const params: Record<string, any> = {};
      paramsRaw.split(",").forEach(pair => {
        const [k, v] = pair.split("=");
        if (k && v !== undefined) {
          // Si el parámetro es value, forzar a string decimal
          if (k.trim() === "value") {
            params[k.trim()] = String(v.trim());
          } else {
            params[k.trim()] = v.trim();
          }
        }
      });
      try {
        const toolResult = await tool.handler(params);
        history.push({ role: "assistant", content });
        history.push({ role: "function", name: toolName, content: String(toolResult) });
        // Nueva respuesta del modelo con el resultado de la tool
        messages = [
          { role: "system", content: assistantPrompt },
          ...history
        ];
        response = await client.chat.completions.create({
          model,
          messages,
          max_tokens: maxTokens,
          temperature: modelTemperature
        });
        content = response.choices[0].message?.content ?? "";
      } catch (error) {
        content = `Error executing tool: ${error instanceof Error ? error.message : error}`;
      }
    }
    history.push({ role: "assistant", content });
    console.log("\nAgent:", content);
  }
}


async function main(): Promise<void> {
  try {
    console.log('Agent ready. Type a tool name or "exit" to exit.');
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
