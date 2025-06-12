import React from 'react';

const AboutUsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">About Us</h1>
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md prose lg:prose-xl">
        <p className="mb-4">
          Welcome to Session Intimate Care, your trusted platform for connecting with qualified professionals 
          for guidance and support in intimate health and wellness.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">Our Mission</h2>
        <p>
          Our mission is to provide a safe, confidential, and accessible space for individuals to seek expert advice 
          and services related to intimate care. We believe that everyone deserves access to reliable information and 
          professional support to enhance their well-being.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">Who We Are</h2>
        <p>
          Session Intimate Care was founded by a team passionate about breaking down barriers and stigmas associated 
          with intimate health. We connect users with a curated network of certified therapists, counselors, 
          doctors, and wellness experts specializing in various aspects of intimate care.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">What We Offer</h2>
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li><strong>Expert Consultations:</strong> Schedule one-on-one sessions with experienced professionals.</li>
          <li><strong>Informative Resources:</strong> Access articles, guides, and FAQs on a wide range of topics. (Coming Soon)</li>
          <li><strong>Secure Platform:</strong> Our platform ensures your privacy and confidentiality with secure communication channels.</li>
          <li><strong>Convenient Booking:</strong> Easily find and book sessions that fit your schedule.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-3">Our Commitment</h2>
        <p>
          We are committed to upholding the highest standards of professionalism and ethics. All experts on our 
          platform are vetted to ensure they meet our quality criteria. Your trust and safety are paramount to us.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">Get in Touch</h2>
        <p>
          We are always looking to improve and welcome your feedback. If you have any questions or suggestions, 
          please feel free to <a href="/contact-us" className="text-blue-600 hover:underline">contact us</a>.
        </p>

        <p className="mt-6">
          <strong>[Placeholder: This is a template. Please customize this content to accurately reflect your organization's mission, values, and story.]</strong>
        </p>
      </div>
    </div>
  );
};

export default AboutUsPage;
