import React, { useState } from "react";
import { useWeb3 } from "../contexts/Web3Context";
import { useDropzone } from "react-dropzone";

export default function CollegePage({ onBack }) {
  const { isConnected, uploadCertificate, loading } = useWeb3();
  const [formData, setFormData] = useState({
    studentName: "",
    rollNumber: "",
    course: "CSE",
    yearOfPassing: new Date().getFullYear(),
  });
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [uploadResult, setUploadResult] = useState(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
      setUploadStatus("File selected: " + acceptedFiles[0].name);
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isConnected) {
      setUploadStatus("Please connect your Petra wallet first");
      return;
    }

    if (!file) {
      setUploadStatus("Please select a certificate file");
      return;
    }

    try {
      setUploadStatus("Uploading certificate to IPFS and Aptos blockchain...");
      const result = await uploadCertificate(formData, file);
      
      if (result.success) {
        setUploadStatus("Certificate uploaded successfully!");
        setUploadResult({
          transactionHash: result.transactionHash,
          ipfsUrl: result.ipfsUrl
        });
        
        // Reset form
        setFormData({
          studentName: "",
          rollNumber: "",
          course: "CSE",
          yearOfPassing: new Date().getFullYear(),
        });
        setFile(null);
      }
    } catch (error) {
      setUploadStatus("Error: " + error.message);
      console.error("Upload error:", error);
    }
  };

  return (
    <div className="form-container">
      <div className="content-box">
        <h2>Upload Certificate to Aptos</h2>
        
        {!isConnected && (
          <div className="warning-message">
            Please connect your Petra wallet to upload certificates
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Student Name</label>
            <input
              type="text"
              name="studentName"
              value={formData.studentName}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Roll Number</label>
            <input
              type="text"
              name="rollNumber"
              value={formData.rollNumber}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Course</label>
            <select
              name="course"
              value={formData.course}
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
            <label>Year of Passing</label>
            <input
              type="number"
              name="yearOfPassing"
              value={formData.yearOfPassing}
              onChange={handleInputChange}
              min="2000"
              max={new Date().getFullYear() + 5}
              required
            />
          </div>

          <div className="form-group">
            <label>Certificate File</label>
            <div {...getRootProps()} className="dropzone">
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the certificate file here...</p>
              ) : (
                <p>Drag & drop a certificate file here, or click to select</p>
              )}
              {file && (
                <p className="file-info">Selected: {file.name}</p>
              )}
            </div>
          </div>

          {uploadStatus && (
            <div className={`status-message ${uploadStatus.includes('Error') ? 'error' : 'success'}`}>
              {uploadStatus}
            </div>
          )}

          {uploadResult && (
            <div className="upload-result">
              <h4>Upload Successful!</h4>
              <p><strong>Transaction Hash:</strong> {uploadResult.transactionHash}</p>
              <p><strong>IPFS URL:</strong> <a href={uploadResult.ipfsUrl} target="_blank" rel="noopener noreferrer">{uploadResult.ipfsUrl}</a></p>
              <p><strong>Blockchain:</strong> Aptos Testnet</p>
            </div>
          )}

          <div className="button-container">
            <button 
              type="submit" 
              className="upload-button" 
              disabled={!isConnected || loading}
            >
              {loading ? "Uploading..." : "Upload Certificate"}
            </button>
          </div>
        </form>
        
        <button className="back-button" onClick={onBack}>Back</button>
      </div>
    </div>
  );
}
