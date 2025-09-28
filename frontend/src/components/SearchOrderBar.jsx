import React, { useState } from 'react';

const SearchOrderBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(query.trim());
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-2 mb-6">
            <input
                type="text"
                className="border rounded px-3 py-2 w-full"
                placeholder="Cari produk atau No. Invoice..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <button
                type="submit"
                className="bg-[#1B263B] text-white px-4 py-2 rounded hover:bg-[#23304a]"
            >
                Cari
            </button>
        </form>
    );
};

export default SearchOrderBar;
