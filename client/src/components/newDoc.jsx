import './styles/newDoc.css';
import { useState } from 'react';
import { useAuth } from '../context/authContext';
import axios from 'axios';

function NewDoc({setNewDoc, edit=false, docs, docData={}}) {
    const {user} = useAuth();
    const [docsType, setDocsType] = useState(["Wolfsberg", "ESMA", "KBIS", "SIRENE", "Other"]);
    const [doc, setDoc] = useState({
        user: user.data.id,
        dili: user.dili.id,
        name: "",
        file: null,
        docType: ""
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const {name, value} = e.target;
        setDoc({
            ...doc,
            [name]: value
        });
    }

    const handleFile = (e) => {
        if (!e.target.files) return;
        
        const file = e.target.files[0];

        setDoc({
            ...doc,
            file: file
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!doc.name || !doc.file || !doc.date) {
            setError("All fields are required");
        }

        let formData = new FormData();
        formData.append("document", doc.file, doc.file.name);
        formData.append("name", doc.name);
        formData.append("docType", doc.docType);
        formData.append("diligence", user.dili.id);
        formData.append("user", user.data.id);

        APIDocument(formData);
        setDoc({
                user: user.data.id,
                dili: user.dili.id,
                name: "",
                file: null,
                docType: ""
        });
        e.target[0].value = "";
        e.target[1].value = "";
        e.target[2].value = "";
    }
    
    const APIDocument = async (data) => {
        let axiosConfig = {
            headers: {
                'content-Type': 'multpart/form-data'
            }
        }
        
        try {
            /* if(edit) {
                await axios.put('http://')
            } else { */
                await axios.post('http://127.0.0.1:8000/api/documents/', data, axiosConfig )
                    .then(res => {
                        console.log(res);
                    })

            setNewDoc(false);
        } catch (error) {
            console.log(error);
            setError(error.message);
        }
    }

    const downloadDoc = async (id) => {
        try {
            await axios.get(`http://127.0.0.1:8000/api/documents/${user.dili.id}/${id}/`)
                .then(res => {
                    console.log(res);
                })
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="newDocApp">
            <div className='bg'></div>
            <div className='newDoc'>
                {edit? <h2>Edit document</h2> : <h2>New docuemnt</h2>}
                <form onSubmit={handleSubmit}>
                    {error?<p style={{color: 'red'}}>{error}</p> : ''}
                    {edit? <h5>Actuale: <b>{docData[1]}</b></h5>:''}
                    <select name="docType" id="docType" onChange={handleChange}  required>
                        <option value="" disabled selected>Document type</option>
                        {
                            docsType.map((docType, index) => {
                                if (edit && docType === docData[2]) {
                                    return <option value={docType} key={index} selected>{docType}</option>
                                }
                                if (docs) {
                                    for (const key in docs) {
                                        if (docs[key].docType !== docType) {
                                            return <option value={docType} key={index}>{docType}</option>
                                        }
                                    }
                                } else {
                                    return <option value={docType} key={index}>{docType}</option>
                                }
                            })
                        }
                    </select>
                    <input type="text" name='name' placeholder="Nom de document" onChange={handleChange} required />
                    <input type="file" name="file" id="inpFile" onChange={handleFile} required />
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