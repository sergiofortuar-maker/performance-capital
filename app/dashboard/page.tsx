"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [wallet, setWallet] = useState<string | null>(null);
  const [balance, setBalance] = useState(0);

  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const [depositQr, setDepositQr] = useState<string | null>(null);
  const [withdrawRequested, setWithdrawRequested] = useState(false);

  const APR = 0.08;

  // ===================== LOAD USER =====================
  useEffect(() => {
    const w = localStorage.getItem("wallet");

    if (!w) {
      window.location.href = "/";
      return;
    }

    setWallet(w);

    // 🔥 CORREGIDO AQUÍ
    fetch("/api/xaman/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wallet: w }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((data) => {
        if (typeof data.balance === "number") {
          setBalance(data.balance);
        }
      })
      .catch((err) => {
        console.error("Error loading user:", err);
      });
  }, []);

  const dailyGain = (balance * APR) / 365;

  // ===================== DEPOSIT =====================
  async function depositXrp() {
    if (!depositAmount || Number(depositAmount) <= 0 || !wallet) return;

    setDepositQr(null);
    setWithdrawRequested(false);

    try {
      const res = await fetch("/api/xaman/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: depositAmount,
          wallet,
        }),
      });

      if (!res.ok) throw new Error("Deposit failed");

      const data = await res.json();

      if (data.qr) {
        setDepositQr(data.qr);
        setDepositAmount("");
      } else {
        alert("Error creando depósito");
      }
    } catch (err) {
      console.error("Deposit error:", err);
      alert("Error creando depósito");
    }
  }

  // ===================== WITHDRAW =====================
  async function requestWithdrawXrp() {
    if (!withdrawAmount || Number(withdrawAmount) <= 0 || !wallet) return;

    if (Number(withdrawAmount) > balance) {
      alert("No tienes balance suficiente");
      return;
    }

    setWithdrawRequested(false);

    try {
      const res = await fetch("/api/xaman/withdraw/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet,
          amount: withdrawAmount,
        }),
      });

      if (!res.ok) throw new Error("Withdraw failed");

      const data = await res.json();

      if (data.success) {
        setWithdrawRequested(true);
        setWithdrawAmount("");
      } else {
        alert("Error creando solicitud de retiro");
      }
    } catch (err) {
      console.error("Withdraw error:", err);
      alert("Error creando solicitud de retiro");
    }
  }

  function disconnectWallet() {
    localStorage.clear();
    window.location.href = "/";
  }

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
      <h1>Dashboard · XRP Earn</h1>

      <p>
        <strong>Wallet:</strong>
        <br />
        {wallet}
      </p>

      <hr style={{ borderColor: "#333", margin: "20px 0" }} />

      <p>
        <strong>Balance:</strong>
      </p>
      <h2>{balance.toFixed(6)} XRP</h2>

      <p style={{ color: "lime" }}>
        Ganancia diaria estimada (8% APY): +{dailyGain.toFixed(6)} XRP
      </p>

      <hr style={{ borderColor: "#333", margin: "25px 0" }} />

      {/* ================= DEPOSIT ================= */}
      <h3>Depositar XRP</h3>

      <input
        type="number"
        placeholder="Cantidad XRP"
        value={depositAmount}
        onChange={(e) => setDepositAmount(e.target.value)}
        style={{
          padding: 6,
          background: "#111",
          color: "#fff",
          border: "1px solid #555",
          marginRight: 10,
        }}
      />

      <button onClick={depositXrp}>Depositar</button>

      {depositQr && (
        <div style={{ marginTop: 20 }}>
          <p>Escanea con Xaman</p>
          <img src={depositQr} width={260} />
        </div>
      )}

      <hr style={{ borderColor: "#333", margin: "30px 0" }} />

      {/* ================= WITHDRAW ================= */}
      <h3>Retirar XRP</h3>

      <input
        type="number"
        placeholder="Cantidad XRP"
        value={withdrawAmount}
        onChange={(e) => setWithdrawAmount(e.target.value)}
        style={{
          padding: 6,
          background: "#111",
          color: "#fff",
          border: "1px solid #555",
          marginRight: 10,
        }}
      />

      <button onClick={requestWithdrawXrp}>Solicitar retiro</button>

      {withdrawRequested && (
        <p style={{ marginTop: 15, color: "#22c55e" }}>
          ✔ Retiro solicitado correctamente. En 24–48 horas lo recibirás en tu wallet.
        </p>
      )}

      <hr style={{ borderColor: "#333", margin: "30px 0" }} />

      <button
        onClick={disconnectWallet}
        style={{
          padding: "8px 14px",
          background: "#222",
          color: "#fff",
          border: "1px solid #555",
          cursor: "pointer",
        }}
      >
        Desconectar billetera
      </button>

      <p style={{ marginTop: 20, fontSize: 12, color: "#aaa" }}>
        * Ganancias estimadas. No garantizadas.
      </p>
    </main>
  );
}
