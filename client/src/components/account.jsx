import './styles/account.css';
import Header from './header';
import { useAuth } from '../context/authContext';
import { useState } from 'react';
import axios from 'axios';


function Account() {
    const {user, setUser} = useAuth();
    const [error, setError] = useState("");
    const [userData, setUserData] = useState(user.data);

    const handleChange = (e) => {
        const {name, value} = e.target;

        if (!value) {
            setError("All fields are required");
        } else if (name === "email" && !value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i)) {
            setError("Invalid email");
        } else {
            setError("");
        }
        
        setUserData({
            ...userData,
            [name]: value
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (user.data === userData) {
            setError("No changes");
            return;
        }

        const {name, value} = e.target;
        setUserData({
            ...userData,
            [name]: value
        });

        const data = {
            id: user.data.id,
            first_name: userData.first_name,
            last_name: userData.last_name,
            username: userData.username,
            email: userData.email
        }
        APIAccount(data);
    }

    const APIAccount = async (data) => {
        try {
            await axios.put('http://127.0.0.1:8000/api/users/', data)
            .then(res => {
                user.data = res.data.user;
                setUser({...user});
            })
        } catch (error) {
            setError(error.message);
        }
    }

    return (
        <div className="account">
            <Header />
            <main>
                <h2>Account</h2>
                <form onSubmit={handleSubmit}>
                    <h2>User Data</h2>
                    <span>
                        <label htmlFor="first_name">First name</label>
                        <input type="text" name="first_name" id="first_name" placeholder="First name" defaultValue={user.data.first_name} onChange={handleChange} />
                    </span>
                    <span>
                        <label htmlFor="last_name">Last name</label>
                        <input type="text" name="last_name" id="last_name" placeholder="Last name" defaultValue={user.data.last_name} onChange={handleChange} />
                    </span>
                    <span>
                        <label htmlFor="username">Username</label>
                        <input type="text" name="username" id="username" placeholder="Username" defaultValue={user.data.username} onChange={handleChange} />
                    </span>
                    <span>
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" id="email" placeholder="Email" defaultValue={user.data.email} onChange={handleChange} />
                    </span>
                    <span>
                        <p>{error?error:''}</p>
                        <button>Update</button>
                    </span>
                </form>
            </main>
        </div>
    )
}

export default Account;