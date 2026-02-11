import { NextResponse } from "next/server";
import { XummSdk } from "xumm-sdk";
import { pendingDeposits } from "@/lib/pendingDeposits";

const xumm = new XummSdk(
  process.env.XUMM_API_KEY!,
  process.env.XUMM_API_SECRET!
);

export async function POST(req: Request) {
  try {
    const { wallet, amount } = await req.json();

    if (!wallet || !amount || Number(amount) <= 0) {
      return NextResponse.json(
        { error: "Datos inválidos" },
        { status: 400 }
      );
    }

    const payload = await xumm.payload.create({
      txjson: {
        TransactionType: "Payment",
        Destination: process.env.XRP_DESTINATION!,
        Amount: String(Math.floor(Number(amount) * 1_000_000)),
      },

      // ✅ ESTO ES CLAVE
      options: {
        submit: true,
        expire: 10,
      },

      // ✅ WEBHOOK BIEN DEFINIDO
      webhookurl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/xaman/webhook`,
    });

    pendingDeposits.push({
      uuid: payload.uuid,
      wallet,
      amount: Number(amount),
    });

    return NextResponse.json({
      qr: payload.refs.qr_png,
      uuid: payload.uuid,
      amount: Number(amount),
    });
  } catch (error) {
    console.error("DEPOSIT ERROR:", error);
    return NextResponse.json(
      { error: "Error creando depósito" },
      { status: 500 }
    );
  }
}
