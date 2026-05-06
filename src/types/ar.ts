import { RefObject } from "react";

export type Vector3 = [number, number, number];

export interface ARConfig {
  markerType: "nft" | "pattern" | "preset";
  markerUrl: string; //Url or preset type es. "hiro"
  modelUrl: string;
  scale: Vector3;
  rotation: Vector3;
  position: Vector3;
  particleEffectName?: string; //Effect to load, if any
  enableInteraction: boolean; //Wheter the user can interact with the model
  customAnimation?: CustomAnimation; // CustomAnimation
}

// Configuration for reveal animation
export interface RevealConfig {
  type: "clip-x" | "clip-y" | "clip-z"; // Clip axis
  duration?: number; // Duration in ms
  min?: number; // Clip plane starting point
  max?: number; // Clip plane ending point
}

// Configuration for animation
export interface CustomAnimation {
  name: "reveal" | string; // Animation name
  config: RevealConfig; //Add new config in future
}

export interface AROffsets {
  x: number;
  y: number;
  z: number;
}

export interface UseIframeMessageProps {
  setIsMarkerFound: (found: boolean) => void;
  setAnimations: (animations: string[]) => void;
  setActiveAnim: (anim: string | null) => void;
  iframeRef: RefObject<HTMLIFrameElement | null>;
}
