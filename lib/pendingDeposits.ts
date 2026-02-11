type PendingDeposit = {
  uuid: string;
  wallet: string;
  amount: number;
};

const globalAny = global as any;
if (!globalAny.__pendingDeposits) {
  globalAny.__pendingDeposits = [] as PendingDeposit[];
}

export const pendingDeposits: PendingDeposit[] =
  globalAny.__pendingDeposits;
