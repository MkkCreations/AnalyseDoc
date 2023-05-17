import './styles/documents.css';
import { useAuth } from "../context/authContext";
import { Link } from 'react-router-dom';
import Header from "./header";
import { useState } from 'react';
import NewDoc from './newDoc';
import axios from 'axios';

function Documents() {
    const {user, setUser} = useAuth();
    const [docs, setDocs] = useState([]);
    const [newDoc, setNewDoc] = useState(false);
    const [settings, setSettings] = useState(false);

    return (
        <div className="documents">
            <Header />
            <div style={{display: !newDoc?'none': 'unset'}}><NewDoc setNewDoc={setNewDoc} /></div>
            <main>
                <h2><Link to={'/projects'}>Projects</Link> - Documents({user.dili.dili_name})</h2>

                <section>
                    <span className='docs'>
                        <div>
                            <h4 onClick={() => {setNewDoc(!newDoc)}}>New Document</h4>
                            <div>
                                <p>{user.dili[0]? user.docs[0]+'%':'---'}</p>
                            </div>
                        </div>
                        <div>
                            <article>
                                <div>
                                    <h5>Wolfsberg</h5>
                                    <p>Wolfsberg.pdg</p>
                                    <p>23/03/2023 01:23</p>
                                </div>
                                <button>
                                    <figure>
                                        <img src='https://img.icons8.com/material-rounded/24/ffffff/menu-2.png' onClick={() => {setSettings(!settings)}} alt='options'/>
                                        <div className='docSettings' style={{display: settings?'flex':'none'}}>
                                            <p /* onClick={() => handleEdit(diligence.id)} */>Edit</p>
                                            <p /* onClick={() => handleDelete(diligence.id)} */>Delete</p>
                                        </div>
                                    </figure>
                                </button>
                            </article>
                            <DocField doc={{name: 'Wolfsberg', file: 'Wolfsberg.pdf', date: '23/03/2023 01:23'}} />
                        </div>
                    </span>
                    <span className='doc'>
                        <embed src="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf#toolbar=0&navpanes=0&scrollbar=0" width="100%" height="100%" type='application/pdf'/>
                    </span>
                </section>
            </main>
        </div>
    )
}

function DocField({doc}) {
    const [settings, setSettings] = useState(false);
    const [editDoc, setEditDoc] = useState(false);

    const handleEdit = (doc) => {
        setEditDoc(true);
    }

    const handleDelete = async (doc) => {
        window.confirm('Are you sure you want to delete this project?');
        await axios.delete(`http://`)
                .then(res => {
                    console.log(res);
            });
    }

    return (
        <article>
            <div>
                <span style={{display: !editDoc?'none': 'unset'}}><NewDoc setNewDoc={setEditDoc} edit={true} docData={doc} /></span>
                <h5>{doc.name}</h5>
                <p>{doc.file}</p>
                <p>{doc.date}</p>
            </div>
            <button>
                <figure>
                    <img src='https://img.icons8.com/material-rounded/24/ffffff/menu-2.png' alt='options' onClick={() => {setSettings(!settings)}} />
                    <div className='docSettings' style={{display: settings?'flex':'none'}}>
                    <p onClick={() => handleEdit(doc.id)}>Edit</p>
                    <p onClick={() => handleDelete(doc.id)}>Delete</p>
                </div>
                </figure>
            </button>
        </article>
    )
}

export default Documents;