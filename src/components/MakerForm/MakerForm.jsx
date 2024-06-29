import React, { useState } from 'react';
import { subDays, addDays, format } from 'date-fns';

import { initializeApp } from 'firebase/app';
import { getFirestore, addDoc, collection } from 'firebase/firestore';
import app from '../../firebaseapp';

const CropProtectionForm = () => {

    const db = getFirestore(app);

    const [formData, setFormData] = useState({
        date: '',
        crop: '',
        variety: '',
        line: '',
        typeOfSeed: '',
        issuedLotNo: '',
        packagedLotNo: '',
        packagedLotNoBags: '',
        packagedLotNoQty: '',
        labelNoTo: '',
        lableNoFrom: '',
        reminentQty: '',
        packagingLoss: '',
        packedSize: '',
        issuedLotNoBags: '',
        issuedLotNoQty: '',
        dateOfPacking: '',
        dateOfTest: '',
        dateOfExpiry: '',
        lableNoFrom: '',
        labelNoTo: '',
        chemicalUsage: {
            polymer: { type: '', usedQty: '' },
            thiram: { type: '', usedQty: '' },
            metalexal: { type: '', usedQty: '' },
            deltamitrin: { type: '', usedQty: '' },
            thimotoxin: { type: '', usedQty: '' },
        },
        packingMaterialUsage: {
            pouch: { type: '', usedQty: '' },
            hdpe: { type: '', usedQty: '' },
            damaged: { type: '', usedQty: '' },
            others: { type: '', usedQty: '' },
        },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const calculateDateAfter = (dateString) => {
        // Parse the date string into a Date object
        const currentDate = new Date(dateString);

        // Add 270 days to the current date
        const futureDate = addDays(currentDate, 270);

        // Format the future date as "YYYY-MM-DD"
        const formattedDate = format(futureDate, 'yyyy-MM-dd');

        return formattedDate;
    };


    const calculateDateBefore = (dateString) => {
        // Parse the date string into a Date object
        const currentDate = new Date(dateString);

        // Subtract 10 days from the current date
        const pastDate = subDays(currentDate, 10);

        // Format the past date as "YYYY-MM-DD"
        const formattedDate = format(pastDate, 'yyyy-MM-dd');

        return formattedDate;
    };

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        const expiryDate = calculateDateAfter(value);
        const testdate = calculateDateBefore(value);
        console.log(value);
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
            dateOfTest: testdate,
            dateOfExpiry: expiryDate,
            dateOfPacking: value
        }));
    };


    const handleDropdownChange = (name, value) => {
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleChemicalChange = (chemical, field, value) => {
        setFormData(prevState => ({
            ...prevState,
            chemicalUsage: {
                ...prevState.chemicalUsage,
                [chemical]: {
                    ...prevState.chemicalUsage[chemical],
                    [field]: value
                }
            }
        }));
    };

    const handlePackingMaterialChange = (material, field, value) => {
        setFormData(prevState => ({
            ...prevState,
            packingMaterialUsage: {
                ...prevState.packingMaterialUsage,
                [material]: {
                    ...prevState.packingMaterialUsage[material],
                    [field]: value
                }
            }
        }));
    };

    const cropOptions = ['Mustard', 'Maize'];

    const getVarieties = (crop) => {
        if (crop === 'Mustard') {
            return ['Mustard Variety 1', 'Mustard Variety 2'];
        } else if (crop === 'Maize') {
            return ['Maize Variety 1', 'Maize Variety 2'];
        } else {
            return [];
        }
    };

    const typeOfSeedOptions = ['Seed Type 1', 'Seed Type 2'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);
        try {
            // Add data to Firestore
            // const docRef = await db.collection('markerform').add(formData);
            const docRef = await addDoc(collection(db, 'markerform'), formData);
            console.log('Document written with ID: ', docRef.id);
            // Optionally, clear form data or show success message
            alert('Form data submitted successfully!');
        } catch (error) {
            console.error('Error adding document: ', error);
            alert('Failed to submit form data. Please try again later.');
        }
        // Handle form submission
    };

    return (
        <div className="container mt-4 p-4 bg-light">
            <h2 className="text-center mb-4 text-primary">CRYSTAL CROP PROTECTION LIMITED</h2>
            <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                    <div className="col-md-4">
                        <label htmlFor="date" className="form-label">Date:</label>
                        <input type="date" className="form-control" id="date" name="date" value={formData.date} onChange={handleDateChange} />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="line" className="form-label">Line:</label>
                        <input type="text" className="form-control" id="line" name="line" value={formData.line} onChange={handleChange} />
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-4">
                        <label htmlFor="crop" className="form-label">Crop:</label>
                        <select className="form-control" id="crop" name="crop" value={formData.crop} onChange={(e) => handleDropdownChange('crop', e.target.value)}>
                            <option value="">Select Crop</option>
                            {cropOptions.map((crop, index) => (
                                <option key={index} value={crop}>{crop}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="variety" className="form-label">Variety:</label>
                        <select className="form-control" id="variety" name="variety" value={formData.variety} onChange={handleChange}>
                            <option value="">Select Variety</option>
                            {getVarieties(formData.crop).map((variety, index) => (
                                <option key={index} value={variety}>{variety}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="typeOfSeed" className="form-label">Type of Seed:</label>
                        <select className="form-control" id="typeOfSeed" name="typeOfSeed" value={formData.typeOfSeed} onChange={handleChange}>
                            <option value="">Select Type of Seed</option>
                            {typeOfSeedOptions.map((type, index) => (
                                <option key={index} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-4">
                        <label htmlFor="issuedLotNo" className="form-label">Issued Lot No:</label>
                        <input type="text" className="form-control" id="issuedLotNo" name="issuedLotNo" value={formData.issuedLotNo} onChange={handleChange} />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="bags" className="form-label">Bags:</label>
                        <input type="text" className="form-control" id="bags" name="issuedLotNoBags" value={formData.issuedLotNoBags} onChange={handleChange} />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="qty" className="form-label">Qty:</label>
                        <input type="text" className="form-control" id="qty" name="issuedLotNoQty" value={formData.issuedLotNoQty} onChange={handleChange} />
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-4">
                        <label htmlFor="issuedLotNo" className="form-label">Packed Lot No:</label>
                        <input type="text" className="form-control" id="issuedLotNo" name="packagedLotNo" value={formData.packagedLotNo} onChange={handleChange} />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="bags" className="form-label">Bags:</label>
                        <input type="text" className="form-control" id="bags" name="packagedLotNoBags" value={formData.packagedLotNoBags} onChange={handleChange} />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="qty" className="form-label">Qty:</label>
                        <input type="text" className="form-control" id="qty" name="packagedLotNoQty" value={formData.packagedLotNoQty} onChange={handleChange} />
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-4">
                        <label htmlFor="issuedLotNo" className="form-label">Packed Size:</label>
                        <input type="text" className="form-control" id="issuedLotNo" name="packedSize" value={formData.packedSize} onChange={handleChange} />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="bags" className="form-label">Reminent Qty:</label>
                        <input type="text" className="form-control" id="bags" name="reminentQty" value={formData.reminentQty} onChange={handleChange} />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="qty" className="form-label">Packaging Loss:</label>
                        <input type="text" className="form-control" id="qty" name="packagingLoss" value={formData.packagingLoss} onChange={handleChange} />
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-4">
                        <label htmlFor="date" className="form-label">Date of Packaging:</label>
                        <input type="date" className="form-control" id="date" name="date" value={formData.dateOfPacking} disabled />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="date" className="form-label">Date of Test:</label>
                        <input type="date" className="form-control" id="date" name="date" value={formData.dateOfTest} disabled />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="date" className="form-label">Date of Expiry:</label>
                        <input type="date" className="form-control" id="date" name="date" value={formData.dateOfExpiry} disabled />
                    </div>
                </div>

                <div className="row mb-2">
                    <div className="col-md-6">
                        <label htmlFor="issuedLotNo" className="form-label">Label No From:</label>
                        <input type="text" className="form-control" id="issuedLotNo" name="lableNoFrom" value={formData.lableNoFrom} onChange={handleChange} />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="bags" className="form-label">Label No To:</label>
                        <input type="text" className="form-control" id="bags" name="labelNoTo" value={formData.labelNoTo} onChange={handleChange} />
                    </div>
                </div>

                <h4 className="mt-4 mb-3 text-secondary">Chemical Usage</h4>
                <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                        <thead className="table-primary">
                            <tr>
                                <th>Material</th>
                                <th>Polymer</th>
                                <th>Thiram</th>
                                <th>Metalexal</th>
                                <th>Deltamitrin</th>
                                <th>Thimotoxin</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Type of Material</td>
                                {['polymer', 'thiram', 'metalexal', 'deltamitrin', 'thimotoxin'].map(chemical => (
                                    <td key={chemical}>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.chemicalUsage[chemical].type}
                                            onChange={(e) => handleChemicalChange(chemical, 'type', e.target.value)}
                                        />
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td>Used Qty</td>
                                {['polymer', 'thiram', 'metalexal', 'deltamitrin', 'thimotoxin'].map(chemical => (
                                    <td key={chemical}>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.chemicalUsage[chemical].usedQty}
                                            onChange={(e) => handleChemicalChange(chemical, 'usedQty', e.target.value)}
                                        />
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h4 className="mt-4 mb-3 text-secondary">Packing Material Usage</h4>
                <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                        <thead className="table-success">
                            <tr>
                                <th>Material</th>
                                <th>Pouch/Roll</th>
                                <th>HDPE Bags</th>
                                <th>Damaged Qty</th>
                                <th>Others</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Type of Material</td>
                                {['pouch', 'hdpe', 'damaged', 'others'].map(mat => (
                                    <td key={mat}>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.packingMaterialUsage[mat].type}
                                            onChange={(e) => handlePackingMaterialChange(mat, 'type', e.target.value)}
                                        />
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td>Used Qty</td>
                                {['pouch', 'hdpe', 'damaged', 'others'].map(mat => (
                                    <td key={mat}>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={formData.packingMaterialUsage[mat].usedQty}
                                            onChange={(e) => handlePackingMaterialChange(mat, 'usedQty', e.target.value)}
                                        />
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 text-center">
                    <button type="submit" className="btn btn-primary btn-lg">Submit</button>
                </div>
            </form>
        </div>
    );
};

export default CropProtectionForm;
