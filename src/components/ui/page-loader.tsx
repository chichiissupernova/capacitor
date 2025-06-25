
import { LoadingSpinner } from "./loading-spinner"

export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFEFE9] to-[#fffdf9]">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-gray-600 animate-pulse">Loading CHICHI...</p>
      </div>
    </div>
  )
}
