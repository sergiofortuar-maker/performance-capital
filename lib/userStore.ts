export type User = {
  wallet: string;
  balance: number;
  lastInterestUpdate: number;
  lastProcessedTx?: string;
};

const memoryStore: Record<string, User> = {};

export function getUserData(wallet: string): User {
  if (!memoryStore[wallet]) {
    memoryStore[wallet] = {
      wallet,
      balance: 0,
      lastInterestUpdate: Date.now(),
    };
  }

  return memoryStore[wallet];
}

export function updateUserData(wallet: string, data: Partial<User>): void {
  if (!memoryStore[wallet]) {
    memoryStore[wallet] = {
      wallet,
      balance: 0,
      lastInterestUpdate: Date.now(),
    };
  }

  memoryStore[wallet] = {
    ...memoryStore[wallet],
    ...data,
  };
}
