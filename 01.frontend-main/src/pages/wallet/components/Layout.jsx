import Navigation from './navigation';

export default function Walletlayout({ children }) {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 md:col-span-2">
        <Navigation />
      </div>
      <div className="col-span-12 p-4 md:col-span-10">
        {/* Content goes here */}
        <div className="mt-1">{children}</div>
      </div>
    </div>
  );
}
