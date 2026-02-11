import { getUserData, updateUserData } from "./userStore";

const APY = 0.08;

export function applyDailyYield(wallet: string) {
  const user = getUserData(wallet);

  // 🔥 Protección por si el usuario no existe
  if (!user) {
    console.warn("User not found for wallet:", wallet);
    return;
  }

  const now = Date.now();
  const last = user.lastInterestUpdate ?? now;

  const daysPassed = Math.floor(
    (now - last) / (1000 * 60 * 60 * 24)
  );

  if (daysPassed <= 0) return;

  const dailyRate = APY / 365;
  const gain = user.balance * dailyRate * daysPassed;

  updateUserData(wallet, {
    balance: user.balance + gain,
    lastInterestUpdate: now,
  });
}
