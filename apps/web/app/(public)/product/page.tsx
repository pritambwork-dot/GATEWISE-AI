import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ProductPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-6">
      <Link href="/" className="inline-flex items-center space-x-1 text-xs text-gatewise-secondary hover:text-gatewise-text font-semibold">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Home</span>
      </Link>
      <h1 className="text-3xl font-extrabold text-gatewise-text">GATEWISE AI Product Architecture</h1>
      <p className="text-sm text-gatewise-secondary leading-relaxed">
        A 3-way interconnected institutional security platform: Android handheld terminals at campus gates, central FastAPI backend with OpenCV computer vision pipeline, and desktop administrator portal for Chief Security Officers.
      </p>
    </div>
  );
}
