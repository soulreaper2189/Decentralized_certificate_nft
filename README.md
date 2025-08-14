# Aptos Certificate Verification System

A modern, decentralized certificate verification system built with React and Aptos blockchain. This application eliminates the need for a traditional backend by directly interacting with Aptos Move contracts and IPFS for secure, tamper-proof certificate management.

## 🎯 **What We've Built**

✅ **Enhanced Move Contract**: Complete certificate management with verification  
✅ **Aptos Frontend**: React app that works with your Move contract  
✅ **IPFS Integration**: Decentralized file storage for certificates  
✅ **Petra Wallet Support**: Native Aptos wallet integration  
✅ **No Backend Required**: Everything runs on Aptos blockchain and IPFS  

## 🚀 **Quick Start**

### **1. Deploy Your Move Contract**
```bash
# Install Aptos CLI
curl -fsSL "https://aptos.dev/scripts/install_cli.py" | python3

# Deploy contract
aptos move publish --named-addresses my_addr=0x2351d7888f7b0ac1eb42567ff8a22254ac6a063965b97c372df77a0947ae9bb1

# Initialize storage
aptos move run --function-id '0x2351d7888f7b0ac1eb42567ff8a22254ac6a063965b97c372df77a0947ae9bb1::certificate_nft::init_storage'
```

### **2. Setup Frontend**
```bash
cd frontend
npm install
cp env.example .env
# Add your Pinata API keys to .env
npm run dev
```

### **3. Test Your System**
1. Connect Petra wallet
2. Switch to Aptos testnet
3. Test certificate upload (College role)
4. Test certificate verification (Company role)
5. Test certificate retrieval (Student role)

## 🔧 **Features**

### **For Colleges**
- Upload student certificates to IPFS
- Mint certificates on Aptos blockchain
- Track all uploaded certificates

### **For Companies**
- Search certificates by student details
- Verify certificates directly on blockchain
- View verification history

### **For Students**
- Retrieve verified certificates
- View blockchain verification status
- Access IPFS-stored certificate files

## 📋 **Move Contract Functions**

Your enhanced contract includes:

- `init_storage(admin: &signer)` - Initialize storage
- `mint_certificate(admin, student_name, roll_number, course, year_of_passing, ipfs_cid)` - Upload certificate
- `verify_certificate(verifier, certificate_index)` - Verify certificate
- `search_certificates(roll_number, course, year_of_passing)` - Search by student details
- `get_certificate(certificate_index)` - Get certificate by index
- `get_certificate_count()` - Get total certificates

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

## 🌐 **Deployment**

### **Local Development**
```bash
npm run dev
```

### **Production Build**
```bash
npm run build
```

### **Deploy to Vercel**
```bash
npm install -g vercel
vercel --prod
```

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

## 🔍 **Debugging**

### **Enable Console Logging**
Check browser console for detailed error messages.

### **Verify Contract Deployment**
```bash
aptos account list --query resources --account 0x2351d7888f7b0ac1eb42567ff8a22254ac6a063965b97c372df77a0947ae9bb1
```

### **Check Transaction Status**
Use [Aptos Explorer](https://explorer.aptoslabs.com/) to verify transactions.

## 📊 **Architecture**

```
Frontend (React) → Aptos Move Contract → IPFS Storage
     ↓                    ↓                    ↓
Petra Wallet    →  Blockchain Data   →  Certificate Files
```

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
- See detailed deployment guide in `APTOS_DEPLOYMENT.md`

---

**Next Steps**: Test your system thoroughly, then deploy to mainnet when ready!
