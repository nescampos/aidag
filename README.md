# BlockDAG AI Agent - AIDAG

A modular AI agent for the BlockDAG blockchain, capable of interacting via CLI, executing blockchain operations, and supporting tool-calls through natural language using OpenAI-compatible models.

## Features
- Natural language interaction with the agent (CLI)
- Executes blockchain operations (balance, send, deploy token, etc.)
- Tool-call support: the agent can invoke blockchain tools as needed
- OpenAI-compatible (works with any service supporting the OpenAI API)
- Modular tool system (easy to add new blockchain tools)

## Requirements
- Node.js 18+
- npm
- OpenAI API key (or compatible service)

## Setup
1. **Clone the repository:**
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure environment variables:**
   Create a `.env` file in the root directory with the following variables:
   ```env
   OPENAI_API_KEY=your_openai_or_compatible_api_key
   OPENAI_BASE_URL=optional_custom_endpoint
   OPENAI_MODEL=gpt-4o # or your preferred model
   WALLET_PRIVATE_KEY=....
   ```

## Usage

### CLI Mode
Run the agent in CLI mode:
```bash
bun run src\index.ts
```
- Type your questions or requests in natural language.
- The agent will respond, and if a blockchain operation is needed, it will execute the corresponding tool.
- To exit, type `exit`.


## Tool-Call Format
When the agent needs to execute a blockchain operation, it uses a tool-call format.

## Available Tools
- `get_balance`: Get the balance of a wallet
- `get_wallet_address`: Get the connected wallet address
- `send_transaction`: Send BDAG or tokens to an address
- `deploy_erc20`: Deploy a new ERC20 token

## Environment Variables
- `OPENAI_API_KEY`: Your OpenAI or compatible API key (required)
- `OPENAI_BASE_URL`: Custom endpoint for OpenAI-compatible services (optional)
- `OPENAI_MODEL`: Model to use (default: gpt-4o)

## Adding New Tools
- Add a new tool in the `tools/` directory following the existing pattern.
- Register it in `tools/allTools.ts`.
- The tool will be automatically available to the agent.

## Contribution
- Fork the repo and submit pull requests.
- Please document new tools and features.
- Issues and suggestions are welcome!

## License
MIT

## Future Roadmap and Improvements

### Planned Features
- **Advanced DeFi Operations**: Integration with decentralized exchanges for swapping tokens, providing liquidity, and yield farming
- **NFT Support**: Tools for minting, transferring, and managing NFTs on the BlockDAG network
- **Multi-wallet Management**: Support for managing multiple wallets and signing keys
- **Transaction Batching**: Ability to batch multiple operations into a single transaction
- **Smart Contract Interaction**: Generic tools to interact with any deployed smart contract
- **On-chain Data Queries**: More comprehensive data retrieval tools for blockchain state
- **Improved Token Handling**: Better support for various token standards and custom tokens
- **Gas Optimization**: Advanced gas estimation and optimization features

### Platform Improvements
- **GUI Interface**: Development of a web-based interface alongside the CLI
- **Mobile App**: Native mobile application for on-the-go blockchain operations
- **Enhanced Security**: Multi-signature support and hardware wallet integration
- **Transaction Scheduling**: Ability to schedule transactions for future execution
- **Better Error Handling**: More intuitive error messages and recovery mechanisms
- **Performance Optimization**: Reduced latency in AI response and transaction execution
- **Advanced Analytics**: Transaction history and portfolio tracking features

### AI Capabilities
- **Natural Language Understanding**: Improved parsing of complex user requests
- **Context Awareness**: Better retention of conversation context across sessions
- **Predictive Operations**: Suggestions for optimal transaction strategies based on market conditions
- **Educational Mode**: Explanations of blockchain concepts for new users 