export type Withdraw = {
  id: string;
  wallet: string;
  amount: number;
  status: "pending" | "paid";
  createdAt: number;
};

let withdraws: Withdraw[] = [];

export function getWithdraws(): Withdraw[] {
  return withdraws;
}

export function createWithdraw(wallet: string, amount: number): Withdraw {
  const newWithdraw: Withdraw = {
    id: crypto.randomUUID(),
    wallet,
    amount,
    status: "pending",
    createdAt: Date.now(),
  };

  withdraws.push(newWithdraw);
  return newWithdraw;
}

export function markAsPaid(id: string): void {
  const withdraw = withdraws.find((w) => w.id === id);
  if (withdraw) {
    withdraw.status = "paid";
  }
}
