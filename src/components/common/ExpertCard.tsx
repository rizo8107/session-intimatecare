import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, DollarSign } from 'lucide-react';

interface Expert {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatar: string;
  category: string;
  rating: number;
  reviewCount: number;
  hourlyRate: number;
}

interface ExpertCardProps {
  expert: Expert;
  featured?: boolean;
}

const ExpertCard: React.FC<ExpertCardProps> = ({ expert, featured = false }) => {
  return (
    <Link 
      to={`/expert/${expert.id}`}
      className={`block bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-primary-200 transition-all duration-300 group ${featured ? 'ring-2 ring-accent-500 ring-opacity-20' : ''}`}
    >
      <div className="p-6">
        {featured && (
          <div className="flex items-center mb-3">
            <span className="bg-accent-100 text-accent-700 text-xs font-semibold px-2 py-1 rounded-full">
              Featured Expert
            </span>
          </div>
        )}
        
        <div className="flex items-start space-x-4">
          <img
            src={expert.avatar}
            alt={expert.name}
            className="w-16 h-16 rounded-full object-cover ring-2 ring-gray-100 group-hover:ring-primary-200 transition-all"
          />
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
              {expert.name}
            </h3>
            <p className="text-sm text-gray-600 mb-1">{expert.title}</p>
            <p className="text-sm text-gray-500 line-clamp-2 mb-3">
              {expert.bio.substring(0, 100)}...
            </p>
            
            {/* Category Badge */}
            <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full mb-3">
              {expert.category}
            </span>
            
            {/* Stats */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 text-yellow-500">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-gray-700 font-medium">{expert.rating}</span>
                  <span className="text-gray-500">({expert.reviewCount})</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-1 text-primary-600 font-semibold">
                <DollarSign className="h-4 w-4" />
                <span>{expert.hourlyRate}/hr</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ExpertCard;