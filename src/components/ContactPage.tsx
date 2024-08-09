import React from 'react';

const ContactPage = () => {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
        <p className="text-xl mb-8">
          Have a question, feedback, or just want to say hello? We'd love to hear from you! Our team is always ready to assist you and provide the support you need.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
            <p className="mb-4">
              If you have any inquiries or need assistance, please don't hesitate to reach out to us using the contact information below:
            </p>
            <ul className="space-y-2">
              <li>
                <strong>Email:</strong> info@claropdf.com
              </li>
              <li>
                <strong>Phone:</strong> +1 (555) 123-4567
              </li>
              <li>
                <strong>Address:</strong> 123 Main St, Suite 456, Anytown, USA
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Send Us a Message</h2>
            <form>
              <div className="mb-4">
                <label htmlFor="name" className="block mb-2">Name</label>
                <input type="text" id="name" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600" required />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block mb-2">Email</label>
                <input type="email" id="email" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600" required />
              </div>
              <div className="mb-4">
                <label htmlFor="message" className="block mb-2">Message</label>
                <textarea id="message" rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600" required>
                </textarea>
              </div>
              <button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;