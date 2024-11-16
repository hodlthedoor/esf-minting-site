import React from 'react';
import { Twitter } from 'lucide-react';
import Image from 'next/image';
import leaf from '@/images/leaf.png';

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 backdrop-blur-sm border-t border-cyan-500/10" style={{ zIndex: 50 }}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Left side */}
          <div className="text-sm text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">
            powered by esf.tools
          </div>
          
          {/* Right side */}
          <div className="flex items-center space-x-4">
            <a 
              href="https://x.com/digijointz" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-cyan-400/70 hover:text-cyan-400 transition-colors"
            >
              <Twitter size={40} />
            </a>
            
            <a 
              href="https://gethype.digital/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-cyan-400/70 hover:text-cyan-400 transition-colors"
            >
              <Image 
                src={leaf}
                alt="Cannabis Icon" 
                width={40} 
                height={40}
                className="opacity-70 hover:opacity-100 transition-opacity"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;