import React, { useState } from 'react';
import { Calendar, MessageCircle, Star, Clock, DollarSign, User, BookOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('upcoming');

  // Mock data - in real app, this would come from API
  const upcomingBookings = [
    {
      id: '1',
      expertName: 'Sarah Johnson',
      expertAvatar: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=400',
      service: 'Product Strategy Session',
      date: '2024-02-15',
      time: '10:00 AM',
      duration: 60,
      price: 150,
      status: 'confirmed'
    },
    {
      id: '2',
      expertName: 'David Martinez',
      expertAvatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400',
      service: 'Portfolio Review',
      date: '2024-02-18',
      time: '2:00 PM',
      duration: 45,
      price: 125,
      status: 'confirmed'
    }
  ];

  const pastBookings = [
    {
      id: '3',
      expertName: 'Lisa Wang',
      expertAvatar: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=400',
      service: 'Marketing Strategy Consultation',
      date: '2024-01-20',
      time: '3:00 PM',
      duration: 90,
      price: 250,
      status: 'completed',
      rating: 5,
      review: 'Excellent session! Lisa provided actionable insights that helped improve our marketing strategy.'
    }
  ];

  const stats = [
    { label: 'Total Sessions', value: '12', icon: BookOpen, color: 'text-primary-600' },
    { label: 'Hours of Mentorship', value: '18', icon: Clock, color: 'text-secondary-600' },
    { label: 'Amount Invested', value: '$1,850', icon: DollarSign, color: 'text-accent-600' },
    { label: 'Average Rating Given', value: '4.8', icon: Star, color: 'text-yellow-600' }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <img
              src={user?.avatar || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400'}
              alt={user?.name}
              className="w-16 h-16 rounded-full object-cover ring-4 ring-white shadow-lg"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
              <p className="text-gray-600">Manage your bookings and track your learning journey</p>
            </div>
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
                </div>
                <div className={`p-3 rounded-full bg-gray-50`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Bookings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">My Bookings</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveTab('upcoming')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'upcoming'
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Upcoming
                  </button>
                  <button
                    onClick={() => setActiveTab('past')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'past'
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Past
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {activeTab === 'upcoming' && upcomingBookings.map((booking) => (
                  <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary-200 transition-colors">
                    <div className="flex items-start space-x-4">
                      <img
                        src={booking.expertAvatar}
                        alt={booking.expertName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">{booking.service}</h3>
                            <p className="text-sm text-gray-600">with {booking.expertName}</p>
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
                            <span className="inline-block bg-success-100 text-success-700 text-xs px-2 py-1 rounded-full">
                              {booking.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 mt-4">
                          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                            Join Meeting
                          </button>
                          <button className="text-gray-600 hover:text-gray-700 text-sm">
                            Reschedule
                          </button>
                          <button className="text-gray-600 hover:text-gray-700 text-sm">
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {activeTab === 'past' && pastBookings.map((booking) => (
                  <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-4">
                      <img
                        src={booking.expertAvatar}
                        alt={booking.expertName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">{booking.service}</h3>
                            <p className="text-sm text-gray-600">with {booking.expertName}</p>
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
                            <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                              {booking.status}
                            </span>
                          </div>
                        </div>
                        
                        {booking.rating && (
                          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-sm font-medium text-gray-700">Your Review:</span>
                              <div className="flex items-center">
                                {[...Array(booking.rating)].map((_, i) => (
                                  <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-gray-600">"{booking.review}"</p>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-4 mt-4">
                          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                            Book Again
                          </button>
                          <button className="text-gray-600 hover:text-gray-700 text-sm">
                            View Notes
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {((activeTab === 'upcoming' && upcomingBookings.length === 0) || 
                (activeTab === 'past' && pastBookings.length === 0)) && (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No {activeTab} bookings
                  </h3>
                  <p className="text-gray-600">
                    {activeTab === 'upcoming' 
                      ? 'You don\'t have any upcoming sessions. Explore experts to book your next session.'
                      : 'You haven\'t completed any sessions yet.'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors text-left">
                  Find New Expert
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  View Messages
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  Update Profile
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900">Booked session with Sarah Johnson</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent-600 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900">Completed session with Lisa Wang</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-secondary-600 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900">Left review for David Martinez</p>
                    <p className="text-xs text-gray-500">3 days ago</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended Experts */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recommended for You</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <img
                    src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400"
                    alt="Expert"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Alex Thompson</h4>
                    <p className="text-sm text-gray-600">Software Engineer</p>
                    <div className="flex items-center text-yellow-500">
                      <Star className="h-3 w-3 fill-current" />
                      <span className="text-xs ml-1">4.9</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;