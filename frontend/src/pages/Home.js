import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Search, MapPin, Star, Clock, Heart, Eye } from 'lucide-react';
import { adsService, categoriesService, locationsService } from '../services/api';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const navigate = useNavigate();

  // Fetch data
  const { data: categories } = useQuery('categories', categoriesService.getCategories);
  const { data: featuredAds } = useQuery(
    'featuredAds',
    () => adsService.getAds({ limit: 8, isPremium: true })
  );
  const { data: cities } = useQuery('cities', locationsService.getCities);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append('q', searchQuery.trim());
    if (selectedCity) params.append('city', selectedCity);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-bg text-white py-20">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find What You're Looking For
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100">
              Discover premium classified ads in your area. Connect with quality service providers.
            </p>
            
            {/* Search Form */}
            <form onSubmit={handleSearch} className="bg-white rounded-lg p-4 shadow-xl">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="What are you looking for?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 text-gray-900 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div className="flex-1">
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full px-4 py-3 text-gray-900 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">All Cities</option>
                    {cities?.data?.data?.map(city => (
                      <option key={city.name} value={city.name}>
                        {city.name} ({city.count})
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-semibold flex items-center justify-center"
                >
                  <Search size={20} className="mr-2" />
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Browse Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {categories?.data?.data?.map(category => (
              <Link
                key={category._id}
                to={`/category/${category.slug}`}
                className="group bg-gray-50 rounded-lg p-6 text-center hover:bg-primary-50 hover:shadow-lg transition-all duration-200"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-lg mx-auto mb-3 flex items-center justify-center group-hover:bg-primary-200">
                  <span className="text-2xl">💫</span>
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-primary-700">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {category.adsCount} ads
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Ads */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Featured Ads</h2>
            <Link to="/search" className="text-primary-600 hover:text-primary-700 font-semibold">
              View All →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredAds?.data?.data?.map(ad => (
              <div key={ad._id} className="card group hover:shadow-lg transition-shadow duration-200">
                <div className="relative">
                  {ad.images?.[0]?.url ? (
                    <img
                      src={ad.images[0].url}
                      alt={ad.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">No Image</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className="bg-primary-600 text-white px-2 py-1 rounded text-xs font-semibold">
                      PREMIUM
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary-600 transition-colors">
                    {ad.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {ad.description}
                  </p>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <MapPin size={14} className="mr-1" />
                    {ad.location.city}, {ad.location.state}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <Eye size={14} className="mr-1" />
                      {ad.views}
                    </div>
                    <div className="flex items-center">
                      <Clock size={14} className="mr-1" />
                      {new Date(ad.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <Link
                    to={`/ad/${ad._id}`}
                    className="block w-full mt-4 text-center bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Rubica?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied users who trust Rubica for their classified ad needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">10K+</div>
              <div className="text-gray-600">Active Ads</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">5K+</div>
              <div className="text-gray-600">Happy Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">50+</div>
              <div className="text-gray-600">Cities</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">24/7</div>
              <div className="text-gray-600">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Post Your Ad?</h2>
          <p className="text-xl mb-8 text-primary-100">
            Join our community and start connecting with potential customers today.
          </p>
          <Link
            to="/post-ad"
            className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
          >
            Post Your First Ad
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;