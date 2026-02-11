import { NextResponse } from "next/server";

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

    // Simulación temporal (reemplaza por tu SDK real)
    const payload: DepositPayload | null = {
      uuid: "demo-uuid"
    };

    // 🔥 ESTA VALIDACIÓN ES LA CLAVE
    if (!payload || !payload.uuid) {
      return NextResponse.json(
        { error: "Invalid payload returned" },
        { status: 500 }
      );
    }

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
