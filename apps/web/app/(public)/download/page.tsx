import Link from 'next/link';
import { ArrowLeft, Download, ShieldCheck, FileCheck } from 'lucide-react';

export default function DownloadPage() {
  const sha256 = '8a4f91e32d0c1589b4f2c00a4e76d542ef891024bc681b9e289387216a491ef2';

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-8">
      <Link href="/" className="inline-flex items-center space-x-1 text-xs text-gatewise-secondary hover:text-gatewise-text font-semibold">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Home</span>
      </Link>

      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-gatewise-text">Download Official Android Guard APK</h1>
        <p className="text-xs text-gatewise-secondary">
          Certified institutional release for security guard terminals at IIM Sambalpur campus gates.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-gatewise-border shadow-sm space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gatewise-primary text-white flex items-center justify-center">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gatewise-text">GATEWISE Guard · Android 14/15</h2>
            <p className="text-xs text-gatewise-secondary">Package: com.gatewiseai.guard · v1.0.0 (48.6 MB)</p>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-background-secondary border border-gatewise-border text-xs space-y-1">
          <span className="font-semibold text-gatewise-text block">Official SHA-256 Checksum:</span>
          <span className="font-mono text-[11px] text-gatewise-secondary break-all">{sha256}</span>
        </div>

        <div className="pt-2">
          <button className="px-5 py-2.5 rounded-xl bg-gatewise-primary text-white text-xs font-bold hover:bg-gatewise-deep transition-all flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Download Signed APK</span>
          </button>
        </div>
      </div>
    </div>
  );
}
