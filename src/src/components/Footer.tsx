import React from 'react';
import { Twitter, Github, Linkedin } from 'lucide-react';
export function Footer() {
  return (
    <footer className="border-t border-border mt-16 py-8 bg-surface/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="font-sora font-bold text-lg tracking-tight flex items-center gap-1 text-muted">
          AI <span className="text-border font-mono font-medium">{'//'}</span>{' '}
          24
        </div>

        <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-muted">
          <a href="#" className="hover:text-primary transition-colors">
            About
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            Newsletter
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            Terms
          </a>
        </div>

        <div className="flex items-center gap-5 text-muted">
          <Twitter className="w-4 h-4 hover:text-primary cursor-pointer transition-colors" />
          <Github className="w-4 h-4 hover:text-primary cursor-pointer transition-colors" />
          <Linkedin className="w-4 h-4 hover:text-primary cursor-pointer transition-colors" />
        </div>
      </div>
    </footer>);

}