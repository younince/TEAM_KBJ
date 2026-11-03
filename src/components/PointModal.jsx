import { useState, useEffect } from 'react'

export default function PointModal({ isOpen, onClose, greenPoints, onConvert }) {
  const [amount, setAmount] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // 모달이 열릴 때 상태 초기화
  useEffect(() => {
    if (isOpen) {
      setAmount('')
      setErrorMessage('')
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleConvertClick = () => {
    const parseAmount = parseInt(amount, 10)
    if (!amount || isNaN(parseAmount) || parseAmount <= 0 || parseAmount > greenPoints) {
      setErrorMessage('변환 실패: 전환할 포인트가 올바르지 않거나 보유 포인트를 초과했습니다.')
      return
    }
    setErrorMessage('')
    onConvert(parseAmount)
  }

  return (
    <div 
      className="success-modal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(9, 13, 22, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div 
        className="auth-card" 
        style={{ 
          maxWidth: '440px', 
          width: '100%', 
          margin: 0, 
          padding: '32px',
          alignItems: 'stretch',
          gap: '20px',
          border: '1px solid var(--border-focus)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), var(--shadow-glow)',
          animation: 'modalPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
          <h2 style={{ fontFamily: 'var(--heading)', fontWeight: '700', fontSize: '20px', color: '#fff', margin: 0 }}>
            하나머니로 전환
          </h2>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>현재 나의 그린포인트</span>
          <span style={{ fontSize: '24px', fontWeight: '800', color: 'var(--primary)' }}>
            {greenPoints.toLocaleString()} <span style={{ fontSize: '16px', fontWeight: '600' }}>GP</span>
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '14px', color: 'var(--text-main)', fontWeight: '600' }}>
            얼마나 하나머니로 변환할것인가요?
          </label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="변환할 포인트를 입력하세요"
            value={amount}
            onChange={(e) => {
              const onlyNums = e.target.value.replace(/[^0-9]/g, '')
              setAmount(onlyNums)
              setErrorMessage('')
            }}
            style={{ 
              width: '100%',
              backgroundColor: 'var(--bg-input)', 
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '14px 16px',
              color: 'var(--text-main)',
              fontSize: '15px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {errorMessage && (
          <div style={{ 
            color: 'var(--secondary)', 
            fontSize: '13px', 
            fontWeight: '600', 
            backgroundColor: 'rgba(239, 68, 68, 0.1)', 
            padding: '12px', 
            borderRadius: '10px', 
            border: '1px solid rgba(239, 68, 68, 0.2)' 
          }}>
            {errorMessage}
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
          <button
            className="auth-submit-btn"
            style={{ flex: 1, margin: 0, padding: '14px', borderRadius: '12px' }}
            onClick={handleConvertClick}
          >
            전환
          </button>
          <button
            className="logout-btn"
            style={{ flex: 1, borderRadius: '12px', fontSize: '15px', padding: '14px' }}
            onClick={onClose}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  )
}
