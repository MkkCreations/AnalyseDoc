import './styles/navDili.css';
import logoutIcon from '../samples/log-out1.png';
import closeIcon from '../samples/close.png';
import { useAuth } from '../context/authContext';
import { Link, useMatch, useResolvedPath } from 'react-router-dom';
import { useState } from 'react';

function NavDiligence() {
    const {user} = useAuth();
    const [menu, setMenu] = useState(false);

    const handleMenu = () => {
        setMenu(!menu);
    }

    return (

        <div className='navDiliApp' style={{width: menu&&window.visualViewport.width < 550?'40%':''}}>
            <div className='hamburger' >
                <span className='close' style={{display: menu?'unset':'none'}}>
                    <img src={closeIcon} alt='close' onClick={handleMenu}/>
                </span>
                <div onClick={handleMenu} style={{display: !menu?'flex':'none', padding: menu?'50px 0 0':''}}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <figure style={{display: !menu?'unset':'none'}}>
                    <img src={logoutIcon} alt='logout' />
                </figure>
            </div>
            <div className='navDili' style={{display:menu?'flex':''}}>
                <span>
                    <div className='navHeaderDili'>
                        <h1>{user.dili.dili_name}</h1>
                    </div>
                    <CustomLink to={`/dili`}>Preview</CustomLink>
                    <CustomLink to={`/dili/docs`}>Documents</CustomLink>
                </span>
                <span>
                    <CustomLink to='/projects'>Projects</CustomLink>
                    <CustomLink to='/account'>Account</CustomLink>
                    <CustomLink to='/' >Logout</CustomLink>
                </span>
            </div>
        </div>
    )
}

function CustomLink({to, children, ...props}) {
    const resolvedPath = useResolvedPath(to)
    const isActive = useMatch({ path: resolvedPath.pathname})
    return (
        <Link className={isActive ? "active" : ""} to={to} {...props}>
          {children}
        </Link>
    )
}

export default NavDiligence;