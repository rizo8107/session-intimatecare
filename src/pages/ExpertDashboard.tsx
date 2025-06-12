import React, { useState } from 'react';
import { Calendar, DollarSign, Users, Star, Clock, MessageCircle, TrendingUp, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ExpertDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - in real app, this would come from API
  const stats = [
    { label: 'Total Earnings', value: '$12,450', change: '+12%', icon: DollarSign, color: 'text-accent-600' },
    { label: 'Sessions This Month', value: '28', change: '+8%', icon: Calendar, color: 'text-primary-600' },
    { label: 'Total Clients', value: '156', change: '+15%', icon: Users, color: 'text-secondary-600' },
    { label: 'Average Rating', value: '4.9', change: '+0.1', icon: Star, color: 'text-yellow-600' }
  ];

  const upcomingBookings = [
    {
      id: '1',
      clientName: 'Michael Chen',
      clientAvatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
      service: 'Product Strategy Session',
      date: '2024-02-15',
      time: '10:00 AM',
      duration: 60,
      price: 150,
      status: 'confirmed'
    },
    {
      id: '2',
      clientName: 'Emma Wilson',
      clientAvatar: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=400',
      service: 'Career Mentorship',
      date: '2024-02-15',
      time: '2:00 PM',
      duration: 45,
      price: 125,
      status: 'confirmed'
    },
    {
      id: '3',
      clientName: 'James Rodriguez',
      clientAvatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
      service: 'Product Strategy Session',
      date: '2024-02-16',
      time: '11:00 AM',
      duration: 60,
      price: 150,
      status: 'pending'
    }
  ];

  const recentReviews = [
    {
      id: '1',
      clientName: 'Michael Chen',
      clientAvatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 5,
      comment: 'Sarah provided incredible insights that helped me land my dream PM role. Her advice was practical and actionable.',
      date: '2024-01-15',
      service: 'Product Strategy Session'
    },
    {
      id: '2',
      clientName: 'Emma Wilson',
      clientAvatar: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 5,
      comment: 'Amazing mentorship session. Sarah helped me understand the product management landscape better.',
      date: '2024-01-20',
      service: 'Career Mentorship'
    }
  ];

  const earningsData = [
    { month: 'Jan', amount: 2450 },
    { month: 'Feb', amount: 3200 },
    { month: 'Mar', amount: 2800 },
    { month: 'Apr', amount: 3600 },
    { month: 'May', amount: 4200 },
    { month: 'Jun', amount: 3800 }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={user?.avatar || 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=400'}
                alt={user?.name}
                className="w-16 h-16 rounded-full object-cover ring-4 ring-white shadow-lg"
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
                <p className="text-gray-600">Manage your expert profile and track your success</p>
              </div>
            </div>
            <button className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
              <Settings className="h-5 w-5" />
              <span>Manage Profile</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-success-600 mr-1" />
                    <span className="text-sm text-success-600 font-medium">{stat.change}</span>
                  </div>
                </div>
                <div className={`p-3 rounded-full bg-gray-50`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'bookings', label: 'Bookings' },
                { id: 'reviews', label: 'Reviews' },
                { id: 'earnings', label: 'Earnings' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.i
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Upcoming Sessions */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Today's Sessions</h3>
                  <div className="space-y-4">
                    {upcomingBookings.slice(0, 2).map((booking) => (
                      <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <img
                            src={booking.clientAvatar}
                            alt={booking.clientName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium text-gray-900">{booking.service}</h4>
                                <p className="text-sm text-gray-600">with {booking.clientName}</p>
                                <div className="flex items-center space-x-2 mt-1 text-sm text-gray-500">
                                  <Clock className="h-4 w-4" />
                                  <span>{booking.time} ({booking.duration}min)</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-semibold text-gray-900">${booking.price}</div>
                                <span className={`inline-block text-xs px-2 py-1 rounded-full ${
                                  booking.status === 'confirmed' 
                                    ? 'bg-success-100 text-success-700'
                                    : 'bg-warning-100 text-warning-700'
                                }`}>
                                  {booking.status}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3 mt-3">
                              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                                Start Session
                              </button>
                              <button className="text-gray-600 hover:text-gray-700 text-sm">
                                Message
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Reviews */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Reviews</h3>
                  <div className="space-y-4">
                    {recentReviews.slice(0, 2).map((review) => (
                      <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <img
                            src={review.clientAvatar}
                            alt={review.clientName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-900">{review.clientName}</h4>
                              <div className="flex items-center">
                                {[...Array(review.rating)].map((_, i) => (
                                  <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">"{review.comment}"</p>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>{review.service}</span>
                              <span>{formatDate(review.date)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">All Bookings</h3>
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 bg-primary-100 text-primary-700 rounded-lg text-sm font-medium">
                      Upcoming
                    </button>
                    <button className="px-4 py-2 text-gray-600 hover:text-gray-900 rounded-lg text-sm">
                      Past
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary-200 transition-colors">
                      <div className="flex items-start space-x-4">
                        <img
                          src={booking.clientAvatar}
                          alt={booking.clientName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-gray-900">{booking.service}</h4>
                              <p className="text-sm text-gray-600">with {booking.clientName}</p>
                              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                <div className="flex items-center space-x-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>{formatDate(booking.date)}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{booking.time} ({booking.duration}min)</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-semibold text-gray-900">${booking.price}</div>
                              <span className={`inline-block text-xs px-2 py-1 rounded-full ${
                                booking.status === 'confirmed' 
                                  ? 'bg-success-100 text-success-700'
                                  : 'bg-warning-100 text-warning-700'
                              }`}>
                                {booking.status}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 mt-4">
                            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                              Start Session
                            </button>
                            <button className="text-gray-600 hover:text-gray-700 text-sm">
                              Message Client
                            </button>
                            <button className="text-gray-600 hover:text-gray-700 text-sm">
                              Reschedule
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Client Reviews</h3>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Star className="h-5 w-5 text-yellow-500 fill-current" />
                      <span className="text-lg font-semibold">4.9</span>
                      <span className="text-gray-500">({recentReviews.length} reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {recentReviews.map((review) => (
                    <div key={review.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start space-x-4">
                        <img
                          src={review.clientAvatar}
                          alt={review.clientName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-semibold text-gray-900">{review.clientName}</h4>
                              <p className="text-sm text-gray-600">{review.service}</p>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center mb-1">
                                {[...Array(review.rating)].map((_, i) => (
                                  <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                                ))}
                              </div>
                              <p className="text-sm text-gray-500">{formatDate(review.date)}</p>
                            </div>
                          </div>
                          <p className="text-gray-700 leading-relaxed">"{review.comment}"</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Earnings Tab */}
            {activeTab === 'earnings' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Earnings Overview</h3>
                  <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                    Request Payout
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-6 text-white">
                    <h4 className="text-lg font-semibold mb-2">Total Earnings</h4>
                    <p className="text-3xl font-bold">$12,450</p>
                    <p className="text-primary-100 text-sm">All time</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">This Month</h4>
                    <p className="text-3xl font-bold text-gray-900">$3,200</p>
                    <p className="text-success-600 text-sm">+12% from last month</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Available</h4>
                    <p className="text-3xl font-bold text-gray-900">$2,850</p>
                    <p className="text-gray-500 text-sm">Ready for payout</p>
                  </div>
                </div>

                {/* Earnings Chart Placeholder */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Monthly Earnings</h4>
                  <div className="h-64 flex items-end justify-between space-x-2">
                    {earningsData.map((data, index) => (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div 
                          className="bg-primary-500 rounded-t w-full"
                          style={{ height: `${(data.amount / 5000) * 200}px` }}
                        ></div>
                        <span className="text-sm text-gray-600 mt-2">{data.month}</span>
                        <span className="text-xs text-gray-500">${data.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertDashboard;