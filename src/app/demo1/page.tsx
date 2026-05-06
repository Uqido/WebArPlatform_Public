"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ARConfig } from "@/types/ar";
import { buildARQueryString, useIframeMessage } from "@/utils/arHelper";

export default function Demo1Page() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [animations, setAnimations] = useState<string[]>([]);

  const [activeAnim, setActiveAnim] = useState<string | null>(null);

  // Track if marker is found
  const [isMarkerFound, setIsMarkerFound] = useState<boolean>(false);

  const config: ARConfig = {
    markerType: "pattern",
    markerUrl: "/marker_pattern/pattern-card.patt",
    modelUrl: "/models/tvanim/TV-anim.gltf",
    scale: [1, 1, 1],
    rotation: [180, 90, -90],
    position: [0, 0, 0],
    enableInteraction: true,
  };

  const iframeSrc = `/marker-ar.html?${buildARQueryString(config)}`;

  // Listen for events from iframe
  useIframeMessage({
    setIsMarkerFound,
    setAnimations,
    setActiveAnim,
    iframeRef,
  });

  const changeAnimation = (animationName: string) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: "CHANGE_ANIMATION", clip: animationName },
        "*",
      );
    }
  };

  const handleAnimationClick = (animName: string) => {
    setActiveAnim(animName);
    changeAnimation(animName);
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100dvh",
        overflow: "hidden",
        backgroundColor: "#000",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "40px 20px",
          zIndex: 10,
          fontFamily: "sans-serif",
          pointerEvents: "none",
          textAlign: "center",
          boxSizing: "border-box",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "2.5rem",
              marginBottom: "10px",
              color: "#0f0",
              textShadow: "2px 2px 5px rgba(0,0,0,0.8)",
              marginTop: 0,
            }}
          >
            Demo1 - AR Active!
          </h1>
          <p
            style={{
              fontSize: "1.2rem",
              color: "#fff",
              textShadow: "1px 1px 3px rgba(0,0,0,0.8)",
              margin: 0,
            }}
          >
            {isMarkerFound
              ? "Marker found! Play with animations."
              : "Frame the marker."}
          </p>
        </div>

        <div
          style={{
            pointerEvents: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
          }}
        >
          {/* Show buttons only if marker is found and animations exist */}
          {isMarkerFound && animations.length > 0 && (
            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {animations.map((animName) => (
                <button
                  key={animName}
                  onClick={() => handleAnimationClick(animName)}
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

          <Link
            href="/"
            style={{
              display: "inline-block",
              padding: "12px 24px",
              backgroundColor: "#0070f3",
              color: "white",
              textDecoration: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "bold",
              boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
            }}
          >
            ← Back to the scanner
          </Link>
        </div>
      </div>

      <iframe
        ref={iframeRef}
        src={iframeSrc}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          border: "none",
          zIndex: 1,
        }}
        allow="camera; gyroscope; accelerometer; magnetometer; vr;"
        title="AR Scanner"
      />
    </div>
  );
}
