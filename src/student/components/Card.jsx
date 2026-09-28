export default function Card({ children, className = "" }) {
  return (
    <div className={`overflow-hidden rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6 ${className}`}>
      {children}
    </div>
  );
}
