import './styles/documents.css';
import './styles/preview.css';
import { useAuth } from "../context/authContext";
import { Question } from './model/Question';
import { Link } from 'react-router-dom';
import Header from "./header";
import { useEffect, useState } from 'react';
import NewDoc from './newDoc';
import PopUpInfo from './popUpInfo';

function Documents() {
    const {user, client} = useAuth();
    const [docs, setDocs] = useState([{}]);
    const [newDoc, setNewDoc] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState();
    const [loading, setLoading] = useState(false);

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
        setSelectedDoc(doc);
    }

    useEffect(() => {
        getDocs();
    }, [newDoc, setNewDoc, loading])

    return (
        <div className="documents">
            <Header />
            {
                !newDoc? '':
                <NewDoc setNewDoc={setNewDoc} docs={docs} edit={false} docData={[]} setLoading={setLoading} />
            }
            <main>
                <h2><Link to={'/projects'}>Projects</Link> - Documents({user.dili.dili_name})</h2>

                <section>
                    <span className='docs'>
                        <div>
                            <h4 onClick={() => {setSelectedDoc('');setNewDoc(!newDoc)}}>New document</h4>
                            <div>
                                <p>{docs? (docs.length/4)*100+'%':'---'}</p>
                            </div>
                        </div>
                        <div>
                            { docs[0] === undefined? <center><p>No documents</p></center>:
                                docs.map(doc => {
                                    return <section className='docLink' onClick={() => {handleShowDoc(doc)}} ><DocField doc={doc} key={doc.id} getDocs={getDocs} setSelectedDoc={setSelectedDoc} docs={docs} setLoading={setLoading}/></section>
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
            {
                !loading? '':
                <PopUpInfo loading={loading} />
            }
        </div>
    )
}

function DocField({doc, getDocs, setSelectedDoc, docs, setLoading}) {
    const {user, client} = useAuth();
    const [settings, setSettings] = useState(false);
    const [editDoc, setEditDoc] = useState(false);

    const handleEdit = (document) => {
        setEditDoc(true);
        return (
            <NewDoc setNewDoc={setEditDoc} edit={true} docData={document} docs={docs} setLoading={setLoading}/>
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
        setSelectedDoc('');
    }

    useEffect(() => {
        getDocs();
    }, [editDoc, setEditDoc, setSettings, settings])

    return (
        <article key={doc.id}>
            <div onClick={() => {setSelectedDoc(doc)}}>
                <span style={{display: !editDoc?'none': 'unset'}}><NewDoc setNewDoc={setEditDoc} edit={true} docData={doc} setLoading={setLoading}/></span>
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
    const [fetch, setFetch] = useState(false);


    const fetchQuestions = async () => {
        setQuestions({});
        try {
            await client.get(`answers/${user.dili.id}/${doc.doc.id}`)
                .then(res => {
                    let questionsTemp = {};
                    for (const key in res.data.data) {
                        const question = new Question(res.data.data[key][0].id_q, res.data.data[key][0].num_q, res.data.data[key][0].question, res.data.data[key][0].type, res.data.data[key][0].parent, res.data.data[key][1].id_res, res.data.data[key][1].ai_res, res.data.data[key][1].answer, res.data.data[key][1].answer_type, Number(res.data.data[key][1].ai_confidence).toFixed(0), res.data.data[key][1].document_name, res.data.data[key][1].ai_res_accepted, res.data.data[key][2]);
                        questionsTemp[key] = question;
                    }
                    setQuestions({...questionsTemp});
                })
        } catch (error) {
            console.log(error);
        }
    }


    const handleChange = (key, e) => {
        questions[key].Answer = e.target.value;
    }
    const handleAccept = (key, e) => {
        e.preventDefault();
            
        const answer = {
            id: questions[key].IdAnswer,
            res_acceptation: 1
        }
        putAnswer(answer);
    }

    const handleDelete = (key, e) => {
        e.preventDefault();
        
        const answer = {
            id: questions[key].IdAnswer,
            res_acceptation: -1
        }
        putAnswer(answer);
        e.target.form[0].value = '';
    }

    const putAnswer = async (answer) => {
        setFetch(true);
        try {
            await client.put('answers/', answer)
        } catch (error) {
            console.log(error);
        }
        setFetch(false);
    }

    useEffect(() => {
        setQuestions({});
        if (doc.doc.id !== undefined) {
            fetchQuestions();
        }
    }, [edit, setEdit, doc])


    return (
        <div>
            <center><h2>{doc.doc.docType}</h2></center>
            {Object.keys(questions).map(key => {
                return <div className='question' key={key}>
                    <h4>{questions[key].NumQ}  {questions[key].Question}</h4>
                    <hr />
                    <div>
                        <form onChange={(e)=>handleChange(key,e)}>
                            {questions[key].Type === 'C'?
                                <div className='checkbox'>
                                    { questions[key].AiAnswer?
                                        <input type="text" defaultValue={questions[key].AiAnswer} />
                                        :
                                        ''
                                    }
                                    {Object.values(questions[key].checkboxs).map(
                                        (checkbox, index) => {
                                            return <div key={index}>
                                                <input type='checkbox' name={checkbox.num_q} value={checkbox.data_q} defaultChecked={questions[key].AiAnswer? questions[key].AiAnswer.includes(checkbox.data_q)?true:false: questions[key].Answer? questions[key].Answer.includes(checkbox.data_q)?true:false:false} />
                                                <label>{checkbox.data_q}</label>
                                            </div>
                                        }
                                    )}
                                </div>
                                :
                                ''
                            }
                            {questions[key].Type === 'R' ?
                                <div> 
                                    <label>Yes</label>
                                    <input type='radio' name={key} value={'yes'} defaultChecked={(questions[key].Answer? questions[key].Answer: questions[key].AiAnswer) === 'yes' ?true:false} />
                                    <label>No</label>
                                    <input type='radio' name={key} value={'no'} defaultChecked={(questions[key].Answer? questions[key].Answer: questions[key].AiAnswer) === 'no'?true:false} />
                                    <p>{questions[key].AiConfidence? questions[key].AiConfidence+'%' : 0+'%'}</p>
                                    <p>{questions[key].documentName}</p>
                                    <p>{questions[key].resAccepted === 1?'Accepted':''}</p>
                                </div>
                                :
                                ''
                            }
                            {questions[key].Type === 'T' ?
                                <div>
                                    <input type='text' name={key[2]} defaultValue={questions[key].Answer? questions[key].Answer : questions[key].AiAnswer} />
                                    <p>{questions[key].AiConfidence? questions[key].AiConfidence+'%' : 0+'%'}</p>
                                    <p>{questions[key].documentName}</p>
                                    <p>{questions[key].resAccepted === 1?'Accepted':''}</p>
                                </div>
                                :
                                ''
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