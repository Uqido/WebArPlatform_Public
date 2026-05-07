## Table of Contents

- [Getting Started](#getting-started)
- [WebArPlatform Project Guide](#webarplatform-project-guide)
  - [General Description and Project Structure](#general-description-and-project-structure)
- [Expanding the WebAR Platform](#expanding-the-webar-platform)
  - [1. How to Create a New Page](#1-how-to-create-a-new-page)
  - [2. How to add and use a new AR Library](#2-how-to-add-and-use-a-new-ar-library)
- [Export a Gltf from Unity](#export-a-gltf-from-unity)
- [Try it yourself](#try-it-yourself)

# Getting Started

First, build and run the application:

```bash
npm run dev
```

The app will be available locally at http://localhost:3000.

To instantly expose your local server to the internet through a secure, temporary HTTPS URL without any port forwarding, run:

```bash
npx cloudflared tunnel --url http://localhost:3000
```

Once executed, Cloudflare will generate a public URL in the terminal, for example:
https://some-random-words.trycloudflare.com

To test the application on other devices, simply open the generated link on your smartphone

# WebArPlatform Project Guide

This document provides an overview of the WebAR project's structure and explains how to extend it by adding new pages and libraries (such as `mind-ar`).

## General Description and Project Structure

The **WebArPlatform** project is a web application based on **Next.js** (using the App Router) and **TypeScript**, integrated with web-based Augmented Reality (WebAR) technologies, such as A-Frame and AR.js.

### Directory Structure

The main structure of the project is organized as follows:

- **`public/`**: Contains publicly accessible static files.
  - **`ar-libs/`**: External libraries for Augmented Reality (e.g., `aframe-ar.js`, `aframe-master.js`).
  - **`particles/`**: Scripts for particle effects (`dust-particles.js`).
  - Also contains static HTML files for tracking based on markers or NFTs (`marker-ar.html`, `nft-ar.html`).
- **`src/app/`**: The core of the Next.js application (App Router). Each subfolder represents a route (e.g.,`glacierInTime`, `iceCore`) and contains its own `page.tsx`.
- **`src/components/`**: Contains reusable React components (e.g., `ModelViewer.jsx`).
- **`src/types/`**: Contains TypeScript type definitions to support the AR libraries (`ar.ts`).
- **`src/utils/`**: Utility functions and custom hooks (e.g., `arHelper.ts`, `useQrScanner.ts`).
- **`global.d.ts`**: Global TypeScript definitions (for example, to declare custom elements like `<model-viewer>` so React recognizes them).

---

# Expanding the WebAR Platform

This guide explains how to add new pages to the Next.js platform and how to integrate new AR libraries (e.g., MindAR, 8th Wall, etc.) following the project's existing architecture.

---

## 1. How to Create a New Page

Your project uses the Next.js App Router paradigm, where routes are defined by folders inside the `src/app` directory.

### Step 1.1: Create the Route Directory

Create a new folder inside `src/app/` with the name of your desired route (e.g., `src/app/my-new-experience/`).

### Step 1.2: Create the `page.tsx` File

Inside that new folder, create a `page.tsx` file. This file will export the React component for your page.

```tsx
"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ARConfig } from "@/types/ar";
import { buildARQueryString, useIframeMessage } from "@/utils/arHelper";

export default function MyNewExperiencePage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isMarkerFound, setIsMarkerFound] = useState<boolean>(false);

  // Define your configuration
  const config: ARConfig = {
    markerType: "pattern",
    markerUrl: "/path/to/marker",
    modelUrl: "/models/my-model.gltf",
    scale: [1, 1, 1],
    rotation: [0, 0, 0],
    position: [0, 0, 0],
    enableInteraction: true,
  };

  // Build the URL for the iframe
  const iframeSrc = `/my-custom-ar.html?${buildARQueryString(config)}`;

  // Listen for events from the AR iframe
  useIframeMessage({
    setIsMarkerFound,
    setAnimations: () => {},
    setActiveAnim: () => {},
    iframeRef,
  });

  return (
    <div style={{ width: "100vw", height: "100dvh", overflow: "hidden" }}>
      <iframe
        ref={iframeRef}
        src={iframeSrc}
        style={{ width: "100%", height: "100%", border: "none" }}
        allow="camera; gyroscope; accelerometer; magnetometer; vr;"
      />
    </div>
  );
}
```

## 2. How to add and use a new AR Library

Because AR libraries (especially A-Frame based ones) often require direct DOM manipulation and specific meta tags that conflict with React's virtual DOM, the platform uses an **Iframe Architecture**.
AR libraries are loaded in static HTML files inside the `public/` folder, and the Next.js pages display them via an `<iframe>`.

### Step 2.1: Add the library files

You have two options for adding new library files to your project:

**Option A: Manual Download (Static)**
To keep dependencies stable and load them statically:

1. Download the new library's JavaScript files (e.g., `new-ar-lib.min.js`).
2. Place them inside the `public/ar-libs/` directory.

**Option B: Via NPM Package**
Libraries can also be added via npm packages. However, to make them accessible to the static HTML files, you may need to update the `postinstall` script in your `package.json` to automatically copy the new libraries from the `node_modules` folder to `public/ar-libs/`.

Here is an example of how the `postinstall` command looks:

```json
"postinstall": "shx mkdir -p public/ar-libs && shx cp -f \"node_modules/aframe/dist/*.js\" public/ar-libs/ && shx cp -f node_modules/@ar-js-org/ar.js/aframe/build/aframe-ar.js public/ar-libs/ && shx cp -f node_modules/aframe-extras/dist/aframe-extras.min.js public/ar-libs/"
```

**Option C: Via CDN / External Link**
You can also include a library directly from an external source (like a CDN or a hosted repository). You don't need to download or install anything; just add a `<script>` tag pointing to the URL directly inside your static HTML file.

### Step 2.2: Create a static HTML entry point

Create a new HTML file in the `public/` directory (e.g., `public/my-custom-ar.html`). This file will host the A-Frame scene and your new library.

### Step 2.3: Connect the HTML to Next.js

In your Next.js page (created in Step 1), point the iframe `src` to your new HTML file.

You can pass data into the iframe by converting your configuration object using the `buildARQueryString` helper. The `useIframeMessage` hook will automatically listen to the `window.parent.postMessage` calls you set up in Step 2.2, allowing your React UI to react to AR events (like showing a button only when the marker is found).

# Export a Gltf from Unity

First we need the UnityGltf package. It can be added from the following github repository: https://github.com/KhronosGroup/UnityGLTF.git

Once done, to export a model, we have to right click on the game object, select **UnityGLTF** and **Export Selected**.

To modify the export settings, for example to allow the animation export, we can select the **Open export Settings** option.

## Try it yourself

Scan the following QRs to reach the webAR platform. Once the camera is active, scan again the QR to go to the AR effect.

<table>
  <tr>
    <td><img width="263" height="301" alt="IceCore" src="https://github.com/user-attachments/assets/59dd8354-544e-4125-a09e-2f9eece2172f" /></td>
    <td><img width="300" alt="Carota" src="https://github.com/user-attachments/assets/eaef985b-6e57-43e1-9912-c4fa40170aa5" /></td>
  </tr>
  
  <tr>
    <td><img width="262" height="302" alt="Glacier in Time" src="https://github.com/user-attachments/assets/f79ce71a-20ba-478d-b3e6-fdee3642d582" /></td>
    <td><img width="300" alt="Ieri e oggi" src="https://github.com/user-attachments/assets/20dbb24f-f2ca-4aa9-acc9-ec41a4462c42" /></td>
  </tr>
</table>
