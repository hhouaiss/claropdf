import React, { useState } from 'react';
import { Download, Share2 } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface DownloadShareProps {
  analysisResult: any;
  pdfName: string;
}

const DownloadShareButtons: React.FC<DownloadShareProps> = ({ analysisResult, pdfName }) => {
  const [isShared, setIsShared] = useState(false);

  const handleDownload = async () => {
    const element = document.getElementById('analysis-content');
    if (!element) return;

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${pdfName}_analysis.pdf`);
  };

  const handleShare = async () => {
    const shareableLink = `${window.location.origin}/analysis/${analysisResult.id}`;
    
    try {
      await navigator.clipboard.writeText(shareableLink);
      setIsShared(true);
      setTimeout(() => setIsShared(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="flex space-x-4">
      {/* <button 
        onClick={handleDownload}
        className="text-gray-500 hover:text-gray-700 transition-colors" 
        aria-label="Download"
      >
        <Download size={24} />
      </button> */}
      <button 
        onClick={handleShare}
        className="text-gray-500 hover:text-gray-700 transition-colors relative" 
        aria-label="Share"
      >
        <Share2 size={24} />
        {isShared && (
          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded">
            Link copied!
          </span>
        )}
      </button>
    </div>
  );
};

export default DownloadShareButtons;