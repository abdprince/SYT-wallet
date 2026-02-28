import { useEffect, useState } from 'react'

function App() {
  const [userId, setUserId] = useState<number | null>(null)

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp
    if (tg) {
      tg.ready()
      tg.expand()
      const user = tg.initDataUnsafe?.user
      if (user) {
        setUserId(user.id)
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="bg-gray-100 rounded-xl p-6 text-center mb-4">
        <div className="text-3xl font-bold mb-1">2,000</div>
        <div className="text-gray-500">SYT</div>
        <div className="flex gap-2 mt-4 justify-center">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
            إرسال
          </button>
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg">
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
    </div>
  )
}

export default App
