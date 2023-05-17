import './styles/login.css';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';

function Signup() {
    const [userRegister, setUserRegister] = useState({
        usr: "",
        pwd: "",
        pwd2: "",
        email: "",
        firstName: "",
        lastName: ""

    });
    const { user, signup, login} = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const {name, value} = e.target;
        setUserRegister({
            ...userRegister,
            [name]: value
        });
        if (name === "pwd2" && value !== userRegister.pwd) {
            setError("Passwords don't match");
            return;
        } else
        if (name === "pwd" && value.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        } else {
            setError("");
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(userRegister);
        if (!userRegister.firstName || !userRegister.email || !userRegister.usr || !userRegister.pwd) {
            setError("All fields are required");
            return;
        }
        const data = {
            username: userRegister.usr,
            password: userRegister.pwd,
            password2: userRegister.pwd2,
            first_name: userRegister.firstName,
            last_name: userRegister.lastName,
            email: userRegister.email
        }
        try {
            console.log(await signup(data));
            await login(data);
            navigate('/projects');
        } catch (error) {
            console.log(error.response.data);
            setError(error.response.data.data);
        }
    }
    return (
        <div className='loginDiv'>
            <form onSubmit={handleSubmit}>
                {error && <div>{error}</div>}
                <span>
                    <input type="text" name="firstName" placeholder="First name" required onChange={handleChange}/>
                </span>
                <span>
                    <input type="text" name="lastName" placeholder="Last name" onChange={handleChange}/>
                </span>
                <span>
                    <input type="email" name="email" placeholder="Email" required onChange={handleChange}/>
                </span>
                <span>
                    <input type="text" name="usr" placeholder="Username" required onChange={handleChange}/>
                </span>
                <span>
                    <input type="password" name="pwd" placeholder="Password" required onChange={handleChange}/>
                </span>
                <span>
                    <input type="password" name="pwd2" placeholder="Repeat password" required onChange={handleChange}/>
                </span>
                <button>Sign up</button>
                <Link className='signup' to={'/'}>Login</Link>
            </form>
        </div>
    )
}

export default Signup;