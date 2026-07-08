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
  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <Logo />
        <div className="auth-subtitle">AI 기반 환경실천 검증 및 리워드 서비스</div>
        
        {authError && <div className="error-message">{authError}</div>}
        
        <form className="auth-form" onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="login-id">아이디</label>
            <div className="input-wrapper">
              <input
                id="login-id"
                type="text"
                placeholder="아이디를 입력하세요"
                value={authId}
                onChange={(e) => setAuthId(e.target.value)}
              />
              <UserIcon />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="login-password">비밀번호</label>
            <div className="input-wrapper">
              <input
                id="login-password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
              />
              <LockIcon />
            </div>
          </div>

          <button type="submit" className="auth-submit-btn">로그인</button>
        </form>

        <div className="auth-switch-prompt">
          아직 계정이 없으신가요? 
          <button className="auth-switch-btn" onClick={() => { setPage('signup'); }}>
            회원가입
          </button>
        </div>
      </div>
    </div>
  )
}
