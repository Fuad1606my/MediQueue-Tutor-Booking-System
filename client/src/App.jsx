import './index.css';
import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import FindTutors from './pages/FindTutors';
import MyBookings from './pages/MyBookings';
import AddTutor from './pages/AddTutor';
import MyTutors from './pages/MyTutors';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import { Menu, X, Mail, Phone, MapPin } from 'lucide-react';

function App() {
  const getTabFromHash = () => {
    const hash = window.location.hash.replace('#', '');
    const validTabs = ['home', 'find', 'bookings', 'add', 'my-tutors', 'auth', 'profile'];
    if (validTabs.includes(hash)) return hash;
    return sessionStorage.getItem('mediqueue_active_tab') || 'home';
  };

  const [activeTab, setActiveTab] = useState(getTabFromHash);
  const [authMode, setAuthMode] = useState('login');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('mediqueue_session') || localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [redirectTarget, setRedirectTarget] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handlePopState = () => {
      const currentTab = getTabFromHash();
      setActiveTab(currentTab);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    sessionStorage.setItem('mediqueue_active_tab', activeTab);
    if (window.location.hash.replace('#', '') !== activeTab) {
      window.history.pushState(null, '', `#${activeTab}`);
    }
  }, [activeTab]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('mediqueue_session', JSON.stringify(user));
    } else {
      localStorage.removeItem('mediqueue_session');
    }
  }, [user]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthTabClick = (mode) => {
    setAuthMode(mode);
    setActiveTab('auth');
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('mediqueue_session');
    localStorage.removeItem('user');
    setUser(null);
    setActiveTab('home');
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const validTabs = ['home', 'find', 'bookings', 'add', 'my-tutors', 'auth', 'profile'];

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col justify-between font-sans">
      <div>
        <nav className="bg-white/90 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50 shadow-sm px-4 md:px-12 h-16 flex justify-between items-center">
          
          {/* Brand Logo */}
          <div 
            onClick={() => handleTabClick('home')} 
            className="flex items-center gap-2.5 cursor-pointer select-none group transition-all duration-300 hover:scale-105"
            title="Go to Home"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-md group-hover:rotate-6 transition-all duration-300">
              🎓
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tight transition-colors duration-300 group-hover:text-blue-600">
              Medi<span className="text-blue-600">Queue</span>
            </span>
          </div>

          {/* Desktop Nav Pills */}
          <div className="hidden md:flex items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-full border border-slate-200/60 text-xs font-black shadow-inner">
            <button 
              onClick={() => handleTabClick('home')} 
              className={`px-4 py-1.5 rounded-full transition-all duration-300 cursor-pointer hover:scale-105 ${activeTab === 'home' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' : 'text-slate-600 hover:text-blue-600'}`}
            >
              Home
            </button>
            <button 
              onClick={() => handleTabClick('find')} 
              className={`px-4 py-1.5 rounded-full transition-all duration-300 cursor-pointer hover:scale-105 ${activeTab === 'find' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' : 'text-slate-600 hover:text-blue-600'}`}
            >
              Tutors
            </button>
            {user && (
              <>
                <button 
                  onClick={() => handleTabClick('add')} 
                  className={`px-4 py-1.5 rounded-full transition-all duration-300 cursor-pointer hover:scale-105 ${activeTab === 'add' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' : 'text-slate-600 hover:text-blue-600'}`}
                >
                  Add Tutor
                </button>
                <button 
                  onClick={() => handleTabClick('my-tutors')} 
                  className={`px-4 py-1.5 rounded-full transition-all duration-300 cursor-pointer hover:scale-105 ${activeTab === 'my-tutors' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' : 'text-slate-600 hover:text-blue-600'}`}
                >
                  My Tutors
                </button>
                <button 
                  onClick={() => handleTabClick('bookings')} 
                  className={`px-4 py-1.5 rounded-full transition-all duration-300 cursor-pointer hover:scale-105 ${activeTab === 'bookings' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' : 'text-slate-600 hover:text-blue-600'}`}
                >
                  My Sessions
                </button>
              </>
            )}
          </div>

          {/* User Controls */}
          <div className="hidden md:flex items-center gap-3 text-xs font-black">
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                  className="w-9 h-9 rounded-full bg-blue-600 text-white font-black flex items-center justify-center border-2 border-slate-200 cursor-pointer shadow-sm hover:scale-105 transition-all"
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 font-bold text-slate-700 animate-in fade-in duration-200">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-black text-slate-900 truncate">{user.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                    </div>
                    <button onClick={() => handleTabClick('profile')} className="w-full text-left px-4 py-2 hover:bg-blue-50 hover:text-blue-600 text-xs transition-all cursor-pointer">My Profile</button>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-red-50 text-xs text-red-600 border-t cursor-pointer transition-all">Sign out</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-2">
                <button 
                  onClick={() => handleAuthTabClick('login')} 
                  className={`px-4 py-2 rounded-full transition-all duration-300 cursor-pointer ${activeTab === 'auth' && authMode === 'login' ? 'bg-blue-100 text-blue-600 font-black' : 'text-slate-600 hover:text-blue-600'}`}
                >
                  Log in
                </button>
                <button 
                  onClick={() => handleAuthTabClick('register')} 
                  className="px-5 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 cursor-pointer shadow-md"
                >
                  Register
                </button>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="md:hidden p-2 text-slate-700 hover:text-blue-600 rounded-xl bg-slate-100 transition-all"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </nav>

        {/* Mobile Nav Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-6 py-4 space-y-3 font-black text-xs text-slate-700 shadow-xl">
            <button onClick={() => handleTabClick('home')} className={`block w-full text-left py-2 px-3 rounded-xl ${activeTab === 'home' ? 'bg-blue-50 text-blue-600' : ''}`}>Home</button>
            <button onClick={() => handleTabClick('find')} className={`block w-full text-left py-2 px-3 rounded-xl ${activeTab === 'find' ? 'bg-blue-50 text-blue-600' : ''}`}>Tutors</button>
            {user ? (
              <>
                <button onClick={() => handleTabClick('add')} className={`block w-full text-left py-2 px-3 rounded-xl ${activeTab === 'add' ? 'bg-blue-50 text-blue-600' : ''}`}>Add Tutor</button>
                <button onClick={() => handleTabClick('my-tutors')} className={`block w-full text-left py-2 px-3 rounded-xl ${activeTab === 'my-tutors' ? 'bg-blue-50 text-blue-600' : ''}`}>My Tutors</button>
                <button onClick={() => handleTabClick('bookings')} className={`block w-full text-left py-2 px-3 rounded-xl ${activeTab === 'bookings' ? 'bg-blue-50 text-blue-600' : ''}`}>My Sessions</button>
                <button onClick={() => handleTabClick('profile')} className={`block w-full text-left py-2 px-3 rounded-xl ${activeTab === 'profile' ? 'bg-blue-50 text-blue-600' : ''}`}>My Profile</button>
                <button onClick={handleLogout} className="block w-full text-left py-2 px-3 text-red-600 border-t mt-2 pt-2">Sign out</button>
              </>
            ) : (
              <div className="pt-2 border-t flex flex-col gap-2">
                <button onClick={() => handleAuthTabClick('login')} className="w-full py-2 bg-slate-100 rounded-xl text-center">Log in</button>
                <button onClick={() => handleAuthTabClick('register')} className="w-full py-2 bg-blue-600 text-white rounded-xl text-center">Register</button>
              </div>
            )}
          </div>
        )}

        <main>
          {activeTab === 'home' && <Home user={user} setActiveTab={setActiveTab} setRedirectTarget={setRedirectTarget} setAuthMode={setAuthMode} />}
          {activeTab === 'find' && <FindTutors user={user} setActiveTab={setActiveTab} setRedirectTarget={setRedirectTarget} setAuthMode={setAuthMode} />}
          {activeTab === 'bookings' && (user ? <MyBookings user={user} /> : <Auth setUser={setUser} setActiveTab={setActiveTab} redirectTarget={redirectTarget} setRedirectTarget={setRedirectTarget} authMode={authMode} setAuthMode={setAuthMode} />)}
          {activeTab === 'add' && (user ? <AddTutor user={user} setActiveTab={setActiveTab} /> : <Auth setUser={setUser} setActiveTab={setActiveTab} redirectTarget={redirectTarget} setRedirectTarget={setRedirectTarget} authMode={authMode} setAuthMode={setAuthMode} />)}
          {activeTab === 'my-tutors' && (user ? <MyTutors user={user} /> : <Auth setUser={setUser} setActiveTab={setActiveTab} redirectTarget={redirectTarget} setRedirectTarget={setRedirectTarget} authMode={authMode} setAuthMode={setAuthMode} />)}
          {activeTab === 'auth' && <Auth setUser={setUser} setActiveTab={setActiveTab} redirectTarget={redirectTarget} setRedirectTarget={setRedirectTarget} authMode={authMode} setAuthMode={setAuthMode} />}
          {activeTab === 'profile' && user && <Profile user={user} setUser={setUser} />}
          {!validTabs.includes(activeTab) && <NotFound setActiveTab={setActiveTab} />}
        </main>
      </div>

      <footer className="bg-[#0b1329] text-slate-400 py-14 border-t border-slate-800/80 text-xs font-medium">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <div onClick={() => handleTabClick('home')} className="flex items-center gap-2 cursor-pointer select-none group w-fit">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-md">🎓</div>
              <span className="text-xl font-black text-white tracking-tight">MediQueue</span>
            </div>
            <p className="leading-relaxed text-slate-400 text-xs max-w-xs">Connecting students with expert tutors for a smarter, more organized learning experience.</p>
          </div>

          <div className="space-y-3">
            <h4 className="font-black uppercase tracking-wider text-[11px] text-slate-200">LEARNING SERVICES</h4>
            <ul className="space-y-2.5 text-slate-400">
              <li><button onClick={() => handleTabClick('find')} className="hover:text-blue-400 transition-colors cursor-pointer text-left">Browse Tutors</button></li>
              <li><button onClick={() => handleTabClick('find')} className="hover:text-blue-400 transition-colors cursor-pointer text-left">Book a Session</button></li>
              <li><button onClick={() => handleTabClick('find')} className="hover:text-blue-400 transition-colors cursor-pointer text-left">Subject Catalogue</button></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-black uppercase tracking-wider text-[11px] text-slate-200">CONTACT</h4>
            <div className="space-y-2.5 text-slate-400">
              <a href="mailto:fuad1606mym@gmail.com" className="flex items-center gap-2 hover:text-blue-400"><Mail className="w-3.5 h-3.5 text-blue-500" /> fuad1606mym@gmail.com</a>
              <a href="tel:+8801811394590" className="flex items-center gap-2 hover:text-blue-400"><Phone className="w-3.5 h-3.5 text-blue-500" /> +8801811-394590</a>
              <p className="flex items-start gap-2 leading-tight pt-1"><MapPin className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" /> <span>Sector-10, Uttara, Dhaka-1230, Bangladesh</span></p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-black uppercase tracking-wider text-[11px] text-slate-200">FOLLOW US</h4>
            <div className="flex items-center gap-3">
              <a href="https://www.facebook.com/FardinAlFuad" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:bg-blue-600 hover:text-white transition"><svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
              <a href="https://github.com/Fuad1606my" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:bg-blue-600 hover:text-white transition"><svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg></a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12 pt-6 border-t border-slate-800/80 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-[11px]">
          <p>&copy; 2026 MediQueue. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;