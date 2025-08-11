import { ethers } from 'ethers';

// XLayer network configuration
export const XLAYER_CONFIG = {
  chainId: 196,
  chainName: 'XLayer',
  rpcUrls: ['https://rpc.xlayer.network'],
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  blockExplorerUrls: ['https://www.oklink.com/xlayer'],
};

// Simple ERC20 ABI for token interactions
export const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function transferFrom(address from, address to, uint256 amount) returns (bool)',
];

// Multisig wallet ABI (simplified version)
export const MULTISIG_ABI = [
  'function owners(uint256) view returns (address)',
  'function isOwner(address owner) view returns (bool)',
  'function transactionCount() view returns (uint256)',
  'function getTransactionCount() view returns (uint256)',
  'function submitTransaction(address destination, uint256 value, bytes calldata data) returns (uint256)',
  'function confirmTransaction(uint256 transactionId)',
  'function executeTransaction(uint256 transactionId)',
  'function revokeConfirmation(uint256 transactionId)',
  'function isConfirmed(uint256 transactionId) view returns (bool)',
  'function getConfirmationCount(uint256 transactionId) view returns (uint256)',
  'function getConfirmations(uint256 transactionId) view returns (address[])',
  'function getTransaction(uint256 transactionId) view returns (address destination, uint256 value, bytes memory data, bool executed)',
  'function getOwners() view returns (address[])',
  'function getRequired() view returns (uint256)',
  'function requirement() view returns (uint256)',
];

export class XLayerService {
  private provider: ethers.JsonRpcProvider;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(XLAYER_CONFIG.rpcUrls[0]);
  }

  /**
   * Connect to XLayer network
   */
  async connect(): Promise<ethers.JsonRpcProvider> {
    try {
      const network = await this.provider.getNetwork();
      console.log('Connected to network:', network);
      return this.provider;
    } catch (error) {
      console.error('Failed to connect to XLayer:', error);
      throw error;
    }
  }

  /**
   * Get wallet balance
   */
  async getBalance(address: string): Promise<string> {
    try {
      const balance = await this.provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Failed to get balance:', error);
      throw error;
    }
  }

  /**
   * Get token balance
   */
  async getTokenBalance(tokenAddress: string, walletAddress: string): Promise<string> {
    try {
      const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, this.provider);
      const balance = await tokenContract.balanceOf(walletAddress);
      const decimals = await tokenContract.decimals();
      return ethers.formatUnits(balance, decimals);
    } catch (error) {
      console.error('Failed to get token balance:', error);
      throw error;
    }
  }

  /**
   * Create a new multisig wallet (simplified - in production this would deploy a contract)
   */
  async createMultisigWallet(owners: string[], required: number): Promise<string> {
    try {
      // In a real implementation, this would deploy a multisig contract
      // For now, we'll generate a deterministic address based on the owners plus a random salt
      const sortedOwners = [...owners].sort();
      const ownersString = sortedOwners.join(',');
      const salt = ethers.id(Math.random().toString());
      const combinedString = ownersString + salt;
      const hash = ethers.id(combinedString);
      const multisigAddress = ethers.getAddress(ethers.dataSlice(hash, 0, 20));
      
      console.log('Created multisig wallet:', multisigAddress);
      return multisigAddress;
    } catch (error) {
      console.error('Failed to create multisig wallet:', error);
      throw error;
    }
  }

  /**
   * Check if an address is a valid owner of a multisig wallet
   */
  async isOwner(multisigAddress: string, ownerAddress: string): Promise<boolean> {
    try {
      // In a real implementation, this would check the multisig contract
      // For now, we'll return true for demonstration
      return true;
    } catch (error) {
      console.error('Failed to check owner status:', error);
      return false;
    }
  }

  /**
   * Get transaction count for a multisig wallet
   */
  async getTransactionCount(multisigAddress: string): Promise<number> {
    try {
      // In a real implementation, this would query the multisig contract
      // For now, we'll return 0 for demonstration
      return 0;
    } catch (error) {
      console.error('Failed to get transaction count:', error);
      throw error;
    }
  }

  /**
   * Estimate gas for a transaction
   */
  async estimateGas(transaction: {
    to: string;
    value?: string;
    data?: string;
  }): Promise<bigint> {
    try {
      const tx = {
        to: transaction.to,
        value: transaction.value ? ethers.parseEther(transaction.value) : 0,
        data: transaction.data || '0x',
      };

      const gasLimit = await this.provider.estimateGas(tx);
      return gasLimit;
    } catch (error) {
      console.error('Failed to estimate gas:', error);
      throw error;
    }
  }

  /**
   * Get current gas price
   */
  async getGasPrice(): Promise<string> {
    try {
      const gasPrice = await this.provider.getFeeData();
      return gasPrice.gasPrice ? ethers.formatUnits(gasPrice.gasPrice, 'gwei') : '0';
    } catch (error) {
      console.error('Failed to get gas price:', error);
      throw error;
    }
  }

  /**
   * Get network information
   */
  async getNetwork(): Promise<any> {
    try {
      const network = await this.provider.getNetwork();
      return {
        chainId: network.chainId,
        name: network.name,
      };
    } catch (error) {
      console.error('Failed to get network info:', error);
      throw error;
    }
  }
}

// Singleton instance
export const xlayerService = new XLayerService();