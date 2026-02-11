import { NextResponse } from "next/server";
import { getUserData } from "@/lib/userStore";

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

    const user = getUserData(wallet);

    return NextResponse.json({
      wallet: user.wallet,
      balance: user.balance,
      lastInterestUpdate: user.lastInterestUpdate,
    });

  } catch (e) {
    console.error("User API error:", e);

    return NextResponse.json(
      { error: "Error obteniendo usuario" },
      { status: 500 }
    );
  }
}
