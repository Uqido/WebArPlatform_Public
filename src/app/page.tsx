"use client";

import { useState, useEffect } from "react";
import { Manrope } from "next/font/google";
import styles from "./scanner.module.css";
import { useQrScanner } from "../utils/useQrScanner";

// Manrope font configuration
const manrope = Manrope({ subsets: ["latin"] });

export default function Page() {
  const { videoRef, state, qrData, startCamera } = useQrScanner();
  const [isScanning, setIsScanning] = useState(false);

  // 1. Trigger startCamera ONLY after the DOM has updated and the video is mounted
  useEffect(() => {
    if (isScanning) {
      startCamera();
    }
    // We intentionally omit startCamera from the dependency array to avoid
    // infinite loops if the hook doesn't heavily memoize the function.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScanning]);

  const handleStartCamera = () => {
    setIsScanning(true);
  };

  // 2. Helper to determine if the camera failed to initialize
  const isError =
    state.toLowerCase().includes("error") ||
    state.toLowerCase().includes("blocked");

  // If is not scanning, show the landing page.
  if (!isScanning) {
    return (
      <div
        className={manrope.className}
        style={{
          backgroundColor: "#ffffff",
          color: "#000000",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
          Piattaforma WebAR di Uqido
        </h1>
        <p
          style={{
            fontSize: "1.1rem",
            marginBottom: "2rem",
            maxWidth: "400px",
          }}
        >
          Premi il pulsante e inquadra il QR code per accedere ai contenuti AR
        </p>
        <button
          onClick={handleStartCamera}
          style={{
            backgroundColor: "#000000",
            color: "#ffffff",
            border: "none",
            borderRadius: "8px",
            padding: "14px 28px",
            fontSize: "1rem",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          Attiva la camera
        </button>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${manrope.className}`}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={styles.video}
      />

      <div className={styles.overlay}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span
            className={`${styles.statusBadge} ${
              qrData ? styles.statusSuccess : ""
            }`}
            // Add some inline styling to highlight errors in red
            style={
              isError ? { backgroundColor: "#dc2626", color: "white" } : {}
            }
          >
            {state}
          </span>

          {/* Render a Retry/Back button if the camera fails */}
          {isError && (
            <button
              onClick={() => window.location.reload()}
              style={{
                backgroundColor: "#ffffff",
                color: "#000000",
                border: "none",
                borderRadius: "8px",
                padding: "8px 16px",
                fontSize: "0.9rem",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              }}
            >
              Go Back / Retry
            </button>
          )}
        </div>

        {qrData && (
          <div className={styles.resultBox}>
            <h3 style={{ color: "#0f0" }}>✓ Read correctly!</h3>
            <p style={{ color: "#aaa", fontSize: "12px" }}>
              Automatic reset in 2 seconds...
            </p>
            <p
              style={{
                color: "#aaa",
                fontSize: "14px",
                wordBreak: "break-all",
              }}
            >
              <strong>URL:</strong> {qrData.originalUrl}
            </p>

            <div style={{ marginBottom: "20px" }}>
              <strong style={{ color: "#fff" }}>Parameters found:</strong>
              {Object.keys(qrData.parameters).length > 0 ? (
                <ul
                  style={{
                    color: "#0f0",
                    margin: "10px 0 0 0",
                    paddingLeft: "20px",
                  }}
                >
                  {Object.entries(qrData.parameters).map(([key, value]) => (
                    <li key={key}>
                      <b>{key}</b>: {value}
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: "#aaa", fontSize: "14px" }}>
                  No parameter founded.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
