export default function MovieListItem(props) {
    return (
        <div>
            <div>
                <strong>{props.movie.title}</strong>
                {' '}
                <span>({props.movie.year})</span>
                {' '}
                directed by {props.movie.director}
                {' '}
                <button onClick={props.onDelete} style={{marginLeft: '10px'}}>Usuń</button>
                {' '}
                <button onClick={props.onManageActors} style={{marginLeft: '5px'}}>Zarządzaj aktorami</button>
            </div>
            {props.movie.description && <div style={{marginTop: '8px', fontStyle: 'italic'}}>{props.movie.description}</div>}
        </div>
    );
}
