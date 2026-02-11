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
      process.env.XUMM_API_KEY!,
      process.env.XUMM_API_SECRET!
    );

    // 👇 Tipamos como any para que TS no marque rojo
    const result: any = await sdk.payload.get(uuid);

    if (!result?.meta?.signed) {
      return NextResponse.json(
        { error: "Transacción no firmada" },
        { status: 400 }
      );
    }

    const tx = result.response;

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

    const deliveredDrops = Number(tx.delivered_amount);

    if (!deliveredDrops || deliveredDrops <= 0) {
      return NextResponse.json(
        { error: "Monto inválido" },
        { status: 400 }
      );
    }

    const delivered = deliveredDrops / 1000000; // drops → XRP

    const user = getUserData(wallet);

    const updatedBalance = user.balance + delivered;

    updateUserData(wallet, {
      balance: updatedBalance,
      lastInterestUpdate: Date.now(),
    });

    return NextResponse.json({
      success: true,
      newBalance: updatedBalance,
    });

  } catch (error) {
    console.error("Confirm deposit error:", error);

    return NextResponse.json(
      { error: "Error confirmando depósito" },
      { status: 500 }
    );
  }
}
