"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [wallet, setWallet] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Simular wallet conectada (luego lo conectamos a Xaman real)
  useEffect(() => {
    const storedWallet = localStorage.getItem("wallet");
    if (storedWallet) {
      setWallet(storedWallet);
      fetchBalance(storedWallet);
    }
  }, []);

  const fetchBalance = async (walletAddress: string) => {
    const res = await fetch(`/api/xaman/user?wallet=${walletAddress}`);
    const data = await res.json();
    setBalance(data.balance || 0);
  };

  const handleConnectWallet = () => {
    const fakeWallet = "rTESTWallet123456";
    localStorage.setItem("wallet", fakeWallet);
    setWallet(fakeWallet);
    fetchBalance(fakeWallet);
  };

  const handleDeposit = async () => {
    if (!wallet) return;

    setLoading(true);

    const res = await fetch("/api/xaman/connect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wallet }),
    });

    const data = await res.json();
    setQrUrl(data.qrUrl || null);

    setLoading(false);
  };

  const handleWithdraw = async () => {
    if (!wallet) return;

    await fetch("/api/xaman/withdraw/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        wallet,
        amount: 1,
      }),
    });

    alert("Solicitud de retiro enviada");
  };

  return (
    <div style={{ padding: 40, color: "white" }}>
      <h1>Dashboard</h1>

      {!wallet && (
        <button onClick={handleConnectWallet}>
          Conectar billetera
        </button>
      )}

      {wallet && (
        <>
          <p><strong>Wallet:</strong> {wallet}</p>
          <p><strong>Balance:</strong> {balance} XRP</p>

          <button onClick={handleDeposit} disabled={loading}>
            {loading ? "Generando..." : "Depositar"}
          </button>

          <button onClick={handleWithdraw} style={{ marginLeft: 10 }}>
            Retirar 1 XRP
          </button>

          {qrUrl && (
            <div style={{ marginTop: 20 }}>
              <p>Escanea el QR con Xaman:</p>
              <img src={qrUrl} alt="QR Code" width={200} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
