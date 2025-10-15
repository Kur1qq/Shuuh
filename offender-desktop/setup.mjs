import { execSync } from "child_process";
import fs from "fs";

console.log("🔧 Checking environment...");

try {
  // 1️⃣ Node шалгах
  const nodeVersion = execSync("node -v").toString().trim();
  console.log("🟢 Node version:", nodeVersion);
} catch {
  console.error("❌ Node.js not installed. Please install Node 20+");
  process.exit(1);
}

try {
  // 2️⃣ pnpm шалгах
  execSync("pnpm -v", { stdio: "ignore" });
  console.log("🟢 pnpm already installed");
} catch {
  console.log("⚙️ Installing pnpm globally...");
  execSync("npm install -g pnpm", { stdio: "inherit" });
}

if (!fs.existsSync("node_modules")) {
  console.log("📦 Installing all dependencies...");
  execSync("pnpm install", { stdio: "inherit" });
} else {
  console.log("✅ Dependencies already installed");
}

console.log("🚀 Starting development environment...");
execSync("pnpm dev", { stdio: "inherit" });
