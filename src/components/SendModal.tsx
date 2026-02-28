import { useState } from 'react'

interface Props {
  userId: number
  balance: number
  onClose: () => void
  onSuccess: () => void
}

const FUNCTIONS_URL = 'https://wtlgiygdsgohibbpylln.supabase.co'

export default function SendModal({ userId, balance, onClose, onSuccess }: Props) {
  const [toId, setToId] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!toId || !amount) return
    
    setLoading(true)
    try {
      const res = await fetch(`${FUNCTIONS_URL}/send-syt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from_id: userId,
          to_id: parseInt(toId),
          amount: parseInt(amount)
        })
      })
      
      if (res.ok) {
        onSuccess()
        onClose()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm">
        <h3 className="text-lg font-bold mb-4">إرسال SYT</h3>
        
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">رقم المستلم</label>
          <input
            type="number"
            value={toId}
            onChange={(e) => setToId(e.target.value)}
            className="w-full border rounded-lg p-2"
            placeholder="Telegram ID"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">المبلغ</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border rounded-lg p-2"
            max={balance}
          />
          <div className="text-xs text-gray-400 mt-1">الرصيد: {balance} SYT</div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleSend}
            disabled={loading}
            className="flex-1 bg-blue-500 text-white py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? 'جاري...' : 'إرسال'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 py-2 rounded-lg"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  )
}
