import { Link } from "react-router-dom";
import Button from "../components/common/Button";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        textAlign: "center",
        padding: 24,
      }}
    >
      <div style={{ fontSize: 46 }}>🧭</div>
      <h1 style={{ fontSize: 26 }}>Off the path</h1>
      <p style={{ color: "var(--ink-soft)", maxWidth: 360 }}>
        We couldn't find that page. Let's get you back on track.
      </p>
      <Link to="/">
        <Button style={{ marginTop: 8 }}>Back to Solvr</Button>
      </Link>
    </div>
  );
}
