# Deployment Guide for Web3 Certificate Verification System

This guide will help you deploy the Web3 frontend and integrate it with your smart contracts.

## Prerequisites

1. **Smart Contract Deployed**: Your certificate verification smart contract should be deployed on your preferred network
2. **Pinata Account**: For IPFS storage of certificate files
3. **Web3 Wallet**: MetaMask or compatible wallet for testing
4. **Node.js 18+**: For building and running the frontend

## Step 1: Smart Contract Integration

### Update Contract Address
1. Open `src/contracts/CertificateContract.js`
2. Replace `CONTRACT_ADDRESS` with your deployed contract address:
   ```javascript
   export const CONTRACT_ADDRESS = "0xYourActualContractAddressHere";
   ```

### Verify Contract ABI
Ensure your smart contract implements these required functions:
- `uploadCertificate(studentName, rollNumber, course, yearOfPassing, ipfsUrl)`
- `verifyCertificate(certificateId)`
- `getCertificate(certificateId)`
- `searchCertificates(rollNumber, course, yearOfPassing)`

If your contract has different function signatures, update the ABI in `CertificateContract.js`.

## Step 2: Environment Configuration

1. **Create `.env` file** in the frontend directory:
   ```bash
   cp env.example .env
   ```

2. **Configure Pinata API keys**:
   ```env
   REACT_APP_PINATA_API_KEY=your_pinata_api_key_here
   REACT_APP_PINATA_SECRET=your_pinata_secret_here
   ```

3. **Set network configuration**:
   ```env
   REACT_APP_NETWORK_ID=5  # 5 for Goerli, 1 for Ethereum mainnet, etc.
   ```

## Step 3: Install Dependencies

```bash
cd frontend
npm install
```

## Step 4: Test Locally

```bash
npm run dev
```

Open `http://localhost:5173` in your browser and test:
1. Connect your MetaMask wallet
2. Switch to the correct network
3. Test certificate upload (College role)
4. Test certificate verification (Company role)
5. Test certificate retrieval (Student role)

## Step 5: Build for Production

```bash
npm run build
```

This creates a `dist` folder with optimized production files.

## Step 6: Deploy Frontend

### Option A: Vercel (Recommended)
1. Install Vercel CLI: `npm i -g vercel`
2. Deploy: `vercel --prod`
3. Follow prompts to configure your project

### Option B: Netlify
1. Drag and drop the `dist` folder to Netlify
2. Configure custom domain if needed

### Option C: Traditional Hosting
1. Upload `dist` folder contents to your web server
2. Configure server to serve `index.html` for all routes

## Step 7: Post-Deployment Configuration

### Update Contract Address for Production
If deploying to a different network, update the contract address in `CertificateContract.js`.

### Configure IPFS Gateway
For production, consider using a more reliable IPFS gateway:
```javascript
// In CertificateContract.js
export const IPFS_CONFIG = {
  gateway: "https://your-preferred-gateway.com/ipfs/",
  // ... other config
};
```

### Set Up Monitoring
- Monitor transaction success/failure rates
- Track IPFS upload success rates
- Monitor user wallet connection issues

## Network-Specific Configuration

### Ethereum Mainnet
```javascript
export const DEFAULT_NETWORK = 1;
export const NETWORKS = {
  1: {
    name: "Ethereum Mainnet",
    chainId: 1,
    rpcUrl: "https://mainnet.infura.io/v3/YOUR_INFURA_KEY",
    explorer: "https://etherscan.io"
  }
};
```

### Polygon
```javascript
export const DEFAULT_NETWORK = 137;
export const NETWORKS = {
  137: {
    name: "Polygon",
    chainId: 137,
    rpcUrl: "https://polygon-rpc.com",
    explorer: "https://polygonscan.com"
  }
};
```

### BSC
```javascript
export const DEFAULT_NETWORK = 56;
export const NETWORKS = {
  56: {
    name: "BSC",
    chainId: 56,
    rpcUrl: "https://bsc-dataseed.binance.org",
    explorer: "https://bscscan.com"
  }
};
```

## Security Considerations

### Environment Variables
- Never commit `.env` files to version control
- Use different API keys for development and production
- Rotate API keys regularly

### Smart Contract Security
- Audit your smart contract before mainnet deployment
- Use multi-signature wallets for contract upgrades
- Implement proper access controls

### Frontend Security
- Validate all user inputs
- Implement rate limiting for IPFS uploads
- Use HTTPS in production

## Troubleshooting

### Common Issues

1. **Wallet Connection Fails**
   - Check if MetaMask is installed and unlocked
   - Verify network configuration matches your contract
   - Clear browser cache and try again

2. **Contract Calls Fail**
   - Verify contract address is correct
   - Check if you're on the right network
   - Ensure contract ABI matches deployed contract

3. **IPFS Upload Fails**
   - Verify Pinata API keys are correct
   - Check file size limits (max 10MB)
   - Ensure file format is supported

4. **Build Errors**
   - Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
   - Check Node.js version compatibility
   - Verify all dependencies are installed

### Debug Mode
Enable debug logging in the browser console:
```javascript
// In Web3Context.jsx
console.log('Contract call:', { function: 'uploadCertificate', args: [studentName, rollNumber, course, yearOfPassing, ipfsUrl] });
```

## Performance Optimization

### Bundle Size
- Use dynamic imports for large dependencies
- Implement code splitting for different roles
- Optimize images and assets

### Caching
- Implement service worker for offline functionality
- Cache IPFS responses
- Use local storage for user preferences

### Gas Optimization
- Batch multiple operations when possible
- Use appropriate gas limits
- Consider using Layer 2 solutions for high-volume operations

## Monitoring and Analytics

### Transaction Monitoring
- Track success/failure rates
- Monitor gas costs
- Alert on unusual activity

### User Analytics
- Track wallet connection rates
- Monitor feature usage
- Analyze user journey

### Error Tracking
- Implement error boundary components
- Log errors to external service
- Set up alerts for critical failures

## Support and Maintenance

### Regular Updates
- Keep dependencies updated
- Monitor smart contract for security updates
- Update IPFS gateway configurations

### User Support
- Provide clear error messages
- Create user documentation
- Set up support channels

---

**Important**: Always test thoroughly on testnets before deploying to mainnet. Ensure you have sufficient funds for gas fees and understand the implications of blockchain transactions.
