import React from 'react';
import './Header.css';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();

    const handlemarkerClick = () => {
        navigate('/maker-form');
    };

    const handleCheckerClick = () => {
        navigate('/checker-form');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <a className="navbar-brand" href="/">Issue Report</a>
                <div className="d-flex flex-row align-items-center">
                    <button className="btn btn-outline-success me-2" onClick={handlemarkerClick}>
                        Maker
                    </button>
                    <button className="btn btn-outline-success" onClick={handleCheckerClick}>
                        Checker
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Header;
