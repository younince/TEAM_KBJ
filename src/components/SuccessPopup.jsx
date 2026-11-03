export default function SuccessPopup({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="fixed top-6 right-6 z-[250] max-w-sm w-full bg-[#111827] border border-[#84cc16]/30 rounded-2xl p-5 shadow-2xl flex justify-between items-center animate-slide-in"
      style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        zIndex: 300,
        maxWidth: '360px',
        width: '100%',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--primary)',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <div>
        <p style={{ fontSize: '15px', fontWeight: '700', color: '#fff', margin: 0 }}>성공 했습니다.</p>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', margin: 0 }}>하나머니로 그린포인트가 전환되었습니다.</p>
      </div>
      <button
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-muted)',
          fontSize: '24px',
          fontWeight: '700',
          cursor: 'pointer',
          marginLeft: '16px'
        }}
        onClick={onClose}
      >
        &times;
      </button>
    </div>
  )
}
