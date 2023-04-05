export function Title() {
  return (
    <>
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-semibold mr-4">FNES</h1>
        <a
          href="https://github.com/jakubito/fnes"
          className="text-blue-600 font-medium hover:underline"
          target="_blank"
        >
          github
        </a>{' '}
        -
        <a
          href="https://github.com/jakubito"
          className="text-blue-600 font-medium hover:underline"
          target="_blank"
        >
          @jakubito
        </a>
      </div>
      <div className="bg-indigo-50 px-4 py-2 rounded">
        Drop a rom file anywhere, or&nbsp;use the file picker below. Supported formats:{' '}
        <span className="font-semibold">.nes</span>/<span className="font-semibold">.zip</span>
      </div>
    </>
  )
}
