import React from 'react';

const RefundPolicyPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Refunds & Cancellations Policy</h1>
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md prose lg:prose-xl">
        <p className="mb-4">
          Thank you for choosing Session Intimate Care. We strive to provide the best service possible. 
          This policy outlines the terms for refunds and cancellations.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">Cancellations</h2>
        <p>
          If you need to cancel your scheduled session, please notify us at least [e.g., 24 hours] in advance. 
          Cancellations made with less than [e.g., 24 hours] notice may be subject to a cancellation fee or forfeiture of the session fee.
        </p>
        <p>
          To cancel a session, please contact us via [Your Preferred Contact Method, e.g., email at support@sessionintimatecare.com or through your user dashboard].
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">Refunds</h2>
        <p>
          Refunds for services are handled on a case-by-case basis. We are committed to customer satisfaction and will consider refunds under the following circumstances:
        </p>
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li>Service was not provided as described.</li>
          <li>Technical issues on our part prevented the service delivery.</li>
          <li>Cancellation was made within the allowed timeframe as per our cancellation policy.</li>
        </ul>
        <p>
          If a refund is approved, it will be processed within [e.g., 7-10 business days] to the original method of payment.
        </p>
        <p>
          No refunds will be issued for sessions that have already been completed, except in cases of gross misconduct or failure to provide the service as agreed upon from our side.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">No-Show Policy</h2>
        <p>
          If you fail to attend a scheduled session without prior notification (no-show), you may not be eligible for a refund or rescheduling.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">Changes to this Policy</h2>
        <p>
          We reserve the right to modify this refund and cancellation policy at any time. Any changes will be effective immediately upon posting the updated policy on our website.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">Contact Us</h2>
        <p>
          If you have any questions about our Refunds and Cancellations Policy, please contact us at <a href="mailto:support@sessionintimatecare.com" className="text-blue-600 hover:underline">support@sessionintimatecare.com</a>.
        </p>

        <p className="mt-6">
          <strong>[Placeholder: This is a template. You should replace this with your full Refund and Cancellation Policy. Consult with a legal professional to ensure compliance.]</strong>
        </p>
      </div>
    </div>
  );
};

export default RefundPolicyPage;
