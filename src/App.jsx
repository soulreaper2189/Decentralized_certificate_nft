import React, { useState } from "react";
import "./App.css";
import { Web3Provider } from "./contexts/Web3Context";
import WalletConnect from "./components/WalletConnect";
import CollegePage from "./components/CollegePage";
import CompanyPage from "./components/CompanyPage";
import StudentPage from "./components/StudentPage";

export default function App() {
  const [page, setPage] = useState("home");

  return (
    <Web3Provider>
      <div className="app">
        <header className="app-header">
          <h1>Aptos Certificate Verification System</h1>
          <WalletConnect />
        </header>
        
        <main className="app-main">
          {page === "home" && (
            <div className="container">
              <div className="welcome-section">
                <h2>Welcome to the Aptos Blockchain Certificate Verification System</h2>
                <p>Connect your Petra wallet to get started with secure, tamper-proof certificate management on Aptos</p>
              </div>
              
              <div className="role-selection">
                <h3>Select Your Role</h3>
                <div className="role-grid">
                  <div className="role-card" onClick={() => setPage("college")}>
                    <div className="role-icon">🏫</div>
                    <h4>College</h4>
                    <p>Upload and mint student certificates on the Aptos blockchain</p>
                  </div>
                  
                  <div className="role-card" onClick={() => setPage("company")}>
                    <div className="role-icon">🏢</div>
                    <h4>Company</h4>
                    <p>Verify candidate certificates from the Aptos blockchain</p>
                  </div>
                  
                  <div className="role-card" onClick={() => setPage("student")}>
                    <div className="role-icon">👨‍🎓</div>
                    <h4>Student</h4>
                    <p>Retrieve and view your verified certificates from Aptos</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {page === "college" && <CollegePage onBack={() => setPage("home")} />}
          {page === "company" && <CompanyPage onBack={() => setPage("home")} />}
          {page === "student" && <StudentPage onBack={() => setPage("home")} />}
        </main>
      </div>
    </Web3Provider>
  );
}
