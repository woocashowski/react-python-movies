import {useState} from "react";

export default function MovieEditForm(props) {
    const [title, setTitle] = useState(props.movie.title || '');
    const [year, setYear] = useState(props.movie.year || '');
    const [director, setDirector] = useState(props.movie.director || '');
    const [description, setDescription] = useState(props.movie.description || '');

    function submit(event) {
        event.preventDefault();
        if (title.length < 2) return alert('Tytuł jest za krótki');
        props.onSubmit({id: props.movie.id, title, year, director, description});
    }

    return <form onSubmit={submit} style={{marginTop: '10px'}}>
        <h3>Edytuj film</h3>
        <div>
            <label>Tytuł</label>
            <input value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div>
            <label>Rok</label>
            <input value={year} onChange={e => setYear(e.target.value)} />
        </div>
        <div>
            <label>Reżyser</label>
            <input value={director} onChange={e => setDirector(e.target.value)} />
        </div>
        <div>
            <label>Opis</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} />
        </div>
        <button type="submit">Zapisz</button>
        <button type="button" onClick={props.onCancel} style={{marginLeft: '8px'}}>Anuluj</button>
    </form>;
}
