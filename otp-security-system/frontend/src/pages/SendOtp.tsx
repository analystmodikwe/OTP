import { useState } from "react";

// Local backend — i am going to swap this out for an env var before deploying anywhere real
const API_BASE  = import.meta.env.VITE_API_BASE;

export default function SendOtp() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Handles both the initial "Send" and the "Resend" button —
  // it's literally the same request. The backend is the one deciding
  // whether this counts as a fresh OTP or a resend of the existing one,
  // so the frontend doesn't need to know or care which happened.
  async function handleSend() {
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        // this covers both 400 (missing email) and 429 (rate limited) —
        // the backend sends a proper "error" message either way
        throw new Error(data.error ?? "Something went wrong");
      }

      setMessage(data.message ?? "OTP sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Send OTP</h1>
        <p style={styles.subtext}>
          Enter an email address to send a one-time passcode.
        </p>

        <input
          style={styles.input}
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          style={styles.button}
          onClick={handleSend}
          disabled={loading || !email}
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>

        {/* Same handler as above — not duplicating logic here on purpose */}
        <button
          style={styles.secondaryButton}
          onClick={handleSend}
          disabled={loading || !email}
        >
          Resend OTP
        </button>

        {message && <p style={styles.success}>{message}</p>}
        {error && <p style={styles.error}>{error}</p>}
      </div>
    </div>
  );
}

// Keeping styles as a plain object instead of a CSS file for now —
// easier to tweak quickly while the layout's still in flux
const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f5f5f5", // light grey, not pure white — easier on the eyes
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "system-ui, sans-serif",
  },
  card: {
    backgroundColor: "#ffffff",
    border: "1px solid #e0e0e0",
    borderRadius: "6px",
    padding: "32px",
    width: "360px",
  },
  heading: {
    fontSize: "20px",
    fontWeight: 600,
    marginBottom: "4px",
    color: "#1a1a1a",
  },
  subtext: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    fontSize: "14px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    marginBottom: "12px",
    boxSizing: "border-box", // so padding doesn't blow out the width
  },
  button: {
    width: "100%",
    padding: "10px",
    fontSize: "14px",
    fontWeight: 500,
    backgroundColor: "#1a1a1a",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginBottom: "8px",
  },
  secondaryButton: {
    width: "100%",
    padding: "10px",
    fontSize: "14px",
    fontWeight: 500,
    backgroundColor: "#fff",
    color: "#1a1a1a",
    border: "1px solid #ccc",
    borderRadius: "4px",
    cursor: "pointer",
  },
  success: {
    marginTop: "16px",
    fontSize: "14px",
    color: "#2e7d32",
  },
  error: {
    marginTop: "16px",
    fontSize: "14px",
    color: "#c62828",
  },
};