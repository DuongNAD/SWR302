import React, { useState } from 'react';
import { X, UserCheck, ShieldAlert, Sparkles, KeyRound, Building2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, loginAs } = useAuth();
  const { showToast } = useToast();

  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isWholesaleAccount, setIsWholesaleAccount] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === 'login') {
      loginAs(isWholesaleAccount ? 'wholesale_client' : 'customer');
      setIsAuthModalOpen(false);
    } else {
      if (!otpStep) {
        setOtpStep(true);
        showToast({
          type: 'info',
          message: 'Mã xác thực OTP đã được gửi! (Mã thử nghiệm demo: 889966)'
        });
      } else {
        loginAs('customer');
        setIsAuthModalOpen(false);
        showToast({
          type: 'success',
          message: 'Đăng ký tài khoản thành công và đã tự động đăng nhập!'
        });
      }
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={() => setIsAuthModalOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white rounded-3xl border border-[#EFE4D6] shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 bg-[#FFFBF5] border-b border-[#EFE4D6] flex items-center justify-between">
          <div>
            <h2 id="auth-modal-title" className="text-lg font-black text-[#2B1D14]">
              {tab === 'login' ? 'Đăng Nhập Tài Khoản' : 'Đăng Ký Thành Viên Mới'}
            </h2>
            <p className="text-2xs text-[#6B5B4E]">
              Gia Hòa Phát — Hệ thống cung ứng nguyên liệu làm bánh
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAuthModalOpen(false)}
            aria-label="Đóng cửa sổ đăng nhập"
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Demo Login Preset Buttons (For SWR302 Exam Presentation) */}
        <div className="p-4 bg-amber-50/70 border-b border-amber-200/80 space-y-2">
          <div className="flex items-center gap-1.5 text-3xs font-extrabold uppercase tracking-wider text-[#92400E]">
            <Sparkles className="w-3 h-3" />
            <span>Phục vụ báo cáo đồ án SWR302 (Chọn nhanh vai trò):</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                loginAs('customer');
                setIsAuthModalOpen(false);
              }}
              className="py-2 px-1 text-center bg-white hover:bg-amber-100/70 border border-amber-300 rounded-xl text-2xs font-bold text-stone-800 transition-colors cursor-pointer"
            >
              👩‍🍳 Khách Lẻ
            </button>
            <button
              type="button"
              onClick={() => {
                loginAs('wholesale_client');
                setIsAuthModalOpen(false);
              }}
              className="py-2 px-1 text-center bg-white hover:bg-amber-100/70 border border-amber-300 rounded-xl text-2xs font-bold text-stone-800 transition-colors cursor-pointer"
            >
              🏢 Tiệm Bánh Sỉ
            </button>
            <button
              type="button"
              onClick={() => {
                loginAs('admin');
                setIsAuthModalOpen(false);
              }}
              className="py-2 px-1 text-center bg-[#92400E] hover:bg-[#78350F] text-white rounded-xl text-2xs font-bold transition-colors cursor-pointer"
            >
              🛠️ Admin Kho
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#EFE4D6]">
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setOtpStep(false);
            }}
            className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-colors cursor-pointer ${
              tab === 'login'
                ? 'border-[#92400E] text-[#92400E] bg-white'
                : 'border-transparent text-stone-500 hover:text-stone-800 bg-stone-50/50'
            }`}
          >
            Đăng Nhập
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('register');
              setOtpStep(false);
            }}
            className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-colors cursor-pointer ${
              tab === 'register'
                ? 'border-[#92400E] text-[#92400E] bg-white'
                : 'border-transparent text-stone-500 hover:text-stone-800 bg-stone-50/50'
            }`}
          >
            Đăng Ký
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {tab === 'register' && !otpStep && (
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Họ và tên của bạn
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nguyễn Văn A"
                className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-[#EFE4D6] rounded-xl focus:bg-white focus:border-[#92400E] focus:outline-none"
              />
            </div>
          )}

          {!otpStep ? (
            <>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Email hoặc Số điện thoại
                </label>
                <input
                  type="text"
                  required
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder="baker@example.com hoặc 0912..."
                  className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-[#EFE4D6] rounded-xl focus:bg-white focus:border-[#92400E] focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-stone-700">Mật khẩu</label>
                  {tab === 'login' && (
                    <button
                      type="button"
                      onClick={() => showToast({ type: 'info', message: 'Liên kết đặt lại mật khẩu demo đã gửi qua email.' })}
                      className="text-2xs text-[#92400E] hover:underline cursor-pointer"
                    >
                      Quên mật khẩu?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 text-xs bg-stone-50 border border-[#EFE4D6] rounded-xl focus:bg-white focus:border-[#92400E] focus:outline-none"
                />
              </div>

              {tab === 'login' && (
                <div className="pt-1">
                  <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isWholesaleAccount}
                      onChange={(e) => setIsWholesaleAccount(e.target.checked)}
                      className="rounded border-[#EFE4D6] text-[#92400E] focus:ring-[#92400E] cursor-pointer"
                    />
                    <span>Đăng nhập tài khoản Đại lý / Tiệm bánh mua sỉ</span>
                  </label>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-3 py-2">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                <p className="font-bold">Mã xác thực OTP (FR-AUTH-02)</p>
                <p className="text-2xs mt-0.5">Nhập mã 6 chữ số vừa gửi tới thiết bị của bạn. Mã mẫu: <strong>889966</strong></p>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Nhập mã OTP 6 chữ số
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="889966"
                  className="w-full px-3.5 py-2.5 text-center tracking-widest text-lg font-mono font-bold bg-stone-50 border border-[#EFE4D6] rounded-xl focus:bg-white focus:border-[#92400E] focus:outline-none"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-[#92400E] hover:bg-[#78350F] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
          >
            {tab === 'login'
              ? 'Đăng Nhập Ngay'
              : otpStep
              ? 'Xác Thực OTP & Hoàn Tất'
              : 'Gửi Mã Xác Thực OTP'}
          </button>
        </form>
      </div>
    </div>
  );
};
