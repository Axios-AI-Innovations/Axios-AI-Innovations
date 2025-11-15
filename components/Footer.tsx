import Image from 'next/image';
import { Mail, Github } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    {/* Company Info */}
                    <div className="flex flex-col md:flex-row items-center md:items-start space-y-3 md:space-y-0 md:space-x-4">
                        <Image
                            src="/images/axios-ai-logo.png"
                            alt="Axios AI Innovations Logo"
                            width={40}
                            height={40}
                            className="w-10 h-10 object-contain"
                            style={{ filter: 'drop-shadow(0 2px 8px #1ac8ed99)' }}
                        />
                        <div className="text-center md:text-left">
                            <div className="font-bold text-lg text-white tracking-wide">
                                Axios AI <span className="font-light">Innovations</span>
                            </div>
                            <div className="text-sm text-gray-400 font-medium">
                                AI for the Work You Hate
                            </div>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="text-center space-y-3">
                        <div className="text-xs text-gray-500">Building AI tools from real pain points</div>
                        <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                            <Mail className="w-4 h-4" />
                            <span>CEO@axiosaiinnovations.com</span>
                        </div>
                    </div>

                    {/* Contact & Legal */}
                    <div className="flex flex-col items-center md:items-end space-y-3">
                        <div className="text-xs text-gray-500 text-center md:text-right">
                            Founded by Mark Schindler
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 mt-6 pt-4">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
                        <p className="text-gray-500 text-xs">
                            © {currentYear} Axios AI Innovations, LLC. All rights reserved.
                        </p>
                        <div className="flex items-center space-x-4 text-xs">
                            <a href="#" className="text-gray-500 hover:text-gray-300 transition-colors">
                                Privacy
                            </a>
                            <a href="#" className="text-gray-500 hover:text-gray-300 transition-colors">
                                Terms
                            </a>
                            <a
                                href="https://github.com/Axios-AI-Innovations"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-gray-500 hover:text-gray-300 transition-colors"
                            >
                                <Github className="w-3.5 h-3.5" />
                                <span>GitHub</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
