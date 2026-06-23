import React from 'react';
import { Link } from 'react-router-dom';
export function Footer() {
  return (
    <footer className="border-t border-border mt-16 py-8 bg-surface/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <img
          src="/mos-footer-logo.svg"
          alt="Mosaic Logo"
          className="h-8 w-auto hover:opacity-80 transition-opacity cursor-pointer"
        />

        <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-muted">
          <Link to="/about" className="hover:text-primary transition-colors">
            About
          </Link>
          <Link to="/privacy" className="hover:text-primary transition-colors">
            Privacy
          </Link>
          <Link to="/terms" className="hover:text-primary transition-colors">
            Terms
          </Link>
        </div>

        <div className="text-sm text-muted">
          build by <span className="font-semibold text-primary">Not Normal</span>
        </div>
      </div>
    </footer>);

}