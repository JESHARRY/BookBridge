import React from 'react';

const SeeUserData = ({ userData }) => {
    return (
        <div>
            <h3 className="font-bold text-xl">User Information</h3>
            <p><strong>Email:</strong> {userData.email}</p>
        </div>
    );
};

export default SeeUserData;
