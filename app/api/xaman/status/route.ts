import { NextResponse } from "next/server";
import { XummSdk } from "xumm-sdk";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { wallet, amount } = await req.json();

    if (!wallet || !amount) {
      return NextResponse.json(
        { error: "Wallet y amount requeridos" },
        { status: 400 }
      );
    }

    const sdk = new XummSdk(
      process.env.XUMM_API_KEY!,
      process.env.XUMM_API_SECRET!
    );

    const payload = await sdk.payload.create({
      TransactionType: "Payment",
      Destination: process.env.XRP_DESTINATION!,
      Amount: (Number(amount) * 1_000_000).toString(), // XRP → drops
    });

    if (!payload?.uuid) {
      return NextResponse.json(
        { error: "Payload failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      uuid: payload.uuid,
      qr: payload.refs?.qr_png ?? null,
    });

  } catch (error) {
    console.error("Deposit error:", error);
    return NextResponse.json(
      { error: "Error creando depósito" },
      { status: 500 }
    );
  }
}
