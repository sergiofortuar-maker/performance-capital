import { NextResponse } from "next/server";
import { pendingDeposits } from "@/lib/pendingDeposits";
import { getUser, updateUser } from "@/lib/userStore";

export async function POST(req: Request) {
  const body = await req.json();

  const uuid = body.payload_uuidv4;
  const resolved = body.payload?.meta?.resolved;
  const success = body.payload?.meta?.signed === true;

  if (!resolved || !success) {
    return NextResponse.json({ ok: true });
  }

  const deposit = pendingDeposits.find(d => d.uuid === uuid);
  if (!deposit) return NextResponse.json({ ok: true });

  const user = getUser(deposit.wallet);
  user.balance += deposit.amount;
  user.totalDeposited += deposit.amount;
  updateUser(user);

  // eliminar pendiente
  const index = pendingDeposits.indexOf(deposit);
  pendingDeposits.splice(index, 1);

  return NextResponse.json({ ok: true });
}
