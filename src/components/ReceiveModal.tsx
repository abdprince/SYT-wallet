interface Props {
  userId: number
  onClose: () => void
}

export default function ReceiveModal({ userId, onClose }: Props) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(userId.toString())
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm text-center">
        <h3 className="text-lg font-bold mb-4">استلام SYT</h3>
        
        <div className="bg-gray-100 rounded-lg p-4 mb-4">
          <div className="text-sm text-gray-500 mb-1">عنوان محفظتك</div>
          <div className="text-xl font-mono font-bold">{userId}</div>
        </div>
        
        <button
          onClick={copyToClipboard}
          className="w-full bg-green-500 text-white py-2 rounded-lg mb-2"
        >
          نسخ الرقم
        </button>
        
        <button
          onClick={onClose}
          className="w-full bg-gray-200 py-2 rounded-lg"
        >
          إغلاق
        </button>
      </div>
    </div>
  )
}
