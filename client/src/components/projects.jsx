import './styles/projects.css';
import { useAuth } from '../context/authContext';
import { Link } from 'react-router-dom';
import Header from './header';
import axios from 'axios';
import { useEffect, useState } from 'react';
import New from './new';

function Projects() {
    const [diligences, setDiligences] = useState([]);
    const [newDili, setNewDili] = useState(false);

    const fetchDiligences = async () => {
        try {
            await axios.get('http://127.0.0.1:8000/api/diligences/')
                .then(res => {
                setDiligences(res.data.diligences);
            })
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchDiligences();
    }, [newDili, setNewDili])

    const handleOrder = (e) => {
        diligences.sort((a, b) => {
            if (e.target.value === 'date') {
                return new Date(a.date) - new Date(b.date);
            } else if (e.target.value === 'name') {
                return a.dili_name.localeCompare(b.dili_name);
            }
        })
        setDiligences([...diligences]);
    }

    const handleSearch = (e) => {
        if (e.target.value === '') {
            fetchDiligences();
        } else {
            setDiligences(diligences.filter(diligence => {
                return diligence.dili_name.toLowerCase().includes(e.target.value.toLowerCase());
            }))
        }
    }

    return (
        <div className='projects'>
            <Header />
            <div style={{display: !newDili?'none': 'unset'}}><New setNewDili={setNewDili} /></div>
            <main>
                <h2>Project</h2>
                <span className='searchBar'>
                    <Link onClick={() => {setNewDili(true)}}>New project</Link>
                    <div>
                        <input type="text" placeholder='Search' onChange={handleSearch}/>
                    </div>
                </span>
                <span>
                    <p>Order by</p>
                    <select name="orderby" id="orderby" onChange={handleOrder}>
                        <option value="default"></option>
                        <option value="date">Date</option>
                        <option value="name">Name</option>
                    </select>
                </span>
                {diligences?
                    <div className='diliGrid'>
                        {diligences.map(diligence => {
                            return <Diligence  diligence={diligence} fetchDiligences={fetchDiligences} key={diligence.id}/> 
                        })}
                    </div>
                    :
                    <center><h4>No diligences found</h4></center>
                } 
            </main>
        </div>
    )
}



function Diligence({diligence, fetchDiligences}) {
    const {user, setUser} = useAuth();
    const [settings, setSettings] = useState(false);
    const [editDili, setEditDili] = useState(false);

    const handleEdit = (dili) => {
        setEditDili(true);
    }

    const handleDelete = async (dili) => {
        window.confirm('Are you sure you want to delete this project?');
        await axios.delete(`http://127.0.0.1:8000/api/diligences/${dili}`)
                .then(res => {
                    console.log(res);
            });
        fetchDiligences();
    }

    useEffect(() => {
        fetchDiligences();
    }, [editDili, setEditDili])

    return (
        <div className='diligence'>
            <div style={{display: !editDili?'none': 'unset', color: 'black'}}><New setNewDili={setEditDili} edit={true} dili={[diligence.id, diligence.dili_name]} /></div>
            <figure>
                <img src='https://img.icons8.com/material-rounded/24/ffffff/menu-2.png' onClick={() => {setSettings(!settings)}} alt='settings'/>
                <div className='diliSettings' style={{display: settings?'flex':'none'}}>
                    <p onClick={() => handleEdit(diligence.id)}>Edit</p>
                    <p onClick={() => handleDelete(diligence.id)}>Delete</p>
                </div>
            </figure>
            <Link to={'/dili'}  onClick={()=>{setUser({...user, dili: diligence})}}>
                <h3>{diligence.dili_name.toUpperCase()}</h3>
            </Link>
            <p>{new Date(diligence.date).toLocaleString()}</p>
        </div>
    )
}

export default Projects;