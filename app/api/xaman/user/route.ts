import { NextResponse } from "next/server";
import { getUserData } from "@/lib/userStore";

export async function POST(req: Request) {
  try {
    const { wallet } = await req.json();

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
    return NextResponse.json(
      { error: "Error obteniendo usuario" },
      { status: 500 }
    );
  }
}
