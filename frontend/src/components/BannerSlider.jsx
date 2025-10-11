import React from 'react';

export default function BannerSlider({ height = '40vh' }) {
    const createBannerBg = () =>
        'data:image/svg+xml;utf8,' +
        encodeURIComponent(
            `<svg xmlns='http://www.w3.org/2000/svg' width='1600' height='600' viewBox='0 0 1600 600'>
                <defs>
                    <linearGradient id='bg' x1='0%' y1='0%' x2='100%' y2='100%'>
                        <stop offset='0%' stop-color='#1B263B'/>
                        <stop offset='100%' stop-color='#415A77'/>
                    </linearGradient>
                    <radialGradient id='accent1' cx='80%' cy='20%' r='300'>
                        <stop offset='0%' stop-color='#778DA9' stop-opacity='0.4'/>
                        <stop offset='100%' stop-color='transparent'/>
                    </radialGradient>
                    <radialGradient id='accent2' cx='20%' cy='80%' r='250'>
                        <stop offset='0%' stop-color='#E0E1DD' stop-opacity='0.1'/>
                        <stop offset='100%' stop-color='transparent'/>
                    </radialGradient>
                </defs>
                <rect width='100%' height='100%' fill='url(#bg)'/>
                <circle cx='1280' cy='120' r='300' fill='url(#accent1)'/>
                <circle cx='320' cy='480' r='250' fill='url(#accent2)'/>
                <rect x='1200' y='200' width='200' height='200' rx='20' fill='white' opacity='0.03' transform='rotate(15 1300 300)'/>
                <rect x='200' y='100' width='150' height='150' rx='15' fill='white' opacity='0.05' transform='rotate(-20 275 175)'/>
                <polygon points='1400,400 1500,350 1550,450 1450,500' fill='white' opacity='0.04'/>
            </svg>`
        );

    const bannerContent = {
        src: createBannerBg(),
        title: 'Selamat Datang di TokoKita',
        subtitle: 'Platform belanja online terpercaya dengan ribuan produk berkualitas',
        ctaText: 'Jelajahi Produk'
    };

    const scrollToProducts = () => {
        const productHeader = document.querySelector('[data-section="products"] h2') ||
                              document.querySelector('#products h2') ||
                              document.querySelector('h2:contains("Produk Pilihan")') ||
                              document.querySelector('[data-section="products"]') ||
                              document.querySelector('#products');

        if (productHeader) {
            const productSection = productHeader.closest('section') || productHeader.parentElement;
            const offset = 100;
            const elementPosition = productSection.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        } else {
            window.scrollTo({
                top: window.innerHeight * 0.9,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div
            className="relative overflow-hidden rounded-2xl bg-[#1B263B] shadow-md"
            style={{ height, fontFamily: 'Poppins, ui-sans-serif, system-ui' }}
        >
            <div className="relative w-full h-full">
                {/* Background Image */}
                <img
                    src={bannerContent.src}
                    alt={bannerContent.title}
                    className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Content Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#1B263B]/70 via-[#1B263B]/40 to-transparent" />

                {/* Banner Content */}
                <div className="relative h-full flex items-center">
                    <div className="px-6 md:px-12 max-w-2xl">
                        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-3">
                            {bannerContent.title}
                        </h1>
                        <p className="text-sm md:text-lg text-white/90 leading-relaxed mb-4 max-w-lg">
                            {bannerContent.subtitle}
                        </p>
                        <button
                            onClick={scrollToProducts}
                            className="inline-flex items-center px-6 py-3 bg-white text-[#1B263B] font-semibold rounded-full hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg group"
                        >
                            {bannerContent.ctaText}
                            <svg
                                className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Decorative Circle */}
                <div className="absolute bottom-4 right-4 opacity-20">
                    <div className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center">
                        <div className="w-6 h-6 bg-white rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}