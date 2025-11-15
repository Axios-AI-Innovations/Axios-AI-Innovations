'use client';

import { useEffect, useRef } from 'react';
import { ArrowDown } from 'lucide-react';
import ExperienceCanvas from '@/components/ExperienceCanvas';
import gsap from 'gsap';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!heroRef.current || !titleRef.current || !subtitleRef.current || !ctaRef.current) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    
    tl.from(titleRef.current, {
      y: 100,
      opacity: 0,
      duration: 1.2,
      delay: 0.3
    })
    .from(subtitleRef.current, {
      y: 50,
      opacity: 0,
      duration: 1,
    }, '-=0.6')
    .from(ctaRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 0.8
    }, '-=0.4');

  }, []);

  const handleScrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      {/* 3D Canvas - hidden on mobile, shown on md and up */}
      <div className="hidden md:block">
        <ExperienceCanvas />
      </div>

      {/* Static gradient fallback for mobile */}
      <div className="md:hidden absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-cyan-900/20 to-purple-900/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black" />
      </div>

      {/* Chrome grid overlay across entire hero */}
      <div className="absolute inset-0 chrome-grid opacity-30 pointer-events-none" />

      {/* Gradient fade to black at bottom */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black pointer-events-none" />

      {/* Radial gradient overlay behind H1 for better readability */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.5) 0%, transparent 70%)',
        }}
      />

      {/* Semi-opaque black layer behind hero text content area - more visible on mobile */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="bg-black/50 md:bg-black/30 rounded-3xl w-full max-w-6xl h-[60vh] md:h-[50vh] blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
        {/* Main Headline */}
        <h1 
          ref={titleRef}
          className="chrome-text text-6xl md:text-8xl lg:text-9xl font-black mb-8"
          style={{
            textShadow: '0 0 80px rgba(0, 255, 255, 0.5)',
            letterSpacing: '-0.02em'
          }}
        >
          AI for the Work<br />You Hate
        </h1>

        {/* Subtitle */}
        <p 
          ref={subtitleRef}
          className="text-xl md:text-3xl text-gray-200 mb-12 max-w-3xl mx-auto font-light"
          style={{
            textShadow: '0 0 30px rgba(255, 255, 255, 0.3), 0 2px 10px rgba(0, 0, 0, 0.5)'
          }}
        >
          Innovative automation built from real pain points.<br />
          <span className="chrome-text text-2xl md:text-3xl">Tell us what's stealing your time.</span>
        </p>

        {/* CTA */}
        <a
          ref={ctaRef}
          href="#contact"
          className="inline-block chrome-button px-12 py-6 text-xl rounded-full"
        >
          <span className="flex items-center gap-3">
            What's Your Pain Point?
            <ArrowDown className="w-6 h-6" />
          </span>
        </a>
      </div>

      {/* Chrome scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-cyan-400/50 flex items-start justify-center p-2 bg-black/40 backdrop-blur-sm">
          <div className="w-1 h-2 rounded-full bg-cyan-400 animate-pulse" style={{ boxShadow: '0 0 10px rgba(0, 255, 255, 0.8)' }} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
