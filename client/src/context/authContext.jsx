import { createContext,useContext, useState } from "react";
import axios from 'axios';
export const authContext = createContext();

export const useAuth = () => {
    const context = useContext(authContext);
    if (!context) throw new Error('There is not AuthProvaider');
    return context;
}


const client = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
});

export function AuthProvider({children}) {
    const [loading, setLoading] = useState(true);

    const [user, setUser] = useState({
        loged: false,
        data: [],
        dili: ''
    });
    
    const login =  (data) => {
        if (user.loged) return console.log("User is already loged");
        return client.post('login/', data)
            .then(res => {
                if (res.status !== 202) throw new Error(res.data['error']);
                setUser({...user, loged: true, data : res.data});
            })
            .catch(err => {
                throw new Error(err);
            });
    }

    const logout = () => {
        if (!user.loged) return console.log("User is not loged");
        return client.post('logout/')
            .then(res => {
                console.log(res);
            })
    }

    const signup = (data) => {
        console.log(data);
        return axios.post('http://127.0.0.1:8000/api/register/', data)
    }

    return (
        <authContext.Provider value={{login,logout, user, setUser, signup, client}}>
            {children}
        </authContext.Provider>
    )
}