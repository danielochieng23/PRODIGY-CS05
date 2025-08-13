import React from 'react';
import { useParams } from 'react-router-dom';

const CategoryPage = () => {
  const { slug } = useParams();

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold">Category: {slug}</h1>
      <p className="text-gray-600 mt-4">Browse ads in this category.</p>
    </div>
  );
};

export default CategoryPage;