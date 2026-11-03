import Logo from '../components/Logo'
import { UserIcon, LockIcon } from '../components/Icons'

export default function Login({
  authId,
  setAuthId,
  authPassword,
  setAuthPassword,
  handleLogin,
  setPage,
  authError
}) {
  // 아이디와 비밀번호가 모두 비어있지 않은지 검증
  const isFormValid = authId.trim() !== '' && authPassword.trim() !== ''

  const onSubmit = (e) => {
    e.preventDefault()
    if (isFormValid) {
      handleLogin(e)
    }
  }

  return (
    <div className="auth-wrapper flex items-center justify-center min-h-screen bg-[#090d16] px-4">
      <div className="auth-card w-full max-w-[440px] bg-[#111827]/70 backdrop-blur-md border border-white/10 rounded-3xl p-10 flex flex-col items-center shadow-2xl">
        <Logo />
        <div className="auth-subtitle text-[#94a3b8] text-sm mt-2 mb-8 text-center">
          AI 기반 환경실천 검증 및 리워드 서비스
        </div>
        
        {authError && (
          <div className="error-message w-full text-[#ef4444] bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-lg p-3 mb-4 text-center text-sm">
            {authError}
          </div>
        )}
        
        <form className="auth-form w-full flex flex-col gap-5" onSubmit={onSubmit}>
          <div className="input-group flex flex-col gap-2">
            <label htmlFor="login-id" className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">
              아이디
            </label>
            <div className="input-wrapper relative flex items-center">
              <input
                id="login-id"
                type="text"
                placeholder="아이디를 입력하세요"
                value={authId}
                onChange={(e) => setAuthId(e.target.value)}
                className="w-full py-3.5 pl-11 pr-4 bg-[#0f172a]/60 border border-white/10 rounded-xl text-[#f1f5f9] text-sm focus:outline-none focus:border-[#84cc16] focus:ring-2 focus:ring-[#84cc16]/20 transition-all"
              />
              <UserIcon />
            </div>
          </div>

          <div className="input-group flex flex-col gap-2">
            <label htmlFor="login-password" className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">
              비밀번호
            </label>
            <div className="input-wrapper relative flex items-center">
              <input
                id="login-password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                className="w-full py-3.5 pl-11 pr-4 bg-[#0f172a]/60 border border-white/10 rounded-xl text-[#f1f5f9] text-sm focus:outline-none focus:border-[#84cc16] focus:ring-2 focus:ring-[#84cc16]/20 transition-all"
              />
              <LockIcon />
            </div>
          </div>

          <button
            type="submit"
            disabled={!isFormValid}
            className="auth-submit-btn"
          >
            로그인
          </button>
        </form>

        <div className="auth-switch-prompt mt-6 text-sm text-[#94a3b8] text-center">
          아직 계정이 없으신가요? 
          <button
            className="auth-switch-btn ml-1.5 text-[#84cc16] font-semibold hover:text-[#a3e635] hover:underline transition-colors"
            onClick={() => setPage('signup')}
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  )
}

