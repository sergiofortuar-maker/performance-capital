import { NextResponse } from "next/server";

// 🔥 Forzamos runtime Node (importante para SDK blockchain)
export const runtime = "nodejs";

interface DepositPayload {
  uuid: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { wallet, amount } = body;

    if (!wallet || !amount) {
      return NextResponse.json(
        { error: "Missing wallet or amount" },
        { status: 400 }
      );
    }

    // 🔹 Aquí debes poner tu llamada real al SDK de Xaman
    const payload: DepositPayload | null = await createDepositPayload();

    // 🔥 PROTECCIÓN contra null (esto arregla el error de Vercel)
    if (!payload || !payload.uuid) {
      return NextResponse.json(
        { error: "Invalid payload returned" },
        { status: 500 }
      );
    }

    // Simulación de almacenamiento temporal
    const pendingDeposits: any[] = [];

    pendingDeposits.push({
      uuid: payload.uuid,
      wallet,
      amount: Number(amount),
    });

    return NextResponse.json({
      success: true,
      uuid: payload.uuid,
    });

  } catch (error: any) {
    console.error("Deposit error:", error);

    return NextResponse.json(
      { error: error?.message || "Deposit failed" },
      { status: 500 }
    );
  }
}

/**
 * 🔹 Función simulada temporal
 * Sustituye esto por tu llamada real al SDK de Xaman
 */
async function createDepositPayload(): Promise<DepositPayload | null> {
  return {
    uuid: "demo-deposit-uuid"
  };
}
