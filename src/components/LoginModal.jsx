import React, { useState } from 'react';
import MagneticButton from './MagneticButton';

export function LoginModal({ isOpen, onClose, onAuthSuccess }) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'user'
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = activeTab === 'login' ? '/api/auth/login' : '/api/auth/register';
    const payload = activeTab === 'login' 
      ? { email: formData.email, password: formData.password }
      : formData;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        localStorage.setItem('takeback_token', result.token);
        onAuthSuccess(result.user, result.token);
        onClose();
        // Reset form
        setFormData({ name: '', email: '', password: '', phone: '', role: 'user' });
      } else {
        alert(result.message || 'Authentication failed. Please verify credentials.');
      }
    } catch (err) {
      console.error('Auth error:', err);
      alert('Unable to reach authentication server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-[#121613] border border-white/10 rounded-[28px] overflow-hidden shadow-2xl p-6 text-light-cream text-left">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-mint uppercase tracking-wider">// ACCESS GATEWAY AUTH</span>
            <h3 className="display-header text-xl font-bold uppercase">
              {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="text-white/40 hover:text-white text-xs font-mono bg-transparent border-none cursor-pointer"
          >
            [ CLOSE ]
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-white/10 mb-6 text-xs font-mono select-none">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 pb-3 text-center transition-colors cursor-pointer border-none bg-transparent ${
              activeTab === 'login' ? 'text-mint font-bold border-b-2 border-mint' : 'text-white/50 hover:text-white'
            }`}
          >
            SIGN IN
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 pb-3 text-center transition-colors cursor-pointer border-none bg-transparent ${
              activeTab === 'register' ? 'text-mint font-bold border-b-2 border-mint' : 'text-white/50 hover:text-white'
            }`}
          >
            REGISTER
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {activeTab === 'register' && (
            <>
              {/* Full Name */}
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-mono text-white/45 uppercase">Full Name:</label>
                <input 
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-xs text-light-cream placeholder:text-white/20 focus:ring-1 focus:ring-mint focus:outline-none"
                  style={{ minHeight: '40px' }}
                />
              </div>

              {/* Phone Number */}
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-mono text-white/45 uppercase">Phone Number:</label>
                <input 
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. 9876543210"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-xs text-light-cream placeholder:text-white/20 focus:ring-1 focus:ring-mint focus:outline-none"
                  style={{ minHeight: '40px' }}
                />
              </div>
            </>
          )}

          {/* Email Address */}
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-mono text-white/45 uppercase">Email Address:</label>
            <input 
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. member@takeback.com"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-xs text-light-cream placeholder:text-white/20 focus:ring-1 focus:ring-mint focus:outline-none"
              style={{ minHeight: '40px' }}
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-mono text-white/45 uppercase">Password:</label>
            <input 
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-xs text-light-cream placeholder:text-white/20 focus:ring-1 focus:ring-mint focus:outline-none"
              style={{ minHeight: '40px' }}
            />
          </div>

          {activeTab === 'register' && (
            /* Admin Debug Checkbox */
            <div className="flex items-center gap-2 mt-1">
              <input 
                type="checkbox"
                id="role-admin-toggle"
                checked={formData.role === 'admin'}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.checked ? 'admin' : 'user' }))}
                className="w-4 h-4 accent-mint bg-[#121613] border-white/10 rounded cursor-pointer"
              />
              <label htmlFor="role-admin-toggle" className="text-[10px] font-mono text-white/60 cursor-pointer select-none">
                Register as Admin operator role
              </label>
            </div>
          )}

          {/* Action Button */}
          <MagneticButton 
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-mint hover:bg-mint/90 text-deep-ink font-bold rounded-xl text-xs uppercase tracking-wider font-sans border-none cursor-pointer mt-2"
          >
            {loading ? 'Processing...' : activeTab === 'login' ? 'Sign In' : 'Create Account'}
          </MagneticButton>

          {activeTab === 'login' && (
            <div className="text-[9px] font-mono text-white/30 text-center mt-2">
              Tip: Admin credentials are <span className="text-mint">admin@takeback.com / admin123</span>
            </div>
          )}

        </form>
      </div>
    </div>
  );
}

export default LoginModal;
