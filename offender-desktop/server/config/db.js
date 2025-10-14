import mysql from "mysql2/promise";

const db = await mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "Shuuh",
  port: "3306",
  connectionLimit: 10,
});

try {
  const connection = await db.getConnection();
  console.log("✅ Database connected successfully!");
  connection.release();
} catch (err) {
  console.error("❌ Database connection failed:", err.message);
}

export default db;
