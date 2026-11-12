import React, { useState } from 'react';

interface Plan {
  id: string;
  tier: string;
  monthlyPrice: string;
  yearlyPrice: string;
  desc: string;
  features: string[];
  isPro?: boolean;
}

const PLANS: Plan[] = [
  {
    id: 'pilot',
    tier: 'Campus Pilot',
    monthlyPrice: 'Free',
    yearlyPrice: 'Free',
    desc: 'For institutions evaluating edge biometrics and guard operations on a single post.',
    features: [
      'Up to 2 Gate Posts in the cloud sandbox',
      'Up to 250 Enrolled student and staff identities',
      'Real-time YuNet 5-point facial landmark isolation',
      'On-device SFace 128-D cosine verification',
      'Web Command Centre & Android Guard APK client',
    ],
  },
  {
    id: 'standard',
    tier: 'Institutional Standard',
    monthlyPrice: '₹9,999/m',
    yearlyPrice: '₹99,990/y',
    desc: 'For universities, colleges, and enterprise perimeters requiring high-capacity verification.',
    features: [
      'Up to 10 Active Gate Posts with multi-guard sync',
      'Up to 10,000 Enrolled identity vectors',
      'Encrypted on-device SQLite sovereign offline fallback',
      'HMAC-SHA256 non-repudiation cryptographic ledger',
      'Visitor pre-registration portal & QR pass scanner',
    ],
  },
  {
    id: 'sovereign',
    tier: 'Sovereign Defense',
    monthlyPrice: '₹19,999/m',
    yearlyPrice: '₹1,99,990/y',
    desc: 'For high-security research campuses, defence estates, and air-gapped critical infrastructure.',
    isPro: true,
    features: [
      'Unlimited Gate Posts & Automated Barrier Actuators',
      'Air-gapped on-premise neural inference cluster',
      'High-speed 4K ANPR Vehicle License Plate AI',
      'Strict Zero Raw Image Retention Guarantee',
      '24/7 Dedicated Campus Incident & Cyber SLA',
    ],
  },
];

export const Pricing: React.FC = () => {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="c3-pricing-section w-full">
      {/* Pricing SVG Noise Filter */}
      <svg
        className="absolute w-0 h-0 pointer-events-none"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="c3-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.5"
            numOctaves="2"
            stitchTiles="stitch"
          />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.075" />
          </feComponentTransfer>
          <feComposite in2="SourceGraphic" operator="in" result="noise" />
          <feBlend in="SourceGraphic" in2="noise" mode="overlay" />
        </filter>
      </svg>

      {/* Watermark (giant hero headline as backdrop) */}
      <div className="c3-watermark-container">
        <div className="c3-watermark-main">
          <span className="c3-watermark-line-1">Sovereign Access.</span>
          <span className="c3-watermark-line-2">Revitalized</span>
        </div>
      </div>

      {/* Pricing Grid */}
      <div className="c3-grid">
        {PLANS.map((plan) => {
          const price = yearly ? plan.yearlyPrice : plan.monthlyPrice;

          return (
            <div
              key={plan.id}
              className={`c3-card ${plan.isPro ? 'c3-card-pro' : ''}`}
            >
              <div className="c3-tier-small">{plan.tier}</div>
              <div className="c3-tier-large">{price}</div>
              <div className="c3-desc">{plan.desc}</div>

              <ul className="c3-list">
                {plan.features.map((feature, idx) => (
                  <li key={idx}>
                    <span className="c3-check">
                      <svg
                        width="14"
                        height="11"
                        viewBox="0 0 14 11"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          d="M1 5.5L4.8 9.5L13 1.5"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button type="button" className="c3-btn">
                Select Deployment
              </button>
            </div>
          );
        })}
      </div>

      {/* Yearly Billing Toggle */}
      <div className="c3-toggle-wrap">
        <span className="text-sm font-medium text-white/75">
          Annual Institutional Deployment (15% Savings)
        </span>
        <button
          type="button"
          onClick={() => setYearly(!yearly)}
          className={`c3-toggle ${yearly ? 'active' : ''}`}
          aria-label="Toggle annual billing"
        >
          <div className="c3-toggle-knob" />
        </button>
      </div>
    </section>
  );
};
