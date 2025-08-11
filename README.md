# 🔄 Social Swap Pool

A decentralized application that enables groups of users to pool funds into multisig smart account wallets and collectively swap tokens on the XLayer network using OKX DEX API.

## 🌟 Features

### Core Functionality
- **Multisig Wallet Pools**: Create and join pools with multiple signers
- **Collective Token Swapping**: Pool funds to reduce fees and slippage
- **Democratic Voting**: Propose and vote on swap orders
- **Real-time Tracking**: Monitor transaction statuses and pool balances
- **XLayer Integration**: Built on XLayer network for fast, low-cost transactions
- **OKX DEX API**: Access to deep liquidity and competitive rates

### User Experience
- **Wallet Connection**: Connect via MetaMask or other Web3 wallets
- **Intuitive Dashboard**: Clean interface for managing pools and swaps
- **Pool Management**: Create, join, and manage multiple pools
- **Voting Interface**: Easy-to-use voting system for swap proposals
- **Transaction History**: Complete audit trail of all pool activities

## 🛠️ Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript 5** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **shadcn/ui** - High-quality UI components
- **Ethers.js** - Ethereum blockchain interaction
- **Wagmi** - React hooks for Ethereum
- **Zustand** - Lightweight state management

### Backend
- **Node.js + Express** - API server
- **Prisma ORM** - Database management with SQLite
- **OKX DEX API** - Token swap execution
- **XLayer SDK** - Smart account abstraction

### Blockchain
- **XLayer Network** - Layer 2 scaling solution
- **Multisig Smart Contracts** - Secure fund management
- **ERC20 Token Support** - Wide token compatibility

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MetaMask or compatible Web3 wallet
- XLayer network configured in wallet

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd social-swap-pool
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file with your configuration:
   ```env
   DATABASE_URL=file:./dev.db
   
   # XLayer Configuration
   XLAYER_RPC_URL=https://rpc.xlayer.network
   XLAYER_CHAIN_ID=196
   XLAYER_EXPLORER_URL=https://www.oklink.com/xlayer
   
   # OKX DEX API Configuration
   OKX_DEX_API_URL=https://www.okx.com/api/v5/dex
   OKX_API_KEY=your_okx_api_key_here
   OKX_SECRET_KEY=your_okx_secret_key_here
   OKX_PASSPHRASE=your_okx_passphrase_here
   
   # Application Configuration
   NEXTAUTH_SECRET=your_nextauth_secret_here
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   npm run db:generate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📚 Detailed Setup Guide

### 1. Wallet Configuration

#### Adding XLayer Network to MetaMask
1. Open MetaMask
2. Click on the network selector
3. Click "Add Network"
4. Enter these details:
   - **Network Name**: XLayer
   - **RPC URL**: https://rpc.xlayer.network
   - **Chain ID**: 196
   - **Currency Symbol**: ETH
   - **Block Explorer**: https://www.oklink.com/xlayer

#### Getting Test Tokens
For testing purposes, you may need test ETH on XLayer. Check the XLayer documentation for faucets or test token distribution methods.

### 2. OKX API Configuration

#### Creating OKX API Keys
1. Sign up at [OKX](https://www.okx.com)
2. Go to API Management
3. Create new API keys with these permissions:
   - **Spot Trading**: Enabled
   - **Withdrawal**: Disabled (for security)
   - **DEX API**: Enabled

#### Setting Up API Keys
Add your API credentials to the `.env` file:
```env
OKX_API_KEY=your_api_key
OKX_SECRET_KEY=your_secret_key
OKX_PASSPHRASE=your_passphrase
```

### 3. Database Setup

The application uses SQLite for development. For production, consider using PostgreSQL or MySQL.

#### Database Schema
The application includes these main entities:
- **Users**: Wallet addresses and user information
- **Pools**: Multisig pool configurations
- **Pool Members**: Pool membership with roles
- **Swap Proposals**: Token swap proposals
- **Votes**: Member votes on proposals
- **Transactions**: Executed transactions and their status

## 🎯 Usage Guide

### Creating a Pool

1. **Connect Your Wallet**
   - Click "Connect Wallet" in the top right
   - Approve the connection in MetaMask
   - Ensure you're on the XLayer network

2. **Navigate to Create Pool**
   - Click on the "Create Pool" tab
   - Fill in the pool details:
     - **Pool Name**: A descriptive name for your pool
     - **Description**: Optional description of the pool's purpose
     - **Required Signatures**: Number of members needed to approve transactions
     - **Initial Members**: Add wallet addresses of pool members

3. **Create the Pool**
   - Click "Create Pool"
   - Confirm the transaction in MetaMask
   - Wait for pool creation to complete

### Joining a Pool

1. **Get Pool Information**
   - Ask the pool creator for the pool ID
   - Or browse available pools in the "My Pools" section

2. **Request to Join**
   - Navigate to the pool dashboard
   - Click "Join Pool" (if implemented)
   - Wait for approval from pool members

### Creating a Swap Proposal

1. **Go to Pool Dashboard**
   - Select your pool from the list
   - Navigate to the "Swap Proposals" tab

2. **Create New Proposal**
   - Click "New Swap Proposal"
   - Fill in the swap details:
     - **From Token**: Token you want to swap from
     - **To Token**: Token you want to swap to
     - **Amount**: Amount to swap
     - **Minimum Received**: Minimum amount you want to receive (slippage protection)

3. **Submit Proposal**
   - Click "Create Proposal"
   - The proposal will be visible to all pool members

### Voting on Proposals

1. **View Proposals**
   - Go to the "Swap Proposals" tab in your pool
   - Find the proposal you want to vote on

2. **Cast Your Vote**
   - Click on the proposal
   - Select your vote: For, Against, or Abstain
   - Confirm your vote

3. **Monitor Results**
   - Watch the voting progress
   - Proposal executes automatically if approved

### Executing Swaps

1. **Approved Proposals**
   - Once a proposal has enough votes, it moves to "Approved" status
   - Any pool member can execute the swap

2. **Execute Swap**
   - Click "Execute" on an approved proposal
   - Confirm the transaction in MetaMask
   - Monitor the transaction status

## 🔧 API Reference

### Pool Management

#### Create Pool
```http
POST /api/pools
Content-Type: application/json

