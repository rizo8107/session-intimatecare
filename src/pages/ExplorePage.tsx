import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Loader } from 'lucide-react';
import { useExperts, Expert } from '../hooks/useDatabase';
import ExpertCard from '../components/common/ExpertCard';

const ExplorePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('q') || '');
  
  const { data: experts, loading: expertsLoading } = useExperts({ 
    featured: false, 
    approved: true 
  });
  const [filteredExperts, setFilteredExperts] = useState<Expert[]>([]);

  // Debug logging
  React.useEffect(() => {
    console.log('ExplorePage - Experts:', experts);
    console.log('ExplorePage - Experts loading:', expertsLoading);
  }, [experts, expertsLoading]);

  // Filter experts by search query
  useEffect(() => {
    console.log('ExplorePage - Filtering experts with search query:', searchQuery);
    let results = [...(experts ?? [])];

    // Filter by search query
    if (searchQuery.trim()) {
      const searchTerm = searchQuery.toLowerCase();
      results = results.filter(expert => 
        expert.profile?.full_name?.toLowerCase().includes(searchTerm) ||
        expert.title?.toLowerCase().includes(searchTerm) ||
        expert.services?.some((service: any) => service.name.toLowerCase().includes(searchTerm) || 
                               service.category?.name.toLowerCase().includes(searchTerm))
      );
    }
    
    setFilteredExperts(results);
  }, [searchQuery, experts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    setSearchParams(params);
  };

  if (expertsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-12 w-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading experts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Explore Experts
          </h1>
          <p className="text-lg text-gray-600">
            Find the perfect expert to guide your professional journey
          </p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search experts by name, skill, or expertise..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium">
                {filteredExperts.length} experts found
              </span>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredExperts.map((expert, index) => (
            <div key={expert.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
              <ExpertCard
                expert={{
                  id: expert.id,
                  name: expert.profile?.full_name || 'Expert',
                  title: expert.title || 'No title provided',
                  bio: expert.profile?.bio || 'No bio provided.',
                  avatar: expert.profile?.avatar_url || 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=400',
                  category: expert.services?.[0]?.category?.name || 'General',
                  rating: expert.reviews?.length ? expert.reviews.reduce((acc: number, review: { rating: number }) => acc + review.rating, 0) / expert.reviews.length : 0,
                  reviewCount: expert.reviews?.length || 0,
                  hourlyRate: expert.services?.[0]?.price || 0
                }}
                featured={expert.is_featured ?? false}
              />
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredExperts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No experts found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or browse all categories
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('');
                setPriceRange('all');
                setSearchParams({});
              }}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Show All Experts
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;