import MovieListItem from "./MovieListItem";
import MovieEditForm from "./MovieEditForm";

export default function MoviesList(props) {
    return <div>
        <h2>Filmy</h2>
        <ul className="movies-list">
            {props.movies.map(movie => <li key={movie.id} style={{marginBottom: '12px'}}>
                <MovieListItem 
                    movie={movie} 
                    onDelete={() => props.onDeleteMovie(movie)}
                    onEdit={() => props.onEditMovie(movie)}
                    onManageActors={() => props.onManageActors(movie)}
                />
                {props.editingMovie && props.editingMovie.id === movie.id && (
                    <div style={{marginTop: '8px', padding: '8px', background: '#fafafa', borderRadius: 4}}>
                        <MovieEditForm movie={props.editingMovie} onSubmit={props.onUpdateMovie} onCancel={() => props.onEditMovie(null)} />
                    </div>
                )}
            </li>)}
        </ul>
    </div>;
}