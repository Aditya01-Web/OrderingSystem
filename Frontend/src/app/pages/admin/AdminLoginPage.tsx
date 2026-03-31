import { useState } from 'react';
import { useNavigate } from 'react-router';
import { adminLogin } from '../../services/adminApi';
import { Coffee, Lock, User, Eye, EyeOff } from 'lucide-react'; // ✅ added Eye, EyeOff

export const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPassword, setShowPassword] = useState(false); // ✅ added

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await adminLogin(username, password);
      navigate('/admin/dashboard');
    } catch {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: '#F7F3ED' }}
    >
      <div
        className="w-full max-w-md p-8 rounded-2xl shadow-lg border"
        style={{ backgroundColor: '#fff', borderColor: '#C8BAA8' }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: '#3A6B35' }}
          >
            <Coffee className="w-8 h-8" style={{ color: '#F7F3ED' }} />
          </div>
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: '"Playfair Display", Georgia, serif', color: '#1C2B1A' }}
          >
            Admin Panel
          </h1>
          <p className="text-sm mt-1" style={{ color: '#6B7F68' }}>
            The Coffee Nest
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#1C2B1A' }}>
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#6B7F68' }} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none text-sm"
                style={{
                  borderColor: '#C8BAA8',
                  backgroundColor: '#F7F3ED',
                  color: '#1C2B1A',
                }}
              />
            </div>
          </div>

          {/* ✅ Password field with eye toggle */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#1C2B1A' }}>
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#6B7F68' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border outline-none text-sm"
                style={{
                  borderColor: '#C8BAA8',
                  backgroundColor: '#F7F3ED',
                  color: '#1C2B1A',
                }}
              />
              {/* Eye icon button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                style={{ color: '#6B7F68' }}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-center py-2 rounded-lg" style={{ backgroundColor: '#FEF2F2', color: '#DC2626' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-sm uppercase tracking-wide transition-all duration-200"
            style={{
              backgroundColor: loading ? '#A8C9A0' : '#3A6B35',
              color: '#F7F3ED',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};