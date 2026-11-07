import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-carbon border-t border-[#C5A059]/20 py-8 px-6 text-center text-sm text-lime/60">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p>&copy; 2026 NutriTrack AI. All rights reserved.</p>
        <div className="flex space-x-6 text-xs">
          <a href="#" className="hover:text-gold transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-gold transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-gold transition-colors">Contact Support</a>
        </div>
      </div>
    </footer>
  );
}