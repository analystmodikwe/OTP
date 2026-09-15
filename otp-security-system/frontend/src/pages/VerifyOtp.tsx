import { useState } from "react";

const API_BASE = "http://localhost:4000/api/otp";

export default function VerifyOtp() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  // Storing the whole backend response rather than a plain boolean,
  // since we want to show the "reason" text (expired, wrong code, etc)
  // and not just a generic "invalid" message
  const [result, setResult] = useState<{ valid: boolean; reason?: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleVerify() {
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (!res.ok) {
        // only hits this for 400 — missing email/code.
        // "invalid OTP" is still a 200 from the backend, just with valid: false
        throw new Error(data.error ?? "Something went wrong");
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Verify OTP</h1>
        <p style={styles.subtext}>
          Enter the email and the code you received.
        </p>

        <input
          style={styles.input}
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={styles.input}
          type="text"
          placeholder="6-digit code"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <button
          style={styles.button}
          onClick={handleVerify}
          disabled={loading || !email || code.length !== 6}
        >
          {loading ? "Checking..." : "Verify OTP"}
        </button>

        {/* two separate conditions on purpose — result.valid can be
            true, false, or result itself can just be null (nothing checked yet) */}
        {result?.valid && <p style={styles.success}>✓ Valid code</p>}
        {result && !result.valid && (
          <p style={styles.error}>{result.reason ?? "Invalid code"}</p>
        )}
        {error && <p style={styles.error}>{error}</p>}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
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
    boxSizing: "border-box",
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