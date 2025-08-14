import React, { useState } from "react";
import { useWeb3 } from "../contexts/Web3Context";

export default function CompanyPage({ onBack }) {
  const { isConnected, verifyCertificate, searchCertificates, loading } = useWeb3();
  const [searchData, setSearchData] = useState({
    rollNumber: "",
    course: "CSE",
    yearOfPassing: "",
    certificateId: ""
  });
  const [searchResult, setSearchResult] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState("");
  const [searchStatus, setSearchStatus] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!isConnected) {
      setSearchStatus("Please connect your Petra wallet first");
      return;
    }

    const { rollNumber, course, yearOfPassing, certificateId } = searchData;
    
    if (!rollNumber || !course || !yearOfPassing) {
      setSearchStatus("Please fill in all required fields");
      return;
    }

    try {
      setSearchStatus("Searching for certificate on Aptos blockchain...");
      
      // Search for certificates using the Aptos Move contract
      const certificates = await searchCertificates(rollNumber, course, parseInt(yearOfPassing));
      
      if (certificates.length === 0) {
        setSearchStatus("No certificates found for the given criteria");
        setSearchResult(null);
        return;
      }
      
      // If certificateId is provided, find the specific one
      let selectedCertificate = certificates[0];
      if (certificateId) {
        const found = certificates.find(cert => cert.id === certificateId);
        if (found) {
          selectedCertificate = found;
        } else {
          setSearchStatus("Certificate ID does not match any found certificates");
          setSearchResult(null);
          return;
        }
      }
      
      // Format the result for display (Aptos Move contract structure)
      const formattedResult = {
        certificateId: selectedCertificate.id,
        studentName: selectedCertificate.student_name,
        rollNumber: selectedCertificate.roll_number,
        course: selectedCertificate.course,
        yearOfPassing: selectedCertificate.year_of_passing.toString(),
        status: selectedCertificate.is_verified ? "verified" : "minted",
        ipfsUrl: `https://gateway.pinata.cloud/ipfs/${selectedCertificate.ipfs_cid}`,
        blockchain: {
          transactionHash: "0x...", // This would come from the blockchain
          tokenId: selectedCertificate.id
        },
        uploadedBy: selectedCertificate.issuer,
        uploadedAt: new Date(parseInt(selectedCertificate.mint_time) * 1000).toLocaleDateString(),
        verifiedBy: selectedCertificate.verified_by !== "0x0" ? selectedCertificate.verified_by : null,
        verifiedAt: selectedCertificate.verified_time > 0 ? new Date(parseInt(selectedCertificate.verified_time) * 1000).toLocaleDateString() : null
      };
      
      setSearchResult(formattedResult);
      setSearchStatus("Certificate found!");
    } catch (error) {
      setSearchStatus("Error: " + error.message);
      console.error("Search error:", error);
    }
  };

  const handleVerify = async () => {
    if (!searchResult || !isConnected) {
      setVerificationStatus("Please search for a certificate first and ensure wallet is connected");
      return;
    }

    try {
      setVerificationStatus("Verifying certificate on Aptos blockchain...");
      
      // Call Aptos Move contract verification function
      const result = await verifyCertificate(searchResult.certificateId);
      
      if (result.success) {
        setVerificationStatus("Certificate verified successfully!");
        setSearchResult(prev => ({
          ...prev,
          status: "verified",
          verificationHash: result.transactionHash
        }));
      }
    } catch (error) {
      setVerificationStatus("Error: " + error.message);
      console.error("Verification error:", error);
    }
  };

  return (
    <div className="form-container">
      <div className="content-box">
        <h2>Verify Certificate on Aptos</h2>
        
        {!isConnected && (
          <div className="warning-message">
            Please connect your Petra wallet to verify certificates
          </div>
        )}

        <form onSubmit={handleSearch}>
          <div className="form-group">
            <label>Roll Number *</label>
            <input
              type="text"
              name="rollNumber"
              value={searchData.rollNumber}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Course *</label>
            <select
              name="course"
              value={searchData.course}
              onChange={handleInputChange}
              required
            >
              <option value="CSE">CSE</option>
              <option value="IT">IT</option>
              <option value="EEE">EEE</option>
              <option value="ECE">ECE</option>
              <option value="ME">ME</option>
              <option value="CE">CE</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Year of Passing *</label>
            <input
              type="number"
              name="yearOfPassing"
              value={searchData.yearOfPassing}
              onChange={handleInputChange}
              min="2000"
              max={new Date().getFullYear()}
              required
            />
          </div>

          <div className="form-group">
            <label>Certificate ID (Optional)</label>
            <input
              type="text"
              name="certificateId"
              value={searchData.certificateId}
              onChange={handleInputChange}
              placeholder="Leave empty to search by student details"
            />
          </div>

          {searchStatus && (
            <div className={`status-message ${searchStatus.includes('Error') ? 'error' : 'success'}`}>
              {searchStatus}
            </div>
          )}

          <div className="button-container">
            <button 
              type="submit" 
              className="search-button" 
              disabled={!isConnected || loading}
            >
              {loading ? "Searching..." : "Search Certificate"}
            </button>
          </div>
        </form>

        {searchResult && (
          <div className="search-result">
            <h3>Certificate Found on Aptos</h3>
            <div className="certificate-details">
              <p><strong>Certificate ID:</strong> {searchResult.certificateId}</p>
              <p><strong>Student Name:</strong> {searchResult.studentName}</p>
              <p><strong>Roll Number:</strong> {searchResult.rollNumber}</p>
              <p><strong>Course:</strong> {searchResult.course}</p>
              <p><strong>Year of Passing:</strong> {searchResult.yearOfPassing}</p>
              <p><strong>Status:</strong> <span className={`status-${searchResult.status}`}>{searchResult.status}</span></p>
              <p><strong>IPFS URL:</strong> <a href={searchResult.ipfsUrl} target="_blank" rel="noopener noreferrer">View Certificate</a></p>
              <p><strong>Uploaded By:</strong> {searchResult.uploadedBy}</p>
              <p><strong>Uploaded At:</strong> {searchResult.uploadedAt}</p>
              
              {searchResult.verifiedBy && (
                <p><strong>Verified By:</strong> {searchResult.verifiedBy}</p>
              )}
              {searchResult.verifiedAt && (
                <p><strong>Verified At:</strong> {searchResult.verifiedAt}</p>
              )}
              
              {searchResult.blockchain && (
                <div className="blockchain-info">
                  <p><strong>Transaction Hash:</strong> {searchResult.blockchain.transactionHash}</p>
                  <p><strong>Token ID:</strong> {searchResult.blockchain.tokenId}</p>
                  <p><strong>Blockchain:</strong> Aptos Testnet</p>
                </div>
              )}
            </div>

            {searchResult.status === "minted" && (
              <div className="verification-section">
                <button 
                  onClick={handleVerify} 
                  className="verify-button"
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Verify Certificate"}
                </button>
                {verificationStatus && (
                  <div className={`status-message ${verificationStatus.includes('Error') ? 'error' : 'success'}`}>
                    {verificationStatus}
                  </div>
                )}
              </div>
            )}

            {searchResult.status === "verified" && (
              <div className="verification-success">
                <p className="success-message">✅ Certificate has been verified on Aptos!</p>
                {searchResult.verificationHash && (
                  <p><strong>Verification Hash:</strong> {searchResult.verificationHash}</p>
                )}
              </div>
            )}
          </div>
        )}
        
        <button className="back-button" onClick={onBack}>Back</button>
      </div>
    </div>
  );
}
