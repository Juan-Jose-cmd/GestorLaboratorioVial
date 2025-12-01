import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import styles from './NavBar.module.css';

const NavBar = () => {

    const [open, setOpen] = useState(false);

    return (
        <nav className={styles.nav}>
            
            <div className={styles.logo}>
                <NavLink to="/">LabVial</NavLink>
            </div>

            <button 
                className={styles.hamburger}
                onClick={() => setOpen(!open)}
            >
                <span></span>
                <span></span>
                <span></span>
            </button>
            
            <ul className={`${styles.links} ${open ? styles.open : ""}`}>
                <li>
                    <NavLink 
                        to="/login"
                        className={({ isActive }) => isActive ? styles.active : ""}
                        onClick={() => setOpen(false)}
                    >
                        Login
                    </NavLink>
                </li>

                <li>
                    <NavLink 
                        to="/register"
                        className={({ isActive }) => isActive ? styles.active : ""}
                        onClick={() => setOpen(false)}
                    >
                        Register
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;