import React, {useState} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faUserPlus, faHome, faChevronDown, faUser, faBars, faChevronUp} from '@fortawesome/free-solid-svg-icons'
import { NavLink } from 'react-router-dom';
import "./stylesheets/Navbar.css";
import logo from "./images/small-logo.png";

const Navbar = ({navHidden, setNavHidden, userLoaded, logout}) => {

    const [userHidden, setUserHidden] = useState(true);

    const [mnavOpen, setmnavOpen] = useState(false);

    const toggleNavSection = (section) => {
        setUserHidden(!userHidden);
    }

    const logoutMobile = () => {
        setmnavOpen(false);
        logout();
    }

    return (
        <>
        {navHidden ?
            <div className="Navbarh">
                <div className="Navh">
                    <ul className="NavMenuh">
                        <NavLink className="NavLogoh" exact to="/dashboard"><img src={logo} alt="logo"></img></NavLink>
                        {userLoaded ?
                            <>
                                <li className="NavItemh">
                                    <NavLink exact to="/dashboard">
                                        <FontAwesomeIcon icon={faHome} className="NavIconh HoverColor"/>
                                        <span className="HoverColor">Dashboard</span> 
                                    </NavLink>
                                </li>
                                <li className="NavItemh">
                                    <NavLink exact to="/" onClick={logout}>
                                        <FontAwesomeIcon icon={faUser} className="NavIconh HoverColor"/>
                                        <span className="HoverColor">Logout</span>
                                    </NavLink>
                                </li>
                            </>
                        :
                            <>
                                <li className="NavItemh">
                                    <NavLink exact to="/signup">
                                        <FontAwesomeIcon icon={faUserPlus} className="NavIconh HoverColor"/>
                                        <span className="HoverColor">Signup</span> 
                                    </NavLink>
                                </li>           
                                <li className="NavItemh">
                                    <NavLink exact to="/login">
                                        <FontAwesomeIcon icon={faSignInAlt} className="NavIconh HoverColor"/>
                                        <span className="HoverColor">Login</span> 
                                    </NavLink>
                                </li>
                            </>
                        }
                        <li className="NavItemh NavFinal">
                            <div onClick={() => setNavHidden(!navHidden)}>
                                <FontAwesomeIcon icon={faBars} className="NavIconh HoverColor"/>
                                <span className="HoverColor">Expand Menu</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        :
            <div className="Navbar">
                <div className="Nav">
                    <ul className="NavMenu">
                        <NavLink className="NavLogo" exact to="/dashboard"><img src={logo} alt="logo"></img></NavLink>
                        <li className="NavTitle">MAIN</li>
                            {userLoaded ?
                                <>
                                    <li className="NavItem">
                                        <NavLink exact to="/dashboard">
                                            <FontAwesomeIcon icon={faHome} className="NavIcon HoverColor"/>
                                            <span className="HoverColor">Dashboard</span> 
                                        </NavLink>
                                    </li>          
                                    <li className="NavTitle">USER</li>
                                    {userHidden ?
                                        <li className="NavItem" onClick={() => toggleNavSection()}>
                                            <div>
                                                <FontAwesomeIcon icon={faUser} className="NavIcon HoverColor"/>
                                                <span className="HoverColor">Profile</span> 
                                                <FontAwesomeIcon icon={faChevronDown} className="NavIcon HoverColor NavEnd"/>
                                            </div>
                                        </li>
                                    :
                                        <>
                                            <li className="NavItem NavActive" onClick={() => toggleNavSection()}>
                                                <div>
                                                    <FontAwesomeIcon icon={faUser} className="NavIcon HoverColor"/>
                                                    <span className="HoverColor">Profile</span> 
                                                    <FontAwesomeIcon icon={faChevronUp} className="NavIcon HoverColor NavEnd"/>
                                                </div>
                                            </li>
                                            <div className="NavDropdown" data-section="user">
                                                <li className="NavItemDropdown">
                                                    <NavLink exact to="/" onClick={logout}>
                                                        <span className="HoverColor">Logout</span> 
                                                    </NavLink>
                                                </li>
                                            </div>
                                        </>
                                    }
                                </>
                            :
                                <>
                                    <li className="NavItem">
                                        <NavLink exact to="/signup">
                                            <FontAwesomeIcon icon={faUserPlus} className="NavIcon HoverColor"/>
                                            <span className="HoverColor">Signup</span> 
                                        </NavLink>
                                    </li>           
                                    <li className="NavItem">
                                        <NavLink exact to="/login">
                                            <FontAwesomeIcon icon={faSignInAlt} className="NavIcon HoverColor"/>
                                            <span className="HoverColor">Login</span> 
                                        </NavLink>
                                    </li>
                                </>
                            }
                        <li className="NavItem NavFinal">
                            <div onClick={() => setNavHidden(!navHidden)}>
                                <FontAwesomeIcon icon={faBars} className="NavIcon HoverColor"/>
                                <span className="HoverColor">Hide Menu</span> 
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        }
        <FontAwesomeIcon icon={faBars} className="Navmbtn" onClick={() => setmnavOpen(!mnavOpen)}/>
        {mnavOpen ?
            <div className="Navmobile">
                {userLoaded ?
                    <>
                        <NavLink exact to="/dashboard" onClick={() => setmnavOpen(false)}>Dashboard</NavLink>
                        <NavLink exact to="/" onClick={logoutMobile}>Logout</NavLink>
                    </>
                :
                    <>
                        <NavLink exact to="/signup" onClick={() => setmnavOpen(false)}>Signup</NavLink>
                        <NavLink exact to="/login" onClick={() => setmnavOpen(false)}>Login</NavLink>
                    </>
                }
            </div>
        : null }
        </> 
    )
}

export default Navbar;