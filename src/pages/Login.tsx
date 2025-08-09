import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { WaveButton } from '../components/WaveButton';
import { Header } from '../components/Header';
import { useAuth } from '../contexts';

export function Login() {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  
  const navigate = useNavigate();
  const { signInWithEmailAndPassword, signInWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // 간단한 이메일/비밀번호 검증
      if (!email || !password) {
        setError('이메일과 비밀번호를 입력해주세요.');
        return;
      }
      
      await signInWithEmailAndPassword(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || '로그인에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsGoogleLoading(true);

    try {
      await signInWithGoogle();
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Google 로그인에 실패했습니다.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative" aria-label="로그인 페이지">
      <Header />
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl mx-auto px-4 sm:px-0 relative z-10">
        <GlassCard variant="strong" className="p-6 sm:p-8 animate-fade-in">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-4 animate-bounce-gentle">🌊</div>
            <h1 className="text-3xl font-bold text-white mb-2 text-glow">
              Moonwave Travel
            </h1>
            <p className="text-white/80 text-lg">
              여행의 모든 순간을 담다
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <GlassCard variant="light" className="p-4 mb-6 border-red-500/50 bg-red-500/10">
              <div className="flex items-center space-x-2">
                <div className="text-red-400">⚠️</div>
                <p className="text-sm text-white">
                  {error}
                </p>
              </div>
            </GlassCard>
          )}

          {/* Google Login Button */}
          <WaveButton
            type="button"
            variant="secondary"
            size="lg"
            className="w-full mb-4"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading}
          >
            <div className="flex items-center justify-center space-x-3">
              <div className="w-5 h-5">
                <svg viewBox="0 0 24 24" className="w-5 h-5">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </div>
              <span>{isGoogleLoading ? 'Google 로그인 중...' : 'Google로 로그인'}</span>
            </div>
          </WaveButton>


          {/* Divider */}
          <div className="my-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-transparent px-2 text-white">
                또는
              </span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                이메일
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="
                    glass-card w-full pl-10 pr-4 py-3 rounded-lg 
                    text-base text-white placeholder-white/50 
                    focus:outline-none focus:ring-2 
                    focus:ring-primary-500/50 focus:border-transparent
                    transition-all
                  "
                  placeholder="이메일을 입력하세요"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                비밀번호
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-white" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="
                    glass-card w-full pl-10 pr-12 py-3 rounded-lg 
                    text-base text-white placeholder-white/50 
                    focus:outline-none focus:ring-2 
                    focus:ring-primary-500/50 focus:border-transparent
                    transition-all
                  "
                  placeholder="비밀번호를 입력하세요"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-white/20 transition-all duration-200 min-w-[44px] min-h-[44px]"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading || isGoogleLoading}
                  aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-white hover:text-white/60 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-white hover:text-white/60 transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <WaveButton
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              <div className="flex items-center justify-center space-x-2">
                <LogIn size={20} />
                <span>{isLoading ? '로그인 중...' : '로그인'}</span>
              </div>
            </WaveButton>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-white">
              아직 계정이 없으신가요?{' '}
              <Link 
                to="/signup" 
                className="text-white font-medium hover:underline"
              >
                회원가입
              </Link>
            </p>
          </div>
        </GlassCard>
      </div>
    </main>
  );
}