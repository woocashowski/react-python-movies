export default function ActorsPreview(props) {
    if (!props.actors || props.actors.length === 0) return <div>
        <h4>Aktors Preview</h4>
        <p>Brak aktorów</p>
    </div>;

    return <div>
        <h4>Lista aktorów ({props.actors.length})</h4>
        <ul style={{listStyle: 'none', paddingLeft: 0}}>
            {props.actors.slice(0, 10).map(a => <li key={a.id}>{a.name}</li>)}
        </ul>
        {props.actors.length > 10 && <div><em>...i więcej</em></div>}
    </div>;
}
