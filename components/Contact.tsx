'use client';

import { ChangeEvent, MouseEvent, useState, useRef, useEffect } from 'react';
import { sendContactForm } from '@/lib/emailService';
import { Send, CheckCircle, Calendar } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ValidationErrors {
  [key: string]: string;
}

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    painPoint: '',
    timeSpent: '',
    companySize: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !formRef.current) return;

    // Entrance animation
    gsap.from(formRef.current, {
      scrollTrigger: {
        trigger: formRef.current,
        start: 'top 80%',
        end: 'top 20%',
        scrub: 1,
      },
      y: 100,
      opacity: 0,
      scale: 0.95,
    });
  }, []);

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }

    if (!formData.company.trim()) {
      errors.company = 'Company is required';
    }

    if (!formData.painPoint.trim()) {
      errors.painPoint = 'Please describe your challenge';
    }

    if (!formData.timeSpent) {
      errors.timeSpent = 'Time spent is required';
    }

    if (!formData.companySize) {
      errors.companySize = 'Company size is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const message = `PAIN POINT & CONSULTATION REQUEST

Pain Point/Challenge:
${formData.painPoint}

Time Spent Weekly: ${formData.timeSpent}
${formData.role ? `Role: ${formData.role}` : ''}
Company Size: ${formData.companySize || 'Not specified'}

---
This is a free consultation request to assess fit and discuss solutions.`;

      const success = await sendContactForm({
        name: formData.name,
        email: formData.email,
        company: formData.company || 'Not specified',
        message: message,
        type: 'pain-point-discovery'
      });

      if (success) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', company: '', role: '', painPoint: '', timeSpent: '', companySize: '' });
        setValidationErrors({});
        setTimeout(() => setIsSubmitted(false), 8000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to send. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear validation error when user starts typing
    if (validationErrors[e.target.name]) {
      setValidationErrors({
        ...validationErrors,
        [e.target.name]: ''
      });
    }
  };

  return (
    <section 
      ref={sectionRef}
      id="contact" 
      className="relative min-h-screen flex items-center justify-center py-20 bg-black overflow-hidden"
    >
      {/* Animated background - seamless transition from Hero */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black" />
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Grid overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      <div ref={formRef} className="relative z-10 max-w-3xl mx-auto px-4 w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-black/40 backdrop-blur-xl mb-6">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-cyan-400 font-mono uppercase tracking-wider">
              Free Consultation
            </span>
          </div>
          
          <h2 
            className="text-5xl md:text-6xl font-black mb-6"
            style={{
              background: 'linear-gradient(135deg, #00ffff 0%, #ffffff 50%, #ff00ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Let's See If<br />We're A Good Fit
          </h2>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Book a free consultation to discuss your challenges. No obligation—just a conversation to see if we can solve what's stealing your time.
          </p>
        </div>

        {/* Form */}
        {isSubmitted ? (
          <div className="chrome-surface chrome-edge text-center py-16 px-8 rounded-3xl">
            <CheckCircle className="w-20 h-20 text-cyan-400 mx-auto mb-6" />
            <h3 className="text-3xl font-bold text-white mb-4">Consultation Request Received!</h3>
            <p className="text-gray-300 text-lg max-w-md mx-auto">
              We'll review your information and reach out within 24-48 hours to schedule a free consultation call to see if we're a good fit.
            </p>
          </div>
        ) : (
          <div className="chrome-surface chrome-edge rounded-3xl p-8 md:p-12">
            <div className="space-y-6">
              {/* Name & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    aria-invalid={!!validationErrors.name}
                    aria-describedby={validationErrors.name ? 'error-name' : undefined}
                    className={`chrome-input w-full px-4 py-4 rounded-xl placeholder-gray-500 ${validationErrors.name ? 'border-red-500' : ''}`}
                    placeholder="Your name"
                    required
                  />
                  {validationErrors.name && (
                    <p id="error-name" className="mt-1 text-sm text-red-400" role="alert">
                      {validationErrors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    aria-invalid={!!validationErrors.email}
                    aria-describedby={validationErrors.email ? 'error-email' : undefined}
                    className={`chrome-input w-full px-4 py-4 rounded-xl placeholder-gray-500 ${validationErrors.email ? 'border-red-500' : ''}`}
                    placeholder="your@email.com"
                    required
                  />
                  {validationErrors.email && (
                    <p id="error-email" className="mt-1 text-sm text-red-400" role="alert">
                      {validationErrors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Company & Role */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">Company *</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    aria-invalid={!!validationErrors.company}
                    aria-describedby={validationErrors.company ? 'error-company' : undefined}
                    className={`chrome-input w-full px-4 py-4 rounded-xl placeholder-gray-500 ${validationErrors.company ? 'border-red-500' : ''}`}
                    placeholder="Your Company"
                    required
                  />
                  {validationErrors.company && (
                    <p id="error-company" className="mt-1 text-sm text-red-400" role="alert">
                      {validationErrors.company}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-2">Your Role</label>
                  <input
                    type="text"
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="chrome-input w-full px-4 py-4 rounded-xl placeholder-gray-500"
                    placeholder="CEO, CTO, etc. (Optional)"
                  />
                </div>
              </div>

              {/* Company Size */}
              <div>
                <label htmlFor="companySize" className="block text-sm font-medium text-gray-300 mb-2">
                  Company Size *
                </label>
                <select
                  id="companySize"
                  name="companySize"
                  value={formData.companySize}
                  onChange={handleChange}
                  aria-invalid={!!validationErrors.companySize}
                  aria-describedby={validationErrors.companySize ? 'error-companySize' : undefined}
                  className={`chrome-input w-full px-4 py-4 rounded-xl ${validationErrors.companySize ? 'border-red-500' : ''}`}
                  required
                >
                  <option value="">Select company size</option>
                  <option value="1-10 employees">1-10 employees</option>
                  <option value="11-50 employees">11-50 employees</option>
                  <option value="51-200 employees">51-200 employees</option>
                  <option value="201-1000 employees">201-1000 employees</option>
                  <option value="1000+ employees">1000+ employees</option>
                </select>
                {validationErrors.companySize && (
                  <p id="error-companySize" className="mt-1 text-sm text-red-400" role="alert">
                    {validationErrors.companySize}
                  </p>
                )}
              </div>

              {/* Pain Point */}
              <div>
                <label htmlFor="painPoint" className="block text-sm font-medium text-gray-300 mb-2">
                  What challenge are you looking to solve? *
                </label>
                <div className="mb-2 space-y-1">
                  <p className="text-sm text-gray-500">Examples:</p>
                  <ul className="text-sm text-gray-500 list-disc list-inside space-y-0.5 ml-2">
                    <li>Too much copy-paste admin work</li>
                    <li>Our team wastes time updating spreadsheets</li>
                    <li>We want AI, but don't know where to start</li>
                  </ul>
                </div>
                <textarea
                  id="painPoint"
                  name="painPoint"
                  value={formData.painPoint}
                  onChange={handleChange}
                  rows={4}
                  aria-invalid={!!validationErrors.painPoint}
                  aria-describedby={validationErrors.painPoint ? 'error-painPoint' : undefined}
                  className={`chrome-input w-full px-4 py-4 rounded-xl placeholder-gray-500 resize-none ${validationErrors.painPoint ? 'border-red-500' : ''}`}
                  placeholder="Describe the main challenge, pain point, or opportunity you'd like to discuss..."
                  required
                />
                {validationErrors.painPoint && (
                  <p id="error-painPoint" className="mt-1 text-sm text-red-400" role="alert">
                    {validationErrors.painPoint}
                  </p>
                )}
              </div>

              {/* Time Spent */}
              <div>
                <label htmlFor="timeSpent" className="block text-sm font-medium text-gray-300 mb-2">
                  How much time does this waste weekly? *
                </label>
                <select
                  id="timeSpent"
                  name="timeSpent"
                  value={formData.timeSpent}
                  onChange={handleChange}
                  aria-invalid={!!validationErrors.timeSpent}
                  aria-describedby={validationErrors.timeSpent ? 'error-timeSpent' : undefined}
                  className={`chrome-input w-full px-4 py-4 rounded-xl ${validationErrors.timeSpent ? 'border-red-500' : ''}`}
                  required
                >
                  <option value="">Select time range</option>
                  <option value="1-3 hours">1-3 hours</option>
                  <option value="4-6 hours">4-6 hours</option>
                  <option value="7-10 hours">7-10 hours</option>
                  <option value="10+ hours">10+ hours</option>
                </select>
                {validationErrors.timeSpent && (
                  <p id="error-timeSpent" className="mt-1 text-sm text-red-400" role="alert">
                    {validationErrors.timeSpent}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting || !formData.name || !formData.email || !formData.company || !formData.companySize || !formData.painPoint || !formData.timeSpent}
                className="chrome-button w-full px-8 py-5 text-lg rounded-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <span className="flex items-center justify-center gap-3">
                  {isSubmitting ? 'Sending Request...' : 'Request Free Consultation'}
                  <Send className="w-5 h-5" />
                </span>
              </button>

              <p className="text-center text-sm text-gray-500">
                🔒 We'll review your information and reach out within 24-48 hours to schedule a consultation.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Contact;
