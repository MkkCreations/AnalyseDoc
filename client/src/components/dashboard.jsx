import './styles/dashboard.css';
import Header from './header';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { useEffect, useState } from 'react';


function Dashboard() {
    const {user, client} = useAuth();
    const [data, setData] = useState();

    const getData = async () => {
        try {
            client.get(`dashboard/${user.dili.id}/`)
            .then((res) => {
                console.log(res);
                setData(res.data);
            }
            )
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getData();
    }, [])

    return (
        <div className='dashboard'>
            <Header />
            <main>
                <h2><Link to={'/projects'}>Projects</Link> - Dashboard({user.dili.dili_name})</h2>
                <section>
                    <h3>Analyse progress</h3>
                    <div className='progress'>
                        <div className='progress-bar' style={{width: data?`${(data.total_res/data.total_q)*100}%`:'0', backgroundColor: data?(data.total_res/data.total_q)<0.5?'#8245a6':'':''}}>
                            <p style={{color: '#fff', fontWeight: 'bold'}}>{data?((data.total_res/data.total_q)*100).toFixed(1).toString():0}%</p>
                        </div>
                    </div>
                    {
                        data && data.total_res?
                        <div className='graphics'>
                            <h3>Type of responses</h3>
                            <hr />
                            <p className='definition'>Percentage of how many questions were answered by the AI and how many by human</p>
                            <p className='definition'>ex: <b>ai_answers / total_answers</b></p>
                            <div>
                                <p>Total response: <b>{data.total_res}</b></p>
                                <div>
                                    <ProgressBar progress={((data.total_ai_res/data.total_res)*100).toFixed(1)} label={"AI"} size={250} indicatorWidth={30} trackWidth={30} />
                                    <ProgressBar progress={((data.total_human_res/data.total_res)*100).toFixed(1)} label={"Human"} size={250} indicatorWidth={30} trackWidth={30} indicatorColor={'#8245a6'} />
                                </div>
                            </div>
                            <h3>Documents</h3>
                            <hr />
                            <p className='definition'>Here you can find how many documents has been given and the percentage of the number os answeres were find by each document</p>
                            <p className='definition'>ex: <b>wolfsberg_answers / total_answers</b></p>
                            <div>
                                <p >Total documents: <b>{data.total_docs}</b></p>
                                <div>
                                    <ProgressBar progress={((data.docs.Wolfsberg/data.total_res)*100).toFixed(1)} label={"Wolfsberg"}  indicatorColor={(data.docs.Wolfsberg/data.total_res) < 0.5?'#8245a6':'#07c'} />
                                    <ProgressBar progress={((data.docs.KBIS/data.total_res)*100).toFixed(1)} label={"KBIS"} indicatorColor={(data.docs.KBIS/data.total_res) < 0.5?'#8245a6':'#07c'}/>
                                    <ProgressBar progress={((data.docs.ESMA/data.total_res)*100).toFixed(1)} label={"ESMA"} indicatorColor={(data.docs.ESMA/data.total_res) < 0.5?'#8245a6':'#07c'}/>
                                    <ProgressBar progress={((data.docs.SIRENE/data.total_res)*100).toFixed(1)} label={"SIRENE"} indicatorColor={(data.docs.SIRENE/data.total_res) < 0.5?'#8245a6':'#07c'}/>
                                    <ProgressBar progress={((data.docs.MiFID2/data.total_res)*100).toFixed(1)} label={"MiFID2"} indicatorColor={(data.docs.MiFID2/data.total_res) < 0.5?'#8245a6':'#07c'}/>
                                </div>
                            </div>
                            <h3>Acceptations</h3>
                            <hr />
                            <p className='definition'>Find the total of answers that you accepted, rejected or thes which aren't accepted or rejected</p>
                            <div>
                                <div>
                                    <ProgressBar progress={((data.total_res_accepted/data.total_q)*100).toFixed(1)} label={"Accepted"} indicatorColor={(data.total_res_accepted/data.total_q) < 0.5?'#8245a6':'#07c'} />
                                    <ProgressBar progress={((data.total_res_rejected/data.total_q)*100).toFixed(1)} label={"Rejected"} indicatorColor={(data.total_res_rejected/data.total_q) < 0.5?'#8245a6':'#07c'} />
                                    <ProgressBar progress={((data.total_res_pending/data.total_q)*100).toFixed(1)} label={"Pending"} indicatorColor={(data.total_res_pending/data.total_q) < 0.5?'#8245a6':'#07c'} />
                                </div>
                            </div>
                        </div>
                        :
                        <div className='graphics'><div><center>No data found</center></div></div>
                    }

                </section>
            </main>
        </div>
    )
}

export default Dashboard;


const ProgressBar = (props) => {
    const {
      size = 150,
      progress = 0,
      trackWidth = 10,
      trackColor = `#44444444`,
      indicatorWidth = 10,
      indicatorColor = `#07c`,
      indicatorCap = `round`,
      label = 'text',
      labelColor = `#333`,
      spinnerMode = false,
      spinnerSpeed = 1
    } = props
  
    const center = size / 2,
          radius = center - (trackWidth > indicatorWidth ? trackWidth : indicatorWidth),
          dashArray = 2 * Math.PI * radius,
          dashOffset = dashArray * ((100 - progress) / 100)
  
    let hideLabel = (size < 100 || !label.length || spinnerMode) ? true : false
  
    return (
      <>
        <div
          className="svg-pi-wrapper"
          style={{ width: size, height: size }}
        >
          <svg
            className="svg-pi" 
            style={{ width: size, height: size }}
          >
            <circle
              className="svg-pi-track"
              cx={center}
              cy={center}
              fill="transparent"
              r={radius}
              stroke={trackColor}
              strokeWidth={trackWidth}
            />
            <circle
              className={`svg-pi-indicator ${
                spinnerMode ? "svg-pi-indicator--spinner" : ""
              }`}
              style={{ animationDuration: spinnerSpeed * 1000 }}
              cx={center}
              cy={center}
              fill="transparent"
              r={radius}
              stroke={indicatorColor}
              strokeWidth={indicatorWidth}
              strokeDasharray={dashArray}
              strokeDashoffset={dashOffset}
              strokeLinecap={indicatorCap}
            />
          </svg>
  
          {!hideLabel && (
            <div 
              className="svg-pi-label" 
              style={{ color: labelColor }}
            >
              <span className="svg-pi-label__loading">
                {label}
              </span>
  
              {!spinnerMode && (
                <span className="svg-pi-label__progress">
                  {`${
                    progress > 100 ? 100 : progress
                  }%`}
                </span>
              )}
            </div>
          )}
        </div>
      </>
    )
  }