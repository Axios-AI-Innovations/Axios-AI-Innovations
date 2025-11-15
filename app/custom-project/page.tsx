'use client';

import { useEffect } from 'react';

export default function CustomProjectPage() {
  useEffect(() => {
    // Redirect to homepage with contact section hash
    if (typeof window !== 'undefined') {
      window.location.href = '/#contact';
    }
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-400">Redirecting to consultation form...</p>
      </div>
    </div>
  );
}

