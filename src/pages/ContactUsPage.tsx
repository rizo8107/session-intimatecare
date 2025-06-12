import React from 'react';

const ContactUsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Contact Us</h1>
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <p className="mb-4">
          If you have any questions, concerns, or feedback, please don't hesitate to get in touch with us. 
          We are here to help!
        </p>
        
        <h2 className="text-2xl font-semibold mb-3">Our Contact Information</h2>
        <ul className="list-disc list-inside mb-6">
          <li className="mb-2"><strong>Email:</strong> <a href="mailto:support@sessionintimatecare.com" className="text-blue-600 hover:underline">support@sessionintimatecare.com</a></li>
          <li className="mb-2"><strong>Phone:</strong> +91 99999 88888 (Placeholder)</li>
          <li className="mb-2"><strong>Address:</strong> 123 Wellness Street, Health City, India (Placeholder)</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-3">Send Us a Message</h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" name="name" id="name" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Your Name" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input type="email" name="email" id="email" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="you@example.com" />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
            <textarea name="message" id="message" rows={4} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Your message..."></textarea>
          </div>
          <div>
            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Send Message
            </button>
          </div>
        </form>
        <p className="mt-6 text-sm text-gray-600">
          We typically respond within 24-48 business hours.
        </p>
      </div>
    </div>
  );
};

export default ContactUsPage;
