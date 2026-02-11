// lib/withdrawStore.ts
export type Withdraw = {
  id: string;
  wallet: string;
  amount: number;
  createdAt: number;
  status: "pending" | "paid";
};

// 👉 almacén en memoria GLOBAL (vive mientras el server esté encendido)
const globalAny = global as any;

if (!globalAny.__withdraws) {
  globalAny.__withdraws = [] as Withdraw[];
}

const withdraws: Withdraw[] = globalAny.__withdraws;

export function addWithdraw(wallet: string, amount: number) {
  withdraws.push({
    id: crypto.randomUUID(),
    wallet,
    amount,
    createdAt: Date.now(),
    status: "pending",
  });
}

export function getWithdraws() {
  return withdraws;
}

export function markAsPaid(id: string) {
  const w = withdraws.find((x) => x.id === id);
  if (w) w.status = "paid";
}
