import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const wallet = searchParams.get("wallet");

    if (!wallet) {
      return NextResponse.json(
        { error: "Wallet requerida" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      wallet,
      balance: 0,
      lastInterestUpdate: Date.now(),
    });

  } catch (e) {
    console.error("User API error:", e);

    return NextResponse.json(
      { error: "Error obteniendo usuario" },
      { status: 500 }
    );
  }
}
