export default function MovieActors(props) {
    return <div style={{marginTop: '15px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '5px'}}>
        <h4>Aktorzy w tym filmie ({props.actors.length})</h4>
        {props.actors.length === 0 ? (
            <p><em>Brak przypisanych aktorów</em></p>
        ) : (
            <ul style={{listStyle: 'none', padding: 0}}>
                {props.actors.map(actor => <li key={actor.id} style={{marginBottom: '8px'}}>
                    <span>{actor.name}</span>
                    {' '}
                    <button 
                        onClick={() => props.onRemoveActor(actor)}
                        style={{marginLeft: '10px', padding: '5px 10px', color: 'red'}}
                    >
                        Usuń z filmu
                    </button>
                </li>)}
            </ul>
        )}
    </div>;
}
