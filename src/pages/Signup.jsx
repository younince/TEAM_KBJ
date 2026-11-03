import Logo from '../components/Logo'
import { UserIcon, LockIcon, ShieldCheckIcon } from '../components/Icons'

export default function Signup({
  authId,
  setAuthId,
  authPassword,
  setAuthPassword,
  confirmPassword,
  setConfirmPassword,
  handleSignup,
  setPage,
  authError
}) {
  // 아이디, 비밀번호, 비밀번호 확인 조건 검증
  const isFormValid = 
    authId.trim() !== '' && 
    authPassword.trim().length >= 4 && 
    authPassword === confirmPassword

  const onSubmit = (e) => {
    e.preventDefault()
    if (isFormValid) {
      handleSignup(e)
    }
  }

  return (
    <div className="auth-wrapper flex items-center justify-center min-h-screen bg-[#090d16] px-4">
      <div className="auth-card w-full max-w-[440px] bg-[#111827]/70 backdrop-blur-md border border-white/10 rounded-3xl p-10 flex flex-col items-center shadow-2xl">
        <Logo />
        <div className="auth-subtitle text-[#94a3b8] text-sm mt-2 mb-8 text-center">
          그린마일 회원가입
        </div>
        
        {authError && (
          <div className="error-message w-full text-[#ef4444] bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-lg p-3 mb-4 text-center text-sm">
            {authError}
          </div>
        )}
        
        <form className="auth-form w-full flex flex-col gap-5" onSubmit={onSubmit}>
          <div className="input-group flex flex-col gap-2">
            <label htmlFor="signup-id" className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">
              아이디
            </label>
            <div className="input-wrapper relative flex items-center">
              <input
                id="signup-id"
                type="text"
                placeholder="사용할 아이디를 입력하세요"
                value={authId}
                onChange={(e) => setAuthId(e.target.value)}
                className="w-full py-3.5 pl-11 pr-4 bg-[#0f172a]/60 border border-white/10 rounded-xl text-[#f1f5f9] text-sm focus:outline-none focus:border-[#84cc16] focus:ring-2 focus:ring-[#84cc16]/20 transition-all"
              />
              <UserIcon />
            </div>
          </div>

          <div className="input-group flex flex-col gap-2">
            <label htmlFor="signup-password" className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">
              비밀번호
            </label>
            <div className="input-wrapper relative flex items-center">
              <input
                id="signup-password"
                type="password"
                placeholder="비밀번호를 입력하세요 (4자 이상)"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                className="w-full py-3.5 pl-11 pr-4 bg-[#0f172a]/60 border border-white/10 rounded-xl text-[#f1f5f9] text-sm focus:outline-none focus:border-[#84cc16] focus:ring-2 focus:ring-[#84cc16]/20 transition-all"
              />
              <LockIcon />
            </div>
          </div>

          <div className="input-group flex flex-col gap-2">
            <label htmlFor="confirm-password" className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">
              비밀번호 확인
            </label>
            <div className="input-wrapper relative flex items-center">
              <input
                id="confirm-password"
                type="password"
                placeholder="비밀번호를 한번 더 입력하세요"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full py-3.5 pl-11 pr-4 bg-[#0f172a]/60 border border-white/10 rounded-xl text-[#f1f5f9] text-sm focus:outline-none focus:border-[#84cc16] focus:ring-2 focus:ring-[#84cc16]/20 transition-all"
              />
              <ShieldCheckIcon />
            </div>
          </div>

          <button
            type="submit"
            disabled={!isFormValid}
            className="auth-submit-btn"
          >
            회원가입 완료
          </button>
        </form>

        <div className="auth-switch-prompt mt-6 text-sm text-[#94a3b8] text-center">
          이미 계정이 있으신가요?
          <button
            className="auth-switch-btn ml-1.5 text-[#84cc16] font-semibold hover:text-[#a3e635] hover:underline transition-colors"
            onClick={() => setPage('login')}
          >
            로그인으로 이동
          </button>
        </div>
      </div>
    </div>
  )
}

