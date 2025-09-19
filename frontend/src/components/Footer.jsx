import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="bg-gray-800 text-white mt-auto">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">

                    <div>
                        <h3 className="font-bold text-lg mb-2">TokoKita</h3>
                        <p className="text-gray-400">
                            Platform e-commerce terpercaya Anda untuk semua
                            kebutuhan fashion, elektronik, dan lainnya.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg mb-2">Link Cepat</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    to="/about"
                                    className="text-gray-400 hover:text-white"
                                >
                                    Tentang Kami
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/contact"
                                    className="text-gray-400 hover:text-white"
                                >
                                    Hubungi Kami
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/faq"
                                    className="text-gray-400 hover:text-white"
                                >
                                    FAQ
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg mb-2">Ikuti Kami</h3>
                        <div className="flex justify-center md:justify-start space-x-4">
                            <a
                                href="#"
                                className="text-gray-400 hover:text-white"
                            >
                                Facebook
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-white"
                            >
                                Twitter
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-white"
                            >
                                Instagram
                            </a>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-500">
                    <p>
                        &copy; {new Date().getFullYear()} TokoKita. All rights
                        reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
