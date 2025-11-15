'use client';

import { useState } from 'react';
import { sendContactForm } from '@/lib/emailService';
import { Calendar, CheckCircle } from 'lucide-react';

// Define interfaces for type safety
interface FormData {
    name: string;
    email: string;
    company: string;
    role: string;
    challenge: string;
    companySize: string;
}

interface ValidationErrors {
    [key: string]: string;
}

const Custom = () => {
    // Initialize state with proper types
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        company: '',
        role: '',
        challenge: '',
        companySize: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

    // Form validation
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

        if (!formData.challenge.trim()) {
            errors.challenge = 'Please describe your challenge';
        }

        if (!formData.companySize) {
            errors.companySize = 'Company size is required';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Format as consultation request for email service
            const consultationDetails = `CONSULTATION REQUEST

Challenge/Need:
${formData.challenge}

Company Size: ${formData.companySize}
${formData.role ? `Role: ${formData.role}` : ''}

---
This is a free consultation request to assess fit.`;

            const success = await sendContactForm({
                name: formData.name,
                email: formData.email,
                company: formData.company,
                projectDetails: consultationDetails,
                budget: 'Consultation - TBD',
                timeline: 'Consultation - TBD',
                type: 'custom-project'
            });

            if (success) {
                setIsSubmitted(true);
                setFormData({
                    name: '',
                    email: '',
                    company: '',
                    role: '',
                    challenge: '',
                    companySize: ''
                });
            }
        } catch (error) {
            setError('Failed to send request. Please try again.');
            console.error('Form submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear validation error when user starts typing
        if (validationErrors[name]) {
            setValidationErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    if (isSubmitted) {
        return (
            <div className="max-w-2xl mx-auto p-6">
                <div className="bg-gradient-to-br from-gray-900 to-black border border-cyan-500/20 rounded-2xl shadow-2xl p-8 text-center">
                    <div className="mb-6">
                        <CheckCircle className="w-16 h-16 text-cyan-400 mx-auto" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4 text-white">Consultation Request Received!</h2>
                    <p className="text-gray-300 mb-6 text-lg">
                        We'll review your information and reach out within 24-48 hours to schedule a free consultation call to see if we're a good fit.
                    </p>
                    <button
                        onClick={() => setIsSubmitted(false)}
                        className="bg-cyan-600 text-white px-8 py-3 rounded-lg hover:bg-cyan-700 transition-colors font-medium"
                    >
                        Request Another Consultation
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="bg-gradient-to-br from-gray-900 to-black border border-cyan-500/20 rounded-2xl shadow-2xl p-8">
                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-black/40 backdrop-blur-xl mb-6">
                        <Calendar className="w-4 h-4 text-cyan-400" />
                        <span className="text-sm text-cyan-400 font-mono uppercase tracking-wider">
                            Free Consultation
                        </span>
                    </div>
                    
                    <h2 className="text-4xl md:text-5xl font-black mb-4"
                        style={{
                            background: 'linear-gradient(135deg, #00ffff 0%, #ffffff 50%, #ff00ff 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        Let's See If We're<br />A Good Fit
                    </h2>
                    
                    <p className="text-lg text-gray-400 max-w-xl mx-auto mb-2">
                        Book a free consultation to discuss your needs and see if we can help solve your challenges.
                    </p>
                    <p className="text-sm text-gray-500">
                        No obligation. Just a conversation to explore possibilities.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                                Your Name *
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className={`w-full p-3 bg-black/40 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-gray-500
                                    ${validationErrors.name ? 'border-red-500' : 'border-gray-700'}`}
                                placeholder="John Doe"
                                required
                            />
                            {validationErrors.name && (
                                <p className="mt-1 text-sm text-red-400">{validationErrors.name}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                Email *
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={`w-full p-3 bg-black/40 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-gray-500
                                    ${validationErrors.email ? 'border-red-500' : 'border-gray-700'}`}
                                placeholder="your@email.com"
                                required
                            />
                            {validationErrors.email && (
                                <p className="mt-1 text-sm text-red-400">{validationErrors.email}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                                Company *
                            </label>
                            <input
                                type="text"
                                id="company"
                                name="company"
                                value={formData.company}
                                onChange={handleInputChange}
                                className={`w-full p-3 bg-black/40 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-gray-500
                                    ${validationErrors.company ? 'border-red-500' : 'border-gray-700'}`}
                                placeholder="Your Company"
                                required
                            />
                            {validationErrors.company && (
                                <p className="mt-1 text-sm text-red-400">{validationErrors.company}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-2">
                                Your Role
                            </label>
                            <input
                                type="text"
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                className="w-full p-3 bg-black/40 border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-gray-500"
                                placeholder="CEO, CTO, etc. (Optional)"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="companySize" className="block text-sm font-medium text-gray-300 mb-2">
                            Company Size *
                        </label>
                        <select
                            id="companySize"
                            name="companySize"
                            value={formData.companySize}
                            onChange={handleInputChange}
                            className={`w-full p-3 bg-black/40 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white
                                ${validationErrors.companySize ? 'border-red-500' : 'border-gray-700'}`}
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
                            <p className="mt-1 text-sm text-red-400">{validationErrors.companySize}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="challenge" className="block text-sm font-medium text-gray-300 mb-2">
                            What challenge are you looking to solve? *
                        </label>
                        <textarea
                            id="challenge"
                            name="challenge"
                            value={formData.challenge}
                            onChange={handleInputChange}
                            rows={4}
                            className={`w-full p-3 bg-black/40 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-gray-500 resize-none
                                ${validationErrors.challenge ? 'border-red-500' : 'border-gray-700'}`}
                            placeholder="Describe the main challenge, pain point, or opportunity you'd like to discuss..."
                            required
                        />
                        {validationErrors.challenge && (
                            <p className="mt-1 text-sm text-red-400">{validationErrors.challenge}</p>
                        )}
                    </div>

                    {error && (
                        <div className="text-red-400 text-sm p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-4 px-6 rounded-lg hover:from-cyan-700 hover:to-blue-700
                            transition-all font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-cyan-600 disabled:hover:to-blue-600
                            shadow-lg shadow-cyan-500/20"
                    >
                        {isSubmitting ? 'Sending Request...' : 'Request Free Consultation'}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-800 text-center">
                    <p className="text-sm text-gray-400 mb-3">What to expect:</p>
                    <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4 text-cyan-400" />
                            Free consultation call
                        </span>
                        <span className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4 text-cyan-400" />
                            No pressure or sales pitch
                        </span>
                        <span className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4 text-cyan-400" />
                            Honest assessment of fit
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Custom;