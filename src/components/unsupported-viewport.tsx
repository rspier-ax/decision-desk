export function UnsupportedViewport() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-slate-50 px-6 text-center">
      <h1 className="text-lg font-semibold text-slate-900">Larger screen required</h1>
      <p className="mt-2 max-w-md text-sm text-slate-600">
        DecisionDesk is an operational review workspace designed for tablet and desktop
        screens. Open it on a device with a viewport of at least 768px.
      </p>
      <p className="mt-3 text-xs text-slate-500">Minimum supported width: 768px</p>
    </div>
  );
}
