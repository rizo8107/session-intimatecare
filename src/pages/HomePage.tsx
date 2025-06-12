import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, Users, Award, ArrowRight, CheckCircle, Loader } from 'lucide-react';
import { useExperts, useCategories } from '../hooks/useDatabase';
import ExpertCard from '../components/common/ExpertCard';

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { experts: featuredExperts, loading: expertsLoading } = useExperts({ 
    featured: true, 
    approved: true 
  });
  const { categories, loading: categoriesLoading } = useCategories();

  // Debug logging
  React.useEffect(() => {
    console.log('HomePage - Featured experts:', featuredExperts);
    console.log('HomePage - Categories:', categories);
    console.log('HomePage - Experts loading:', expertsLoading);
    console.log('HomePage - Categories loading:', categoriesLoading);
  }, [featuredExperts, categories, expertsLoading, categoriesLoading]);

  const features = [
    {
      icon: Users,
      title: 'Connect with Top Experts',
      description: 'Access industry leaders and seasoned professionals across various fields'
    },
    {
      icon: Award,
      title: 'Personalized Guidance',
      description: 'Get tailored advice and mentorship that fits your specific needs and goals'
    },
    {
      icon: CheckCircle,
      title: 'Flexible Booking',
      description: 'Book sessions that work with your schedule, from 15-minute calls to full workshops'
    }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Connect with{' '}
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Top Experts
              </span>
              <br />for Personalized Guidance
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              Get one-on-one mentorship, career advice, and expert insights from industry leaders 
              across product management, design, marketing, and technology.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search for experts by name, skill, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg shadow-lg"
                />
                <Link
                  to={`/explore${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  Search
                </Link>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/explore"
                className="bg-primary-600 text-white px-8 py-4 rounded-xl hover:bg-primary-700 transition-all transform hover:scale-105 font-semibold text-lg shadow-lg"
              >
                Explore Experts
              </Link>
              <Link
                to="/auth"
                className="border-2 border-primary-600 text-primary-600 px-8 py-4 rounded-xl hover:bg-primary-50 transition-all font-semibold text-lg"
              >
                Become an Expert
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose ExpertConnect?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform connects you with verified experts who are passionate about sharing their knowledge and helping you succeed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-8 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Explore by Category
            </h2>
            <p className="text-lg text-gray-600">
              Find experts in your area of interest
            </p>
          </div>

          {categoriesLoading ? (
            <div className="flex justify-center">
              <Loader className="h-8 w-8 animate-spin text-primary-600" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {(categories ?? []).map((category, index) => (
                <Link
                  key={category.id}
                  to={`/explore?category=${encodeURIComponent(category.name)}`}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all text-center group"
                >
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: `${category.color}20`, color: category.color }}
                  >
                    <span className="text-lg font-bold">{category.name.charAt(0)}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-500">Explore experts</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Experts Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Featured Experts
              </h2>
              <p className="text-lg text-gray-600">
                Meet our top-rated professionals ready to help you succeed
              </p>
            </div>
            <Link
              to="/explore"
              className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-semibold"
            >
              <span>View All</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          {expertsLoading ? (
            <div className="flex justify-center">
              <Loader className="h-8 w-8 animate-spin text-primary-600" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(featuredExperts ?? []).slice(0, 3).map((expert, index) => (
                <div key={expert.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <ExpertCard 
                    expert={{
                      id: expert.id,
                      name: expert.profile?.full_name || 'Expert',
                      title: expert.title,
                      bio: expert.profile?.bio || '',
                      avatar: expert.profile?.avatar_url || 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=400',
                      category: expert.expertise_areas?.[0] || 'General',
                      rating: expert.average_rating || 0,
                      reviewCount: expert.total_reviews || 0,
                      hourlyRate: expert.hourly_rate || 0
                    }}
                    featured 
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-primary-100">Expert Professionals</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-primary-100">Sessions Completed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">4.9</div>
              <div className="text-primary-100">Average Rating</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-primary-100">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have accelerated their careers through personalized expert guidance.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/explore"
              className="bg-primary-600 text-white px-8 py-4 rounded-xl hover:bg-primary-700 transition-all transform hover:scale-105 font-semibold text-lg shadow-lg"
            >
              Find Your Expert
            </Link>
            <Link
              to="/auth"
              className="border-2 border-primary-600 text-primary-600 px-8 py-4 rounded-xl hover:bg-primary-50 transition-all font-semibold text-lg"
            >
              Share Your Expertise
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;