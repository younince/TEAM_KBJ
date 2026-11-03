import { useState } from 'react'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Main from './pages/Main'
import MyPage from './pages/MyPage'
import './App.css'

export default function App() {
  const [page, setPage] = useState('login') // 'login' | 'signup' | 'main' | 'mypage'
  const [user, setUser] = useState(null) // { id: '...' }
  const [greenPoints, setGreenPoints] = useState(100)

  // 피드 상태를 공통 App 레벨로 이동하여 Main과 MyPage가 데이터를 공유하도록 함
  const [feed, setFeed] = useState([
    {
      id: 1,
      author: 'eco_warrior',
      image: '/feed1.jpg',
      text: '오늘도 일회용 컵 대신 개인 텀블러로 아메리카노 테이크아웃 성공! 플라스틱 빨대도 정중히 거절했습니다. 🥤 #텀블러사용 #제로웨이스트 #그린마일',
      points: '+140 GP',
      time: '3시간 전',
      likes: 0,
      liked: false
    },
    {
      id: 2,
      author: 'green_rider',
      image: '/feed2.jpg',
      text: '날씨가 화창해서 차 대신 따릉이 타고 출퇴근했습니다! 건강도 챙기고 탄소 배출도 줄이고, 일석이조네요! 🚲 #친환경이동 #출퇴근길 #자전거생활',
      points: '+180 GP',
      time: '5시간 전',
      likes: 0,
      liked: false
    },
    {
      id: 3,
      author: 'recycle_master',
      image: '/feed3.jpg',
      text: '플라스틱 용기들 물에 깨끗이 씻고 라벨지 떼서 정석대로 분리배출 완료했습니다. 분리배출만 올바르게 해도 에너지가 엄청 절약된다네요. ♻️ #분리배출 #자원순환',
      points: '+150 GP',
      time: '1일 전',
      likes: 0,
      liked: false
    }
  ])

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
          feed={feed}
          setFeed={setFeed}
          setPage={setPage}
          handleLogout={handleLogout}
        />
      )}

      {page === 'mypage' && (
        <MyPage
          user={user}
          greenPoints={greenPoints}
          setGreenPoints={setGreenPoints}
          feed={feed}
          setPage={setPage}
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
