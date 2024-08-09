import React from 'react';

const AboutPage = () => {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">About ClaroPDF</h1>
        <p className="text-xl mb-8">
          ClaroPDF is an AI-powered web application that revolutionizes the way you work with PDFs. Our mission is to help businesses and individuals unlock valuable insights from their documents, enabling them to make data-driven decisions and streamline their workflows.
        </p>
        <p className="text-xl mb-8">
          With ClaroPDF, you can easily upload your PDFs and let our advanced AI algorithms analyze the content, extract key information, and present it in a clear and concise format. Our interactive data visualization tools allow you to explore and gain deeper insights from your documents.
        </p>
        <p className="text-xl mb-8">
          Whether you're working with financial reports, research papers, legal contracts, or any other type of PDF, ClaroPDF simplifies the process of extracting actionable intelligence from your documents. Say goodbye to manual data entry and hours spent poring over complex PDFs.
        </p>
        <p className="text-xl">
          Join the countless businesses and individuals who have already transformed the way they work with PDFs using ClaroPDF. Experience the power of AI-driven document analysis and take your productivity to the next level.
        </p>
      </div>
    </section>
  );
};

export default AboutPage;