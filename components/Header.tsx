'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const handleSmoothScroll = (elementId: string) => {
    setIsMenuOpen(false);
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-cyan-500/20 bg-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center space-x-3 group"
            >
              <Image
                  src="/images/axios-ai-logo.png"
                  alt="Axios AI Symbol"
                  width={48}
                  height={48}
                  className="w-10 h-10 md:w-12 md:h-12 object-contain transition-transform group-hover:scale-110"
                  priority
              />
              <div>
                <div className="font-bold text-xl md:text-2xl text-white tracking-wide">
                  Axios AI <span className="font-light text-cyan-400">Innovations</span>
                </div>
                <div className="text-xs md:text-sm text-gray-400 font-medium">
                  AI for the Work You Hate
                </div>
              </div>
            </button>

            {/* Desktop CTA */}
            <div className="hidden lg:block">
              <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSmoothScroll('contact');
                  }}
                  className="px-6 py-2.5 rounded-xl font-bold text-black bg-gradient-to-r from-cyan-400 to-cyan-500 hover:shadow-[0_0_20px_rgba(0,255,255,0.6)] transition-all"
              >
                Free Consultation
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
                onClick={toggleMenu}
                className="lg:hidden p-2 text-white hover:text-cyan-400 rounded-lg transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
              <div className="lg:hidden py-4 border-t border-cyan-500/20">
                <div className="px-3">
                  <a
                      href="#contact"
                      onClick={(e) => {
                        e.preventDefault();
                        handleSmoothScroll('contact');
                      }}
                      className="w-full px-4 py-2.5 rounded-xl font-bold text-black bg-gradient-to-r from-cyan-400 to-cyan-500 transition-all block text-center"
                  >
                    Free Consultation
                  </a>
                </div>
              </div>
          )}
        </div>
      </header>
  );
};

export default Header;
