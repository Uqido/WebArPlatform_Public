"use client";

import { useEffect, useRef, useState } from "react";

const ModelViewer = ({ src, alt }) => {
  const modelRef = useRef(null);

  // States to keep track of all animations and active animation
  const [animations, setAnimations] = useState([]);
  const [activeAnim, setActiveAnim] = useState("");

  useEffect(() => {
    import("@google/model-viewer").catch(console.error);
  }, []);

  // Extract animations form glb/gltf model
  useEffect(() => {
    const model = modelRef.current;
    if (!model) return;

    const handleLoad = () => {
      const available = model.availableAnimations;

      if (available && available.length > 0) {
        setAnimations(available);
        setActiveAnim(available[0]);
      }
    };

    model.addEventListener("load", handleLoad);

    return () => {
      model.removeEventListener("load", handleLoad);
    };
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "550px",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      {/* Buttons shown only if there are animations. */}
      {animations.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {animations.map((animName) => (
            <button
              key={animName}
              onClick={() => setActiveAnim(animName)}
              style={{
                padding: "8px 16px",
                cursor: "pointer",
                borderRadius: "6px",
                border: "none",
                backgroundColor:
                  activeAnim === animName ? "#0070f3" : "#e0e0e0",
                color: activeAnim === animName ? "white" : "black",
                fontWeight: "bold",
                boxShadow:
                  activeAnim === animName
                    ? "0 2px 4px rgba(0,0,0,0.2)"
                    : "none",
                transition: "all 0.2s ease-in-out",
              }}
            >
              {animName}
            </button>
          ))}
        </div>
      )}

      <div style={{ flexGrow: 1, width: "100%", height: "100%" }}>
        <model-viewer
          ref={modelRef}
          src={src}
          alt={alt}
          animation-name={activeAnim} // Animation to play
          autoplay // Play animations
          camera-controls
          auto-rotate
          ar
          ar-modes="webxr scene-viewer quick-look"
          ar-scale="auto" // Autoscale the 3d model (?)
          shadow-intensity="1"
          style={{ width: "100%", height: "100%" }}
        ></model-viewer>
      </div>
    </div>
  );
};

export default ModelViewer;
