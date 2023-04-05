export function Mappings() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-5 mb-1">
        <div className="text-lg font-medium">Button mappings</div>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-20">
          <div className="flex items-center justify-center font-medium bg-gray-900 text-white w-6 h-6 rounded-full text-sm">
            →
          </div>
        </div>
        <button
          type="button"
          className="bg-white border border-b-2 border-gray-400 rounded-md px-2 hover:bg-gray-100 hover:border-gray-500"
          title="Click to change"
        >
          ArrowRight
        </button>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-20">
          <div className="flex items-center justify-center font-medium bg-gray-900 text-white w-6 h-6 rounded-full text-sm">
            ←
          </div>
        </div>
        <button
          type="button"
          className="border border-b-2 border-gray-400 rounded-md px-2 hover:bg-gray-100 hover:border-gray-500"
        >
          ArrowLeft
        </button>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-20">
          <div className="flex items-center justify-center font-medium bg-gray-900 text-white w-6 h-6 rounded-full text-sm">
            ↓
          </div>
        </div>
        <button
          type="button"
          className="border border-b-2 border-gray-400 rounded-md px-2 hover:bg-gray-100 hover:border-gray-500"
        >
          ArrowDown
        </button>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-20">
          <div className="flex items-center justify-center font-medium bg-gray-900 text-white w-6 h-6 rounded-full text-sm">
            ↑
          </div>
        </div>
        <button
          type="button"
          className="border border-b-2 border-gray-400 rounded-md px-2 hover:bg-gray-100 hover:border-gray-500"
        >
          ArrowUp
        </button>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-20">
          <div className="flex items-center justify-center font-medium bg-gray-700 text-white px-2 h-6 max-w-min rounded-full text-sm">
            Start
          </div>
        </div>
        <button
          type="button"
          className="border border-b-2 border-gray-400 rounded-md px-2 hover:bg-gray-100 hover:border-gray-500"
        >
          Enter
        </button>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-20">
          <div className="flex items-center justify-center font-medium bg-gray-700 text-white px-2 h-6 max-w-min rounded-full text-sm">
            Select
          </div>
        </div>
        <button
          type="button"
          className="border border-b-2 border-gray-400 rounded-md px-2 hover:bg-gray-100 hover:border-gray-500"
        >
          KeyS
        </button>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-20">
          <div className="flex items-center justify-center font-medium bg-red-500 text-white w-6 h-6 rounded-full text-sm">
            B
          </div>
        </div>
        <button
          type="button"
          className="border border-b-2 border-gray-400 rounded-md px-2 hover:bg-gray-100 hover:border-gray-500"
        >
          KeyD
        </button>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-20">
          <div className="flex items-center justify-center font-medium bg-red-500 text-white w-6 h-6 rounded-full text-sm">
            A
          </div>
        </div>
        <button
          type="button"
          className="border border-b-2 border-gray-400 rounded-md px-2 hover:bg-gray-100 hover:border-gray-500"
        >
          KeyF
        </button>
      </div>
    </div>
  )
}
