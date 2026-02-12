import { NextResponse } from "next/server";
import { getUserData, updateUserData } from "@/lib/userStore";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("📩 Webhook recibido");

    const payload = body?.payload;
    const response = payload?.response;
    const tx = response?.txjson;

    // 1️⃣ Validar estructura básica
    if (!payload || !tx) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // 2️⃣ Solo procesar si firmado y validado
    if (!payload.signed || !payload.resolved) {
      return NextResponse.json({ message: "Not signed or not resolved" });
    }

    const txHash = payload.txid;
    const wallet = tx.Account;
    const destination = tx.Destination;
    const amountDrops = tx.Amount;

    if (!txHash || !wallet || !destination || !amountDrops) {
      return NextResponse.json({ error: "Missing tx fields" }, { status: 400 });
    }

    // 3️⃣ Validar que el destino sea TU wallet
    if (destination !== process.env.XRP_WALLET_ADDRESS) {
      return NextResponse.json({ error: "Invalid destination" }, { status: 400 });
    }

    // 4️⃣ Convertir drops a XRP
    const amountXrp = Number(amountDrops) / 1_000_000;

    if (isNaN(amountXrp) || amountXrp <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // 5️⃣ Buscar usuario por wallet
    const user = getUserData(wallet);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 6️⃣ Evitar doble procesamiento
    if (user.lastProcessedTx === txHash) {
      return NextResponse.json({ message: "Already processed" });
    }

    // 7️⃣ Actualizar balance
    updateUserData(wallet, {
      balance: user.balance + amountXrp,
      lastProcessedTx: txHash,
    });

    console.log("✅ Balance actualizado:", amountXrp, "XRP");

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("❌ Webhook error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
