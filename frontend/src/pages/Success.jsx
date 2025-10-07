import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../utils/api";

export default function Success() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("processing");
  const hasRun = useRef(false); // 🚀 prevents double execution

  useEffect(() => {
    if (hasRun.current) return; // stop 2nd call in StrictMode
    hasRun.current = true;

    const confirmOrder = async () => {
      const sessionId = searchParams.get("session_id");
      if (!sessionId) {
        setStatus("failed");
        return;
      }

      try {
        const res = await API.post("/payments/confirm", { sessionId });

        if (res.status >= 200 && res.status < 300) {
          setStatus("succeeded");
        } else {
          setStatus("failed");
        }
      } catch (err) {
        console.error("Order confirmation failed:", err);
        setStatus("failed");
      }

      setTimeout(() => {
        navigate("/orders");
      }, 3000);
    };

    confirmOrder();
  }, [searchParams, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "80px" }}>
      {status === "succeeded" && (
        <>
          <h2 style={{ color: "green" }}>✅ Payment Successful</h2>
          <p>You will be redirected to your orders in 3 seconds...</p>
        </>
      )}
      {status === "failed" && (
        <>
          <h2 style={{ color: "red" }}>❌ Payment Failed</h2>
          <p>Please try again. Redirecting to orders...</p>
        </>
      )}
      {status === "processing" && (
        <>
          <h2>⏳ Payment Processing</h2>
          <p>We are verifying your payment...</p>
        </>
      )}
    </div>
  );
}
