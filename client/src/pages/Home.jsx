import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MapPin, Clock, ArrowRight } from 'lucide-react';
import axios from 'axios';

const slides = [
  {
    title: "From Struggling to Succeeding",
    desc: "Students who use MediQueue see a 40% grade improvement on average within just four weeks.",
    bgImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200"
  },
  {
    title: "Unlock Your Academic Potential",
    desc: "Connect with verified tutors across 50+ subjects and schedule sessions that fit your lifestyle.",
    bgImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200"
  },
  {
    title: "Expert Guidance, Built For You",
    desc: "Eliminate manual scheduling and prevent time slot conflicts with our optimized booking framework.",
    bgImage: "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?q=80&w=1200"
  }
];

const Home = ({ setActiveTab }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [tutors, setTutors] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    axios.get('http://localhost:5000/tutors')
      .then(res => setTutors(res.data.slice(0, 6)))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="font-sans bg-slate-50 space-y-16 pb-16">
      
      {/* 1. FIGMA HERO BANNER SLIDER WITH BACKGROUND IMAGE */}
      <div className="relative h-[500px] overflow-hidden w-full shadow-lg">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0 bg-cover bg-center flex items-center px-8 md:px-20"
            style={{ backgroundImage: `url(${slides[currentSlide].bgImage})` }}
          >
            {/* Dark Overlay for Text Readability */}
            <div className="absolute inset-0 bg-slate-900/75 backdrop-blur-[1px]"></div>

            <div className="max-w-2xl space-y-5 relative z-10 text-white">
              <span className="bg-blue-500/20 text-blue-300 text-xs font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full border border-blue-400/30">
                PROVEN RESULTS
              </span>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                {slides[currentSlide].title}
              </h1>
              <p className="text-base text-slate-200 font-medium leading-relaxed">
                {slides[currentSlide].desc}
              </p>
              <button onClick={() => setActiveTab('find')} className="mt-2 inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl transition-all shadow-md cursor-pointer text-sm uppercase tracking-wider">
                Find a Tutor <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrentSlide(i)} className={`h-2.5 rounded-full transition-all ${currentSlide === i ? 'bg-white w-8' : 'bg-white/40 w-2.5'}`} />
          ))}
        </div>
      </div>

      {/* 2. AVAILABLE TUTORS GRID ($limit: 6) */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
        <div className="flex justify-between items-end border-b pb-4">
          <div>
            <span className="text-xs font-black text-blue-600 uppercase tracking-widest">OUR EXPERTS</span>
            <h2 className="text-3xl font-black text-slate-900 mt-1">Available Tutors</h2>
          </div>
          <button onClick={() => setActiveTab('find')} className="text-blue-600 hover:text-blue-800 text-sm font-black flex items-center gap-1 cursor-pointer">
            View all <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutors.map(t => (
            <div key={t._id} className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-slate-200 p-5 space-y-4 relative flex flex-col justify-between">
              <span className={`absolute top-3 right-3 px-2.5 py-1 text-[10px] font-black rounded-lg text-white z-10 ${t.teachingMode === 'Online' ? 'bg-cyan-600' : 'bg-blue-600'}`}>
                {t.teachingMode || 'Online'}
              </span>
              <div className="w-full h-48 rounded-xl overflow-hidden bg-slate-100 border">
                <img src={t.image || '/male-avatar.jpg'} alt="" className="w-full h-full object-cover" onError={(e)=>e.target.src='/male-avatar.jpg'} />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900 truncate">{t.name}</h3>
                <p className="text-xs font-black text-blue-600">{t.language || t.subject}</p>
                <div className="flex items-center gap-1 text-amber-500 text-xs font-black mt-1">
                  <Star className="w-3.5 h-3.5 fill-current" /> 4.9 <span className="text-slate-400 font-bold">(112 reviews)</span>
                </div>
              </div>
              <div className="flex justify-between items-center border-t border-slate-100 pt-3 mt-2">
                <span className="text-xl font-black text-slate-900">${t.price || 45}<span className="text-xs text-slate-500 font-bold">/hr</span></span>
                <button onClick={() => setActiveTab('find')} className="px-4 py-2 bg-blue-600 text-white font-black text-xs rounded-xl hover:bg-blue-700 cursor-pointer shadow">
                  Book Session
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. HOW MEDIQUEUE WORKS */}
      <div className="bg-slate-100/80 py-14 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center space-y-8">
          <h2 className="text-2xl font-black text-slate-900">How MediQueue Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {[
              { step: "01", title: "Browse Tutors", desc: "Find your perfect match from vetted experts." },
              { step: "02", title: "Book a Session", desc: "Pick your preferred date and time." },
              { step: "03", title: "Start Learning", desc: "Get your token and improve your grades." }
            ].map((p, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2 relative shadow-sm">
                <span className="text-5xl font-black text-slate-100 absolute right-4 top-2">{p.step}</span>
                <h3 className="text-base font-black text-slate-900 relative z-10">{p.title}</h3>
                <p className="text-xs font-medium text-slate-600 leading-relaxed relative z-10">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;