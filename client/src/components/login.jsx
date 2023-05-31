import './styles/login.css';
import { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import userPhoto from '../samples/usr.png';
import pwdPhoto from '../samples/pwd.png';


function Login() {
    const [userLogin, setUserLogin] = useState({
        usr: "",
        pwd: ""
    });
    const {login, user, setUser} = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const handleChange = (e) => {
        const {name, value} = e.target;
        setUserLogin({
            ...userLogin,
            [name]: value
        });
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!userLogin.usr || !userLogin.pwd) {
            setError("Username is required");
            return;
        } 
        const data = {
            username: userLogin.usr,
            password: userLogin.pwd
        }
        try {
            await login(data);
            navigate('/projects');
        } catch (error) {
            setError(error.message);
        }
    }


    return (
        <div className='loginDiv'>
            <form onSubmit={handleSubmit}>
                {error && <div>{error}</div>}
                <span>
                    <figure>
                        <img src={userPhoto} alt="usr" />
                    </figure>
                    <input type="text" name="usr" placeholder="Username" onChange={handleChange}/>
                </span>
                <br/>
                <span>
                    <figure>
                        <img src={pwdPhoto} alt="pwd" />
                    </figure>
                    <input type="password" name="pwd" placeholder="Password" onChange={handleChange}/>
                </span>
                <a className='forgot' href="/">Forgot password?</a>
                <br/>
                <button>Login</button>
                <Link className='signup' to={'/signup'}>Sign up</Link>
            </form>
        </div>
    )
}

export default Login;