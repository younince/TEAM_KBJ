import { useState } from 'react'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Main from './pages/Main'
import './App.css'

export default function App() {
  const [page, setPage] = useState('login') // 'login' | 'signup' | 'main'
  const [user, setUser] = useState(null) // { id: '...' }
  const [greenPoints, setGreenPoints] = useState(1200)

  // Auth Forms State
  const [authId, setAuthId] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [authError, setAuthError] = useState('')

  // Auth handlers
  const handleLogin = (e) => {
    e.preventDefault()
    // Bypass validation: use entered ID or default to 'green_user'
    const finalId = authId.trim() || 'green_user'
    setUser({ id: finalId })
    setPage('main')
    setAuthId('')
    setAuthPassword('')
    setAuthError('')
  }

  const handleSignup = (e) => {
    e.preventDefault()
    // Bypass validation: use entered ID or default to 'green_user'
    const finalId = authId.trim() || 'green_user'
    setUser({ id: finalId })
    setPage('main')
    setAuthId('')
    setAuthPassword('')
    setConfirmPassword('')
    setAuthError('')
  }

  const handleLogout = () => {
    setUser(null)
    setPage('login')
  }

  return (
    <div className="App">
      {page === 'login' && (
        <Login
          authId={authId}
          setAuthId={setAuthId}
          authPassword={authPassword}
          setAuthPassword={setAuthPassword}
          handleLogin={handleLogin}
          setPage={setPage}
          authError={authError}
        />
      )}

      {page === 'signup' && (
        <Signup
          authId={authId}
          setAuthId={setAuthId}
          authPassword={authPassword}
          setAuthPassword={setAuthPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          handleSignup={handleSignup}
          setPage={setPage}
          authError={authError}
        />
      )}

      {page === 'main' && (
        <Main
          user={user}
          greenPoints={greenPoints}
          setGreenPoints={setGreenPoints}
          handleLogout={handleLogout}
        />
      )}

      <footer>
        <p>&copy; 2026 GreenMile. All rights reserved.</p>
        <p style={{ fontSize: '12px', opacity: 0.8 }}>더 깨끗한 내일을 만들기 위해 AI와 함께 행동하는 우리들의 탄소저감 커뮤니티</p>
      </footer>
    </div>
  )
}
