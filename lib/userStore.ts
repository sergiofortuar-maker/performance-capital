import fs from "fs";
import path from "path";

export const runtime = "nodejs"; // 🔥 Forzamos Node

const dataDir = path.join(process.cwd(), "data");
const filePath = path.join(dataDir, "users.json");

type User = {
  wallet: string;
  balance: number;
  lastInterestUpdate: number;
};

function ensureFileExists() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({}));
  }
}

function readUsers(): Record<string, User> {
  ensureFileExists();
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function writeUsers(users: Record<string, User>) {
  ensureFileExists();
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
}

export function getUserData(wallet: string): User {
  const users = readUsers();

  if (!users[wallet]) {
    users[wallet] = {
      wallet,
      balance: 0,
      lastInterestUpdate: Date.now(),
    };
    writeUsers(users);
  }

  return users[wallet];
}

export function updateUserData(
  wallet: string,
  data: Partial<User>
) {
  const users = readUsers();

  if (!users[wallet]) {
    users[wallet] = {
      wallet,
      balance: 0,
      lastInterestUpdate: Date.now(),
    };
  }

  users[wallet] = {
    ...users[wallet],
    ...data,
  };

  writeUsers(users);
}
