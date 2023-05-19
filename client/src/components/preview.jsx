import './styles/preview.css';
import { useAuth } from '../context/authContext';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from './header';
import { Question } from './model/Question';

function Preview() {
    const {user} = useAuth();
    const [questions, setQuestions] = useState({});
    const [edit, setEdit] = useState(false);


    const fetchQuestions = async () => {
        try {
            await axios.get(`http://127.0.0.1:8000/api/answers/${user.dili.id}`)
                .then(res => {
                    console.log(res.data.data);
                    for (const key in res.data.data) {
                        const question = new Question(res.data.data[key][0].id_q, res.data.data[key][0].num_q, res.data.data[key][0].question, res.data.data[key][0].type, res.data.data[key][0].parent, res.data.data[key][1].id_res, res.data.data[key][1].ai_res, res.data.data[key][1].answer, res.data.data[key][1].answer_type);
                        questions[key] = question;
                    }
                    setQuestions({...questions});
                    console.log(questions);
            })
        } catch (error) {
            console.log(error);
        }
    }

    const handleSearch = (e) => {
        if (e.target.value === '') {
            fetchQuestions();
        } else {
            Object.keys(questions).map(key => {
                if (!questions[key].getNumQ().toLowerCase().includes(e.target.value.toLowerCase()) && !questions[key].getQuestion().toLowerCase().includes(e.target.value.toLowerCase())) {
                    delete questions[key];
                }
                return null;
            }
            )
            setQuestions({...questions});
        }
    }

    const handleFilter = (e) => {
        if (e.target.value === 'nonAnswered') {
            Object.keys(questions).map(key => {
                if (questions[key].getAnswer() !== null) {
                    delete questions[key];
                }
            }
            )
            setQuestions({...questions});
        } else if (e.target.value === 'answered') {
            Object.keys(questions).map(key => {
                if (questions[key].getAnswer() === null) {
                    delete questions[key];
                }
            }
            )
            setQuestions({...questions});
        } else {
            fetchQuestions();
        }
    }

    const handleChange = (key, e) => {
        if (questions[key].getType() === 'R') {
            if (e.target.value === 'yes') {
                questions[key].setAnswer(true);
                questions[key].setAnswerType('H');
            } else {
                questions[key].setAnswer(false);
                questions[key].setAnswerType('H');
            }
        } else {
            questions[key].setAnswer(e.target.value);
            questions[key].setAnswerType('H');

        }
        const answer = {
            id: questions[key].getIdAnswer(),
            answer: questions[key].getAnswer(),
            answer_type: questions[key].getAnswerType(),
            id_q: questions[key].getId(),
            id_dili: user.dili.id
        }
        putAnswer(answer);

        console.log(questions);
        setQuestions({...questions});
    }

    const handleDisable = (e) => {
        e.preventDefault();
        e.target.form[0].disabled = !e.target.form[0].disabled;
        e.target.form[1].innerHTML = e.target.form[1].innerHTML === 'Edit' ? 'Save' : 'Edit';
        setEdit(!edit);
    }

    const putAnswer = async (answer) => {
        try {
            await axios.put('http://127.0.0.1:8000/api/answers/', answer)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchQuestions();
    }, []);

    return (
        <div className="preview">
            <Header />
            <main>
                <h2><Link to={'/projects'}>Projects</Link> - Preview({user.dili.dili_name})</h2>
                <span>
                    <div>
                        <div className='filterBy'>
                            <select name="orderby" id="orderby" onChange={handleFilter}>
                                <option value="default"></option>
                                <option value="answered">Answered</option>
                                <option value="nonAnswered">No answered</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <input type="text" placeholder='Search' onChange={handleSearch}/>
                    </div>
                </span>
                <div className='iciQ'>
                    <span>
                        <h3>I.C.I Review</h3>
                        <hr />
                    </span>
                    {/* <div>
                       {Object.keys(ici).map(key => {
                            return <div key={key}>
                                <h4>{key} {ici[key][0][0]}</h4>
                                <div>
                                    <form onChange={(e)=>handleChange(key,e)}>
                                        {ici[key][0][1] === 'R' ?
                                            <div> 
                                                <div>{ici[key][1][0]}</div>
                                                <label>Yes</label>
                                                <input type='radio' name={key} value={'yes'} />
                                                <label>No</label>
                                                <input type='radio' name={key} value={'no'} />
                                            </div>
                                            : 
                                            <div>
                                                <input type='text' name={key[2]} disabled={true} />
                                                <button onClick={handleDisable}>Edit</button>
                                            </div>
                                        }
                                    </form>
                                </div>
                            </div>
                          })
                       }
                    </div> */}
                    <div>
                       {Object.keys(questions).map(key => {
                            return <div className='question' key={key}>
                                <h4>{questions[key].getNumQ()}  {questions[key].getQuestion()}</h4>
                                <hr />
                                <div>
                                    <form onChange={(e)=>handleChange(key,e)}>
                                        {questions[key].getType() === 'R' ?
                                            <div> 
                                                <div>{questions[key].getAiAnswer()}</div>
                                                <label>Yes</label>
                                                <input type='radio' name={key} value={'yes'} defaultChecked={questions[key].getAnswer() === 'True'?true:false} />
                                                <label>No</label>
                                                <input type='radio' name={key} value={'no'} defaultChecked={questions[key].getAnswer() === 'False'?true:false} />
                                                <p>{questions[key].getAnswerType() === 'H' ? '100%' : ''}</p>
                                            </div>
                                            : 
                                            <div>
                                                <input type='text' name={key[2]} disabled={true} value={questions[key].getAnswer()? questions[key].getAnswer() : ''} />
                                                <p>{questions[key].getAnswerType() === 'H' ? '100%' : ''}</p>
                                                <button onClick={handleDisable}>Edit</button>
                                            </div>
                                        }
                                    </form>
                                </div>
                            </div>
                          })
                       }
                    </div>
                </div>
                <div className='btnDwn'>
                    <button>Download I.C.I</button>
                </div>
            </main>
        </div>
    );
}

export default Preview;