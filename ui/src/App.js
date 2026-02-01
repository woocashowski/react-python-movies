import './App.css';
import {useEffect, useState} from "react";
import "milligram";
import MovieForm from "./MovieForm";
import MoviesList from "./MoviesList";
import ActorForm from "./ActorForm";
import ActorsList from "./ActorsList";
import MovieActors from "./MovieActors";

function App() {
    const [movies, setMovies] = useState([]);
    const [actors, setActors] = useState([]);
    const [addingMovie, setAddingMovie] = useState(false);
    const [addingActor, setAddingActor] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [selectedMovieActors, setSelectedMovieActors] = useState([]);

    useEffect(() => {
        const fetchMovies = async () => {
            const response = await fetch(`/movies`);
            if (response.ok) {
                const movies = await response.json();
                setMovies(movies);
            }
        };
        fetchMovies();
    }, []);

    useEffect(() => {
        const fetchActors = async () => {
            const response = await fetch(`/actors`);
            if (response.ok) {
                const actors = await response.json();
                setActors(actors);
            }
        };
        fetchActors();
    }, []);

    useEffect(() => {
        if (selectedMovie) {
            const fetchMovieActors = async () => {
                const response = await fetch(`/movies/${selectedMovie.id}/actors`);
                if (response.ok) {
                    const actors = await response.json();
                    setSelectedMovieActors(actors);
                }
            };
            fetchMovieActors();
        }
    }, [selectedMovie]);

    async function handleAddMovie(movie) {
        movie.actors = '';
        const response = await fetch('/movies', {
            method: 'POST',
            body: JSON.stringify(movie),
            headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) {
            const movieWithId = await response.json();
            movie.id = movieWithId.id;
            setMovies([...movies, movie]);
            setAddingMovie(false);
        }
    }

    async function handleDeleteMovie(movie) {
        const url = `/movies/${movie.id}`;
        const response = await fetch(url, {method: 'DELETE'});
        if (response.ok) {
            setMovies(movies.filter(m => m !== movie));
        }
    }

    async function handleAddActor(actor) {
        const response = await fetch('/actors', {
            method: 'POST',
            body: JSON.stringify(actor),
            headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) {
            const actorWithId = await response.json();
            setActors([...actors, {id: actorWithId.id, name: actorWithId.name}]);
            setAddingActor(false);
        }
    }

    async function handleDeleteActor(actor) {
        const url = `/actors/${actor.id}`;
        const response = await fetch(url, {method: 'DELETE'});
        if (response.ok) {
            setActors(actors.filter(a => a !== actor));
            if (selectedMovie) {
                setSelectedMovieActors(selectedMovieActors.filter(a => a !== actor));
            }
        }
    }

    async function handleAssignActorToMovie(actor) {
        if (!selectedMovie) {
            alert('Najpierw wybierz film, do którego chcesz przypisać aktora');
            return;
        }
        const response = await fetch(`/movies/${selectedMovie.id}/actors/${actor.id}`, {
            method: 'POST'
        });
        if (response.ok) {
            const updatedActors = [...selectedMovieActors, actor];
            setSelectedMovieActors(updatedActors);
        } else {
            const data = await response.json();
            alert(data.message || 'Błąd przy przypisywaniu aktora');
        }
    }

    async function handleRemoveActorFromMovie(actor) {
        const response = await fetch(`/movies/${selectedMovie.id}/actors/${actor.id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            setSelectedMovieActors(selectedMovieActors.filter(a => a !== actor));
        }
    }

    return (
        <div className="container">
            <h1>Moje ulubione filmy</h1>
            <div style={{display: 'flex', gap: '20px', marginBottom: '20px'}}>
                <div style={{flex: 1}}>
                    {movies.length === 0
                        ? <p>Brak filmów. Może coś dodać?</p>
                        : <MoviesList movies={movies}
                                      onDeleteMovie={handleDeleteMovie}
                                      onManageActors={(movie) => setSelectedMovie(movie)}
                        />}
                    {addingMovie
                        ? <MovieForm onMovieSubmit={handleAddMovie}
                                     buttonLabel="Dodaj film"
                        />
                        : <button onClick={() => setAddingMovie(true)}>Dodaj film</button>}
                </div>
                <div style={{flex: 1}}>
                    <h2>Zarządzanie aktorami</h2>
                    {addingActor
                        ? <ActorForm onActorSubmit={handleAddActor}
                                     buttonLabel="Dodaj aktora"
                        />
                        : <button onClick={() => setAddingActor(true)}>Dodaj aktora</button>}
                    
                    <hr/>
                    
                    {selectedMovie ? (
                        <>
                            <h3>Film: <strong>{selectedMovie.title}</strong></h3>
                            
                            <h4>Dostępni aktorzy do przypisania:</h4>
                            <ActorsList 
                                actors={actors}
                                selectedMovie={selectedMovie}
                                onSelectActor={handleAssignActorToMovie}
                                onDeleteActor={handleDeleteActor}
                            />

                            <MovieActors 
                                actors={selectedMovieActors}
                                onRemoveActor={handleRemoveActorFromMovie}
                            />
                            <button onClick={() => setSelectedMovie(null)} style={{marginTop: '10px'}}>
                                Zamknij edycję
                            </button>
                        </>
                    ) : (
                        <p><em>Wybierz film (kliknij "Zarządzaj aktorami") aby przypisać aktorów</em></p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;