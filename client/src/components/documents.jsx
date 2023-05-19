import './styles/documents.css';
import { useAuth } from "../context/authContext";
import { Link } from 'react-router-dom';
import Header from "./header";
import { useEffect, useState } from 'react';
import NewDoc from './newDoc';
import axios from 'axios';

function Documents() {
    const {user} = useAuth();
    const [docs, setDocs] = useState([{}]);
    const [downloadDoc, setDownloadDoc] = useState();
    const [newDoc, setNewDoc] = useState(false);

    const getDocs = async () => {
        try {
            await axios.get(`http://127.0.0.1:8000/api/documents/${user.dili.id}/0/`)
                .then(res => { 
                    console.log(res);
                    setDocs(res.data);
                })
        } catch (error) {
            console.log(error);
        }
    }

    const handleShowDoc = (doc) => {
        console.log(doc);
        try {
            axios.get(`http://127.0.0.1:8000/api/documents/${user.dili.id}/${doc.id}/`)
                .then(res => {
                    console.log(res);
                    setDownloadDoc(res.config.url);
                })
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getDocs();
    }, [newDoc, setNewDoc])

    return (
        <div className="documents">
            <Header />
            <div style={{display: !newDoc?'none': 'unset'}}><NewDoc setNewDoc={setNewDoc} docs={docs} /></div>
            <main>
                <h2><Link to={'/projects'}>Projects</Link> - Documents({user.dili.dili_name})</h2>

                <section>
                    <span className='docs'>
                        <div>
                            <h4 onClick={() => {setNewDoc(!newDoc)}}>New Document</h4>
                            <div>
                                <p>{docs? (docs.length/4)*100+'%':'---'}</p>
                            </div>
                        </div>
                        <div>
                            { docs[0] === undefined? <center><p>No documents</p></center>:
                                docs.map(doc => {
                                    return <section className='docLink' onClick={() => {handleShowDoc(doc)}} ><DocField doc={doc} key={doc.id} /></section>
                                })
                            }
                        </div>
                    </span>
                    <span className='doc'>
                        {
                            docs[0] === undefined? <p>No documents</p>:
                            <embed src={`http://127.0.0.1:8000/api/media/documents/1/BNP-ESMA.pdf`} width="100%" height="100%" type='application/pdf'/>
                        }
                    </span>
                </section>
            </main>
        </div>
    )
}

function DocField({doc}) {
    const {user} = useAuth();
    const [settings, setSettings] = useState(false);
    const [editDoc, setEditDoc] = useState(false);

    const handleEdit = (doc) => {
        setEditDoc(true);
    }

    const handleDelete = async (doc) => {
        window.confirm('Are you sure you want to delete this project?');
        await axios.delete(`http://127.0.0.1:8000/api/documents/${user.dili.id}/${doc}/`)
                .then(res => {
                    console.log(res);
            });
        setSettings(false);
    }

    useEffect(() => {

    }, [editDoc, setEditDoc])

    return (
        <article key={doc.id}>
            <div>
                <span style={{display: !editDoc?'none': 'unset'}}><NewDoc setNewDoc={setEditDoc} edit={true} docData={doc} /></span>
                <h5>{doc.docType}</h5>
                <p>{doc.name}</p>
                <p>{new Date(doc.date).toLocaleString()}</p>
            </div>
            <button>
                <figure>
                    <img src='https://img.icons8.com/material-rounded/24/ffffff/menu-2.png' alt='options' onClick={() => {setSettings(!settings)}} />
                    <div className='docSettings' style={{display: settings?'flex':'none'}}>
                    <a href={`http://127.0.0.1:8000/api/documents/${user.dili.id}/${doc.id}/`}>Download</a>
                    <p onClick={() => handleEdit(doc.id)}>Edit</p>
                    <p onClick={() => handleDelete(doc.id)}>Delete</p>
                </div>
                </figure>
            </button>
        </article>
    )
}

export default Documents;