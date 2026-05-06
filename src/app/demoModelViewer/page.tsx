import Link from "next/link";
import ModelViewer from "../../components/ModelViewer";

export default function Home() {
  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <p>Interact with the object to rotate it</p>

      <div style={{ marginBottom: "20px", marginTop: "20px" }}>
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
            pointerEvents: "auto",
            boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
          }}
        >
          ← Back to the scanner
        </Link>
      </div>

      <ModelViewer
        src="/models/TV-anim.glb"
        alt="Un modello 3D interattivo del mio oggetto"
      />
    </main>
  );
}
