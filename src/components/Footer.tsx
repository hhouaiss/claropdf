import React from 'react';
import { MailIcon, TwitterIcon } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold">ClaroPDF</h3>
          <p className="mt-2 text-gray-400">&copy; {new Date().getFullYear()} All rights reserved.</p>
        </div>
        <div className="flex space-x-4">
          <a href="mailto:hello@claropdf.com" target="_blank" rel="noopener noreferrer">
            <MailIcon className="h-6 w-6 hover:text-gray-400" />
          </a>
          {/* <a href="https://github.com/mywebapp" target="_blank" rel="noopener noreferrer">
            <GithubIcon className="h-6 w-6 hover:text-gray-400" />
          </a> */}
          <a href="https://twitter.com/HHouaiss" target="_blank" rel="noopener noreferrer">
            <TwitterIcon className="h-6 w-6 hover:text-gray-400" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;