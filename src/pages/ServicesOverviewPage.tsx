import React, { useEffect, useState } from 'react';
// import { supabase } from '../lib/supabase'; // Assuming you might fetch services from Supabase

// Placeholder service type - replace with your actual type from database.types.ts if fetching
interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration_minutes?: number;
  expert_name?: string; // Optional: if you want to show who provides it
}

// Placeholder data - replace with actual data or fetch from Supabase
const placeholderServices: Service[] = [
  {
    id: '1',
    name: 'Individual Counseling Session',
    description: 'A one-on-one session with a certified counselor focusing on personal intimate health concerns.',
    price: 2500,
    duration_minutes: 60,
    expert_name: 'Dr. Priya Sharma'
  },
  {
    id: '2',
    name: 'Couples Therapy Session',
    description: 'A guided session for couples to address relationship and intimacy challenges.',
    price: 4000,
    duration_minutes: 90,
    expert_name: 'Mr. Arjun Mehta'
  },
  {
    id: '3',
    name: 'Wellness Workshop: Mindfulness in Intimacy',
    description: 'A group workshop exploring techniques for enhancing mindfulness and connection.',
    price: 1500,
    duration_minutes: 120,
    expert_name: 'Ms. Anjali Desai'
  },
  {
    id: '4',
    name: 'Educational Seminar: Understanding Sexual Health',
    description: 'An informative seminar covering key aspects of sexual health and well-being.',
    price: 1000,
    duration_minutes: 90,
    expert_name: 'Various Experts'
  },
];

const ServicesOverviewPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>(placeholderServices);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Example: Fetch services from Supabase (uncomment and adapt if needed)
  /*
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      setError(null);
      try {
        // Assuming your services table is named 'services' and has 'name', 'description', 'price', 'duration_minutes' columns
        // And you might join with an 'experts' table for 'expert_name'
        const { data, error } = await supabase
          .from('services') 
          .select(`
            id,
            name,
            description,
            price,
            duration_minutes,
            experts ( name ) / Or however you store expert info related to service
          `);

        if (error) throw error;
        
        // Transform data if needed to match the Service interface
        const formattedServices = data.map(s => ({
          ...s,
          expert_name: s.experts ? s.experts.name : 'N/A' // Adjust based on your actual structure
        }));
        setServices(formattedServices);

      } catch (err: any) {
        console.error('Error fetching services:', err);
        setError('Failed to load services. Please try again later.');
      }
      setLoading(false);
    };

    // fetchServices();
  }, []);
  */

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading services...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Our Services & Pricing</h1>
      
      {services.length === 0 && !loading && (
        <p className="text-center text-gray-600">No services currently available. Please check back later.</p>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <div key={service.id} className="bg-white rounded-lg shadow-lg p-6 flex flex-col">
            <h2 className="text-xl font-semibold text-indigo-700 mb-2">{service.name}</h2>
            {service.expert_name && (
              <p className="text-sm text-gray-500 mb-1">With: {service.expert_name}</p>
            )}
            <p className="text-gray-700 mb-3 flex-grow">{service.description}</p>
            {service.duration_minutes && (
              <p className="text-sm text-gray-600 mb-1">Duration: {service.duration_minutes} minutes</p>
            )}
            <p className="text-2xl font-bold text-gray-800 mt-auto">₹{service.price.toLocaleString('en-IN')}</p>
            {/* You might want a link to book this specific service or learn more */}
            {/* <a href={`/booking?serviceId=${service.id}`} className="mt-4 inline-block text-center bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition duration-300">Book Now</a> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesOverviewPage;
