import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

function SearchBar({ onSelect, onSubmit, onClear }) {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const searchContainerRef = useRef(null);
    const justSelectedRef = useRef(false);

    useEffect(() => {
        if (query.length < 2) {
            setSuggestions([]);
            return;
        }

        if (justSelectedRef.current) {
            justSelectedRef.current = false;
            return;
        }

        const debounceTimeout = setTimeout(() => {
            fetchSuggestions();
        }, 300);

        return () => clearTimeout(debounceTimeout);
    }, [query]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                searchContainerRef.current &&
                !searchContainerRef.current.contains(event.target)
            ) {
                setSuggestions([]);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [searchContainerRef]);

    const fetchSuggestions = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.get(
                `/products?search=${query}&limit=10&all=1`
            );
            let arr =
                response.data?.data?.data ||
                response.data?.data ||
                response.data;
            setSuggestions(Array.isArray(arr) ? arr : []);
        } catch (error) {
            console.error('Error fetching search suggestions:', error);
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const v = e.target.value;
        setQuery(v);
        if ((v || '').trim().length === 0 && onClear) {
            onClear();
        }
    };

    const handleClear = () => {
        setQuery('');
        setSuggestions([]);
        if (onClear) onClear();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            setSuggestions([]);
            if (onSubmit) {
                onSubmit(query);
            } else {
                navigate(`/search?q=${query}`);
            }
        }
    };

    return (
        <div
            className="relative w-full max-w-md mx-auto"
            ref={searchContainerRef}
        >
            <form onSubmit={handleSubmit} className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    placeholder="Cari produk..."
                    className="w-full px-4 py-2 pr-10 text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                    type="submit"
                    className="absolute top-0 right-0 mt-2 mr-3 text-gray-500 hover:text-gray-700"
                >
                    <Search size={24} />
                </button>
                {query && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute top-0 right-10 mt-2 mr-2 text-gray-400 hover:text-gray-600"
                    >
                        <X size={20} />
                    </button>
                )}
            </form>

            {suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                    <ul>
                        {suggestions.map((product) => (
                            <li
                                key={product.id}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                    setQuery(product.name || '');
                                    justSelectedRef.current = true;
                                    setSuggestions([]);
                                    if (onSelect) {
                                        onSelect(product);
                                    } else {
                                        navigate(`/product/${product.slug}`);
                                    }
                                }}
                            >
                                <div className="block">{product.name}</div>
                            </li>
                        ))}
                        {loading && (
                            <li className="px-4 py-2 text-gray-500">
                                Mencari...
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default SearchBar;