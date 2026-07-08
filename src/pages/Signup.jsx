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
  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <Logo />
        <div className="auth-subtitle">그린마일 회원가입</div>
        
        {authError && <div className="error-message">{authError}</div>}
        
        <form className="auth-form" onSubmit={handleSignup}>
          <div className="input-group">
            <label htmlFor="signup-id">아이디</label>
            <div className="input-wrapper">
              <input
                id="signup-id"
                type="text"
                placeholder="사용할 아이디를 입력하세요"
                value={authId}
                onChange={(e) => setAuthId(e.target.value)}
              />
              <UserIcon />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="signup-password">비밀번호</label>
            <div className="input-wrapper">
              <input
                id="signup-password"
                type="password"
                placeholder="비밀번호를 입력하세요 (4자 이상)"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
              />
              <LockIcon />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="confirm-password">비밀번호 확인</label>
            <div className="input-wrapper">
              <input
                id="confirm-password"
                type="password"
                placeholder="비밀번호를 한번 더 입력하세요"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <ShieldCheckIcon />
            </div>
          </div>

          <button type="submit" className="auth-submit-btn">회원가입 완료</button>
        </form>

        <div className="auth-switch-prompt">
          이미 계정이 있으신가요?
          <button className="auth-switch-btn" onClick={() => { setPage('login'); }}>
            로그인으로 이동
          </button>
        </div>
      </div>
    </div>
  )
}
