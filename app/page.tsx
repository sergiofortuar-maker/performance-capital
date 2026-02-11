"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [qr, setQr] = useState<string | null>(null);
  const [uuid, setUuid] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 🔥 1️⃣ Conectar billetera
  async function connectWallet() {
    try {
      setLoading(true);
      setQr(null);
      setUuid(null);

      const res = await fetch("/api/xaman/connect", {
        method: "POST", // 🔥 MUY IMPORTANTE
      });

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

  // 🔥 2️⃣ Comprobar estado
  async function checkStatus() {
    if (!uuid) return;

    try {
      const res = await fetch("/api/xaman/status", {
        method: "GET", // Tu endpoint status usa GET
      });

      if (!res.ok) return;

      const data = await res.json();

      if (data.signed && data.account) {
        localStorage.setItem("wallet", data.account);
        window.location.href = "/dashboard";
      }
    } catch (err) {
      console.error("Status error:", err);
    }
  }

  // 🔁 Auto-check cada 2 segundos
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
        style={{ padding: "10px 16px", cursor: "pointer" }}
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
