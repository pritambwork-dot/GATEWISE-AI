import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function FeaturesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-6">
      <Link href="/" className="inline-flex items-center space-x-1 text-xs text-gatewise-secondary hover:text-gatewise-text font-semibold">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Home</span>
      </Link>
      <h1 className="text-3xl font-extrabold text-gatewise-text">Platform Features & Guarantees</h1>
      <ul className="space-y-3 text-xs text-gatewise-secondary leading-relaxed">
        <li>• Single-shot manual camera capture (zero continuous video surveillance).</li>
        <li>• Decoupled identity recognition (&ge; 90% threshold) vs. institutional authorization.</li>
        <li>• SHA-256 cryptographic audit logs on every guard decision.</li>
        <li>• Zero biometric data sent to third-party LLMs or cloud analytics.</li>
      </ul>
    </div>
  );
}
