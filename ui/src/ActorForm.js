import {useState} from "react";

export default function ActorForm(props) {
    const [name, setName] = useState('');

    function addActor(event) {
        event.preventDefault();
        if (name.length < 2) {
            return alert('Nazwa aktora musi zawierać co najmniej 2 znaki');
        }
        props.onActorSubmit({name});
        setName('');
    }

    return <form onSubmit={addActor}>
        <h3>Dodaj aktora</h3>
        <div>
            <label>Imię i nazwisko</label>
            <input 
                type="text" 
                value={name} 
                onChange={(event) => setName(event.target.value)}
                placeholder="Wpisz nazwisko aktora"
            />
        </div>
        <button>{props.buttonLabel || 'Dodaj'}</button>
    </form>;
}
