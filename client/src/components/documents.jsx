import './styles/documents.css';
import './styles/preview.css';
import { useAuth } from "../context/authContext";
import { Question } from './model/Question';
import { Link } from 'react-router-dom';
import Header from "./header";
import { useEffect, useState } from 'react';
import NewDoc from './newDoc';

function Documents() {
    const {user, client} = useAuth();
    const [docs, setDocs] = useState([{}]);
    const [newDoc, setNewDoc] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState();

    const getDocs = async () => {
        try {
            await client.get(`documents/${user.dili.id}/0/`)
                .then(res => { 
                    setDocs(res.data);
                })
        } catch (error) {
            console.log(error);
        }
    }

    const handleShowDoc = (doc) => {
        try {
            client.get(`documents/${user.dili.id}/${doc.id}/`, {responseType: 'blob'})
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
            {
                !newDoc? '':
                <NewDoc setNewDoc={setNewDoc} docs={docs} edit={false} docData={[]} />
            }
            <main>
                <h2><Link to={'/projects'}>Projects</Link> - Documents({user.dili.dili_name})</h2>

                <section>
                    <span className='docs'>
                        <div>
                            <h4 onClick={() => {setNewDoc(!newDoc)}}>New document</h4>
                            <div>
                                <p>{docs? (docs.length/4)*100+'%':'---'}</p>
                            </div>
                        </div>
                        <div>
                            { docs[0] === undefined? <center><p>No documents</p></center>:
                                docs.map(doc => {
                                    return <section className='docLink' /* onClick={() => {handleShowDoc(doc)}} */ ><DocField doc={doc} key={doc.id} getDocs={getDocs} setSelectedDoc={setSelectedDoc} docs={docs}/></section>
                                })
                            }
                        </div>
                    </span>
                    <span className='doc'>
                        {
                            !selectedDoc? <center><p>No document selected</p></center>:
                            <Questions doc={selectedDoc} />
                        }
                    </span>
                </section>
            </main>
        </div>
    )
}

function DocField({doc, getDocs, setSelectedDoc, docs}) {
    const {user, client} = useAuth();
    const [settings, setSettings] = useState(false);
    const [editDoc, setEditDoc] = useState(false);

    const handleEdit = (document) => {
        setEditDoc(true);
        return (
            <NewDoc setNewDoc={setEditDoc} edit={true} docData={document} docs={docs} />
        )
    }

    const handleDelete = async (doc) => {
        if (!window.confirm('Are you sure you want to delete this project?')) {
            return;
        }
        await client.delete(`documents/${user.dili.id}/${doc}/`)
                .then(res => {
                    console.log(res);
                });
        setSettings(false);
    }

    useEffect(() => {
        getDocs();
    }, [editDoc, setEditDoc, setSettings, settings])

    return (
        <article key={doc.id}>
            <div onClick={() => {setSelectedDoc(doc)}}>
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
                    <p onClick={() => handleEdit(doc)}>Edit</p>
                    <p onClick={() => handleDelete(doc.id)}>Delete</p>
                </div>
                </figure>
            </button>
        </article>
    )
}


function Questions(doc) {
    const {user, client} = useAuth();
    const [edit, setEdit] = useState(false);
    const [questions, setQuestions] = useState({});

    const fetchQuestions = async () => {
        try {
            await client.get(`answers/${user.dili.id}/${doc.doc.id}`)
                .then(res => {
                    for (const key in res.data.data) {
                        const question = new Question(res.data.data[key][0].id_q, res.data.data[key][0].num_q, res.data.data[key][0].question, res.data.data[key][0].type, res.data.data[key][0].parent, res.data.data[key][1].id_res, res.data.data[key][1].ai_res, res.data.data[key][1].answer, res.data.data[key][1].answer_type, res.data.data[key][1].ai_confidence, res.data.data[key][1].document_name);
                        questions[key] = question;
                    }
                    setQuestions({...questions});
                })
        } catch (error) {
            console.log(error);
        }
    }


    const handleChange = (key, e) => {
        console.log(e.target.value);
        console.log(key);
        console.log(questions[key]);
        questions[key].Answer = e.target.value;
        console.log(questions[key]);
    }

    const handleDisable = (e) => {
        e.preventDefault();
        setEdit(true);
    }

    useEffect(() => {

        if (doc.doc.id !== undefined) {
            fetchQuestions();
        }
    }, [edit, setEdit, doc, setQuestions])


    return (
        <div>
            <center><h2>{doc.doc.docType}</h2></center>
            {Object.keys(questions).map(key => {
                return <div className='question' key={key}>
                    <h4>{questions[key].NumQ}  {questions[key].Question}</h4>
                    <hr />
                    <div>
                        <form onChange={(e)=>handleChange(key,e)}>
                            {questions[key].Type === 'R' ?
                                <div> 
                                    <div>{questions[key].AiAnswer}</div>
                                    <label>Yes</label>
                                    <input type='radio' name={key} value={'yes'} defaultChecked={questions[key].Answer === 'True'?true:false} />
                                    <label>No</label>
                                    <input type='radio' name={key} value={'no'} defaultChecked={questions[key].Answer === 'False'?true:false} />
                                    <p>{questions[key].AnswerType === 'H' ? '100%' : ''}</p>
                                </div>
                                : 
                                <div>
                                    <input type='text' name={key[2]} disabled={true} value={questions[key].Answer? questions[key].Answer : ''} />
                                    <p>{questions[key].AnswerType === 'H' ? '100%' : ''}</p>
                                    <button onClick={handleDisable}>Edit</button>
                                </div>
                            }
                        </form>
                    </div>
                </div>
                })
            }
        </div>
    )
}

export default Documents;