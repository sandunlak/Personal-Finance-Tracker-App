import React, { useContext, useState } from 'react';
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faBars } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';

function Header() {
    const { user, logout } = useContext(AuthContext);
    const [isClicked, setIsClicked] = useState(false);

    const buttonClicked = () => {
        setIsClicked((prev) => !prev);
    };

    const handleLogout = () => {
        logout();
        setIsClicked(false);
    };

    return (
        <header className="header">
            <Link to="/" className="logo">
                Group Project
            </Link>

            {user && (
                <div className="menu-container">
                    <button onClick={buttonClicked} className="menu-toggle">
                        <FontAwesomeIcon icon={isClicked ? faTimes : faBars} />
                    </button>
                    {isClicked && (
                        <div className="dropdown-menu">
                            <Link to="/add-transaction" className="menu-item" onClick={() => setIsClicked(false)}>
                                Add Transaction
                            </Link>
                            <Link to="/add-category" className="menu-item" onClick={() => setIsClicked(false)}>
                                Add Category
                            </Link>
                            <Link to="/profile" className="menu-item" onClick={() => setIsClicked(false)}>
                                Profile
                            </Link>
                            <Link to="/dashboard" className="menu-item" onClick={() => setIsClicked(false)}>
                                Dashboard
                            </Link>
                            <button onClick={handleLogout} className="logout-btn">
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
}

export default Header;
