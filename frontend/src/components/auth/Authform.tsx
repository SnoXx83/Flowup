"use client";

import { useState } from 'react';
import api from '@/services/api';
import { useRouter } from 'next/navigation';

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!isLogin) {
        // Registration Request with new fields
        await api.post('/auth/register', { 
            firstname, 
            lastname, 
            email, 
            password, 
            imageUrl 
        });
        setIsLogin(true); // Switch to login after successful registration
      } else {
        // Login Request
        const response = await api.post('/auth/login', { email, password });
        const { access_token } = response.data;
        localStorage.setItem('access_token', access_token);
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formTitle = isLogin ? 'Sign in' : 'Sign up';
  const formSubtitle = isLogin ? 'Welcome back! Please sign in to continue' : 'Create an account to get started';
  const switchText = isLogin ? 'Don’t have an account?' : 'Already have an account?';
  const switchLinkText = isLogin ? 'Sign up' : 'Sign in';
  const submitButtonText = isLogin ? 'Login' : 'Sign up';

  return (
    <div className="flex min-h-screen w-full">
      <div className="w-full hidden md:inline-block">
        <img className="h-full" src="https://images.unsplash.com/photo-1712758602405-f8aa7de86cef?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTE1fHxwcm9qZWN0JTIwbWFuYWdtZW50fGVufDB8fDB8fHww" alt="leftSideImage" />
      </div>

      <div className="w-full flex flex-col items-center justify-center">
        <form className="md:w-96 w-80 flex flex-col items-center justify-center" onSubmit={handleSubmit}>
          <h2 className="text-4xl text-gray-900 font-medium">{formTitle}</h2>
          <p className="text-sm text-gray-500/90 mt-3">{formSubtitle}</p>
          
          {/* Social login button */}
          <button type="button" className="w-full mt-8 bg-gray-500/10 flex items-center justify-center h-12 rounded-full">
            <img src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleLogo.svg" alt="googleLogo" />
          </button>

          <div className="flex items-center gap-4 w-full my-5">
            <div className="w-full h-px bg-gray-300/90"></div>
            <p className="w-full text-nowrap text-sm text-gray-500/90">or {formTitle} with email</p>
            <div className="w-full h-px bg-gray-300/90"></div>
          </div>

          {/* Registration form fields */}
          {!isLogin && (
            <>
              {/* Firstname */}
              <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2 mb-4">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 8a3 3 0 100-6 3 3 0 000 6zM8 10c-2.316 0-4.484.773-6 2.053C2.102 12.378 2 12.578 2 12.8v.2c0 1.258 1.144 2.298 2.5 2.571h7c1.356-.273 2.5-1.313 2.5-2.571v-.2c0-.222-.102-.422-.4-.683C12.484 10.773 10.316 10 8 10z" fill="#6B7280" /></svg>
                <input 
                  type="text" 
                  placeholder="First Name" 
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full" 
                  required={!isLogin}
                />
              </div>

              {/* Lastname */}
              <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2 mb-4">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 8a3 3 0 100-6 3 3 0 000 6zM8 10c-2.316 0-4.484.773-6 2.053C2.102 12.378 2 12.578 2 12.8v.2c0 1.258 1.144 2.298 2.5 2.571h7c1.356-.273 2.5-1.313 2.5-2.571v-.2c0-.222-.102-.422-.4-.683C12.484 10.773 10.316 10 8 10z" fill="#6B7280" /></svg>
                <input 
                  type="text" 
                  placeholder="Last Name" 
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full" 
                  required={!isLogin}
                />
              </div>

              {/* ImageURL */}
              <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2 mb-4">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H2C.895 2 0 2.895 0 4v8c0 1.105.895 2 2 2h12c1.105 0 2-.895 2-2V4c0-1.105-.895-2-2-2zM2 3h12a1 1 0 011 1v6.586l-2.293-2.293a1 1 0 00-1.414 0L8 10.586l-1.293-1.293a1 1 0 00-1.414 0L2 12.586V4a1 1 0 011-1z" fill="#6B7280" /></svg>
                <input 
                  type="url" 
                  placeholder="Image URL" 
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full" 
                  required={!isLogin}
                />
              </div>
            </>
          )}

          {/* Email */}
          <div className={`flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2 ${!isLogin ? 'mb-4' : ''}`}>
            <svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z" fill="#6B7280" /></svg>
            <input 
              type="email" 
              placeholder="Email id" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full" 
              required
            />                 
          </div>

          {/* Password */}
          <div className={`flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2 ${isLogin ? 'mt-6' : 'mb-6'}`}>
            <svg width="13" height="17" viewBox="0 0 13 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z" fill="#6B7280" /></svg>
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full" 
              required
            />
          </div>

          {/* Remember me & Forgot password */}
          {isLogin && (
            <div className="w-full flex items-center justify-between mt-8 text-gray-500/80">
              <div className="flex items-center gap-2">
                <input className="h-5" type="checkbox" id="checkbox" />
                <label className="text-sm" htmlFor="checkbox">Remember me</label>
              </div>
              <a className="text-sm underline" href="#">Forgot password?</a>
            </div>
          )}

          {/* Error message display */}
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

          {/* Submit button */}
          <button type="submit" className="mt-8 w-full h-11 rounded-full text-white bg-indigo-500 hover:opacity-90 transition-opacity">
            {loading ? 'Loading...' : submitButtonText}
          </button>
          
          {/* Switch between login/registration */}
          <p className="text-gray-500/90 text-sm mt-4">
            {switchText}{' '}
            <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-indigo-400 hover:underline">
              {switchLinkText}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}