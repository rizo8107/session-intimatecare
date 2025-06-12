import React from 'react';

const TermsAndConditionsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Terms & Conditions</h1>
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md prose lg:prose-xl">
        <p className="mb-4">
          Please read these terms and conditions carefully before using Our Service.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">Interpretation and Definitions</h2>
        <h3 className="text-xl font-semibold mt-4 mb-2">Interpretation</h3>
        <p>
          The words of which the initial letter is capitalized have meanings defined under the following conditions. 
          The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
        </p>
        <h3 className="text-xl font-semibold mt-4 mb-2">Definitions</h3>
        <p>For the purposes of these Terms and Conditions:</p>
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li>
            <strong>Application</strong> means the software program provided by the Company downloaded by You on any electronic device, named Session Intimate Care.
          </li>
          <li>
            <strong>Company</strong> (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to Session Intimate Care.
          </li>
          <li>
            <strong>Service</strong> refers to the Application or the Website or both.
          </li>
          <li>
            <strong>Terms and Conditions</strong> (also referred as "Terms") mean these Terms and Conditions that form the entire agreement between You and the Company regarding the use of the Service.
          </li>
          <li>
            <strong>Website</strong> refers to Session Intimate Care, accessible from [Your Website URL]
          </li>
          <li>
            <strong>You</strong> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-3">Acknowledgment</h2>
        <p>
          These are the Terms and Conditions governing the use of this Service and the agreement that operates between You and the Company. 
          These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service.
        </p>
        <p>
          Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms and Conditions. 
          These Terms and Conditions apply to all visitors, users and others who access or use the Service.
        </p>
        <p>
          By accessing or using the Service You agree to be bound by these Terms and Conditions. If You disagree with any part of these Terms and Conditions then You may not access the Service.
        </p>
        {/* Add more sections as needed: e.g., User Accounts, Content, Prohibited Uses, Intellectual Property, Termination, Limitation of Liability, Governing Law, Changes to These Terms, Contact Us */}
        <p className="mt-6">
          <strong>[Placeholder: This is a template. You should replace this with your full Terms and Conditions. Consult with a legal professional to ensure compliance.]</strong>
        </p>
      </div>
    </div>
  );
};

export default TermsAndConditionsPage;
