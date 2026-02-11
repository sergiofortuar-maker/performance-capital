let memoryStore: Record<string, any> = {};

type User = {
  wallet: string;
  balance: number;
  lastInterestUpdate: number;
};

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

export function updateUserData(wallet: string, data: Partial<User>) {
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
