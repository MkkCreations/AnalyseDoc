import './styles/dashboard.css';
import Header from './header';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';


function Dashboard() {
    const {user} = useAuth();


    return (
        <div className='dashboard'>
            <Header />
            <main>
                <h2><Link to={'/projects'}>Projects</Link> - Dashboard({user.dili.dili_name})</h2>
                <section>
                    <h3>Avancement de l'analyse</h3>
                    <div className='progress'>
                        <div className='progress-bar' style={{width: '25%'}}>
                        </div>
                    </div>
                    <div className='circle-progress'>
                        <div className='cercle-progres-bar' style={{width: '25%'}}>
                        </div>
                    </div>

                    <h3>Total reponses</h3>

                    <div className='total-reponses'>
                        <div className='total-reponses-item'>
                            <h4>Wolfsberg</h4>
                            <p>0/27</p>
                        </div>
                        <div className='total-reponses-item'>
                            <h4>KBIS</h4>
                            <p>0/6</p>
                        </div>
                        <div className='total-reponses-item'>
                            <h4>ESMA</h4>
                            <p>0/4</p>
                        </div>
                        <div className='total-reponses-item'>
                            <h4>SIRENE</h4>
                            <p>0/5</p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}

export default Dashboard;