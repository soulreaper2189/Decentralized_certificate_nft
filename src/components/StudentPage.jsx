import React, { useState } from "react";
import { useWeb3 } from "../contexts/Web3Context";

export default function StudentPage({ onBack }) {
  const { isConnected, searchCertificates, loading } = useWeb3();
  const [searchData, setSearchData] = useState({
    name: "",
    rollNumber: "",
    course: "CSE",
    yearOfPassing: ""
  });
  const [searchResult, setSearchResult] = useState(null);
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

    const { name, rollNumber, course, yearOfPassing } = searchData;
    
    if (!name || !rollNumber || !course || !yearOfPassing) {
      setSearchStatus("Please fill in all required fields");
      return;
    }

    try {
      setSearchStatus("Searching for your certificate on Aptos blockchain...");
      
      // Search for certificates using the Aptos Move contract
      const certificates = await searchCertificates(rollNumber, course, parseInt(yearOfPassing));
      
      if (certificates.length === 0) {
        setSearchStatus("No certificates found for the given criteria");
        setSearchResult(null);
        return;
      }
      
      // Find the certificate that matches the student name
      const studentCertificate = certificates.find(cert => 
        cert.student_name.toLowerCase() === name.toLowerCase()
      );
      
      if (!studentCertificate) {
        setSearchStatus("No certificate found for the given name and details");
        setSearchResult(null);
        return;
      }
      
      // Format the result for display (Aptos Move contract structure)
      const formattedResult = {
        certificateId: studentCertificate.id,
        studentName: studentCertificate.student_name,
        rollNumber: studentCertificate.roll_number,
        course: studentCertificate.course,
        yearOfPassing: studentCertificate.year_of_passing.toString(),
        status: studentCertificate.is_verified ? "verified" : "minted",
        ipfsUrl: `https://gateway.pinata.cloud/ipfs/${studentCertificate.ipfs_cid}`,
        blockchain: {
          transactionHash: "0x...", // This would come from the blockchain
          tokenId: studentCertificate.id
        },
        uploadedBy: studentCertificate.issuer,
        uploadedAt: new Date(parseInt(studentCertificate.mint_time) * 1000).toLocaleDateString(),
        verifiedBy: studentCertificate.verified_by !== "0x0" ? studentCertificate.verified_by : null,
        verifiedAt: studentCertificate.verified_time > 0 ? new Date(parseInt(studentCertificate.verified_time) * 1000).toLocaleDateString() : null,
        verificationHistory: studentCertificate.is_verified ? [
          {
            verifiedBy: "Aptos Blockchain Verification",
            verifiedAt: new Date(parseInt(studentCertificate.verified_time) * 1000).toISOString(),
            verificationMethod: "blockchain"
          }
        ] : []
      };
      
      setSearchResult(formattedResult);
      setSearchStatus("Certificate found!");
    } catch (error) {
      setSearchStatus("Error: " + error.message);
      console.error("Search error:", error);
    }
  };

  return (
    <div className="form-container">
      <div className="content-box">
        <h2>Retrieve Your Certificate from Aptos</h2>
        
        {!isConnected && (
          <div className="warning-message">
            Please connect your Petra wallet to retrieve certificates
          </div>
        )}

        <form onSubmit={handleSearch}>
          <div className="form-group">
            <label>Your Name *</label>
            <input
              type="text"
              name="name"
              value={searchData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          
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
            <h3>Your Certificate on Aptos</h3>
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

              {searchResult.verificationHistory && searchResult.verificationHistory.length > 0 && (
                <div className="verification-history">
                  <h4>Verification History</h4>
                  {searchResult.verificationHistory.map((verification, index) => (
                    <div key={index} className="verification-record">
                      <p><strong>Verified By:</strong> {verification.verifiedBy}</p>
                      <p><strong>Verified At:</strong> {new Date(verification.verifiedAt).toLocaleDateString()}</p>
                      <p><strong>Method:</strong> {verification.verificationMethod}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {searchResult.status === "verified" && (
              <div className="verification-success">
                <p className="success-message">✅ Your certificate has been verified and is authentic on Aptos!</p>
                <p>This certificate is stored on the Aptos blockchain and cannot be tampered with.</p>
              </div>
            )}
          </div>
        )}
        
        <button className="back-button" onClick={onBack}>Back</button>
      </div>
    </div>
  );
}
