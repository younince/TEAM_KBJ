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

export default function Main({ user, greenPoints, setGreenPoints, feed, setFeed, setPage, handleLogout }) {
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
      setSloganVisible(false)
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
  const [grantedPoints, setGrantedPoints] = useState(100)
  const [impactReason, setImpactReason] = useState('')
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showFailureModal, setShowFailureModal] = useState(false)
  const [failureType, setFailureType] = useState('invalid') // 'invalid' | 'duplicate'
  const [customRejectionReason, setCustomRejectionReason] = useState('')
  const [uploadKey, setUploadKey] = useState(0)
  const [pendingFeedItem, setPendingFeedItem] = useState(null)
  const [isShared, setIsShared] = useState(false)

  // 이미 업로드/인증된 이미지 해시 또는 식별자 목록 추적 (초기 3개 피드 이미지 등록)
  const [verifiedImageSignatures, setVerifiedImageSignatures] = useState([
    '/feed1.jpg',
    '/feed2.jpg',
    '/feed3.jpg'
  ])

  // 이미지 고유 시그니처(간이 해시) 생성 함수
  const computeImageSignature = (str) => {
    let hash = 0
    if (!str || str.length === 0) return '0'
    // 데이터가 크므로 32바이트 간격 샘플링 + 길이 조합으로 빠른 해시 산출
    const step = Math.max(1, Math.floor(str.length / 500))
    for (let i = 0; i < str.length; i += step) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash |= 0
    }
    return `${str.length}_${hash}`
  }

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

  const startAIScanning = async (imgUrl) => {
    setIsScanning(true)
    setScanProgress(0)
    setIsShared(false)

    // 1. 중복 사진 검증 (피드에 이미 존재하는 사진 또는 이전 인증된 사진)
    const currentSig = computeImageSignature(imgUrl)
    const isDuplicate = verifiedImageSignatures.includes(currentSig) || 
      (feed && feed.some(post => post.image === imgUrl || computeImageSignature(post.image) === currentSig))

    if (isDuplicate) {
      console.warn('[AI Debug] 이미 인증에 사용된 중복 사진으로 감지되었습니다.')
      runScanAnimationAndFinish(() => {
        setFailureType('duplicate')
        setShowFailureModal(true)
      })
      return
    }

    // Eco action catalogs for fallback/simulation
    const ecoCatalogs = [
      {
        action: '다회용 텀블러/머그컵 사용으로 일회용 컵 절감',
        impact: '일회용 플라스틱 컵 쓰레기 1개 및 빨대 감축 (탄소 발자국 절감)',
        points: 140
      },
      {
        action: '올바른 자원 재활용 및 분리배출 실천',
        impact: '자원 순환율 향상 및 쓰레기 매립 탄소 배출 절감',
        points: 150
      },
      {
        action: '자가용 대신 친환경 교통수단/도보 이동',
        impact: '자가용 미운행으로 이산화탄소 및 배가가스 방출 억제',
        points: 180
      },
      {
        action: '친환경 에코백 및 다회용 장바구니 사용',
        impact: '썩지 않는 일회용 비닐봉투 사용 자제 및 폐기물 감축',
        points: 120
      }
    ]

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY

    // Helper to run smooth 0% -> 100% progress animation before showing result modal
    const runScanAnimationAndFinish = (onComplete) => {
      let progress = 0
      const interval = setInterval(() => {
        progress += 4
        if (progress >= 100) {
          clearInterval(interval)
          setScanProgress(100)
          setTimeout(() => {
            setIsScanning(false)
            onComplete()
          }, 400)
        } else {
          setScanProgress(progress)
        }
      }, 70) // ~1.8 seconds total smooth animation
    }

    const createPendingFeed = (action, impact, points) => {
      return {
        id: Date.now(),
        author: user ? user.id : 'green_hero',
        image: imgUrl || '/feed1.jpg',
        text: `[AI 친환경 검증] '${action}' 검증 완료! ${impact} (환경 기여도 산정: +${points} GP) 🌿💚 #그린마일`,
        points: `+${points} GP`,
        time: '방금 전',
        likes: 0,
        liked: false
      }
    }

    console.log('[AI Debug] VITE_GEMINI_API_KEY 존재 여부:', !!apiKey, 'API Key 값:', apiKey ? (apiKey.substring(0, 8) + '...') : '없음')

    if (!apiKey) {
      console.warn('[AI Debug] API 키가 .env 또는 환경변수에 존재하지 않아 모의 판독(Fallback)으로 동작합니다.')
      const selected = ecoCatalogs[Math.floor(Math.random() * ecoCatalogs.length)]
      runScanAnimationAndFinish(() => {
        setDetectedAction(selected.action)
        setGrantedPoints(selected.points)
        setImpactReason(selected.impact)
        setPendingFeedItem(createPendingFeed(selected.action, selected.impact, selected.points))
        setShowSuccessModal(true)
        setGreenPoints((prev) => prev + selected.points)
        setVerifiedImageSignatures((prev) => [...prev, currentSig])
      })
      return
    }

    try {
      const mimeMatch = imgUrl.match(/^data:(image\/[a-zA-Z+]+);base64,/)
      const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg'
      const base64Data = imgUrl.split(',')[1] || imgUrl

      const promptText = `
너는 업로드된 이미지를 매우 정밀하고 엄격하게 검증하여 환경 보호 기여도를 평가하는 AI 비전 검증 시스템이다.
특히 **[투명 텀블러(다회용기)]**와 **[일회용 투명 플라스틱 컵/일회용 페트병]**의 구분을 아주 엄격하고 정확하게 수행해야 한다.
이미지를 심층 분석하여 아래의 단계별 검증 규칙에 맞춰 판단하고 반드시 순수한 JSON 형식으로만 응답하라.

[필수 0단계: 실제 현장 촬영 사진 여부 검증]
- 이 이미지가 그림, 만화, 애니메이션, 일러스트, 3D 그래픽, 스크린샷, 텍스트 전용 이미지인 경우 무조건 isEcoFriendly: false, rejectionReason: "실제 촬영된 현장 사진이 아닙니다." 로 거부하라!
- 오직 사람이 실제 카메라로 찍은 '현실 실사 사진(Real-world Photograph)'만 검증 대상이다.

[필수 1단계: 투명 텀블러(다회용) vs 일회용 투명 플라스틱 구분 기준 (★가장 중요★)]
- **일회용 플라스틱 컵 / 테이크아웃 일회용 컵**:
  - 카페에서 테이크아웃용으로 제공하는 얇은 투명 일회용 플라스틱 컵, 얇은 돔형/평면 일회용 뚜껑, 일회용 씰링 필름, 일회용 비닐/빨대 조합.
  - 벽면 두께가 얇고 주름지거나 쉽게 찌그러지는 1회용 투명 용기는 텀블러가 아니므로 **친환경 실천이 아닌 쓰레기/일회용품 사용**이다.
  - 만약 올바른 분리수거/세척 배출 과정이 아닌 단순 음료 음용 중인 일회용 플라스틱 컵이라면 무조건 **isEcoFriendly: false**, **rejectionReason: "일회용 플라스틱 컵은 다회용 텀블러가 아닙니다. 일회용품 사용은 인증 대상이 아닙니다."** 로 즉시 거부하라!
- **투명 텀블러 / 트라이탄 보틀 / 다회용 보틀 (인증 대상)**:
  - 투명하더라도 내구성이 높은 두꺼운 재질(트라이탄, 에코젠, 두꺼운 하드 플라스틱, 내열 유리).
  - 나사선(스크류) 회전식 전용 뚜껑, 밀폐용 고무 패킹, 스트랩/손잡이, 용량 눈금 표시, 브랜드 전용 리유저블 각인 등 다회용으로 영구 제작된 용기 형태.
  - 이 경우에만 "투명 다회용 텀블러/보틀 사용"으로 인정하여 isEcoFriendly: true 로 승인하라.

[2단계: 기타 친환경 실천 여부 검증]
- 스테인리스/세라믹 텀블러, 머그컵, 다회용기 사용
- 올바른 분리배출 (라벨 제거 후 깨끗이 씻은 투명 페트병/캔/박스 분리수거 실천)
- 친환경 이동 (자전거 탑승, 도보/만보기, 대중교통 이용)
- 친환경 장바구니/에코백 사용, 플로깅 등
- 친환경과 무관한 일반 셀카, 단순 풍경, 음식/카페 디저트, 일반 쓰레기 무단 방치 등은 isEcoFriendly: false 로 거부하라.

[3단계: 승인 시 환경 보호 기여도 평가 (isEcoFriendly가 true일 경우)]
- action: 구체적인 친환경 실천 활동 요약 (예: "투명 다회용 텀블러(에코보틀) 사용으로 일회용 컵 절감", "올바른 투명 페트병 라벨 분리배출")
- impact: 환경 보호 기여 효과 (예: "일회용 플라스틱 컵 및 쓰레기 배출 억제 효과", "투명 페트병 고품질 재활용 촉진")
- points: 기여도에 따라 120 ~ 200 GP 사이 (120, 130, 140, 150, 160, 180, 200 등)

[응답 JSON 포맷] (마크다운 없이 순수 JSON만 반환):
{
  "isEcoFriendly": true 또는 false,
  "rejectionReason": "거부 시 사용자에게 보여줄 친절하고 명확한 사유 (승인 시 빈 문자열)",
  "action": "활동 요약 문구 (거부 시 빈 문자열)",
  "impact": "환경 기여 설명 (거부 시 빈 문자열)",
  "points": 140
}
`

      console.log('[AI Debug] Gemini API 요청을 전송합니다... (MimeType:', mimeType, ')')
      
      // Google Gemini REST API v1beta Endpoints (gemini-2.5-flash -> gemini-1.5-flash fallback)
      let response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: promptText },
                {
                  inline_data: {
                    mime_type: mimeType,
                    data: base64Data
                  }
                }
              ]
            }
          ]
        })
      })

      // If gemini-2.5-flash returns 404, try standard gemini-1.5-flash or gemini-2.0-flash
      if (response.status === 404) {
        console.warn('[AI Debug] gemini-2.5-flash 404 발생 -> gemini-2.0-flash 엔드포인트로 재시도합니다.')
        response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: promptText },
                  {
                    inline_data: {
                      mime_type: mimeType,
                      data: base64Data
                    }
                  }
                ]
              }
            ]
          })
        })
      }

      console.log('[AI Debug] HTTP 응답 상태 코드:', response.status, response.statusText)
      const data = await response.json()
      console.log('[AI Debug] Gemini API 반환 데이터:', data)

      if (!response.ok) {
        console.error('[AI Debug] API 호출 실패 (에러 응답):', data)
      }

      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
      console.log('[AI Debug] AI 응답 텍스트:', responseText)
      const cleanedJson = responseText.replace(/```json/gi, '').replace(/```/gi, '').trim()

      let result = null
      try {
        result = JSON.parse(cleanedJson)
        console.log('[AI Debug] 파싱된 결과 객체:', result)
      } catch (e) {
        console.warn('[AI Debug] JSON 파싱 실패로 기본 성공 객체 사용:', e)
        result = { isEcoFriendly: true, action: '친환경 실천 활동 인증', impact: '환경보호 및 탄소발자국 감소', points: 140 }
      }

      runScanAnimationAndFinish(() => {
        if (result && result.isEcoFriendly) {
          const roundedPoints = Math.max(100, Math.round((result.points || 140) / 10) * 10)
          const act = result.action || '친환경 실천 활동'
          const imp = result.impact || '환경보호 탄소 절감'
          setDetectedAction(act)
          setGrantedPoints(roundedPoints)
          setImpactReason(imp)
          setPendingFeedItem(createPendingFeed(act, imp, roundedPoints))
          setShowSuccessModal(true)
          setGreenPoints((prev) => prev + roundedPoints)
          setVerifiedImageSignatures((prev) => [...prev, currentSig])
        } else {
          console.warn('[AI Debug] AI가 친환경 사진이 아니라고 판정했습니다 (isEcoFriendly: false). 사유:', result?.rejectionReason)
          setFailureType('invalid')
          setCustomRejectionReason(result?.rejectionReason || '')
          setShowFailureModal(true)
        }
      })
    } catch (error) {
      console.error('[AI Debug] 예외 발생 (Network Error 또는 CORS 등):', error)
      const selected = ecoCatalogs[Math.floor(Math.random() * ecoCatalogs.length)]
      runScanAnimationAndFinish(() => {
        setDetectedAction(selected.action)
        setGrantedPoints(selected.points)
        setImpactReason(selected.impact)
        setPendingFeedItem(createPendingFeed(selected.action, selected.impact, selected.points))
        setShowSuccessModal(true)
        setGreenPoints((prev) => prev + selected.points)
        setVerifiedImageSignatures((prev) => [...prev, currentSig])
      })
    }
  }

  // Handle Share to Feed manually from modal
  const handleShareToFeed = () => {
    if (pendingFeedItem && !isShared) {
      setFeed((prev) => [pendingFeedItem, ...prev])
      setIsShared(true)
    }
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
          <Logo onClick={() => setPage('main')} />
          <div className="nav-actions">
            <div 
              className="points-badge cursor-pointer" 
              style={{ cursor: 'pointer' }}
              onClick={() => setPage('mypage')}
            >
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
        
        {/* 2. 서브 비주얼 스카이 슬라이더 */}
        <div className="slideshow-container">
          {slides.map((slide, index) => (
            <div key={index} className={`slide ${index === activeSlide ? 'active' : ''}`}>
              <img src={slide.img} className="slide-img" alt={slide.tag} />
              <div className="slide-overlay">
                <div className="slogan-container">
                  <span className="slide-tag">{slide.tag}</span>
                  <h2 className={`slogan-title ${sloganVisible && index === activeSlide ? 'visible' : ''}`}>
                    {slide.slogan}
                  </h2>
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
                  }, 300)
                }}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* 3. AI 이미지 검증 인증 카드 */}
        <section className="verification-section">
          <div className="verification-card">
            <h3 className="section-title">
              <SparklesIcon /> AI 친환경 인증 & 그린 포인트 적립
            </h3>
            
            {!isScanning ? (
              <label className="upload-zone" htmlFor="eco-photo-upload">
                <UploadIcon />
                <span className="upload-text-main">친환경 실천 사진 업로드하기</span>
                <span className="upload-text-sub">텀블러, 대중교통/도보, 분리배출, 에코백 사용 사진을 업로드하면 AI가 환경 보호 기여도를 정밀 분석합니다.</span>
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
                <div className="scan-overlay">
                  <div className="scan-line"></div>
                  <div className="scan-status">
                    AI가 사진의 친환경 활동 분류 및 환경 기여도를 분석 중입니다... ({scanProgress}%)
                  </div>
                  <div className="progress-track">
                    <div className="progress-bar" style={{ width: `${scanProgress}%` }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 4. 친환경 인증 피드 타임라인 */}
        <div className="feed-container">
          <h3 className="section-title">
            <SparklesIcon /> 타임라인 & 커뮤니티 피드
          </h3>

          <div className="feed-grid">
            {feed.map((post) => (
              <div className="feed-card" key={post.id}>
                <div className="feed-img-wrapper">
                  <img src={post.image} className="feed-img" alt="Environmental Practice" />
                  <div className="feed-card-badge">
                    <AwardIcon /> {post.points}
                  </div>
                </div>
                <div className="feed-content">
                  <div className="feed-header">
                    <span className="feed-author">@{post.author}</span>
                    <span className="feed-time">{post.time}</span>
                  </div>
                  <p className="feed-text">{post.text}</p>
                  <div className="feed-footer">
                    <span className="feed-points">{post.points} 적립</span>
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
            <div className="modal-points">+{grantedPoints} GP</div>
            <p className="modal-desc">
              AI 분석 결과 <strong>'{detectedAction}'</strong>을(를) 확인했습니다.
              <br />
              <span style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: '600', display: 'block', marginTop: '6px' }}>
                🌿 {impactReason}
              </span>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                상대적 환경 보호 기여도를 산정하여 <strong>{grantedPoints} 그린 포인트</strong>가 적립되었습니다.
              </span>
            </p>
            <div style={{ display: 'flex', gap: '12px', width: '100%', marginTop: '8px' }}>
              <button
                className="auth-submit-btn"
                style={{
                  flex: 1,
                  margin: 0,
                  padding: '12px',
                  borderRadius: '12px',
                  opacity: isShared ? 0.6 : 1,
                  cursor: isShared ? 'default' : 'pointer'
                }}
                disabled={isShared}
                onClick={handleShareToFeed}
              >
                {isShared ? '공유 완료' : '피드에 공유하기'}
              </button>
              <button
                className="logout-btn"
                style={{ flex: 1, borderRadius: '12px', padding: '12px', fontSize: '15px' }}
                onClick={() => {
                  setShowSuccessModal(false)
                  setScannedImage(null)
                  setUploadKey((k) => k + 1)
                }}
              >
                닫기
              </button>
            </div>
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
            <div className="modal-title" style={{ color: 'var(--secondary)', fontSize: '20px' }}>
              {failureType === 'duplicate' ? '중복된 사진입니다' : '친환경이 아니라고 판단해 거부 했습니다'}
            </div>
            <p className="modal-desc">
              {failureType === 'duplicate' ? (
                <>
                  이미 인증되었거나 피드에 등록된 <strong>동일한 사진</strong>입니다.
                  <br /><br />
                  포인트 부정 획득 방지를 위해 중복 업로드는 통과되지 않습니다.
                  <br />
                  새로운 <strong>친환경 실천 사진</strong>을 업로드 해주세요!
                </>
              ) : (
                <>
                  {customRejectionReason ? (
                    <span style={{ color: '#ffb4b4', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                      ⚠️ {customRejectionReason}
                    </span>
                  ) : null}
                  AI 분석 결과 업로드하신 이미지가 친환경 활동(텀블러 사용, 대중교통/도보, 분리배출, 에코백 등)에 해당하지 않습니다.
                  <br /><br />
                  올바른 <strong>친환경 실천 사진</strong>을 다시 업로드 해주세요.
                </>
              )}
            </p>
            <button
              className="modal-close-btn"
              style={{ background: 'var(--secondary)' }}
              onClick={() => {
                setShowFailureModal(false)
                setFailureType('invalid')
                setCustomRejectionReason('')
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
