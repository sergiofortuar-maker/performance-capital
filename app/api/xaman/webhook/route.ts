import { NextResponse } from "next/server";
import { pendingDeposits } from "@/lib/pendingDeposits";
import { getUserData, updateUserData } from "@/lib/userStore";

export async function POST(req: Request) {
  const body = await req.json();

  const txHash = body?.payload?.txid;

  if (!txHash) {
    return NextResponse.json({ error: "No txHash" }, { status: 400 });
  }

  const deposit = pendingDeposits[txHash];

  if (!deposit) {
    return NextResponse.json({ error: "Deposit not found" }, { status: 404 });
  }

  const { wallet, amount } = deposit;

  const user = getUserData(wallet);

  updateUserData(wallet, {
    balance: user.balance + amount,
  });

  delete pendingDeposits[txHash];

  return NextResponse.json({ success: true });
}
