"use client";

import { useState } from "react";

export default function DashboardPage() {
  const [loading, setLoading] = useState(false);

  const handleConfirmDeposit = async () => {
    try {
      setLoading(true);

      // ⚠️ Esto es solo ejemplo
      const wallet = "WALLET_AQUI";
      const uuid = "UUID_AQUI";

      const res = await fetch("/api/confirm-deposit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ wallet, uuid }),
      });

      const data = await res.json();

      console.log(data);

    } catch (error) {
      console.error("Error confirmando depósito:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Dashboard</h1>

      <button
        onClick={handleConfirmDeposit}
        disabled={loading}
        style={{
          padding: "10px 20px",
          marginTop: "20px",
          cursor: "pointer"
        }}
      >
        {loading ? "Procesando..." : "Confirmar depósito"}
      </button>
    </div>
  );
}
