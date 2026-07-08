import { useState, useEffect } from 'react'
import Logo from '../components/Logo'
import {
  AwardIcon,
  SparklesIcon,
  UploadIcon,
  HeartIcon,
  SuccessBadgeIcon,
  FailureBadgeIcon
} from '../components/Icons'

export default function Main({ user, greenPoints, setGreenPoints, handleLogout }) {
  // Slideshow State
  const [activeSlide, setActiveSlide] = useState(0)
  const [sloganVisible, setSloganVisible] = useState(true)

  // Slider data
  const slides = [
    {
      img: '/slide1.jpg',
      tag: 'Eco-Friendly Lifestyle',
      slogan: '더 푸른 내일을 위한 한 걸음, 그린마일과 시작하세요'
    },
    {
      img: '/slide2.jpg',
      tag: 'Save Our Planet',
      slogan: '당신의 작은 실천이 지구를 살리는 큰 기적을 만듭니다'
    },
    {
      img: '/slide3.jpg',
      tag: 'AI Verification',
      slogan: 'AI 분석으로 즉시 적립되는 그린 포인트와 함께하는 친환경 생활'
    }
  ]

  // Slogan disappear and reappear effect every 3.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Fade out slogan
      setSloganVisible(false)

      // 2. Wait for fade out animation (500ms), change slide, then fade in slogan
      setTimeout(() => {
        setActiveSlide((prev) => (prev + 1) % slides.length)
        setSloganVisible(true)
      }, 500)

    }, 3500)

    return () => clearInterval(interval)
  }, [slides.length])

  // AI Scanning State
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [scannedImage, setScannedImage] = useState(null)
  const [detectedAction, setDetectedAction] = useState('')
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showFailureModal, setShowFailureModal] = useState(false)
  const [uploadKey, setUploadKey] = useState(0) // force file input reset

  // Mock community shared posts
  const [feed, setFeed] = useState([
    {
      id: 1,
      author: 'eco_warrior',
      image: '/feed1.jpg',
      text: '오늘도 일회용 컵 대신 개인 텀블러로 아메리카노 테이크아웃 성공! 플라스틱 빨대도 정중히 거절했습니다. 🥤 #텀블러사용 #제로웨이스트 #그린마일',
      points: '+500 GP',
      time: '3시간 전',
      likes: 24,
      liked: false
    },
    {
      id: 2,
      author: 'green_rider',
      image: '/feed2.jpg',
      text: '날씨가 화창해서 차 대신 따릉이 타고 출퇴근했습니다! 건강도 챙기고 탄소 배출도 줄이고, 일석이조네요! 🚲 #친환경이동 #출퇴근길 #자전거생활',
      points: '+500 GP',
      time: '5시간 전',
      likes: 42,
      liked: false
    },
    {
      id: 3,
      author: 'recycle_master',
      image: '/feed3.jpg',
      text: '플라스틱 용기들 물에 깨끗이 씻고 라벨지 떼서 정석대로 분리배출 완료했습니다. 분리배출만 올바르게 해도 에너지가 엄청 절약된다네요. ♻️ #분리배출 #자원순환',
      points: '+500 GP',
      time: '1일 전',
      likes: 19,
      liked: false
    }
  ])

  // Handle Photo selection & Mock AI Verification
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setScannedImage(reader.result)
      startAIScanning(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const startAIScanning = (imgUrl) => {
    setIsScanning(true)
    setScanProgress(0)

    // 70% success, 30% failure chance to test unclassifiable images
    const isSuccess = Math.random() > 0.3
    
    const ecoActions = [
      '올바른 분리배출 실천',
      '다회용 텀블러 사용',
      '친환경 장바구니/에코백 실천',
      '자전거/대중교통 이동',
      '플로깅 및 주변 환경 정화'
    ]
    const randomAction = ecoActions[Math.floor(Math.random() * ecoActions.length)]
    setDetectedAction(isSuccess ? randomAction : '')

    // Progress bar animation simulation
    let progress = 0
    const interval = setInterval(() => {
      progress += 4
      if (progress >= 100) {
        clearInterval(interval)
        setScanProgress(100)
        setTimeout(() => {
          setIsScanning(false)
          
          if (isSuccess) {
            setShowSuccessModal(true)
            setGreenPoints((prev) => prev + 500)

            // Add to community feed
            const newFeedItem = {
              id: Date.now(),
              author: user ? user.id : 'green_hero',
              image: imgUrl || '/feed1.jpg',
              text: `[AI 친환경 검증 완료] AI가 사진 분석을 통해 '${randomAction}' 실천을 감지했습니다! 모두 함께 더 나은 지구를 만들어요! 🌿💚 #그린마일 #환경사랑`,
              points: '+500 GP',
              time: '방금 전',
              likes: 0,
              liked: false
            }
            setFeed((prev) => [newFeedItem, ...prev])
          } else {
            setShowFailureModal(true)
          }
        }, 600)
      } else {
        setScanProgress(progress)
      }
    }, 120)
  }

  // Feed Like handler
  const handleLike = (id) => {
    setFeed(
      feed.map((post) => {
        if (post.id === id) {
          return {
            ...post,
            liked: !post.liked,
            likes: post.liked ? post.likes - 1 : post.likes + 1
          }
        }
        return post
      })
    )
  }

  return (
    <>
      <header>
        <div className="nav-container">
          <Logo />
          <div className="nav-actions">
            <div className="points-badge">
              <AwardIcon />
              <span>그린 포인트</span> {greenPoints.toLocaleString()} GP
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '600' }}>
              @{user?.id} 님
            </div>
            <button className="logout-btn" onClick={handleLogout}>로그아웃</button>
          </div>
        </div>
      </header>

      <main className="main-wrapper">
        
        {/* SLIDESHOW */}
        <div className="slideshow-container">
          {slides.map((slide, index) => (
            <div key={index} className={`slide ${index === activeSlide ? 'active' : ''}`}>
              <img src={slide.img} className="slide-img" alt={slide.tag} />
              <div className="slide-overlay">
                <div className="slogan-container">
                  <span className="slide-tag">{slide.tag}</span>
                  <h1 className={`slogan-title ${sloganVisible && index === activeSlide ? 'visible' : ''}`}>
                    {slide.slogan}
                  </h1>
                </div>
              </div>
            </div>
          ))}
          <div className="slider-dots">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === activeSlide ? 'active' : ''}`}
                onClick={() => {
                  setSloganVisible(false)
                  setTimeout(() => {
                    setActiveSlide(index)
                    setSloganVisible(true)
                  }, 200)
                }}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* AI ECO-VERIFICATION ZONE */}
        <div className="verification-section">
          <div className="verification-card">
            <h2 className="section-title">
              <SparklesIcon />
              AI 친환경 실천 인증하기
            </h2>
            
            {!isScanning ? (
              <label className="upload-zone" htmlFor="eco-photo-upload">
                <UploadIcon />
                <span className="upload-text-main">환경 실천 사진을 여기에 업로드하세요</span>
                <span className="upload-text-sub">텀블러 사용, 분리배출, 자전거 이용, 에코백 사용 등</span>
                <input
                  key={uploadKey}
                  id="eco-photo-upload"
                  type="file"
                  accept="image/*"
                  className="file-input"
                  onChange={handlePhotoUpload}
                />
              </label>
            ) : (
              <div className="scan-container">
                <img src={scannedImage} className="scan-preview" alt="Scanning Preview" />
                <div className="scan-line"></div>
                <div className="scan-overlay">
                  <div className="scan-status">
                    AI가 이미지를 정밀 분석 중입니다... ({scanProgress}%)
                    <div style={{ fontSize: '13px', color: 'var(--primary)', marginTop: '4px', fontWeight: '500' }}>
                      검출 대상: {detectedAction || '환경 보호 활동'}
                    </div>
                  </div>
                  <div className="progress-track">
                    <div className="progress-bar" style={{ width: `${scanProgress}%` }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SHARED COMMUNITY FEED */}
        <div className="feed-container">
          <h2 className="section-title" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
            <span className="logo-green">그린 커뮤니티</span> 실천 피드
          </h2>

          <div className="feed-grid">
            {feed.map((post) => (
              <div className="feed-card" key={post.id}>
                <div className="feed-img-wrapper">
                  <img src={post.image} className="feed-img" alt="Environmental Practice" />
                  <div className="feed-card-badge">
                    <SparklesIcon />
                    AI 인증 완료
                  </div>
                </div>
                <div className="feed-content">
                  <div className="feed-header">
                    <span className="feed-author">@{post.author}</span>
                    <span className="feed-time">{post.time}</span>
                  </div>
                  <p className="feed-text">{post.text}</p>
                  <div className="feed-footer">
                    <span className="feed-points">{post.points}</span>
                    <button 
                      className={`like-btn ${post.liked ? 'liked' : ''}`}
                      onClick={() => handleLike(post.id)}
                    >
                      <HeartIcon />
                      {post.likes}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* SUCCESS MODAL POPUP */}
      {showSuccessModal && (
        <div className="success-modal-overlay">
          <div className="success-modal">
            <div className="success-icon-badge">
              <SuccessBadgeIcon />
            </div>
            <div className="modal-title">친환경 실천 확인 완료!</div>
            <div className="modal-points">+500 GP</div>
            <p className="modal-desc">
              AI 분석 결과, 성공적으로 <strong>'{detectedAction}'</strong>을(를) 확인하여 <strong>500 그린 포인트</strong>를 추가 지급해 드렸습니다.
              <br />
              실천 내역이 피드에 공유되었습니다.
            </p>
            <button className="modal-close-btn" onClick={() => {
              setShowSuccessModal(false)
              setScannedImage(null)
              setUploadKey(k => k + 1)
            }}>확인</button>
          </div>
        </div>
      )}

      {/* FAILURE MODAL POPUP */}
      {showFailureModal && (
        <div className="success-modal-overlay">
          <div
            className="success-modal failure-modal-animated"
            style={{
              borderColor: 'var(--secondary)',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.6), 0 0 30px rgba(239,68,68,0.15)'
            }}
          >
            <div
              className="success-icon-badge"
              style={{
                color: 'var(--secondary)',
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                borderColor: 'var(--secondary)',
                boxShadow: '0 0 30px rgba(239, 68, 68, 0.25)'
              }}
            >
              <FailureBadgeIcon />
            </div>
            <div className="modal-title" style={{ color: 'var(--secondary)' }}>
              인증 실패
            </div>
            <p className="modal-desc">
              해당사진은 적합한 사진이 아닙니다.
              <br />
              텀블러 사용, 분리배출, 자전거 이용, 에코백 사용 등<br />
              <strong>친환경 실천 사진</strong>을 다시 업로드 해주세요.
            </p>
            <button
              className="modal-close-btn"
              style={{ background: 'var(--secondary)' }}
              onClick={() => {
                setShowFailureModal(false)
                setScannedImage(null)
                setUploadKey(k => k + 1)
              }}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </>
  )
}
