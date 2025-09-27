// src/components/BannerSlider.jsx
import React, { useEffect, useRef, useState } from 'react';

export default function BannerSlider({ slides = [], height = '80vh' }) {
  // SVG placeholder generator (no external assets needed)
  const ph = (label, a = '#1B263B', b = '#415A77') =>
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='1600' height='900'>
        <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0%' stop-color='${a}'/><stop offset='100%' stop-color='${b}'/>
        </linearGradient></defs>
        <rect width='100%' height='100%' fill='url(#g)'/>
        <circle cx='75%' cy='35%' r='260' fill='white' fill-opacity='0.08'/>
        <rect width='100%' height='100%' fill='black' fill-opacity='0.18'/>
        <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
              font-family='Poppins, Arial, sans-serif' font-size='64' fill='white' opacity='0.95'>${label}</text>
      </svg>`
    );

  const fallback = [
    { src: ph('Banner 1'), title: 'A suit and A shoe' },
    { src: ph('Banner 2'), title: 'New arrivals for you' },
    { src: ph('Banner 3'), title: 'Deals of the week' },
  ];
  const safeSlides = slides.length ? slides : fallback;

  const [index, setIndex] = useState(0);
  const timer = useRef(null);
  const AUTOPLAY_MS = 4000;

  const next = () => setIndex(i => (i + 1) % safeSlides.length);
  const prev = () => setIndex(i => (i - 1 + safeSlides.length) % safeSlides.length);
  const goTo = i => setIndex(i);

  const start = () => { stop(); timer.current = setInterval(next, AUTOPLAY_MS); };
  const stop  = () => { if (timer.current) clearInterval(timer.current); };

  useEffect(() => { start(); return stop; }, [safeSlides.length]);

  // touch swipe
  const startX = useRef(null);
  const onTouchStart = e => (startX.current = e.changedTouches[0].clientX);
  const onTouchEnd = e => {
    const dx = e.changedTouches[0].clientX - (startX.current ?? 0);
    if (Math.abs(dx) > 40) (dx < 0 ? next() : prev());
  };

  return (
    <div
      className="relative overflow-hidden rounded-[14px] bg-[#1B263B]"
      style={{ height, fontFamily: 'Poppins, ui-sans-serif, system-ui' }}
      onMouseEnter={stop}
      onMouseLeave={start}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      role="region"
      aria-label="Banner promosi"
    >
      {/* Slides */}
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${index * 100}%)`, width: `${safeSlides.length * 100}%` }}
      >
        {safeSlides.map((s, i) => (
          <div key={i} className="relative min-w-full h-full">
            {/* Full-bleed image */}
            <img
              src={s.src}
              alt={s.alt || s.title || 'banner'}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Bottom dark translucent gradient (2/3 of height) */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[66%] bg-gradient-to-t from-black/65 via-black/40 to-transparent" />

            {/* Text on the gradient */}
            <div className="absolute inset-x-0 bottom-0 h-[66%] flex items-end">
              <div className="px-6 md:px-10 pb-5 md:pb-8 max-w-3xl text-white">
                {s.kicker && (
                  <p className="text-xs md:text-sm tracking-wide uppercase opacity-90">{s.kicker}</p>
                )}
                {s.title && (
                  <h2 className="text-2xl md:text-4xl font-medium leading-tight">{s.title}</h2>
                )}
                {s.subtitle && s.subtitle.trim() !== '' && (
                  <p className="mt-1 text-sm md:text-base opacity-95">{s.subtitle}</p>
                )}
                {s.ctaText && s.ctaText.trim() !== '' && (
                  <a
                    href={s.ctaHref || '#'}
                    className="inline-block mt-4 px-5 py-2.5 rounded-full bg-white/90 text-[#1B263B] font-semibold hover:bg-white"
                  >
                    {s.ctaText}
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <button
        type="button" onClick={prev} aria-label="Sebelumnya"
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full p-3 bg-[#1B263B]/70 text-white hover:bg-[#1B263B]/90"
      >‹</button>
      <button
        type="button" onClick={next} aria-label="Berikutnya"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-3 bg-[#1B263B]/70 text-white hover:bg-[#1B263B]/90"
      >›</button>

      {/* Dots */}
      <div className="absolute bottom-3 w-full flex items-center justify-center gap-2">
        {safeSlides.map((_, i) => (
          <button
            key={i} type="button" onClick={() => goTo(i)} aria-label={`Slide ${i + 1}`}
            className={`h-2 w-2 rounded-full transition ${i === index ? 'bg-white' : 'bg-white/50 hover:bg-white/70'}`}
          />
        ))}
      </div>
    </div>
  );
}
