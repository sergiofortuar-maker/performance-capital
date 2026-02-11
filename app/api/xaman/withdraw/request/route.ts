import { NextResponse } from "next/server";
import { getUser, updateUser } from "@/lib/userStore";
import { addWithdraw } from "@/lib/withdrawStore";
import { applyDailyYield } from "@/lib/yield";

export async function POST(req: Request) {
  try {
    const { wallet, amount } = await req.json();

    if (!wallet || !amount || Number(amount) <= 0) {
      return NextResponse.json({ success: false });
    }

    const user = applyDailyYield(wallet);

    if (user.balance <= 0) {
      return NextResponse.json({
        success: false,
        error: "No has realizado ningún depósito",
      });
    }

    if (user.balance < Number(amount)) {
      return NextResponse.json({
        success: false,
        error: "Saldo insuficiente",
      });
    }

    user.balance -= Number(amount);
    user.totalWithdrawn += Number(amount);
    updateUser(user);

    addWithdraw(wallet, Number(amount));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false });
  }
}
