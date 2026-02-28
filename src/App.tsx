import { useEffect, useState } from 'react'
import SendModal from './components/SendModal'
import ReceiveModal from './components/ReceiveModal'

const FUNCTIONS_URL = 'https://wtlgiygdsgohibbpylln.supabase.co/functions/v1'

function App() {
  const [userId, setUserId] = useState<number | null>(null)
  const [balance, setBalance] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [showSend, setShowSend] = useState(false)
  const [showReceive, setShowReceive] = useState(false)

  useEffect(() => {
  console.log('useEffect started')
  
  const tg = (window as any).Telegram?.WebApp
  console.log('Telegram WebApp:', tg)
  
  if (!tg) {
    console.log('No Telegram WebApp found')
    return
  }

  tg.ready()
  tg.expand()
  
  const user = tg.initDataUnsafe?.user
  console.log('User:', user)
  console.log('User ID:', user?.id)
  
  if (user) {
    setUserId(user.id)
    createWallet(user.id)
  } else {
    console.log('No user found')
  }
}, [])

  const createWallet = async (telegramId: number) => {
  try {
    const res = await fetch(`${FUNCTIONS_URL}/create-wallet`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${(import.meta as any).env.VITE_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ telegram_id: telegramId })
    })
    const data = await res.json()
    
    console.log('Response:', JSON.stringify(data))
console.log('Wallet:', data.wallet)
console.log('Balance:', data.wallet?.balance)
console.log('Balance type:', typeof data.wallet?.balance)
    
    if (data.wallet && typeof data.wallet.balance === 'number') {
      setBalance(data.wallet.balance)
    } else {
      setBalance(0)
    }
  } catch (err) {
    console.error(err)
    setBalance(0)
  } finally {
    setLoading(false)
  }
}

  const refreshBalance = async () => {
  if (!userId) return
  const res = await fetch(`${FUNCTIONS_URL}/create-wallet`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${(import.meta as any).env.VITE_SUPABASE_ANON_KEY}`
    },
    body: JSON.stringify({ telegram_id: userId })
  })
  const data = await res.json()
  setBalance(data.wallet?.balance || 0)
}

  if (loading) return <div className="p-4 text-center">جاري التحميل...</div>

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="bg-gray-100 rounded-xl p-6 text-center mb-4">
        <div className="text-3xl font-bold mb-1">{balance.toLocaleString()}</div>
        <div className="text-gray-500">SYT</div>
        <div className="flex gap-2 mt-4 justify-center">
          <button 
            onClick={() => setShowSend(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            إرسال
          </button>
          <button 
            onClick={() => setShowReceive(true)}
            className="bg-green-500 text-white px-4 py-2 rounded-lg"
          >
            استلام
          </button>
        </div>
      </div>

      <div className="bg-gray-100 rounded-xl p-6 text-center">
        <div className="text-gray-400">قائمة المهام</div>
        <div className="text-sm text-gray-300 mt-2">قريباً</div>
      </div>

      {userId && (
        <div className="text-xs text-gray-300 text-center mt-4">
          ID: {userId}
        </div>
      )}

      {showSend && userId && (
        <SendModal
          userId={userId}
          balance={balance}
          onClose={() => setShowSend(false)}
          onSuccess={refreshBalance}
        />
      )}

      {showReceive && userId && (
        <ReceiveModal
          userId={userId}
          onClose={() => setShowReceive(false)}
        />
      )}
    </div>
  )
}

export default App
