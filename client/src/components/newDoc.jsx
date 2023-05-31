import './styles/newDoc.css';
import { useState } from 'react';
import { useAuth } from '../context/authContext';


function NewDoc({setNewDoc, edit=false, docs, docData=[]}) {
    const {user, client} = useAuth();
    const [docsType] = useState(["Wolfsberg", "ESMA", "KBIS", "SIRENE", "Other"]);
    const [loading, setLoading] = useState(false);
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
        if (edit) return APIDocument(doc);

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
            setLoading(true);
            setError("Loading...");
            if(edit) {
                await client.put('documents/', {id: docData.id, name: data.name, docType: data.docType? data.docType: docData.docType, document: data.file? data.file: docData.document})
                    .then(res => {
                        console.log(res);
                        setError("Document updated");
                    });
            } else {
                await client.post('documents/', data, axiosConfig )
                    .then(res => {
                        console.log(res);
                    })
            }
            setLoading(false);
            setError("");
            setNewDoc(false);
        } catch (error) {
            console.log(error);
            setError(error.message);
        }
    }

    return (
        <div className="newDocApp">
            <div className='bg'></div>
            <div className='newDoc'>
                {edit? <h2>Edit document</h2> : <h2>New document</h2>}
                <form onSubmit={handleSubmit}>
                    {error?<p style={{color: 'red !important'}}>{error}</p> : ''}
                    {edit? <h5>Actuale: <b>{docData.name}</b></h5>:''}
                    <select name="docType" id="docType" onChange={handleChange} required>
                        <option value="" disabled selected>Document type</option>
                        {
                            docsType.map((docType, index) => {
                                if (edit && docType === docData.docType) {
                                    return <option value={docType} key={index} selected>{docType}</option>
                                } 
                                if (docs) {
                                    for (const key in docs) {
                                        if (docType === docs[key].docType) {
                                            return '';
                                        }
                                    }
                                    return <option value={docType} key={index}>{docType}</option>
                                } else {
                                    return <option value={docType} key={index}>{docType}</option>
                                }
                            })
                        }
                    </select>
                    <input type="text" name='name' placeholder="Nom de document" onChange={handleChange} required />
                    {
                        !edit? <input type="file" name="file" id="inpFile" onChange={handleFile} required/>: <input type="file" name="file" id="inpFile" onChange={handleFile} />
                    }
                    <span>
                        <p onClick={() => {setNewDoc(false)}}>Cancel</p>
                        <button>Confirm</button>
                    </span>
                </form>
            </div>
        </div>
    )
}

export default NewDoc;