import sqlite3

db = sqlite3.connect('movies.db')
cursor = db.cursor()

# Check if columns exist
cursor.execute("PRAGMA table_info(movies)")
columns = {col[1] for col in cursor.fetchall()}

# Add missing columns
if 'director' not in columns:
    cursor.execute("ALTER TABLE movies ADD COLUMN director TEXT DEFAULT ''")
    print("Added 'director' column")

if 'description' not in columns:
    cursor.execute("ALTER TABLE movies ADD COLUMN description TEXT DEFAULT ''")
    print("Added 'description' column")

db.commit()
db.close()
print("Migration complete!")
