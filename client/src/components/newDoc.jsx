import './styles/newDoc.css';
import { useState } from 'react';
import { useAuth } from '../context/authContext';

function NewDoc({setNewDoc, edit=false, docData={}}) {
    const {user} = useAuth();
    const [doc, setDoc] = useState({
        dili_id: user.dili.id,
        name: "",
        file: "",
        date: ""
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const {name, value} = e.target;
        setDoc({
            ...doc,
            [name]: value
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(e);
        if (!doc.name || !doc.file || !doc.date) {
            setError("All fields are required");
            return;
        }
        const data = {
            name: doc.name,
            file: doc.file,
            date: doc.date,
            dili: user.dili.id
        }
        console.log(data);
    }


    return (
        <div className="newDocApp">
            <div className='bg'></div>
            <div className='newDoc'>
                {edit? <h2>Edit document</h2> : <h2>New docuemnt</h2>}
                <form onSubmit={handleSubmit}>
                    {error?<p style={{color: 'red'}}>{error}</p> : ''}
                    {edit? <h5>Actuale: <b>{docData[1]}</b></h5>:''}
                    <select name="docType" id="docType" >
                        <option defaultChecked >Selection le type de document</option>
                        <option value="wolfsberg">Wolfsberg</option>
                        <option value="esma">ESMA</option>
                        <option value="kbis">KBIS</option>
                        <option value="other">Other</option>
                    </select>
                    <input type="text" placeholder="Nom de document" onChange={handleChange} required />
                    <input type="file" name="file" id="inpFile" />
                    <span>
                        <p onClick={() => {setNewDoc(false)}}>Annuler</p>
                        <button>Valider</button>
                    </span>
                </form>
            </div>
        </div>
    )
}

export default NewDoc;