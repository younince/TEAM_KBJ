import { useState } from 'react'
import Logo from '../components/Logo'
import { AwardIcon } from '../components/Icons'
import PointModal from '../components/PointModal'
import SuccessPopup from '../components/SuccessPopup'

export default function MyPage({ user, greenPoints, setGreenPoints, feed, setPage, handleLogout }) {
  const [showConvertModal, setShowConvertModal] = useState(false)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)

  // 내 친환경 활동 내역 필터링
  const myActivities = feed.filter((post) => post.author === user?.id)

  const handleConvertPoints = (amount) => {
    setGreenPoints((prev) => prev - amount)
    setShowConvertModal(false)
    setShowSuccessPopup(true)
  }

  return (
    <>
      {/* 1. Header 영역 */}
      <header>
        <div className="nav-container">
          <Logo onClick={() => setPage('main')} />
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

      {/* 2. 서브 비주얼 화면 (헤더 바로 아래 배너 영역) */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '280px',
        overflow: 'hidden',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000'
      }}>
        <img 
          src="/slide3.jpg" 
          alt="My Page Banner" 
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.45,
            filter: 'brightness(0.6)'
          }}
        />
        <div style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          padding: '0 20px'
        }}>
          <span style={{
            color: 'var(--primary)',
            fontWeight: '700',
            fontSize: '14px',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            background: 'var(--primary-bg)',
            border: '1px solid var(--border-focus)',
            padding: '4px 12px',
            borderRadius: '20px',
            marginBottom: '16px',
            display: 'inline-block'
          }}>
            MY PAGE / POINTS
          </span>
          <h1 style={{
            fontFamily: 'var(--heading)',
            fontWeight: '900',
            fontSize: '42px',
            lineHeight: '1.2',
            color: '#ffffff',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.6)'
          }}>
            마이페이지 / 포인트 관리
          </h1>
        </div>
      </div>

      {/* 3. 메인 콘텐츠 2단 레이아웃 (왼쪽: 유저정보 및 내 활동 내역, 오른쪽: 그린포인트 및 하나머니 전환) */}
      <main className="main-wrapper" style={{ padding: '40px 24px' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: '32px',
          justifyContent: 'center',
          alignItems: 'flex-start',
          width: '100%'
        }}>
          
          {/* 왼쪽 영역: 유저 정보 + 나의 활동 내역 */}
          <div className="auth-card" style={{
            flex: '2 1 500px',
            maxWidth: '650px',
            margin: 0,
            alignItems: 'stretch',
            padding: '32px'
          }}>
            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '20px' }}>
              <h2 style={{ fontFamily: 'var(--heading)', fontWeight: '700', fontSize: '20px', color: '#fff' }}>
                내 활동 정보
              </h2>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '28px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>사용자 계정</span>
              <span style={{ fontSize: '18px', fontWeight: '700', color: 'var(--primary)' }}>@{user?.id} 님</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>나의 친환경 활동 내역</span>
              
              <div style={{ 
                maxHeight: '320px', 
                overflowY: 'auto', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '12px', 
                paddingRight: '6px' 
              }}>
                {myActivities.length === 0 ? (
                  <p style={{ fontSize: '14px', color: 'var(--text-muted)', textAlign: 'center', padding: '48px 0' }}>
                    활동 내역이 존재하지 않습니다.<br />메인 화면에서 친환경 실천 사진을 인증해 보세요!
                  </p>
                ) : (
                  myActivities.map((act) => (
                    <div key={act.id} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '16px', 
                      background: 'rgba(255, 255, 255, 0.03)', 
                      padding: '12px', 
                      borderRadius: '12px', 
                      border: '1px solid var(--border)' 
                    }}>
                      <img 
                        src={act.image} 
                        alt="활동 사진" 
                        style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px' }} 
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2px' }}>{act.time}</p>
                        <p style={{ fontSize: '13px', fontWeight: '600', color: '#fff', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                          {act.text}
                        </p>
                      </div>
                      <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--primary)', flexShrink: 0 }}>
                        {act.points}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* 오른쪽 영역: 나의 그린포인트 + 하나머니 전환 버튼 */}
          <div className="auth-card" style={{
            flex: '1 1 320px',
            maxWidth: '440px',
            margin: 0,
            alignItems: 'stretch',
            padding: '32px'
          }}>
            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '20px' }}>
              <h2 style={{ fontFamily: 'var(--heading)', fontWeight: '700', fontSize: '20px', color: '#fff' }}>
                포인트 환전
              </h2>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '32px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>현재 나의 그린포인트</span>
              <span style={{ fontSize: '32px', fontWeight: '900', color: 'var(--primary)', fontFamily: 'var(--heading)' }}>
                {greenPoints.toLocaleString()} <span style={{ fontSize: '20px', fontWeight: '700' }}>GP</span>
              </span>
            </div>

            <button
              className="auth-submit-btn"
              style={{ margin: 0, padding: '16px', borderRadius: '14px', width: '100%' }}
              onClick={() => setShowConvertModal(true)}
            >
              하나머니로 전환
            </button>
          </div>

        </div>
      </main>

      {/* 하나머니 전환 모달 */}
      <PointModal
        isOpen={showConvertModal}
        onClose={() => setShowConvertModal(false)}
        greenPoints={greenPoints}
        onConvert={handleConvertPoints}
      />

      {/* 변환 성공 레이어 팝업 */}
      <SuccessPopup
        isOpen={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
      />
    </>
  )
}
