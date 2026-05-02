import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, googleLogin } = useAuth();


  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
    }
  };


  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card max-w-md w-full p-8"
      >
        <div className="text-center mb-8">
           <h1 className="text-3xl font-black mb-2">Welcome Back</h1>
           <p className="text-gray-500">Log in to your NOTO account</p>
           {error && <p className="mt-4 text-sm font-bold text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">{error}</p>}
        </div>


        <form onSubmit={handleSubmit} className="space-y-6">
           <div>
              <label className="block text-sm font-bold mb-2">Email Address</label>
              <div className="relative">
                 <input 
                   type="email" 
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   className="w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                   style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--border-color)', '--tw-ring-color': 'var(--primary-color)' }}
                   placeholder="name@example.com"
                   required
                 />
                 <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>
           </div>

           <div>
              <label className="block text-sm font-bold mb-2">Password</label>
              <div className="relative">
                 <input 
                   type="password" 
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   className="w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                   style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--border-color)', '--tw-ring-color': 'var(--primary-color)' }}
                   placeholder="••••••••"
                   required
                 />
                 <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>
              <div className="text-right mt-2">
                 <a href="#" className="text-xs font-bold text-primary-color hover:underline" style={{ color: 'var(--primary-color)' }}>Forgot Password?</a>
              </div>
           </div>

           <button type="submit" disabled={loading} className="w-full btn-primary py-3 flex items-center justify-center space-x-2 disabled:opacity-50">
              <LogIn size={20} />
              <span>{loading ? 'Logging in...' : 'Login'}</span>
           </button>

        </form>

        <div className="my-8 flex items-center">
           <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800"></div>
           <span className="px-4 text-xs text-gray-400 uppercase font-bold">Or continue with</span>
           <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800"></div>
        </div>

        <div className="flex justify-center">
            <GoogleLogin 
              onSuccess={credentialResponse => {
                googleLogin(credentialResponse.credential).then(success => {
                  if(success) navigate('/');
                  else setError('Google Login Failed');
                });
              }}
              onError={() => setError('Google Login Failed')}
              useOneTap
              theme="filled_black"
              shape="pill"
              text="continue_with"
            />
         </div>

        <p className="mt-8 text-center text-sm text-gray-500">
           Don't have an account? <Link to="/register" className="font-bold text-primary-color hover:underline" style={{ color: 'var(--primary-color)' }}>Sign Up</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
