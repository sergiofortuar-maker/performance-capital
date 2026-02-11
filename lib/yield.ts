import { getUserData, updateUser } from "./userStore";

const APY = 0.08;

export function applyDailyYield(wallet: string) {
  const user = getUserData(wallet);

  const now = Date.now();
  const last = user.lastInterestUpdate || now;

  const daysPassed = Math.floor((now - last) / (1000 * 60 * 60 * 24));
  if (daysPassed <= 0) return;

  const dailyRate = APY / 365;
  const gain = user.balance * dailyRate * daysPassed;

  updateUser(wallet, {
    balance: user.balance + gain,
    lastInterestUpdate: now,
  });
}
