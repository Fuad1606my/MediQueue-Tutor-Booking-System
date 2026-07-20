import './index.css';
import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import FindTutors from './pages/FindTutors';
import MyBookings from './pages/MyBookings';
import AddTutor from './pages/AddTutor';
import Auth from './pages/Auth';
import Profile from './pages/Profile';

function App() {
  const [activeTab, setActiveTab] = useState(() => {
    return sessionStorage.getItem('mediqueue_active_tab') || 'home';
  });

  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('mediqueue_session');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [redirectTarget, setRedirectTarget] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    sessionStorage.setItem('mediqueue_active_tab', activeTab);
    const titleMap = {
      home: "Home | MediQueue",
      find: "Tutors | MediQueue",
      bookings: "My Bookings | MediQueue",
      add: "Add Tutor | MediQueue",
      profile: "My Profile | MediQueue",
      auth: authMode === 'login' ? "Log In | MediQueue" : "Register | MediQueue"
    };
    document.title = titleMap[activeTab] || "MediQueue Tutor Hub";
  }, [activeTab, authMode]);

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
  };

  const handleAuthTabClick = (mode) => {
    setAuthMode(mode);
    setActiveTab('auth');
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('mediqueue_session');
    setUser(null);
    setActiveTab('home');
    setIsDropdownOpen(false);
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col justify-between font-sans">
      <div>
        {/* Navbar */}
        <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm px-6 md:px-16 h-16 flex justify-between items-center">
          
          {/* Logo */}
          <div 
            onClick={() => handleTabClick('home')} 
            className="flex items-center gap-2 cursor-pointer select-none group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-base shadow-sm group-hover:scale-105 transition-all">
              🎓
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tight">
              Medi<span className="text-blue-600">Queue</span>
            </span>
          </div>

          {/* Center Links */}
          <div className="flex items-center gap-2 bg-slate-100/70 p-1 rounded-full border border-slate-200/60 text-xs font-black">
            <button 
              onClick={() => handleTabClick('home')} 
              className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${activeTab === 'home' ? 'bg-blue-100 text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Home
            </button>
            <button 
              onClick={() => handleTabClick('find')} 
              className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${activeTab === 'find' ? 'bg-blue-100 text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Tutors
            </button>
            {user && (
              <>
                <button 
                  onClick={() => handleTabClick('add')} 
                  className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${activeTab === 'add' ? 'bg-blue-100 text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Add Tutor
                </button>
                <button 
                  onClick={() => handleTabClick('bookings')} 
                  className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${activeTab === 'bookings' ? 'bg-blue-100 text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  My Sessions
                </button>
              </>
            )}
          </div>

          {/* Right Auth Section */}
          <div className="flex items-center gap-3 text-xs font-black">
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                  className="w-9 h-9 rounded-full bg-blue-600 text-white font-black flex items-center justify-center border-2 border-slate-200 cursor-pointer shadow-sm hover:scale-105 transition-all"
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 font-bold text-slate-700">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-black text-slate-900 truncate">{user.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                    </div>
                    <button onClick={() => handleTabClick('profile')} className="w-full text-left px-4 py-2 hover:bg-slate-50 text-xs cursor-pointer">My Profile</button>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-red-50 text-xs text-red-600 border-t cursor-pointer">Sign out</button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button 
                  onClick={() => handleAuthTabClick('login')} 
                  className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${activeTab === 'auth' && authMode === 'login' ? 'bg-blue-100 text-blue-600 shadow-sm font-black' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Log in
                </button>
                <button 
                  onClick={() => handleAuthTabClick('register')} 
                  className={`px-5 py-2 rounded-full transition-all cursor-pointer shadow-sm ${activeTab === 'auth' && authMode === 'register' ? 'bg-blue-600 text-white font-black' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                >
                  Register
                </button>
              </>
            )}
          </div>
        </nav>

        {/* Main Content */}
        <main>
          {activeTab === 'home' && <Home setActiveTab={setActiveTab} />}
          {activeTab === 'find' && (
            <FindTutors 
              user={user} 
              setActiveTab={setActiveTab} 
              setRedirectTarget={setRedirectTarget} 
              setAuthMode={setAuthMode}
            />
          )}
          {activeTab === 'bookings' && (user ? <MyBookings user={user} /> : <Auth setUser={setUser} setActiveTab={setActiveTab} redirectTarget={redirectTarget} setRedirectTarget={setRedirectTarget} authMode={authMode} setAuthMode={setAuthMode} />)}
          {activeTab === 'add' && (user ? <AddTutor user={user} setActiveTab={setActiveTab} /> : <Auth setUser={setUser} setActiveTab={setActiveTab} redirectTarget={redirectTarget} setRedirectTarget={setRedirectTarget} authMode={authMode} setAuthMode={setAuthMode} />)}
          {activeTab === 'auth' && <Auth setUser={setUser} setActiveTab={setActiveTab} redirectTarget={redirectTarget} setRedirectTarget={setRedirectTarget} authMode={authMode} setAuthMode={setAuthMode} />}
          {activeTab === 'profile' && user && <Profile user={user} setUser={setUser} />}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-[#0b1329] text-slate-400 py-12 border-t border-slate-800 text-xs font-medium">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-blue-600 text-white flex items-center justify-center font-black text-xs">🎓</div>
              <span className="text-lg font-black text-white tracking-tight">MediQueue</span>
            </div>
            <p className="leading-relaxed text-slate-400 text-xs">Connecting students with expert tutors for a smarter, more organized learning experience.</p>
          </div>
          <div>
            <h4 className="font-black text-white uppercase tracking-wider mb-3 text-[11px]">Learning Services</h4>
            <ul className="space-y-2 text-slate-400">
              <li><button onClick={() => handleTabClick('find')} className="hover:text-white cursor-pointer">Browse Tutors</button></li>
              <li><button onClick={() => handleTabClick('home')} className="hover:text-white cursor-pointer">Book a Session</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-white uppercase tracking-wider mb-3 text-[11px]">Contact</h4>
            <p className="hover:text-white cursor-pointer">✉ support@mediqueue.edu</p>
            <p className="mt-1">📞 +1 (800) 555-LEARN</p>
            <p className="mt-1">📍 123 Campus Drive, Boston MA</p>
          </div>
          <div>
            <h4 className="font-black text-white uppercase tracking-wider mb-3 text-[11px]">Follow Us</h4>
            <div className="flex gap-3 text-white font-bold">
              <span className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 cursor-pointer transition-all">f</span>
              <span className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 cursor-pointer transition-all">x</span>
              <span className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 cursor-pointer transition-all">in</span>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-10 pt-4 border-t border-slate-800/80 flex justify-between items-center text-slate-500 text-[11px]">
          <p>&copy; 2026 MediQueue. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
            <span className="hover:underline cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;