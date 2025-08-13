import React from 'react';
import { useParams } from 'react-router-dom';

const AdDetails = () => {
  const { id } = useParams();

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold">Ad Details</h1>
      <p>Viewing ad with ID: {id}</p>
      <p className="text-gray-600 mt-4">This page will display detailed information about the selected advertisement.</p>
    </div>
  );
};

export default AdDetails;