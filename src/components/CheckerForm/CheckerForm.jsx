import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, getDoc, doc, addDoc, deleteDoc } from 'firebase/firestore';
import app from '../../firebaseapp';

const CheckerForm = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false); // State for loading spinner
    const db = getFirestore(app);

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'markerform'));
                const fetchedRecords = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), approved: false }));
                setRecords(fetchedRecords);
            } catch (error) {
                console.error('Error fetching records: ', error);
            }
        };
        fetchRecords();
    }, [db]);

    const handleApprove = async (recordId, index) => {
        try {
            setLoading(true); // Start loading spinner

            const recordRef = doc(db, 'markerform', recordId);
            const docSnapshot = await getDoc(recordRef);

            if (docSnapshot.exists()) {
                const recordData = docSnapshot.data();

                // Add the document to approvedRecords collection
                const approvedRecordsRef = collection(db, 'exceldata');
                await addDoc(approvedRecordsRef, {
                    ...recordData,
                    approved: true,
                    approvalDate: new Date().toISOString()
                });

                // Delete the record from markerform collection
                await deleteDoc(recordRef);

                console.log('Record with ID ' + recordId + ' approved and moved to exceldata collection.');

                // Update local state to remove the approved record
                const updatedRecords = [...records];
                updatedRecords.splice(index, 1);
                setRecords(updatedRecords);

                console.log('Record removed from UI after approval.');
            }
        } catch (error) {
            console.error('Error approving record: ', error);
        } finally {
            setLoading(false); // Stop loading spinner
        }
    };

    return (
        <div className="container mt-4 p-4 bg-light">
            <h2 className="text-center mb-4 text-primary">Checker Form</h2>
            {records.map((record, index) => (
                <div key={index} className="mb-4 border p-3">
                    <h3 className="mb-3">Record {index + 1}</h3>
                    <table className="table table-bordered">
                        <tbody>
                            {[
                                ['Date', 'date'],
                                ['Crop', 'crop'],
                                ['Variety', 'variety'],
                                ['Line', 'line'],
                                ['Type of Seed', 'typeOfSeed'],
                                ['Issued Lot No', 'issuedLotNo'],
                                ['Packaged Lot No', 'packagedLotNo'],
                                ['Packaged Lot No Bags', 'packagedLotNoBags'],
                                ['Packaged Lot No Qty', 'packagedLotNoQty'],
                                ['Label No From', 'labelNoFrom'],
                                ['Label No To', 'labelNoTo'],
                                ['Reminent Qty', 'reminentQty'],
                                ['Packaging Loss', 'packagingLoss'],
                                ['Packed Size', 'packedSize'],
                                ['Issued Lot No Bags', 'issuedLotNoBags'],
                                ['Issued Lot No Qty', 'issuedLotNoQty'],
                                ['Date of Packaging', 'dateOfPacking'],
                                ['Date of Test', 'dateOfTest'],
                                ['Date of Expiry', 'dateOfExpiry'],
                            ].map(([label, key]) => (
                                <tr key={key}>
                                    <th className="text-left" style={{ width: '30%' }}>{label}</th>
                                    <td>{record[key]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <h4 className="mt-4 mb-3">Chemical Usage</h4>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th className="text-left">Chemical</th>
                                <th className="text-left">Type</th>
                                <th className="text-left">Used Qty</th>
                            </tr>
                        </thead>
                        <tbody>
                            {['polymer', 'thiram', 'metalexal', 'deltamitrin', 'thimotoxin'].map((chemical) => (
                                <tr key={chemical}>
                                    <td>{chemical.charAt(0).toUpperCase() + chemical.slice(1)}</td>
                                    <td>{record.chemicalUsage?.[chemical]?.type}</td>
                                    <td>{record.chemicalUsage?.[chemical]?.usedQty}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <h4 className="mt-4 mb-3">Packing Material Usage</h4>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th className="text-left">Material</th>
                                <th className="text-left">Type</th>
                                <th className="text-left">Used Qty</th>
                            </tr>
                        </thead>
                        <tbody>
                            {['pouch', 'hdpe', 'damaged', 'others'].map((material) => (
                                <tr key={material}>
                                    <td>{material.charAt(0).toUpperCase() + material.slice(1)}</td>
                                    <td>{record.packingMaterialUsage?.[material]?.type}</td>
                                    <td>{record.packingMaterialUsage?.[material]?.usedQty}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <button
                        className="btn btn-success mt-3"
                        onClick={() => handleApprove(record.id, index)}
                        disabled={record.approved || loading}
                    >
                        {loading && <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>}
                        {record.approved ? 'Approved' : 'Approve'}
                    </button>
                </div>
            ))}
        </div>
    );
};

export default CheckerForm;
