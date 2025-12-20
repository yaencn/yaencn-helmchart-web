#!/usr/bin/env python3
"""Create or update an admin user in the local SQLite DB.

Usage:
  python create_admin.py --username admin
  python create_admin.py --username admin --password secret

If password is not provided, the script will prompt for it.
"""
import argparse
import sqlite3
from getpass import getpass
from passlib.context import CryptContext

DB_PATH = "./sql_app.db"

# Use pbkdf2_sha256 to avoid bcrypt binary dependency and its 72-byte limit.
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")


def get_hashed_password(password: str) -> str:
    return pwd_context.hash(password)


def ensure_table(conn: sqlite3.Connection) -> None:
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            hashed_password TEXT NOT NULL,
            is_active BOOLEAN DEFAULT 1,
            is_superuser BOOLEAN DEFAULT 0
        )
        """
    )


def create_or_update_admin(username: str, password: str) -> None:
    conn = sqlite3.connect(DB_PATH)
    try:
        ensure_table(conn)
        cur = conn.cursor()
        hashed = get_hashed_password(password)

        cur.execute("SELECT id FROM users WHERE username = ?", (username,))
        row = cur.fetchone()
        if row:
            cur.execute(
                "UPDATE users SET hashed_password = ?, is_superuser = 1, is_active = 1 WHERE username = ?",
                (hashed, username),
            )
            print(f"Updated existing user '{username}' as superuser.")
        else:
            cur.execute(
                "INSERT INTO users (username, hashed_password, is_superuser, is_active) VALUES (?, ?, 1, 1)",
                (username, hashed),
            )
            print(f"Created new superuser '{username}'.")
        conn.commit()
    finally:
        conn.close()


def main():
    parser = argparse.ArgumentParser(description="Create or update an admin user in sqlite DB")
    parser.add_argument("--username", "-u", required=True, help="Admin username")
    parser.add_argument("--password", "-p", help="Password (if omitted, will prompt)")
    args = parser.parse_args()

    password = args.password or getpass(prompt="Password: ")
    if not password:
        raise SystemExit("Password cannot be empty")

    create_or_update_admin(args.username, password)


if __name__ == "__main__":
    main()
