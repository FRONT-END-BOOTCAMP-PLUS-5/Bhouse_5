const tabs = [
  { id: null, label: '전체' },
  { id: 1, label: '모집' },
  { id: 2, label: '정보' },
  { id: 3, label: '질문' },
  { id: 4, label: '자유' },
]

interface Props {
  selectedId: number | null
  onChange: (id: number | null) => void
  isLoggedIn: boolean
}

export default function CategoryTabs({ selectedId, onChange, isLoggedIn }: Props) {
  return (
    <div style={{ display: 'flex', gap: '12px', margin: '16px 0' }}>
      {tabs
        .filter((tab) => isLoggedIn || tab.id !== 1) // 🔒 로그인 안 했으면 '모집' 탭 숨김
        .map((tab) => (
          <button
            key={tab.label}
            onClick={() => onChange(tab.id)}
            style={{
              padding: '6px 12px',
              border: selectedId === tab.id ? '2px solid #007AFF' : '1px solid #ccc',
              backgroundColor: selectedId === tab.id ? '#f0f8ff' : '#fff',
              borderRadius: '6px',
              fontWeight: selectedId === tab.id ? 'bold' : 'normal',
              color: selectedId === tab.id ? '#007AFF' : '#333',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {tab.label}
          </button>
        ))}
    </div>
  )
}
