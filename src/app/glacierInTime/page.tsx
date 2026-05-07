"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import { ARConfig, AROffsets, CustomAnimation } from "@/types/ar";
import {
  buildARQueryString,
  getAdjustedARConfig,
  useIframeMessage,
} from "@/utils/arHelper";
import { BASE_PATH } from "@/utils/configHelper";

export default function GlacierInTimePage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [animations, setAnimations] = useState<string[]>([]);
  const [, setActiveAnim] = useState<string | null>(null);
  const [isMarkerFound, setIsMarkerFound] = useState<boolean>(false);
  const [animationStarted, setAnimationStarted] = useState<boolean>(false);

  // 1. Reveal animation
  const revealAnimation: CustomAnimation = {
    name: "reveal",
    config: {
      type: "clip-z",
      duration: 6000,
      min: -1500,
      max: 0,
    },
  };

  const baseConfig: ARConfig = {
    markerType: "nft",
    markerUrl: `${BASE_PATH}/nft/glacier-in-time/glacier-in-time-target`,
    modelUrl: `${BASE_PATH}/models/glacier-in-time/Wrapper.gltf`,
    scale: [250, 250, 250],
    rotation: [0, 180, 0],
    position: [125, 0, -180],
    enableInteraction: false,
    customAnimation: revealAnimation,
  };

  const IOS_OFFSETS: AROffsets = {
    x: -40,
    y: 0,
    z: 0,
  };

  const config = getAdjustedARConfig(baseConfig, IOS_OFFSETS);

  const iframeSrc = `${BASE_PATH}/nft-ar.html?${buildARQueryString(config)}`;

  const markerImageUrl = `${BASE_PATH}/models/glacier-in-time/Marker.jpg`;

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

  const handleScreenTouch = () => {
    if (isMarkerFound && !animationStarted) {
      const firstAnim = animations.length > 0 ? animations[0] : "";
      if (firstAnim) setActiveAnim(firstAnim);

      changeAnimation(firstAnim);
      setAnimationStarted(true);
    }
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
      {/* Invisible overlay to capture the click*/}
      {isMarkerFound && !animationStarted && (
        <div
          onClick={handleScreenTouch}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 8,
            cursor: "pointer",
          }}
        />
      )}

      {/* Overlay image */}
      <Image
        src={markerImageUrl}
        alt="Inquadra questa immagine"
        width={512}
        height={1024}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          maxWidth: "80vw",
          maxHeight: "80vh",
          width: "auto",
          height: "auto",
          opacity: isMarkerFound ? 0 : 0.4,
          transition: "opacity 0.6s ease-in-out",
          pointerEvents: "none",
          zIndex: 5,
        }}
        priority
      />

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
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {!isMarkerFound && (
            <p
              style={{
                fontSize: "1.2rem",
                color: "#fff",
                textShadow: "1px 1px 3px rgba(0,0,0,0.8)",
                margin: 0,
              }}
            >
              Frame the image to start
            </p>
          )}

          {isMarkerFound && !animationStarted && (
            <div
              style={{
                fontSize: "1.5rem",
                color: "#fff",
                fontWeight: "bold",
                animation: "pulse 2s infinite",
                textTransform: "uppercase",
                letterSpacing: "1px",
                textShadow: "2px 2px 6px rgba(0,0,0,0.9)",
                pointerEvents: "none",
              }}
            >
              Tocca per iniziare
            </div>
          )}
        </div>

        {/* Go back button */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
            marginBottom: "20px",
          }}
        >
          <Link
            href="/"
            style={{
              pointerEvents: "auto",
              display: "inline-block",
              padding: "12px 24px",
              backgroundColor: "#0070f3",
              color: "white",
              textDecoration: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "bold",
              opacity: 0.8,
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

      {/* Pulse effect */}
      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.05);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
}
