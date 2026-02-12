import { NextResponse } from "next/server";
import { XummSdk } from "xumm-sdk";
import { getUserData, updateUserData } from "@/lib/userStore";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const wallet: string = body.wallet;
    const uuid: string = body.uuid;

    if (!wallet || !uuid) {
      return NextResponse.json(
        { error: "Wallet y UUID requeridos" },
        { status: 400 }
      );
    }

    const sdk = new XummSdk(
      process.env.XUMM_API_KEY as string,
      process.env.XUMM_API_SECRET as string
    );

    const payload: any = await sdk.payload.get(uuid);

    if (!payload?.meta?.signed || !payload?.meta?.resolved) {
      return NextResponse.json(
        { error: "Transacción no firmada o no validada" },
        { status: 400 }
      );
    }

    const tx: any = payload.response;

    if (!tx) {
      return NextResponse.json(
        { error: "No hay respuesta de transacción" },
        { status: 400 }
      );
    }

    if (tx.Destination !== process.env.XRP_DESTINATION) {
      return NextResponse.json(
        { error: "Destino inválido" },
        { status: 400 }
      );
    }

    let drops = 0;

    if (typeof tx.delivered_amount === "string") {
      drops = Number(tx.delivered_amount);
    } else if (typeof payload?.meta?.delivered_amount === "string") {
      drops = Number(payload.meta.delivered_amount);
    }

    if (!drops || drops <= 0) {
      return NextResponse.json(
        { error: "Amount inválido o no entregado" },
        { status: 400 }
      );
    }

    const deliveredXrp = drops / 1_000_000;

    const user = getUserData(wallet);

    const newBalance = user.balance + deliveredXrp;

    updateUserData(wallet, {
      balance: newBalance,
      lastInterestUpdate: Date.now(),
    });

    return NextResponse.json({
      success: true,
      newBalance,
    });

  } catch (error) {
    console.error("Confirm deposit error:", error);

    return NextResponse.json(
      { error: "Error confirmando depósito" },
      { status: 500 }
    );
  }
}
