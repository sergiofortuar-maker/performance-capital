"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [qr, setQr] = useState<string | null>(null);
  const [uuid, setUuid] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ================== CONNECT WALLET ==================
  async function connectWallet() {
    try {
      setLoading(true);
      setQr(null);
      setUuid(null);

      // 🔥 IMPORTANTE: GET (sin method)
      const res = await fetch("/api/xaman/connect");

      if (!res.ok) {
        throw new Error("Error al conectar");
      }

      const data = await res.json();

      setQr(data.qr);
      setUuid(data.uuid);

    } catch (error) {
      console.error("Connect error:", error);
    } finally {
      setLoading(false);
    }
  }

  // ================== CHECK STATUS ==================
  async function checkStatus() {
    if (!uuid) return;

    try {
      const res = await fetch("/api/xaman/status");

      if (!res.ok) return;

      const data = await res.json();

      if (data.signed && data.account) {
        localStorage.setItem("wallet", data.account);
        window.location.href = "/dashboard";
      }

    } catch (error) {
      console.error("Status error:", error);
    }
  }

  // 🔁 AUTO CHECK CADA 2 SEGUNDOS
  useEffect(() => {
    if (!uuid || !qr) return;

    const interval = setInterval(() => {
      checkStatus();
    }, 2000);

    return () => clearInterval(interval);
  }, [uuid, qr]);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        padding: 40,
        fontFamily: "Arial",
      }}
    >
      <h1>Performance Capital</h1>

      <button
        onClick={connectWallet}
        disabled={loading}
        style={{
          padding: "10px 16px",
          cursor: "pointer",
          background: "#222",
          color: "#fff",
          border: "1px solid #555",
        }}
      >
        {loading ? "Conectando..." : "Conectar billetera (Xaman)"}
      </button>

      {qr && (
        <div style={{ marginTop: 20 }}>
          <p>Escanea con Xaman para conectar</p>
          <img src={qr} width={260} />
          <p style={{ marginTop: 10, fontSize: 12, color: "#aaa" }}>
            Esperando confirmación…
          </p>
        </div>
      )}
    </main>
  );
}
