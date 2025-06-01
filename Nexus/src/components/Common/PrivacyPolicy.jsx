import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="w-11/12 max-w-maxContent mx-auto py-10 text-richblack-200">
      <h1 className="text-3xl font-semibold text-richblack-5 mb-6">Privacy Policy</h1>

      {/* Introduction */}
      {/* <section className="mb-6">
        <h2 className="text-xl font-semibold text-richblack-5 mb-2">Introduction</h2>
        <p className="text-sm">
          At NexusCoding, we are committed to protecting your privacy and ensuring a safe experience on our platform.
          This Privacy Policy outlines how we collect, use, and protect your information for all users including students and instructors.
        </p>
      </section> */}

      {/* Information Collection */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-richblack-5 mb-2">Information We Collect</h2>
        <p className="text-sm">
          We may collect personal information such as your name, email address, payment information, and course interactions
          to provide and improve our services.
        </p>
      </section>

      {/* Instructor Revenue */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-richblack-5 mb-2">Instructor Revenue Policy</h2>
        <p className="text-sm">
          Instructors who publish courses on our platform receive 80% of the total revenue from each course sale.
          The remaining 20% is retained by NexusCoding as a service fee to support platform maintenance, marketing, and operational costs.
        </p>
      </section>

      {/* How We Use Info */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-richblack-5 mb-2">How We Use Your Information</h2>
        <ul className="list-disc ml-6 text-sm space-y-1">
          <li>To process transactions securely</li>
          <li>To deliver course content and updates</li>
          <li>To improve our services and user experience</li>
          <li>To communicate important updates and offers</li>
        </ul>
      </section>

      {/* Third-Party Sharing */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-richblack-5 mb-2">Third-party Sharing</h2>
        <p className="text-sm">
          We do not sell your data to third parties. However, we may share data with trusted services that help us operate our platform,
          such as payment processors and email providers.
        </p>
      </section>

      {/* Your Rights */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-richblack-5 mb-2">Your Rights</h2>
        <p className="text-sm">
          You have the right to access, modify, or delete your personal information.
          To exercise these rights, please contact our support team.
        </p>
      </section>

      {/* For Students */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-richblack-5 mb-2">For Students</h2>
        <p className="text-sm">
          NexusCoding is committed to providing a safe and supportive environment for students.
          Student data is collected solely for educational and administrative purposes, such as course progress tracking, certification,
          and personalized learning. We protect student information in accordance with data protection laws and never share it with
          unauthorized parties. Students can manage their personal data and communication preferences in their account settings.
        </p>
      </section>

      {/* Policy Updates */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-richblack-5 mb-2">Policy Updates</h2>
        <p className="text-sm">
          This policy may be updated from time to time. We encourage users to review this page regularly for the latest information.
        </p>
      </section>

      {/* Optional Contact Section */}
      {/* 
      <div className="text-sm mt-6">
        If you have any questions, please contact us at{" "}
        <a href="mailto:support@nexuscoding.com" className="text-blue-400 underline">
          support@nexuscoding.com
        </a>.
      </div>
      */}
    </div>
  );
};

export default PrivacyPolicy;
