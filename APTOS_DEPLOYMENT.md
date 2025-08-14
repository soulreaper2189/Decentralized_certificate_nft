# Aptos Certificate Verification System - Deployment Guide

This guide will help you deploy your Aptos Move contract and integrate it with the Web3 frontend.

## 🎯 **What We've Built**

✅ **Enhanced Move Contract**: Complete certificate management with verification  
✅ **Aptos Frontend**: React app that works with your Move contract  
✅ **IPFS Integration**: Decentralized file storage for certificates  
✅ **Petra Wallet Support**: Native Aptos wallet integration  

## 🚀 **Step 1: Deploy Your Move Contract**

### **Option A: Use Aptos CLI (Recommended)**

1. **Install Aptos CLI**:
   ```bash
   curl -fsSL "https://aptos.dev/scripts/install_cli.py" | python3
   ```

2. **Initialize Aptos project**:
   ```bash
   aptos init --profile default
   ```

3. **Deploy your contract**:
   ```bash
   aptos move publish --named-addresses my_addr=0x2351d7888f7b0ac1eb42567ff8a22254ac6a063965b97c372df77a0947ae9bb1
   ```

### **Option B: Use Aptos Studio (GUI)**

1. Go to [Aptos Studio](https://studio.aptoslabs.com/)
2. Connect your wallet
3. Upload your Move contract
4. Deploy to testnet

## 🔧 **Step 2: Initialize Contract Storage**

After deployment, you need to initialize the storage:

```bash
# Call the init_storage function
aptos move run --function-id '0x2351d7888f7b0ac1eb42567ff8a22254ac6a063965b97c372df77a0947ae9bb1::certificate_nft::init_storage'
```

## 📱 **Step 3: Install Frontend Dependencies**

```bash
cd frontend
npm install
```

## ⚙️ **Step 4: Configure Environment**

1. **Create `.env` file**:
   ```bash
   cp env.example .env
   ```

2. **Add your Pinata API keys**:
   ```env
   REACT_APP_PINATA_API_KEY=your_actual_pinata_api_key
   REACT_APP_PINATA_SECRET=your_actual_pinata_secret
   ```

## 🧪 **Step 5: Test Locally**

```bash
npm run dev
```

Open `http://localhost:5173` and test:
1. Connect Petra wallet
2. Switch to Aptos testnet
3. Test certificate upload (College role)
4. Test certificate verification (Company role)
5. Test certificate retrieval (Student role)

## 🌐 **Step 6: Deploy Frontend**

### **Option A: Vercel (Recommended)**
```bash
npm install -g vercel
vercel --prod
```

### **Option B: Netlify**
1. Run `npm run build`
2. Drag `dist` folder to Netlify

## 📋 **Move Contract Functions**

Your contract now includes these functions:

### **Core Functions**
- `init_storage(admin: &signer)` - Initialize storage
- `mint_certificate(admin, student_name, roll_number, course, year_of_passing, ipfs_cid)` - Upload certificate
- `verify_certificate(verifier, certificate_index)` - Verify certificate
- `get_certificate(certificate_index)` - Get certificate by index

### **Query Functions**
- `search_certificates(roll_number, course, year_of_passing)` - Search by student details
- `get_certificate_count()` - Get total certificates
- `get_all_certificates(admin_addr)` - Get all certificates

## 🔑 **Required Setup**

### **1. Petra Wallet**
- Install [Petra Wallet](https://petra.app/)
- Create account and get testnet APT tokens
- Switch to Aptos testnet

### **2. Pinata Account**
- Sign up at [pinata.cloud](https://pinata.cloud)
- Get API keys from dashboard
- Add to `.env` file

### **3. Testnet APT Tokens**
- Get testnet APT from [Aptos Faucet](https://aptoslabs.com/testnet-faucet)
- You need APT for transaction fees

## 🧪 **Testing Your System**

### **Test Certificate Upload**
1. Connect Petra wallet as College
2. Fill form with student details
3. Upload PDF/image file
4. Submit transaction
5. Wait for confirmation

### **Test Certificate Verification**
1. Connect Petra wallet as Company
2. Search for uploaded certificate
3. Click "Verify Certificate"
4. Confirm transaction

### **Test Certificate Retrieval**
1. Connect Petra wallet as Student
2. Search with your details
3. View certificate and verification status

## 🚨 **Common Issues & Solutions**

### **1. "Petra Wallet not found"**
- Install Petra Wallet extension
- Refresh browser page
- Check if extension is enabled

### **2. "Transaction failed"**
- Ensure you have enough APT for gas
- Check if you're on testnet
- Verify wallet is connected

### **3. "IPFS upload failed"**
- Check Pinata API keys
- Verify file size (max 10MB)
- Check file format (PDF, PNG, JPG)

### **4. "Move function not found"**
- Ensure contract is deployed
- Check function name spelling
- Verify module address

## 🔍 **Debugging**

### **Enable Console Logging**
Check browser console for detailed error messages.

### **Verify Contract Deployment**
```bash
aptos account list --query resources --account 0x2351d7888f7b0ac1eb42567ff8a22254ac6a063965b97c372df77a0947ae9bb1
```

### **Check Transaction Status**
Use [Aptos Explorer](https://explorer.aptoslabs.com/) to verify transactions.

## 📊 **Monitoring**

### **Track Success Rates**
- Monitor transaction confirmations
- Track IPFS upload success
- Monitor wallet connection rates

### **User Analytics**
- Certificate upload counts
- Verification rates
- Search patterns

## 🚀 **Production Deployment**

### **1. Deploy to Mainnet**
- Update network in frontend
- Ensure sufficient APT balance
- Test thoroughly on testnet first

### **2. Security Considerations**
- Audit Move contract
- Use multi-sig for admin functions
- Implement rate limiting

### **3. Performance Optimization**
- Use CDN for IPFS gateway
- Implement caching
- Monitor gas costs

## 🎉 **You're All Set!**

Your Aptos certificate verification system is now:
- ✅ **Deployed on Aptos testnet**
- ✅ **Frontend integrated with Move contract**
- ✅ **IPFS storage configured**
- ✅ **Petra wallet connected**
- ✅ **Ready for testing and production**

## 📞 **Need Help?**

- Check [Aptos Documentation](https://aptos.dev/)
- Visit [Petra Wallet Support](https://petra.app/)
- Review [Move Language Guide](https://move-language.github.io/move/)

---

**Next Steps**: Test your system thoroughly, then deploy to mainnet when ready!
