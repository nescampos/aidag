import "dotenv/config";
import * as readline from "readline";
import { createOpenAIClient } from "./openai/openaiClientFactory.js";
import { tools } from "../tools/allTools.js";
import { assistantPrompt } from "./constants/prompt.js";
import { ChatCompletionMessageParam, ChatCompletionTool } from "openai/resources/index.js";

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

  // Convertir herramientas a formato compatible con OpenAI
  const openaiTools: ChatCompletionTool[] = Object.values(tools).map(tool => ({
    type: "function",
    function: tool.definition.function
  }));

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
      tools: openaiTools,
      max_tokens: maxTokens,
      temperature: modelTemperature
    });
    
    const responseMessage = response.choices[0].message;
    
    // Verificar si hay llamadas a herramientas
    if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
      // Agregar el mensaje del asistente con las herramientas llamadas al historial
      history.push(responseMessage);
      
      // Procesar cada llamada a herramienta
      for (const toolCall of responseMessage.tool_calls) {
        const functionName = toolCall.function.name;
        const tool = tools[functionName];
        
        if (!tool) {
          console.log(`Tool ${functionName} not found`);
          continue;
        }
        
        try {
          // Parsear los argumentos desde JSON
          const args = JSON.parse(toolCall.function.arguments || '{}');
          
          // Asegurar que value sea string si está presente
          if (args.value !== undefined) {
            args.value = String(args.value);
          }
          
          const toolResult = await tool.handler(args);
          
          // Agregar el resultado de la herramienta al historial
          history.push({
            role: "tool",
            content: String(toolResult),
            tool_call_id: toolCall.id
          });
        } catch (error) {
          console.error(`Error executing tool ${functionName}:`, error);
          // Agregar un mensaje de error al historial
          history.push({
            role: "tool",
            content: `Error executing tool: ${error instanceof Error ? error.message : 'Unknown error'}`,
            tool_call_id: toolCall.id
          });
        }
      }
      
      // Obtener una nueva respuesta del modelo usando los resultados de las herramientas
      const secondResponse = await client.chat.completions.create({
        model,
        messages: [
          { role: "system", content: assistantPrompt },
          ...history
        ],
        max_tokens: maxTokens,
        temperature: modelTemperature
      });
      
      const secondResponseContent = secondResponse.choices[0].message?.content ?? "";
      history.push({ role: "assistant", content: secondResponseContent });
      console.log("\nAgent:", secondResponseContent);
    } else {
      // Si no hay llamadas a herramientas, simplemente mostrar la respuesta
      const content = responseMessage.content ?? "";
      history.push({ role: "assistant", content });
      console.log("\nAgent:", content);
    }
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