{
  "name": "My Trading Pool",
  "description": "Pool for collective trading",
  "multisigAddress": "0x...",
  "creatorAddress": "0x...",
  "members": ["0x...", "0x..."],
  "requiredSignatures": 2
}
```

#### Get User Pools
```http
GET /api/pools?userAddress=0x...
```

#### Get Pool Details
```http
GET /api/pools/{poolId}
```

### Swap Proposals

#### Create Proposal
```http
POST /api/pools/{poolId}/proposals
Content-Type: application/json

{
  "fromToken": "ETH",
  "toToken": "USDT",
  "amount": "1.0",
  "minReceived": "0.95",
  "proposerAddress": "0x..."
}
```

#### Get Pool Proposals
```http
GET /api/pools/{poolId}/proposals
```

#### Vote on Proposal
```http
POST /api/proposals/{proposalId}/vote
Content-Type: application/json

{
  "userAddress": "0x...",
  "vote": "FOR"
}
```

#### Execute Swap
```http
POST /api/proposals/{proposalId}/execute
Content-Type: application/json

{
  "executorAddress": "0x..."
}
```

## 🧪 Testing

### Running Tests
```bash
npm run test
```

### Development Testing
1. Create test pools with small amounts
2. Test the complete flow: create → propose → vote → execute
3. Verify all transaction statuses update correctly
4. Test edge cases like rejected proposals

### Test Scenarios
- **Pool Creation**: Verify multisig wallet creation
- **Member Management**: Test adding/removing members
- **Proposal Lifecycle**: Test all proposal states
- **Voting System**: Verify vote counting and execution
- **Swap Execution**: Test actual token swaps
- **Error Handling**: Test various error conditions

## 🚀 Deployment

### Building for Production
```bash
npm run build
npm run start
```

### Environment Variables for Production
```env
DATABASE_URL=postgresql://user:password@localhost:5432/social_swap_pool
NODE_ENV=production
NEXTAUTH_SECRET=your_secure_secret
```

### Deployment Platforms
- **Vercel**: Recommended for Next.js applications
- **Railway**: Good for full-stack deployments
- **Digital Ocean**: For more control over infrastructure

### Security Considerations
- Use environment variables for all sensitive data
- Implement rate limiting for API endpoints
- Use HTTPS in production
- Regularly update dependencies
- Monitor for security vulnerabilities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Development Guidelines
- Follow TypeScript best practices
- Write clear, documented code
- Include error handling
- Test thoroughly before submitting

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help
- **Documentation**: Check this README and inline code comments
- **Issues**: Create an issue on GitHub for bugs or feature requests
- **Discussions**: Join community discussions for general questions

### Common Issues

#### Wallet Connection Problems
- Ensure MetaMask is installed and unlocked
- Check that you're on the XLayer network
- Verify your wallet has sufficient ETH for gas fees

#### API Errors
- Check your OKX API credentials
- Verify network connectivity
- Ensure all required environment variables are set

#### Database Issues
- Run database migrations if schema changes
- Check database connection string
- Verify file permissions for SQLite

## 🗺️ Roadmap

### Upcoming Features
- **Mobile App**: React Native companion app
- **Advanced Analytics**: Pool performance metrics
- **Governance Tokens**: Pool-specific governance tokens
- **Yield Farming**: Integration with DeFi protocols
- **Cross-Chain Support**: Multi-chain pool operations
- **Advanced Voting**: Quadratic voting and delegation

### Improvements
- **Enhanced UI/UX**: More intuitive interface
- **Performance**: Faster load times and smoother interactions
- **Security**: Additional security measures and audits
- **Documentation**: More comprehensive guides and examples

---

Built with ❤️ for the decentralized finance community. Empowering collective trading through smart contracts and democratic governance.
