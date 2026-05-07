import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import jsQR from "jsqr";

// Define authorized IDs here
const ALLOWED_IDS = ["demoModelViewer", "iceCore", "glacierInTime"];

export function useQrScanner() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Guard to prevent multiple scans/redirects while processing
  const isProcessing = useRef(false);

  // Refs for safely handling timeouts and component unmounting
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMounted = useRef<boolean>(true);

  const [state, setState] = useState<string>("Waiting for camera...");
  const [qrData, setQrData] = useState<{
    originalUrl: string;
    parameters: Record<string, string>;
  } | null>(null);

  // Helper to create a cooldown between scans
  function pauseScanner() {
    isProcessing.current = true;

    // Clear any existing timeout to prevent overlapping cooldowns
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      isProcessing.current = false;

      // Only update state if the component is still mounted
      if (isMounted.current) {
        setState("Scanning...");
      }
    }, 1500);
  }

  // Analyze url from QR
  function analyzeUrl(qrString: string) {
    try {
      const correctUrl = new URL(qrString);
      const parameters = Object.fromEntries(correctUrl.searchParams.entries());
      const id = correctUrl.searchParams.get("id");

      if (id) {
        // Validate the ID against the whitelist
        if (ALLOWED_IDS.includes(id)) {
          isProcessing.current = true;
          setState(`ID "${id}" verified! Redirecting...`);

          // Stop animation before navigating
          if (requestRef.current) cancelAnimationFrame(requestRef.current);
          router.push(`/${id}`);
          return;
        } else {
          // ID found but not authorized
          setState(`Access Denied: ID "${id}" is not valid.`);
          setQrData({ originalUrl: qrString, parameters });

          // Briefly pause to show the error before allowing next scan
          pauseScanner();
          return;
        }
      }

      setState("QR detected but no ID parameter found.");
      setQrData({ originalUrl: qrString, parameters });
      pauseScanner();
    } catch (err) {
      setState("QR does not contain a valid URL.");
      setQrData({ originalUrl: qrString, parameters: {} });
      pauseScanner();
    }
  }

  // Scan frame
  function scanFrame() {
    const video = videoRef.current;

    // Skip frame if processing or video not ready
    if (
      isProcessing.current ||
      !video ||
      video.readyState !== video.HAVE_ENOUGH_DATA
    ) {
      requestRef.current = requestAnimationFrame(scanFrame);
      return;
    }

    if (!canvasRef.current) {
      canvasRef.current = document.createElement("canvas");
    }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    if (ctx) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });

      if (code) {
        analyzeUrl(code.data);
      }
    }
    requestRef.current = requestAnimationFrame(scanFrame);
  }

  // Start Camera
  async function startCamera() {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setState("Camera API blocked or not supported. Check HTTPS/localhost.");
        return;
      }

      // Stop existing tracks before requesting a new stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }

      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        ) || navigator.maxTouchPoints > 0;

      const videoConstraints = isMobile
        ? { facingMode: { ideal: "environment" } }
        : true;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: videoConstraints,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true");
        await videoRef.current.play();

        setState("Scanning...");
        requestRef.current = requestAnimationFrame(scanFrame);
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "NotFoundError") {
        setState("Error: No camera found on this device.");
      } else if (
        err instanceof DOMException &&
        err.name === "NotAllowedError"
      ) {
        setState(
          "Error: Camera permission denied. Please allow camera access.",
        );
      } else if (err instanceof Error) {
        setState(`Camera error: ${err.message}`);
      }
      console.error("getUserMedia error:", err);
    }
  }

  // Clean up on unmount
  useEffect(() => {
    isMounted.current = true;

    return () => {
      // Mark as unmounted to block pending state updates
      isMounted.current = false;

      // Clear the scanner cooldown timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (requestRef.current) cancelAnimationFrame(requestRef.current);

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, []);

  // Expose startCamera to the component
  return { videoRef, state, qrData, startCamera };
}
