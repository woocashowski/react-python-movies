export default function ActorsList(props) {
    return <div>
        <h3>Dostępni aktorzy ({props.actors.length})</h3>
        {props.actors.length === 0 ? (
            <p>Brak aktorów w bazie danych</p>
        ) : (
            <ul className="actors-list">
                {props.actors.map(actor => <li key={actor.id}>
                    <span>{actor.name}</span>
                    {' '}
                    <button 
                        onClick={() => props.onSelectActor(actor)} 
                        style={{marginLeft: '10px', padding: '5px 10px'}}
                        disabled={!props.selectedMovie}
                        title={!props.selectedMovie ? "Wybierz film aby przypisać aktora" : ""}
                    >
                        Przypisz
                    </button>
                    {' '}
                    <button onClick={() => props.onDeleteActor(actor)} 
                            style={{marginLeft: '5px', padding: '5px 10px', color: 'red'}}>
                        Usuń
                    </button>
                </li>)}
            </ul>
        )}
    </div>;
}
