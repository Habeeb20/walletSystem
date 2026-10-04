/* eslint-disable react/no-unescaped-entities */
import  { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { TailSpin } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';
import WalletLoadingAnimation from '../../resources/wallet';

// Use the same base URL your authSlice uses for API calls.
const API_URL = import.meta.env.VITE_BACKEND_URL ?? '';
const RESEND_SECONDS = 60;

async function postJson(path, body) {
  const res = await fetch(`${API_URL}/auth/login-email/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // lets the backend set the httpOnly auth cookie
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || data.message || 'Something went wrong. Try again.');
  return data;
}

const EmailLoginPage = () => {
  const [step, setStep] = useState('email'); // 'email' -> 'code'
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  // Countdown before the user can ask for another code
  useEffect(() => {
    if (secondsLeft <= 0) return undefined;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const sendCode = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      await postJson('request', { email: email.trim() });
      setStep('code');
      setCode('');
      setSecondsLeft(RESEND_SECONDS);
      enqueueSnackbar('Check your email for the login code.', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar(err.message, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await postJson('verify', { email: email.trim(), code });
      enqueueSnackbar('Login successful!', { variant: 'success' });
      // The backend sets an httpOnly auth cookie on success, same as password login.
      navigate('/dashboard');
    } catch (err) {
      enqueueSnackbar(err.message, { variant: 'error' });
      setCode('');
    } finally {
      setLoading(false);
    }
  };

  const useAnotherEmail = () => {
    setStep('email');
    setCode('');
    setSecondsLeft(0);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex w-full max-w-4xl">
        {/* Desktop left panel */}
        <div className="hidden sm:flex sm:w-1/2 bg-green-900 mt-20 h-[500px] relative">
          <WalletLoadingAnimation className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute inset-0 flex items-center justify-center text-center p-6">
            <div>
              <h1 className="text-4xl font-bold text-white">Welcome Back</h1>
              <p className="text-white mt-4">Log in with just your email.</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="w-full sm:w-1/2 bg-white h-[550px] mt-20 p-6 pt-16 sm:pt-12 flex flex-col justify-center">
          <div className="w-full bg-green-800 p-4 sm:hidden">
            <WalletLoadingAnimation className="mx-auto" />
          </div>

          {step === 'email' ? (
            <form onSubmit={sendCode} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600"
                  required
                />
                <p className="mt-2 text-sm text-gray-500">We'll email you a 6-digit code to log in.</p>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-800 text-white py-3 rounded-lg hover:bg-green-700 transition duration-300 flex items-center justify-center disabled:opacity-60"
              >
                {loading ? <TailSpin height="24" width="24" color="#ffffff" /> : 'Send login code'}
              </button>
            </form>
          ) : (
            <form onSubmit={verifyCode} className="space-y-4">
              <p className="text-sm text-gray-700">
                Enter the 6-digit code we sent to <span className="font-medium">{email}</span>. It expires in 10 minutes.
              </p>
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                  Login code
                </label>
                <input
                  id="code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="mt-1 p-3 w-full border border-gray-300 rounded-lg text-center text-2xl tracking-widest focus:ring-2 focus:ring-green-600"
                  required
                  autoFocus
                />
              </div>
              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className="w-full bg-green-800 text-white py-3 rounded-lg hover:bg-green-700 transition duration-300 flex items-center justify-center disabled:opacity-60"
              >
                {loading ? <TailSpin height="24" width="24" color="#ffffff" /> : 'Log in'}
              </button>
              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={sendCode}
                  disabled={loading || secondsLeft > 0}
                  className="text-green-800 hover:underline disabled:text-gray-400 disabled:no-underline"
                >
                  {secondsLeft > 0 ? `Send a new code in ${secondsLeft}s` : 'Send a new code'}
                </button>
                <button type="button" onClick={useAnotherEmail} className="text-gray-600 hover:underline">
                  Use a different email
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center">
            <a href="/login">
              <p className="text-green-800 pb-2 text-sm">Log in with a password instead</p>
            </a>
            <a href="/signup">
              <p className="text-green-800 pb-10 text-sm">Don't have an account? Sign up.</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailLoginPage;