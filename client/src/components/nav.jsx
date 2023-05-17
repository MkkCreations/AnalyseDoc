import './styles/nav.css';
import logoutIcon from '../samples/log-out1.png';
import closeIcon from '../samples/close.png';
import { useAuth } from '../context/authContext';
import { Link, useMatch, useResolvedPath } from 'react-router-dom';
import { useState } from 'react';

function Nav() {
    const {logout, profile} = useAuth();
    const [menu, setMenu] = useState(false);

    const handleMenu = () => {
        setMenu(!menu);
    }

    return (
        <div className='navApp' style={{width: menu&&window.visualViewport.width < 550?'40%':''}}>
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
            <div className='nav' style={{display:menu?'flex':''}}>
                <span>
                    <CustomLink to='/projects'>Projects</CustomLink>
                </span>
                <span>
                    <CustomLink to='/account'>Account</CustomLink>
                    <CustomLink to='/' >Logout</CustomLink>
                    {/* <button onClick={(e) => {e.preventDefault(); logout();}}>Logout</button> */}
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

export default Nav;