"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [wallet, setWallet] = useState<string | null>(null);
  const [balance, setBalance] = useState(0);

  const [depositAmount, setDepositAmount] = useState("");
  const [depositQr, setDepositQr] = useState<string | null>(null);
  const [depositUuid, setDepositUuid] = useState<string | null>(null);

  const APR = 0.08;

  // ================= LOAD USER =================
  useEffect(() => {
    const w = localStorage.getItem("wallet");
    if (!w) {
      window.location.href = "/";
      return;
    }

    setWallet(w);

    fetch(`/api/xaman/user?wallet=${w}`)
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.balance === "number") {
          setBalance(data.balance);
        }
      });
  }, []);

  const dailyGain = (balance * APR) / 365;

  // ================= DEPOSIT =================
  async function depositXrp() {
    if (!wallet || !depositAmount) return;

    const res = await fetch("/api/xaman/deposit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        wallet,
        amount: depositAmount,
      }),
    });

    const data = await res.json();

    if (data.qr && data.uuid) {
      setDepositQr(data.qr);
      setDepositUuid(data.uuid);
    } else {
      alert("Error creando depósito");
    }
  }

  // ================= AUTO CHECK STATUS =================
  useEffect(() => {
    if (!depositUuid || !wallet) return;

    const interval = setInterval(async () => {
      const res = await fetch(`/api/xaman/status?uuid=${depositUuid}`);
      const data = await res.json();

      if (data.signed && data.account) {
        clearInterval(interval);

        // 🔥 CONFIRMAMOS DEPÓSITO
        const confirmRes = await fetch("/api/xaman/deposit/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ wallet }),
        });

        const confirmData = await confirmRes.json();

        if (confirmData.success) {
          setBalance(confirmData.newBalance);
          setDepositQr(null);
          setDepositUuid(null);
          alert("Depósito confirmado y balance actualizado");
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [depositUuid, wallet]);

  function disconnectWallet() {
    localStorage.clear();
    window.location.href = "/";
  }

  return (
    <main style={{ minHeight: "100vh", background: "#000", color: "#fff", padding: 40 }}>
      <h1>Dashboard · XRP Earn</h1>

      <p><strong>Wallet:</strong><br />{wallet}</p>

      <hr />

      <h2>{balance.toFixed(6)} XRP</h2>
      <p style={{ color: "lime" }}>
        Ganancia diaria estimada (8% APY): +{dailyGain.toFixed(6)} XRP
      </p>

      <hr />

      <h3>Depositar XRP</h3>

      <input
        type="number"
        value={depositAmount}
        onChange={(e) => setDepositAmount(e.target.value)}
      />

      <button onClick={depositXrp}>Depositar</button>

      {depositQr && (
        <div style={{ marginTop: 20 }}>
          <p>Escanea con Xaman</p>
          <img src={depositQr} width={260} />
        </div>
      )}

      <hr />

      <button onClick={disconnectWallet}>
        Desconectar billetera
      </button>
    </main>
  );
}
