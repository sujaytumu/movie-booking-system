import { createContext } from "react";
import { useContext } from "react";
import {useLocation,useNavigate} from 'react-router-dom'
import axios from "axios";
import { useState } from "react";
import {toast} from 'react-hot-toast'
import {useAuth, useUser} from '@clerk/clerk-react'
import { useEffect } from "react";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const AppContext = createContext();

export const AppProvider = (props) => {
     const [isAdmin,setisAdmin] = useState(false);
     const [shows,setShows] = useState([]);
     const [favorites,setFavorites] = useState([]);

     const {user} = useUser();
     const {getToken} = useAuth();
     const location = useLocation();
     const navigate = useNavigate();

     const fetchisAdmin = async() => {
        try {
            const {data} = await axios.get('/api/admin/isAdmin', {
            headers : {
                Authorization : `Bearer ${await getToken()}`
            }})
            setisAdmin(data.isAdmin);

            if(!data.isAdmin && location.pathname.startsWith('/admin')) {
                navigate('/');
                toast.error('You are not authorized to access admin panel');
            }
        } catch (error) {
            console.log(error);
        }
     }

     const fetchshows = async() => {
        try {
            const {data} = await axios.get('/api/show/getmovies')
            if(data.success) {
                setShows(data.shows);
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error);
        }
     }

     const fetchfavorites = async() => {
        try {
            const {data} = await axios.get('/api/user/getfavorites',{
            headers : {
                Authorization : `Bearer ${await getToken()}`
            }})

            if(data.success) {
                setFavorites(data.movies)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error);
        }
     }
    
     useEffect(() => {
         if(user) {
            fetchisAdmin();
            fetchfavorites();
         }
     },[user])

     useEffect(() => {
        fetchshows();
     },[])

    return <AppContext.Provider value = {{axios,user,navigate,isAdmin,fetchisAdmin,getToken,fetchfavorites,favorites,setFavorites,shows}}>
        {props.children}
    </AppContext.Provider>
}

export const useAppContext = () => useContext(AppContext);