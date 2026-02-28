import { useEffect, useState } from 'react'

interface Transaction {
  id: string
  from_id: number
  to_id: number
  amount: number
  created_at: string
  type?: 'sent' | 'received'
}

interface Props {
  userId: number
  refreshTrigger?: number
}

const FUNCTIONS_URL = "https://wtlgiygdsgohibbpylln.supabase.co/functions/v1"

export default function TransactionsList({ userId, refreshTrigger }: Props) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTransactions()
  }, [userId, refreshTrigger])

  const fetchTransactions = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${FUNCTIONS_URL}/get-transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(import.meta as any).env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ telegram_id: userId })
      })
      const data = await res.json()
      setTransactions(data.transactions || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ar-SA', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) return <div className="text-center text-gray-400 py-4">جاري التحميل...</div>

  if (transactions.length === 0) {
    return <div className="text-center text-gray-400 py-4">لا توجد معاملات</div>
  }

  return (
    <div className="space-y-3">
      {transactions.map((t) => {
        const isSent = t.type === 'sent' || userId === t.from_id
        
        return (
          <div
            key={t.id}
            className={`flex items-center justify-between p-3 rounded-lg ${
              isSent ? 'bg-red-50' : 'bg-green-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                  isSent ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                }`}
              >
                {isSent ? '↑' : '↓'}
              </div>
              <div>
                <div className="font-medium text-sm">
                  {isSent ? 'إرسال' : 'استلام'}
                </div>
                <div className="text-xs text-gray-500">
                  {isSent ? `إلى: ${t.to_id}` : `من: ${t.from_id}`}
                </div>
              </div>
            </div>
            <div className="text-left">
              <div
                className={`font-bold ${
                  isSent ? 'text-red-600' : 'text-green-600'
                }`}
              >
                {isSent ? '-' : '+'}
                {t.amount} SYT
              </div>
              <div className="text-xs text-gray-400">{formatDate(t.created_at)}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
