"use client";
export default function ConfirmButton({ children, message = "Delete this? This can't be undone." }: { children: React.ReactNode; message?: string }) {
  return (
    <button className="text-sm text-red-400 hover:underline" onClick={(e) => { if (!confirm(message)) e.preventDefault(); }}>
      {children}
    </button>
  );
}
