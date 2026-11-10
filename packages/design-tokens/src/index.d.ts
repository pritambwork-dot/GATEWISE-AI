/**
 * GATEWISE AI — Shared Institutional Design Tokens
 * Source of Truth for Web (Tailwind/Next.js) & Mobile (React Native/Expo)
 */
export declare const GatewiseColors: {
    readonly background: {
        readonly main: "#F4F8F5";
        readonly surface: "#FFFFFF";
        readonly secondary: "#EDF4EF";
    };
    readonly brand: {
        readonly lightGreen: "#DDF0E2";
        readonly mint: "#C7E7D8";
        readonly primary: "#23865D";
        readonly deep: "#176346";
        readonly teal: "#3A9B8B";
        readonly softBlue: "#A8CBE0";
    };
    readonly text: {
        readonly primary: "#1E2D26";
        readonly secondary: "#65756C";
        readonly muted: "#95A39A";
    };
    readonly border: {
        readonly subtle: "#E2EBE4";
        readonly medium: "#C8D9CD";
        readonly strong: "#8FA998";
    };
    readonly status: {
        readonly success: "#26865E";
        readonly warning: "#CF983E";
        readonly error: "#C85B57";
        readonly info: "#3A9B8B";
    };
};
export declare const GatewiseTypography: {
    readonly fontFamily: {
        readonly sans: "Inter, system-ui, -apple-system, sans-serif";
        readonly mono: "monospace";
    };
    readonly fontSize: {
        readonly xs: 11;
        readonly sm: 13;
        readonly base: 15;
        readonly lg: 18;
        readonly xl: 20;
        readonly '2xl': 24;
        readonly '3xl': 30;
        readonly '4xl': 36;
    };
    readonly fontWeight: {
        readonly regular: "400";
        readonly medium: "500";
        readonly semibold: "600";
        readonly bold: "700";
        readonly extrabold: "800";
    };
    readonly lineHeight: {
        readonly tight: 1.15;
        readonly snug: 1.25;
        readonly normal: 1.5;
        readonly relaxed: 1.625;
    };
};
export declare const GatewiseSpacing: {
    readonly none: 0;
    readonly xxs: 2;
    readonly xs: 4;
    readonly sm: 8;
    readonly md: 12;
    readonly base: 16;
    readonly lg: 20;
    readonly xl: 24;
    readonly '2xl': 32;
    readonly '3xl': 40;
    readonly '4xl': 48;
    readonly '5xl': 64;
};
export declare const GatewiseBorderRadius: {
    readonly none: 0;
    readonly sm: 4;
    readonly md: 8;
    readonly lg: 12;
    readonly xl: 16;
    readonly '2xl': 20;
    readonly '3xl': 24;
    readonly full: 9999;
};
export declare const GatewiseShadows: {
    readonly sm: "0 1px 2px 0 rgba(30, 45, 38, 0.05)";
    readonly base: "0 1px 3px 0 rgba(30, 45, 38, 0.1), 0 1px 2px -1px rgba(30, 45, 38, 0.1)";
    readonly md: "0 4px 6px -1px rgba(30, 45, 38, 0.08), 0 2px 4px -2px rgba(30, 45, 38, 0.08)";
    readonly lg: "0 10px 15px -3px rgba(30, 45, 38, 0.08), 0 4px 6px -4px rgba(30, 45, 38, 0.08)";
    readonly xl: "0 20px 25px -5px rgba(30, 45, 38, 0.08), 0 8px 10px -6px rgba(30, 45, 38, 0.08)";
};
export declare const GatewiseMotion: {
    readonly fast: "150ms";
    readonly normal: "250ms";
    readonly slow: "350ms";
    readonly stepperIntervalMs: 280;
};
export declare const GatewiseElevation: {
    readonly base: 0;
    readonly card: 1;
    readonly header: 2;
    readonly modal: 10;
    readonly tooltip: 20;
};
export declare const GatewiseThresholds: {
    readonly faceMatchAutoAdmit: 0.9;
    readonly faceMatchCandidate: 0.7;
    readonly faceMatchUnknown: 0.7;
    readonly minBlurScore: 60;
};
export declare const GatewiseRole: {
    readonly SUPER_ADMIN: "SUPER_ADMIN";
    readonly ADMIN: "ADMIN";
    readonly SECURITY_GUARD: "SECURITY_GUARD";
};
export declare const VerificationOutcome: {
    readonly VERIFIED_AUTHORIZED: "VERIFIED_AUTHORIZED";
    readonly IDENTIFIED_UNAUTHORIZED: "IDENTIFIED_UNAUTHORIZED";
    readonly POTENTIAL_MATCH: "POTENTIAL_MATCH";
    readonly UNKNOWN_PERSON: "UNKNOWN_PERSON";
    readonly IMAGE_QUALITY_INSUFFICIENT: "IMAGE_QUALITY_INSUFFICIENT";
    readonly AUTHORIZATION_EXPIRED: "AUTHORIZATION_EXPIRED";
    readonly SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE";
};
export declare const GuardDecisionAction: {
    readonly GRANT_ENTRY: "GRANT_ENTRY";
    readonly DENY_ENTRY: "DENY_ENTRY";
    readonly ESCALATE_TO_ADMIN: "ESCALATE_TO_ADMIN";
    readonly REFER_TO_VISITOR_DESK: "REFER_TO_VISITOR_DESK";
    readonly MANUAL_ID_CONFIRMED: "MANUAL_ID_CONFIRMED";
};
//# sourceMappingURL=index.d.ts.map