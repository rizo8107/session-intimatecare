import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, DollarSign, MessageCircle, Award, Users } from 'lucide-react';
import { useExpert } from '../hooks/useDatabase';

const ExpertProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: expert, loading, error } = useExpert(id);
  
  const averageRating = useMemo(() => {
    if (!expert?.reviews || expert.reviews.length === 0) return 'N/A';
    const total = expert.reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / expert.reviews.length).toFixed(1);
  }, [expert?.reviews]);
  
  const lowestPrice = useMemo(() => {
    if (!expert?.services || expert.services.length === 0) return null;
    return Math.min(...expert.services.map(s => s.price));
  }, [expert?.services]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-2xl font-bold text-gray-900">Loading...</div>
      </div>
    );
  }

  if (error || !expert) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Expert not found</h2>
          <Link to="/explore" className="text-primary-600 hover:text-primary-700">
            Back to explore
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Expert Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-6">
                <img
                  src={expert.profile?.avatar_url || ''}
                  alt={expert.profile?.full_name || ''}
                  className="w-24 h-24 rounded-full object-cover ring-4 ring-gray-100"
                />
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">{expert.profile?.full_name}</h1>
                      <p className="text-lg text-gray-600 mb-6">{expert.title}</p>
                      
                      <div className="flex items-center space-x-6 mb-4">
                        <div className="flex items-center space-x-1">
                          <Star className="h-5 w-5 text-yellow-500 fill-current" />
                          <span className="font-semibold text-gray-900">{averageRating}</span>
                          <span className="text-gray-500">({expert.reviews?.length || 0} reviews)</span>
                        </div>
                        
                        <div className="flex items-center space-x-1 text-primary-600 font-semibold">
                          <DollarSign className="h-5 w-5" />
                          <span>
                            {lowestPrice ? `$${lowestPrice}/service` : 'Price varies'}
                          </span>
                        </div>
                      </div>
                      
                      {/* <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="bg-gray-100 px-3 py-1 rounded-full">{expert.category}</span>
                        {expert.is_featured && (
                          <span className="bg-accent-100 text-accent-700 px-3 py-1 rounded-full font-medium">
                            Featured Expert
                          </span>
                        )}
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* About */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">About</h2>
              <p className="text-gray-700 leading-relaxed text-lg">{expert.profile?.bio}</p>
            </div>

            {/* Services */}
            {/* Services Section (Commented Out)
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {expert.services.map((service) => (
                  <div key={service.id} className="border border-gray-200 rounded-lg p-6 hover:border-primary-200 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-800">{service.name}</h3>
                      <div className="text-xl font-bold text-primary-600">${service.price}</div>
                    </div>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>60 min session</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Availability (Commented Out) */}
            {/* <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Availability</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {expert.availability.map((slot, index) => (
                  <div key={index} className="bg-gray-100 text-center py-3 px-2 rounded-lg">
                    <p className="font-semibold text-gray-800">{slot.split(' ')[0]}</p>
                    <p className="text-sm text-gray-600">{slot.split(' ')[1]}</p>
                  </div>
                ))}
              </div>
            </div> */}

            {/* Testimonials (Commented Out) */}
            {/* <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What Clients Say</h2>
              <div className="space-y-6">
                {expert.testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="flex items-start space-x-4">
                    <img src={testimonial.clientAvatar} alt={testimonial.clientName} className="w-12 h-12 rounded-full object-cover" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-gray-900">{testimonial.clientName}</h4>
                        <div className="flex items-center">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-1">{new Date(testimonial.date).toLocaleDateString()}</p>
                      <p className="text-gray-700">{testimonial.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div> */}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Book a Session</h3>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Award className="h-6 w-6 mx-auto mb-2 text-primary-600" />
                  <div className="text-2xl font-bold text-gray-900">{expert.average_rating || 'N/A'}</div>
                  <div className="text-sm text-gray-600">Rating</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Users className="h-6 w-6 mx-auto mb-2 text-primary-600" />
                  <div className="text-2xl font-bold text-gray-900">{expert.total_reviews || 0}</div>
                  <div className="text-sm text-gray-600">Reviews</div>
                </div>
              </div>

              <div className="space-y-4">
                <Link
                  to={`/expert/${expert.id}/book`}
                  className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors font-semibold text-center block"
                >
                  Book Now
                </Link>
                
                <button className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center space-x-2">
                  <MessageCircle className="h-5 w-5" />
                  <span>Send Message</span>
                </button>
              </div>

              <div className="mt-6 p-4 bg-primary-50 rounded-lg">
                <h4 className="font-semibold text-primary-900 mb-2">Response Time</h4>
                <p className="text-sm text-primary-700">Usually responds within 2 hours</p>
              </div>
            </div>

            {/* Related Experts */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Similar Experts</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <img
                    src="https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400"
                    alt="Related Expert"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">David Martinez</h4>
                    <p className="text-sm text-gray-600">UX Design Director</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">$200/hr</div>
                    <div className="flex items-center text-yellow-500">
                      <Star className="h-3 w-3 fill-current" />
                      <span className="text-xs ml-1">4.8</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <img
                    src="https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=400"
                    alt="Related Expert"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Lisa Wang</h4>
                    <p className="text-sm text-gray-600">Marketing Director</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">$175/hr</div>
                    <div className="flex items-center text-yellow-500">
                      <Star className="h-3 w-3 fill-current" />
                      <span className="text-xs ml-1">4.7</span>
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

export default ExpertProfile;