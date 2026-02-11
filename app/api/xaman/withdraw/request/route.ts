import { NextResponse } from "next/server";
import { getUserData, updateUserData } from "@/lib/userStore";

export async function POST(req: Request) {
  const body = await req.json();
  const { wallet, amount } = body;

  if (!wallet || !amount) {
    return NextResponse.json(
      { error: "Wallet and amount required" },
      { status: 400 }
    );
  }

  const user = getUserData(wallet);

  if (user.balance < amount) {
    return NextResponse.json(
      { error: "Insufficient balance" },
      { status: 400 }
    );
  }

  updateUserData(wallet, {
    balance: user.balance - amount,
  });

  return NextResponse.json({ success: true });
}
