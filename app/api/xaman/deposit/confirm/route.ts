import { NextResponse } from "next/server";
import { getUserData, updateUserData } from "@/lib/userStore";

export const runtime = "nodejs";

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

    const updatedBalance = user.balance + 1; // 🔥 prueba simple

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
