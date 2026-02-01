import MovieListItem from "./MovieListItem";

export default function MoviesList(props) {
    return <div>
        <h2>Filmy</h2>
        <ul className="movies-list">
            {props.movies.map(movie => <li key={movie.id}>
                <MovieListItem 
                    movie={movie} 
                    onDelete={() => props.onDeleteMovie(movie)}
                    onManageActors={() => props.onManageActors(movie)}
                />
            </li>)}
        </ul>
    </div>;
}