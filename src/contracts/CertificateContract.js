// Smart Contract Interface for Certificate Verification System
// This file defines the expected contract functions and ABI

export const CONTRACT_ABI = [
  // Upload certificate function
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "studentName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "rollNumber",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "course",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "yearOfPassing",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "ipfsUrl",
        "type": "string"
      }
    ],
    "name": "uploadCertificate",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  
  // Verify certificate function
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "certificateId",
        "type": "uint256"
      }
    ],
    "name": "verifyCertificate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  
  // Get certificate details function
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "certificateId",
        "type": "uint256"
      }
    ],
    "name": "getCertificate",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "studentName",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "rollNumber",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "course",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "yearOfPassing",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "ipfsUrl",
            "type": "string"
          },
          {
            "internalType": "bool",
            "name": "isVerified",
            "type": "bool"
          },
          {
            "internalType": "address",
            "name": "uploadedBy",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "uploadedAt",
            "type": "uint256"
          }
        ],
        "internalType": "struct CertificateVerification.Certificate",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  
  // Search certificates by student details
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "rollNumber",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "course",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "yearOfPassing",
        "type": "uint256"
      }
    ],
    "name": "searchCertificates",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  
  // Get certificate count
  {
    "inputs": [],
    "name": "getCertificateCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  
  // Events
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "certificateId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "uploadedBy",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "studentName",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "rollNumber",
        "type": "string"
      }
    ],
    "name": "CertificateUploaded",
    "type": "event"
  },
  
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "certificateId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "verifiedBy",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "verifiedAt",
        "type": "uint256"
      }
    ],
    "name": "CertificateVerified",
    "type": "event"
  }
];

// Contract address - replace with your deployed contract address
export const CONTRACT_ADDRESS = "2351d7888f7b0ac1eb42567ff8a22254ac6a063965b97c372df77a0947ae9bb1";

// Network configuration
export const NETWORKS = {
  1: {
    name: "Ethereum Mainnet",
    chainId: 1,
    rpcUrl: "https://mainnet.infura.io/v3/YOUR_INFURA_KEY",
    explorer: "https://etherscan.io"
  },
  137: {
    name: "Polygon",
    chainId: 137,
    rpcUrl: "https://polygon-rpc.com",
    explorer: "https://polygonscan.com"
  },
  56: {
    name: "BSC",
    chainId: 56,
    rpcUrl: "https://bsc-dataseed.binance.org",
    explorer: "https://bscscan.com"
  },
  5: {
    name: "Goerli Testnet",
    chainId: 5,
    rpcUrl: "https://goerli.infura.io/v3/YOUR_INFURA_KEY",
    explorer: "https://goerli.etherscan.io"
  }
};

// Default network
export const DEFAULT_NETWORK = 5; // Goerli testnet for development

// Gas limits for different operations
export const GAS_LIMITS = {
  uploadCertificate: 500000,
  verifyCertificate: 300000,
  default: 200000
};

// IPFS configuration
export const IPFS_CONFIG = {
  gateway: "https://gateway.pinata.cloud/ipfs/",
  maxFileSize: 10 * 1024 * 1024, // 10MB
  supportedFormats: ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg']
};
