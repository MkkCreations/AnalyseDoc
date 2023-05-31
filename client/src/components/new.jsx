import './styles/new.css';
import { useAuth } from '../context/authContext';
import Header from './header';
import axios from 'axios';
import { useState } from 'react';

function New({setNewDili, edit=false, dili={}}) {
    const {user, setUser} = useAuth();
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        console.log(e.target.value);
        setMessage("");
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(e.target[0].value);
        const data = {
            dili_name: e.target[0].value,
            user_id: user.data.id
        }
        APIDiligences(data);
        e.target[0].value = "";
    }

    const APIDiligences = async (data) => {
        try {
            if(edit) {
                await axios.put('http://127.0.0.1:8000/api/diligences/', {id: dili[0], dili_name: data.dili_name, user_id: data.user_id})
                    .then(res => {
                        console.log(res);
                })
            } else {
                await axios.post('http://127.0.0.1:8000/api/diligences/', data)
                    .then(res => {
                        console.log(res);
                })
            }
            setNewDili(false);
        } catch (error) {
            console.log(error);
            setMessage(error.message);
        }
    }

    return (
        <div className="newApp">
            <div className='bg'></div>
            <div className='new'>
                {edit? <h2>Edit project</h2> : <h2>New project</h2>}
                <form onSubmit={handleSubmit}>
                    {message?<p style={{color: 'red'}}>{message}</p> : ''}
                    {edit? <h5>Actual: <b>{dili[1]}</b></h5>:''}
                    <input type="text" placeholder="Nom de l'entreprise" onChange={handleChange} required/>
                    <span>
                        <p onClick={() => {setNewDili(false)}}>Cancel</p>
                        <button>Confirm</button>
                    </span>
                </form>
            </div>
        </div>
    )
}

export default New;