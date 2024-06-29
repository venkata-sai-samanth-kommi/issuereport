import React from 'react';
import './Header.css';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import * as XLSX from 'xlsx'; // Import xlsx library
import app from '../../firebaseapp'; // Ensure app is imported correctly from your firebaseapp setup
import { saveAs } from 'file-saver';

const Header = () => {
    const navigate = useNavigate();
    const db = getFirestore(app); // Assuming `app` is your Firebase app instance

    const handleMakerClick = () => {
        navigate('/maker-form');
    };

    const handleCheckerClick = () => {
        navigate('/checker-form');
    };

    const handleGenerateExcel = async () => {
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
                    <button className="btn btn-outline-success" onClick={handleGenerateExcel}>
                        Generate Excel
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Header;
