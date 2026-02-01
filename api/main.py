from fastapi import FastAPI, Body
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Any
import sqlite3


class Movie(BaseModel):
    title: str
    year: str
    director: str = ""
    description: str = ""

class Actor(BaseModel):
    name: str

app = FastAPI()

app.mount("/static", StaticFiles(directory="../ui/build/static", check_dir=False), name="static")

@app.get("/")
def serve_react_app():
   return FileResponse("../ui/build/index.html")

@app.get('/movies')
def get_movies():
    db = sqlite3.connect('movies.db')
    cursor = db.cursor()
    movies = cursor.execute('SELECT id, title, year, director, description FROM movies')

    output = []
    for movie in movies:
        movie_dict = {'id': movie[0], 'title': movie[1], 'year': movie[2], 'director': movie[3] if movie[3] else '', 'description': movie[4] if movie[4] else ''}
        output.append(movie_dict)
    db.close()
    return output

@app.get('/movies/{movie_id}')
def get_single_movie(movie_id:int):  # put application's code here
    db = sqlite3.connect('movies.db')
    cursor = db.cursor()
    movie = cursor.execute(f"SELECT * FROM movies WHERE id={movie_id}").fetchone()
    if movie is None:
        return {'message': "Movie not found"}
    return {'title': movie[1], 'year': movie[2], 'actors': movie[3], 'description': movie[4]}

@app.post("/movies")
def add_movie(movie: Movie):
    db = sqlite3.connect('movies.db')
    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO movies (title, year, director, description) VALUES (?, ?, ?, ?)",
        (movie.title, movie.year, movie.director, movie.description)
    )
    db.commit()
    new_id = cursor.lastrowid
    db.close()
    return {
        "message": f"Movie with id = {new_id} added successfully",
        "id": new_id,
    }
    # movie = models.Movie.create(**movie.dict())
    # return movie

@app.put("/movies/{movie_id}")
def update_movie(movie_id:int, params: dict[str, Any]):
    db = sqlite3.connect('movies.db')
    cursor = db.cursor()
    cursor.execute(
        "UPDATE movies SET title = ?, year = ?, director = ?, description = ? WHERE id = ?",
        (params.get('title'), params.get('year'), params.get('director', ''), params.get('description', ''), movie_id)
    )
    db.commit()
    if cursor.rowcount == 0:
        db.close()
        return {"message": f"Movie with id = {movie_id} not found"}
    db.close()
    return {"message": f"Movie with id = {movie_id} updated successfully"}

@app.delete("/movies/{movie_id}")
def delete_movie(movie_id:int):
    db = sqlite3.connect('movies.db')
    cursor = db.cursor()
    cursor.execute("DELETE FROM movies WHERE id = ?", (movie_id,))
    db.commit()
    if cursor.rowcount == 0:
        return {"message": f"Movie with id = {movie_id} not found"}
    return {"message": f"Movie with id = {movie_id} deleted successfully"}

@app.delete("/movies")
def delete_movies(movie_id:int):
    db = sqlite3.connect('movies.db')
    cursor = db.cursor()
    cursor.execute("DELETE FROM movies")
    db.commit()
    return {"message": f"Deleted {cursor.rowcount} movies"}


# ===== ACTOR MANAGEMENT ENDPOINTS =====

@app.get('/actors')
def get_actors():
    db = sqlite3.connect('movies.db')
    cursor = db.cursor()
    actors = cursor.execute('SELECT * FROM actors')
    
    output = []
    for actor in actors:
        actor_dict = {'id': actor[0], 'name': actor[1]}
        output.append(actor_dict)
    db.close()
    return output


@app.get('/actors/{actor_id}')
def get_single_actor(actor_id: int):
    db = sqlite3.connect('movies.db')
    cursor = db.cursor()
    actor = cursor.execute('SELECT * FROM actors WHERE id=?', (actor_id,)).fetchone()
    db.close()
    if actor is None:
        return {'message': "Actor not found"}
    return {'id': actor[0], 'name': actor[1]}


