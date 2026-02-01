import './App.css';
import {useEffect, useState} from "react";
import "milligram";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MovieForm from "./MovieForm";
import MoviesList from "./MoviesList";
import ActorForm from "./ActorForm";
import ActorsList from "./ActorsList";
import MovieActors from "./MovieActors";
import Spinner from "./Spinner";
import MovieEditForm from "./MovieEditForm";
import ActorsPreview from "./ActorsPreview";

function App() {
    const [movies, setMovies] = useState([]);
    const [actors, setActors] = useState([]);
    const [addingMovie, setAddingMovie] = useState(false);
    const [addingActor, setAddingActor] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [selectedMovieActors, setSelectedMovieActors] = useState([]);
    const [loadingMovies, setLoadingMovies] = useState(false);
    const [loadingActors, setLoadingActors] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingMovie, setEditingMovie] = useState(null);

    useEffect(() => {
        const fetchMovies = async () => {
            setLoadingMovies(true);
            try {
                const response = await fetch(`/movies`);
                if (!response.ok) throw new Error(`Server returned ${response.status}`);
                const movies = await response.json();
                setMovies(movies);
            } catch (err) {
                toast.error('Błąd pobierania filmów: ' + err.message);
            } finally {
                setLoadingMovies(false);
            }
        };
        fetchMovies();
    }, []);

    useEffect(() => {
        const fetchActors = async () => {
            setLoadingActors(true);
            try {
                const response = await fetch(`/actors`);
                if (!response.ok) throw new Error(`Server returned ${response.status}`);
                const actors = await response.json();
                setActors(actors);
            } catch (err) {
                toast.error('Błąd pobierania aktorów: ' + err.message);
            } finally {
                setLoadingActors(false);
            }
        };
        fetchActors();
    }, []);

    useEffect(() => {
        if (selectedMovie) {
            const fetchMovieActors = async () => {
                setActionLoading(true);
                try {
                    const response = await fetch(`/movies/${selectedMovie.id}/actors`);
                    if (!response.ok) throw new Error(`Server returned ${response.status}`);
                    const actors = await response.json();
                    setSelectedMovieActors(actors);
                } catch (err) {
                    toast.error('Błąd pobierania aktorów filmu: ' + err.message);
                } finally {
                    setActionLoading(false);
                }
            };
            fetchMovieActors();
        } else {
            setSelectedMovieActors([]);
        }
    }, [selectedMovie]);

    async function handleAddMovie(movie) {
        movie.actors = '';
        setActionLoading(true);
        try {
            const response = await fetch('/movies', {
                method: 'POST',
                body: JSON.stringify(movie),
                headers: { 'Content-Type': 'application/json' }
            });
            if (!response.ok) throw new Error(`Server returned ${response.status}`);
            const movieWithId = await response.json();
            movie.id = movieWithId.id;
            setMovies([...movies, movie]);
            setAddingMovie(false);
            toast.success('Film dodany');
        } catch (err) {
            toast.error('Błąd dodawania filmu: ' + err.message);
        } finally {
            setActionLoading(false);
        }
    }

    async function handleDeleteMovie(movie) {
        if (!window.confirm(`Czy na pewno chcesz usunąć film "${movie.title}"?`)) return;
        setActionLoading(true);
        try {
            const url = `/movies/${movie.id}`;
            const response = await fetch(url, {method: 'DELETE'});
            if (!response.ok) throw new Error(`Server returned ${response.status}`);
            setMovies(movies.filter(m => m !== movie));
            toast.success('Film usunięty');
        } catch (err) {
            toast.error('Błąd usuwania filmu: ' + err.message);
        } finally {
            setActionLoading(false);
        }
    }

    async function handleAddActor(actor) {
        setActionLoading(true);
        try {
            const response = await fetch('/actors', {
                method: 'POST',
                body: JSON.stringify(actor),
                headers: { 'Content-Type': 'application/json' }
            });
            if (!response.ok) throw new Error(`Server returned ${response.status}`);
            const actorWithId = await response.json();
            setActors([...actors, {id: actorWithId.id, name: actorWithId.name}]);
            setAddingActor(false);
            toast.success('Aktor dodany');
        } catch (err) {
            toast.error('Błąd dodawania aktora: ' + err.message);
        } finally {
            setActionLoading(false);
        }
    }

    async function handleDeleteActor(actor) {
        if (!window.confirm(`Czy na pewno chcesz usunąć aktora "${actor.name}"?`)) return;
        setActionLoading(true);
        try {
            const url = `/actors/${actor.id}`;
            const response = await fetch(url, {method: 'DELETE'});
            if (!response.ok) throw new Error(`Server returned ${response.status}`);
            setActors(actors.filter(a => a !== actor));
            if (selectedMovie) {
                setSelectedMovieActors(selectedMovieActors.filter(a => a !== actor));
            }
            toast.success('Aktor usunięty');
        } catch (err) {
            toast.error('Błąd usuwania aktora: ' + err.message);
        } finally {
            setActionLoading(false);
        }
    }

    async function handleAssignActorToMovie(actor) {
        if (!selectedMovie) {
            toast.info('Najpierw wybierz film do edycji');
            return;
        }
        setActionLoading(true);
        try {
            const response = await fetch(`/movies/${selectedMovie.id}/actors/${actor.id}`, {
                method: 'POST'
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || `Server returned ${response.status}`);
            }
            const updatedActors = [...selectedMovieActors, actor];
            setSelectedMovieActors(updatedActors);
            toast.success('Aktor przypisany do filmu');
        } catch (err) {
            toast.error('Błąd przy przypisywaniu aktora: ' + err.message);
        } finally {
            setActionLoading(false);
        }
    }

    async function handleRemoveActorFromMovie(actor) {
        setActionLoading(true);
        try {
            const response = await fetch(`/movies/${selectedMovie.id}/actors/${actor.id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error(`Server returned ${response.status}`);
            setSelectedMovieActors(selectedMovieActors.filter(a => a !== actor));
            toast.success('Aktor usunięty z filmu');
        } catch (err) {
            toast.error('Błąd usuwania aktora z filmu: ' + err.message);
        } finally {
            setActionLoading(false);
        }
    }

    // Edit movie flow
    function handleEditMovie(movie) {
        setEditingMovie(movie);
    }

    async function handleUpdateMovie(data) {
        setActionLoading(true);
        try {
            const response = await fetch(`/movies/${data.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    title: data.title, 
                    year: data.year, 
                    director: data.director,
                    description: data.description
                }),
                headers: { 'Content-Type': 'application/json' }
            });
            if (!response.ok) throw new Error(`Server returned ${response.status}`);
            // Update local state
            setMovies(movies.map(m => m.id === data.id ? {...m, title: data.title, year: data.year, director: data.director, description: data.description} : m));
            setEditingMovie(null);
            toast.success('Film zaktualizowany');
        } catch (err) {
            toast.error('Błąd aktualizacji filmu: ' + err.message);
        } finally {
            setActionLoading(false);
        }
    }

    const filteredMovies = movies.filter(m => m.title.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="container">
            <ToastContainer position="top-right" />
            <h1>Moje ulubione filmy</h1>
            <div style={{marginBottom: '12px'}}>
                <input placeholder="Szukaj filmów..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <div style={{display: 'flex', gap: '20px', marginBottom: '20px'}}>
                <div style={{flex: 1}}>
                    {loadingMovies ? <Spinner /> : (
                        filteredMovies.length === 0
                            ? <p>Brak filmów. Może coś dodać?</p>
                            : <MoviesList movies={filteredMovies}
                                          onDeleteMovie={handleDeleteMovie}
                                          onManageActors={(movie) => setSelectedMovie(movie)}
                                          onEditMovie={handleEditMovie}
                                          editingMovie={editingMovie}
                                          onUpdateMovie={handleUpdateMovie}
                            />
                    )}

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

                    {loadingActors ? <Spinner /> : <ActorsPreview actors={actors} />}

                    <hr />

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
            {actionLoading && <div style={{position: 'fixed', right: 16, bottom: 16}}><Spinner /></div>}
        </div>
    );
}

export default App;