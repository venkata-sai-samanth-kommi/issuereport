// Header.jsx
import React, { useState, useEffect } from 'react';
import './Header.css';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import * as XLSX from 'xlsx';
import app from '../../firebaseapp';
import { saveAs } from 'file-saver';

const Header = () => {
    const navigate = useNavigate();
    const db = getFirestore(app);
    const auth = getAuth(app);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, [auth]);

    const handleMakerClick = () => {
        navigate('/maker-form');
    };

    const handleCheckerClick = () => {
        if (user) {
            navigate('/checker-form');
        } else {
            navigate('/login');
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (error) {
            console.error('Error signing out: ', error);
        }
    };

    const handleGenerateExcel = async () => {
        if (!user) {
            alert('Please login to generate Excel.');
            return;
        }

        try {
            const querySnapshot = await getDocs(collection(db, 'exceldata'));
            const data = querySnapshot.docs.map(doc => doc.data());

            if (data.length > 0) {
                const workbook = XLSX.utils.book_new();
                const worksheet = XLSX.utils.json_to_sheet(data);
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Excel Data');
                const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

                const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                saveAs(blob, 'exceldata.xlsx');
            } else {
                alert('No data available to generate Excel.');
            }
        } catch (error) {
            console.error('Error generating Excel: ', error);
            alert('Failed to generate Excel. Please try again later.');
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <a className="navbar-brand" href="/">Issue Report</a>
                <div className="d-flex flex-row align-items-center">
                    <button className="btn btn-outline-success me-2" onClick={handleMakerClick}>
                        Maker
                    </button>
                    <button className="btn btn-outline-success me-2" onClick={handleCheckerClick}>
                        Checker
                    </button>
                    {user && (
                        <>
                            <button className="btn btn-outline-success me-2" onClick={handleGenerateExcel}>
                                Generate Excel
                            </button>
                            <button className="btn btn-outline-danger" onClick={handleLogout}>
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Header;