@app.post("/actors")
def add_actor(actor: Actor):
    db = sqlite3.connect('movies.db')
    cursor = db.cursor()
    cursor.execute("INSERT INTO actors (name) VALUES (?)", (actor.name,))
    db.commit()
    new_id = cursor.lastrowid
    db.close()
    return {
        "message": f"Actor with id = {new_id} added successfully",
        "id": new_id,
        "name": actor.name
    }


@app.put("/actors/{actor_id}")
def update_actor(actor_id: int, actor: Actor):
    db = sqlite3.connect('movies.db')
    cursor = db.cursor()
    cursor.execute("UPDATE actors SET name = ? WHERE id = ?", (actor.name, actor_id))
    db.commit()
    if cursor.rowcount == 0:
        db.close()
        return {"message": f"Actor with id = {actor_id} not found"}
    db.close()
    return {"message": f"Actor with id = {actor_id} updated successfully"}


@app.delete("/actors/{actor_id}")
def delete_actor(actor_id: int):
    db = sqlite3.connect('movies.db')
    cursor = db.cursor()
    # First, remove actor from all movies
    cursor.execute("DELETE FROM movie_actors WHERE actor_id = ?", (actor_id,))
    # Then delete the actor
    cursor.execute("DELETE FROM actors WHERE id = ?", (actor_id,))
    db.commit()
    if cursor.rowcount == 0:
        db.close()
        return {"message": f"Actor with id = {actor_id} not found"}
    db.close()
    return {"message": f"Actor with id = {actor_id} deleted successfully"}


# ===== MOVIE-ACTOR ASSOCIATION ENDPOINTS =====

@app.get('/movies/{movie_id}/actors')
def get_movie_actors(movie_id: int):
    db = sqlite3.connect('movies.db')
    cursor = db.cursor()
    actors = cursor.execute(
        'SELECT a.id, a.name FROM actors a '
        'JOIN movie_actors ma ON a.id = ma.actor_id '
        'WHERE ma.movie_id = ?',
        (movie_id,)
    )
    
    output = []
    for actor in actors:
        actor_dict = {'id': actor[0], 'name': actor[1]}
        output.append(actor_dict)
    db.close()
    return output


@app.post('/movies/{movie_id}/actors/{actor_id}')
def add_actor_to_movie(movie_id: int, actor_id: int):
    db = sqlite3.connect('movies.db')
    cursor = db.cursor()
    
    # Check if movie exists
    movie = cursor.execute('SELECT * FROM movies WHERE id=?', (movie_id,)).fetchone()
    if movie is None:
        db.close()
        return {'message': "Movie not found"}
    
    # Check if actor exists
    actor = cursor.execute('SELECT * FROM actors WHERE id=?', (actor_id,)).fetchone()
    if actor is None:
        db.close()
        return {'message': "Actor not found"}
    
    # Check if association already exists
    existing = cursor.execute(
        'SELECT * FROM movie_actors WHERE movie_id=? AND actor_id=?',
        (movie_id, actor_id)
    ).fetchone()
    if existing:
        db.close()
        return {'message': "Actor is already assigned to this movie"}
    
    # Add association
    cursor.execute(
        'INSERT INTO movie_actors (movie_id, actor_id) VALUES (?, ?)',
        (movie_id, actor_id)
    )
    db.commit()
    db.close()
    return {
        "message": f"Actor {actor[1]} assigned to movie {movie[1]} successfully"
    }


@app.delete('/movies/{movie_id}/actors/{actor_id}')
def remove_actor_from_movie(movie_id: int, actor_id: int):
    db = sqlite3.connect('movies.db')
    cursor = db.cursor()
    cursor.execute(
        'DELETE FROM movie_actors WHERE movie_id=? AND actor_id=?',
        (movie_id, actor_id)
    )
    db.commit()
    if cursor.rowcount == 0:
        db.close()
        return {"message": f"Association between movie {movie_id} and actor {actor_id} not found"}
    db.close()
    return {"message": f"Actor removed from movie successfully"}


# if __name__ == '__main__':
#     app.run()