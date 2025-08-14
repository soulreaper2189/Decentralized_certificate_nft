import React, { createContext, useContext, useState, useEffect } from 'react';
import { AptosClient, AptosAccount, TxnBuilderTypes, BCS, TransactionPayload } from '@aptos-labs/ts-sdk';

const Web3Context = createContext();

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [client, setClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [network, setNetwork] = useState('testnet');

  // Aptos configuration
  const APTOS_MODULE_ADDRESS = "0x2351d7888f7b0ac1eb42567ff8a22254ac6a063965b97c372df77a0947ae9bb1";
  const APTOS_MODULE_NAME = "certificate_nft";
  const APTOS_FUNCTION_NAME = "mint_certificate";

  // Initialize Aptos client
  useEffect(() => {
    const aptosClient = new AptosClient(
      network === 'mainnet' 
        ? 'https://fullnode.mainnet.aptoslabs.com/v1'
        : 'https://fullnode.testnet.aptoslabs.com/v1'
    );
    setClient(aptosClient);
  }, [network]);

  const connectWallet = async () => {
    try {
      setLoading(true);
      
      if (typeof window.aptos !== 'undefined') {
        // Request account access
        const response = await window.aptos.connect();
        const account = response.address;
        
        setAccount(account);
        setIsConnected(true);
        
        return { success: true, account };
      } else {
        throw new Error('Petra Wallet not found. Please install Petra Wallet.');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setIsConnected(false);
  };

  const uploadToIPFS = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'pinata_api_key': process.env.REACT_APP_PINATA_API_KEY,
          'pinata_secret_api_key': process.env.REACT_APP_PINATA_SECRET,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`IPFS upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      throw error;
    }
  };

  const uploadCertificate = async (certificateData, file) => {
    if (!window.aptos || !isConnected) {
      throw new Error('Wallet not connected');
    }

    try {
      // Upload file to IPFS
      const ipfsUrl = await uploadToIPFS(file);
      
      // Prepare transaction payload for minting certificate
      const payload = {
        type: "entry_function_payload",
        function: `${APTOS_MODULE_ADDRESS}::${APTOS_MODULE_NAME}::${APTOS_FUNCTION_NAME}`,
        type_arguments: [],
        arguments: [
          certificateData.studentName,
          certificateData.rollNumber,
          certificateData.course,
          certificateData.yearOfPassing.toString(),
          ipfsUrl
        ]
      };

      // Submit transaction
      const transaction = await window.aptos.signAndSubmitTransaction(payload);
      
      // Wait for transaction confirmation
      await client.waitForTransaction(transaction.hash);
      
      return { success: true, transactionHash: transaction.hash, ipfsUrl };
    } catch (error) {
      console.error('Error uploading certificate:', error);
      throw error;
    }
  };

  const verifyCertificate = async (certificateIndex) => {
    if (!window.aptos || !isConnected) {
      throw new Error('Wallet not connected');
    }

    try {
      const payload = {
        type: "entry_function_payload",
        function: `${APTOS_MODULE_ADDRESS}::${APTOS_MODULE_NAME}::verify_certificate`,
        type_arguments: [],
        arguments: [certificateIndex.toString()]
      };

      const transaction = await window.aptos.signAndSubmitTransaction(payload);
      await client.waitForTransaction(transaction.hash);
      
      return { success: true, transactionHash: transaction.hash };
    } catch (error) {
      console.error('Error verifying certificate:', error);
      throw error;
    }
  };

  const getCertificate = async (certificateIndex) => {
    if (!client) {
      throw new Error('Aptos client not initialized');
    }

    try {
      const payload = {
        function: `${APTOS_MODULE_ADDRESS}::${APTOS_MODULE_NAME}::get_certificate`,
        type_arguments: [],
        arguments: [certificateIndex.toString()]
      };

      const response = await client.view(payload);
      return response[0]; // Return the certificate data
    } catch (error) {
      console.error('Error getting certificate:', error);
      throw error;
    }
  };

  const searchCertificates = async (rollNumber, course, yearOfPassing) => {
    if (!client) {
      throw new Error('Aptos client not initialized');
    }

    try {
      const payload = {
        function: `${APTOS_MODULE_ADDRESS}::${APTOS_MODULE_NAME}::search_certificates`,
        type_arguments: [],
        arguments: [rollNumber, course, yearOfPassing.toString()]
      };

      const response = await client.view(payload);
      const certificateIndices = response[0];
      
      // Get certificate details for each index
      const certificates = [];
      for (const index of certificateIndices) {
        try {
          const cert = await getCertificate(index);
          if (cert) {
            certificates.push({
              id: index.toString(),
              ...cert
            });
          }
        } catch (err) {
          console.warn(`Error fetching certificate ${index}:`, err);
        }
      }
      
      return certificates;
    } catch (error) {
      console.error('Error searching certificates:', error);
      throw error;
    }
  };

  const getCertificateCount = async () => {
    if (!client) {
      throw new Error('Aptos client not initialized');
    }

    try {
      const payload = {
        function: `${APTOS_MODULE_ADDRESS}::${APTOS_MODULE_NAME}::get_certificate_count`,
        type_arguments: [],
        arguments: []
      };

      const response = await client.view(payload);
      return response[0];
    } catch (error) {
      console.error('Error getting certificate count:', error);
      throw error;
    }
  };

  useEffect(() => {
    // Check if wallet is already connected
    if (typeof window.aptos !== 'undefined') {
      window.aptos.onAccountChange((newAccount) => {
        if (newAccount) {
          setAccount(newAccount.address);
        } else {
          disconnectWallet();
        }
      });

      window.aptos.onNetworkChange((network) => {
        setNetwork(network.name);
      });
    }
  }, []);

  const value = {
    account,
    client,
    isConnected,
    loading,
    network,
    connectWallet,
    disconnectWallet,
    uploadCertificate,
    verifyCertificate,
    getCertificate,
    searchCertificates,
    getCertificateCount,
    uploadToIPFS,
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};
