import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "users.json");

type User = {
  wallet: string;
  balance: number;
  lastInterestUpdate: number;
};

function readUsers(): Record<string, User> {
  if (!fs.existsSync(filePath)) return {};
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function writeUsers(users: Record<string, User>) {
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
}

// ✅ EXISTE
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

// ✅ EXISTE
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
