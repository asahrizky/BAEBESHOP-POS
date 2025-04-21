import { NextResponse } from "next/server";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { name, email, phone, password } = await req.json();

    // Validasi input
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Nama, email, dan password harus diisi" },
        { status: 400 }
      );
    }

    // Buka koneksi database
    const db = await open({
      filename: "./backend/database/ecommerce.db",
      driver: sqlite3.Database,
    });

    // Cek apakah email sudah terdaftar
    const existingUser = await db.get(
      "SELECT * FROM users WHERE email = ?",
      email
    );

    if (existingUser) {
      return NextResponse.json(
        { message: "Email sudah terdaftar" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user baru
    await db.run(
      "INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)",
      [name, email, phone, hashedPassword]
    );

    await db.close();

    return NextResponse.json(
      { message: "Registrasi berhasil" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during registration:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat registrasi" },
      { status: 500 }
    );
  }
}
