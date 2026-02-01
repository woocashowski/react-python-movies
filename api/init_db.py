import sqlite3

def init_db():
    db = sqlite3.connect('movies.db')
    cursor = db.cursor()
    
    # Create actors table if it doesn't exist
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS actors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
        )
    ''')
    
    # Create movie_actors junction table if it doesn't exist
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS movie_actors (
            movie_id INTEGER NOT NULL,
            actor_id INTEGER NOT NULL,
            PRIMARY KEY (movie_id, actor_id),
            FOREIGN KEY (movie_id) REFERENCES movies(id),
            FOREIGN KEY (actor_id) REFERENCES actors(id)
        )
    ''')
    
    db.commit()
    db.close()
    print("Database initialized successfully!")

if __name__ == '__main__':
    init_db()
