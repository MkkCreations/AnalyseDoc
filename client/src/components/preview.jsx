import './styles/preview.css';
import { useAuth } from '../context/authContext';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './header';
import { Question } from './model/Question';

function Preview() {
    const {user, client} = useAuth();
    const [questions, setQuestions] = useState({});
    const [search, setSearch] = useState(false);

    const fetchQuestions = async () => {
        try {
            await client.get(`answers/${user.dili.id}/0`)
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

    const handleSearch = (e) => {
        if (e.target.value === '') {
            fetchQuestions();
        } else {
            setSearch(true);
            Object.keys(questions).map(key => {
                if (!questions[key].NumQ.toLowerCase().includes(e.target.value.toLowerCase()) && !questions[key].Question.toLowerCase().includes(e.target.value.toLowerCase())) {
                    delete questions[key];
                }
                return null;
            }
            )
            setQuestions({...questions});
        }
        search === true && e.target.value === '' && setSearch(false);
    }

    const handleFilter = (e) => {
        if (e.target.value === 'nonAnswered') {
            Object.keys(questions).map(key => {
                if (questions[key].Answer !== null || questions[key].AiAnswer !== null) {
                    delete questions[key];
                }
                return '';
            }
            )
            setQuestions({...questions});
        } else if (e.target.value === 'answered') {
            Object.keys(questions).map(key => {
                if (questions[key].Answer === null || questions[key].AiAnswer === null) {
                    delete questions[key];
                }
                return '';
            }
            )
            setQuestions({...questions});
        } else {
            fetchQuestions();
        }
    }

    const handleChange = (key, e) => {
        if (questions[key].Type === 'R') {
            if (e.target.value === 'yes') {
                questions[key].Answer = true;
                questions[key].AnswerType = 'H';
            } else {
                questions[key].Answer = false;
                questions[key].AnswerType = 'H';
            }
        } else {
            questions[key].Answer = e.target.value;
            questions[key].AnswerType = 'H';

        }
        const answer = {
            id: questions[key].IdAnswer,
            answer: questions[key].Answer,
            id_dili: user.dili.id
        }
        putAnswer(answer);

        console.log(questions);
        setQuestions({...questions});
    }

    const handleAccept = (key, e) => {
        e.preventDefault();
        
        const answer = {
            id: questions[key].IdAnswer,
        }
        putAnswer(answer);
    }

    const putAnswer = async (answer) => {
        try {
            await client.put('answers/', answer)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (!search) fetchQuestions();
    }, [search, questions]);

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
                                <option value="nonAnswered">Not answered</option>
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
                    <div>
                       {Object.keys(questions).map(key => {
                            return <div className='question' key={key}>
                                <h4>{questions[key].NumQ}  {questions[key].Question}</h4>
                                <hr />
                                <div>
                                    <form onChange={(e)=>handleChange(key,e)}>
                                        {questions[key].Type === 'R' ?
                                            <div> 
                                                <label>Yes</label>
                                                <input type='radio' name={key} value={'Yes'} defaultChecked={questions[key].AiAnswer? questions[key].AiAnswer: questions[key].Answer === 'Yes'?true:false} />
                                                <label>No</label>
                                                <input type='radio' name={key} value={'No'} defaultChecked={questions[key].AiAnswer? questions[key].AiAnswer: questions[key].Answer === 'No'?true:false} />
                                                <p>{questions[key].AiConfidence? questions[key].AiConfidence+'%' : 0+'%'}</p>
                                            </div>
                                            : 
                                            <div>
                                                <input type='text' name={key[2]} defaultValue={questions[key].Answer? questions[key].Answer : questions[key].AiAnswer} />
                                                <p>{questions[key].AiConfidence? questions[key].AiConfidence+'%' : 0+'%'}</p>
                                                <p>{questions[key].documentName}</p>
                                                <button onClick={(e) => handleAccept(key, e)} style={{display: questions[key].AiConfidence===100?'none':'unset'}}>Accept</button>
                                                <button onClick={(e) => handleAccept(key, e)} style={{display: questions[key].AiConfidence===100?'unset':'none'}}>Delete</button>
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
                    <a href={`http://127.0.0.1:8000/api/mapping/${user.dili.id}/`}>Download I.C.I</a>
                </div>
            </main>
        </div>
    );
}

export default Preview;