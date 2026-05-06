"use client";

import styles from "./scanner.module.css";
import { useQrScanner } from "../utils/useQrScanner";

export default function Page() {
  const { videoRef, state, qrData } = useQrScanner();

  return (
    <div className={styles.container}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={styles.video}
      />

      <div className={styles.overlay}>
        <div>
          <span
            className={`${styles.statusBadge} ${
              qrData ? styles.statusSuccess : ""
            }`}
          >
            {state}
          </span>
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
