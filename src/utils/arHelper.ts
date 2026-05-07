import { ARConfig, AROffsets, UseIframeMessageProps } from "@/types/ar";
import { useEffect } from "react";

export function buildARQueryString(config: ARConfig): string {
  // Prepariamo i parametri base
  const params: Record<string, string> = {
    markerType: config.markerType,
    markerUrl: config.markerUrl,
    modelUrl: config.modelUrl,
    scale: config.scale.join(" "),
    rotation: config.rotation.join(" "),
    position: config.position.join(" "),
    particleEffectName: config.particleEffectName ?? "",
    enableInteraction: config.enableInteraction.toString(),
  };

  // If animation config is present
  if (config.customAnimation) {
    params.customAnimation = JSON.stringify(config.customAnimation);
  }

  return new URLSearchParams(params).toString();
}

/**
 * Starting from the assumption that the original position is defined in android.
 * Adjust position for ios (?)
 * With Pixel 7 center the model on the image. The offset should place the image on the center also on the iphone (14 Pro)
 *
 * Offeset to center the model on the image on Iphone14 pro.
 * TODO: Try on other devices if the offset is still valid or change.
 *
 */
export function getAdjustedARConfig(
  baseConfig: ARConfig,
  offsets: AROffsets,
): ARConfig {
  if (typeof window === "undefined") return baseConfig;

  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

  if (isIOS) {
    return {
      ...baseConfig,
      position: [
        baseConfig.position[0] + offsets.x,
        baseConfig.position[1] + offsets.y,
        baseConfig.position[2] + offsets.z,
      ] as [number, number, number],
    };
  }

  return baseConfig;
}

//TODO: flag for autoplay
export function useIframeMessage({
  setIsMarkerFound,
  setAnimations,
  setActiveAnim,
  iframeRef,
}: UseIframeMessageProps) {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data) {
        if (event.data.type === "MARKER_STATE") {
          setIsMarkerFound(event.data.isFound);
        } else if (event.data.type === "ANIMATIONS_LOADED") {
          const loadedAnimations = event.data.animations;
          setAnimations(loadedAnimations);
        }
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [setIsMarkerFound, setAnimations, setActiveAnim, iframeRef]);
}
