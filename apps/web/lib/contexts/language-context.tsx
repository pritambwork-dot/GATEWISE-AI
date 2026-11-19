'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi';

export interface Translations {
  // Navigation & Shell
  navOperations: string;
  navIdentity: string;
  navArchitecture: string;
  overview: string;
  liveOperations: string;
  securityGuards: string;
  verificationCentre: string;
  cryptographicAudit: string;
  identityRegistry: string;
  photoLibrary: string;
  registrations: string;
  visitorPasses: string;
  campusVehicles: string;
  reportsAnalytics: string;
  accessControl: string;
  gatesPerimeter: string;
  notifications: string;
  edgeIntegrations: string;
  settings: string;
  sessionAnalytics: string;
  bulkImport: string;
  approvalQueue: string;
  modelEnrollment: string;
  systemStates: string;
  helpSupport: string;

  // Header & Controls
  searchPlaceholder: string;
  campusActiveBadge: string;
  sfaceScore: string;
  profileRole: string;
  profileDesk: string;
  systemPreferences: string;
  publicPortal: string;
  signOut: string;
  consoleTitle: string;
  commandCentre: string;
  overviewDesk: string;

  // Overview Page
  overviewHeading: string;
  overviewSubheading: string;
  liveFeedActive: string;
  exportAuditLogs: string;
  rangeToday: string;
  range7Days: string;
  range30Days: string;
  rangeCustom: string;
  nominalCallout: string;

  // Metric Cards
  metricTotalScans: string;
  metricTotalScansDesc: string;
  metricCompletedVerifications: string;
  metricCompletedVerificationsDesc: string;
  metricVerifiedIdentities: string;
  metricVerifiedIdentitiesDesc: string;
  metricAuthorizedEntries: string;
  metricAuthorizedEntriesDesc: string;
  metricDeniedEntries: string;
  metricDeniedEntriesDesc: string;
  metricPendingReviews: string;
  metricPendingReviewsDesc: string;
  metricActiveVisitors: string;
  metricActiveVisitorsDesc: string;
  metricActiveGuards: string;
  metricActiveGuardsDesc: string;
  metricActiveGates: string;
  metricActiveGatesDesc: string;

  // Graph & Sections
  activityGraphTitle: string;
  activityGraphSubtitle: string;
  outcomesTitle: string;
  outcomesSubtitle: string;
  gateActivityTitle: string;
  gateActivitySubtitle: string;
  recentStreamTitle: string;
  recentStreamSubtitle: string;
  viewAll: string;
  auditLink: string;

  // Table Columns & Badges
  colIdentity: string;
  colIdNumber: string;
  colGateGuard: string;
  colScore: string;
  colTime: string;
  colOutcome: string;
  colAction: string;

  badgeAuthorized: string;
  badgeDenied: string;
  badgeReferred: string;
  badgeOperational: string;
  badgeOnline: string;

  // Desktop Gate
  desktopGateTitle: string;
  desktopGateDesc: string;
  desktopGateBypass: string;
}

export const DICTIONARY: Record<Language, Translations> = {
  en: {
    navOperations: 'OPERATIONS',
    navIdentity: 'IDENTITY & REGISTRY',
    navArchitecture: 'SYSTEM ARCHITECTURE',
    overview: 'Overview',
    liveOperations: 'Live Operations',
    securityGuards: 'Security Guards',
    verificationCentre: 'Verification Centre',
    cryptographicAudit: 'Cryptographic Audit',
    identityRegistry: 'Identity Registry',
    photoLibrary: 'Photograph Library',
    registrations: 'Registrations',
    visitorPasses: 'Visitor Passes',
    campusVehicles: 'Campus Vehicles',
    reportsAnalytics: 'Reports & Analytics',
    accessControl: 'Access Control',
    gatesPerimeter: 'Gates & Perimeter',
    notifications: 'Notifications',
    edgeIntegrations: 'Edge Integrations',
    settings: 'Settings',
    sessionAnalytics: 'Session Analytics',
    bulkImport: 'Bulk XLSX Import',
    approvalQueue: 'Approval Queue',
    modelEnrollment: 'Model Enrollment',
    systemStates: 'System States',
    helpSupport: 'Help & Support',

    searchPlaceholder: 'Search identities, scans, gates, or guard badge numbers...',
    campusActiveBadge: 'IIM Sambalpur Active',
    sfaceScore: 'SFace 128-D',
    profileRole: 'Chief Security Officer',
    profileDesk: 'IIM Sambalpur Desk',
    systemPreferences: 'Settings',
    publicPortal: 'Open Public Portal',
    signOut: 'Sign Out',
    consoleTitle: 'IIM Sambalpur Console',
    commandCentre: 'Command Centre',
    overviewDesk: 'Overview Desk',

    overviewHeading: 'IIM Sambalpur Security Overview',
    overviewSubheading: 'Real-time gate telemetry, biometric verification records, and cryptographic access streams.',
    liveFeedActive: 'Live Feed Active',
    exportAuditLogs: 'Export Audit Logs',
    rangeToday: 'Today',
    range7Days: 'Last 7 days',
    range30Days: 'Last 30 days',
    rangeCustom: 'Custom',
    nominalCallout: 'All 4 perimeter gates operating at nominal biometric verification thresholds.',

    metricTotalScans: 'Total Guard Scans',
    metricTotalScansDesc: 'Total biometric attempts across all active gates',
    metricCompletedVerifications: 'Completed Verifications',
    metricCompletedVerificationsDesc: 'Processed through local on-device neural model',
    metricVerifiedIdentities: 'Verified Identities',
    metricVerifiedIdentitiesDesc: 'Successful 128-D embedding cosine matches',
    metricAuthorizedEntries: 'Authorised Entries',
    metricAuthorizedEntriesDesc: 'Cleared for institutional campus entry',
    metricDeniedEntries: 'Denied Entries',
    metricDeniedEntriesDesc: 'Flagged, mismatched, or unauthorized credentials',
    metricPendingReviews: 'Pending Reviews',
    metricPendingReviewsDesc: 'Awaiting secondary supervisor clearance',
    metricActiveVisitors: 'Active Visitors',
    metricActiveVisitorsDesc: 'Temporary guest & contractor passes on campus',
    metricActiveGuards: 'Active Security Guards',
    metricActiveGuardsDesc: 'On-duty personnel authenticated on mobile stations',
    metricActiveGates: 'Active Gates',
    metricActiveGatesDesc: 'Main, Academic, Hostel & Service access points',

    activityGraphTitle: '24-Hour Verification Activity',
    activityGraphSubtitle: 'Hourly scan volume and authorization velocity across IIM Sambalpur gates',
    outcomesTitle: 'Verification Outcomes',
    outcomesSubtitle: 'Ratio of granted, denied, and referred security checkpoints',
    gateActivityTitle: 'Campus Gate Activity',
    gateActivitySubtitle: 'Live status across active IIM Sambalpur checkpoints',
    recentStreamTitle: 'Recent Clearance Stream',
    recentStreamSubtitle: 'Real-time biometric entry logs and cryptographic audit signatures',
    viewAll: 'View All',
    auditLink: 'Audit',

    colIdentity: 'Identity',
    colIdNumber: 'ID Number',
    colGateGuard: 'Gate & Guard',
    colScore: 'Match Score',
    colTime: 'Time',
    colOutcome: 'Outcome',
    colAction: 'Action',

    badgeAuthorized: 'Authorised',
    badgeDenied: 'Denied',
    badgeReferred: 'Referred',
    badgeOperational: 'Operational',
    badgeOnline: 'Online',

    desktopGateTitle: 'Desktop & Laptop Access Only',
    desktopGateDesc: 'GATEWISE Command Centre is strictly engineered for enterprise security operations on desktop and laptop workstations (minimum 1024px viewport width).',
    desktopGateBypass: 'Continue to Command Centre (Preview)',
  },

  hi: {
    navOperations: 'ऑपरेशन्स',
    navIdentity: 'पहचान एवं रजिस्ट्री',
    navArchitecture: 'सिस्टम आर्किटेक्चर',
    overview: 'अवलोकन',
    liveOperations: 'लाइव ऑपरेशन्स',
    securityGuards: 'सुरक्षा गार्ड',
    verificationCentre: 'सत्यापन केंद्र',
    cryptographicAudit: 'क्रिप्टोग्राफ़िक ऑडिट',
    identityRegistry: 'पहचान रजिस्ट्री',
    photoLibrary: 'फ़ोटो लाइब्रेरी',
    registrations: 'पंजीकरण',
    visitorPasses: 'आगंतुक पास',
    campusVehicles: 'परिसर वाहन',
    reportsAnalytics: 'रिपोर्ट और विश्लेषण',
    accessControl: 'पहुंच नियंत्रण',
    gatesPerimeter: 'गेट एवं परिधि',
    notifications: 'सूचनाएं',
    edgeIntegrations: 'एज एकीकरण',
    settings: 'सेटिंग्स',
    sessionAnalytics: 'सत्र विश्लेषण',
    bulkImport: 'बल्क XLSX आयात',
    approvalQueue: 'अनुमोदन कतार',
    modelEnrollment: 'मॉडल नामांकन',
    systemStates: 'सिस्टम स्थितियाँ',
    helpSupport: 'सहायता एवं संपर्क',

    searchPlaceholder: 'पहचान, स्कैन, गेट या गार्ड बैज संख्या खोजें...',
    campusActiveBadge: 'आईआईएम संबलपुर सक्रिय',
    sfaceScore: 'एस-फेस 128-डी',
    profileRole: 'मुख्य सुरक्षा अधिकारी',
    profileDesk: 'आईआईएम संबलपुर डेस्क',
    systemPreferences: 'सेटिंग्स',
    publicPortal: 'सार्वजनिक पोर्टल खोलें',
    signOut: 'साइन आउट करें',
    consoleTitle: 'आईआईएम संबलपुर कंसोल',
    commandCentre: 'कमांड सेंटर',
    overviewDesk: 'अवलोकन डेस्क',

    overviewHeading: 'आईआईएम संबलपुर सुरक्षा अवलोकन',
    overviewSubheading: 'रीयल-टाइम गेट टेलीमेट्री, बायोमेट्रिक सत्यापन रिकॉर्ड और क्रिप्टोग्राफ़िक एक्सेस स्ट्रीम।',
    liveFeedActive: 'लाइव फ़ीड सक्रिय',
    exportAuditLogs: 'ऑडिट लॉग निर्यात करें',
    rangeToday: 'आज',
    range7Days: 'पिछले 7 दिन',
    range30Days: 'पिछले 30 दिन',
    rangeCustom: 'कस्टम',
    nominalCallout: 'सभी 4 परिधि गेट सामान्य बायोमेट्रिक सत्यापन सीमा पर सक्रिय रूप से कार्यरत हैं।',

    metricTotalScans: 'कुल गार्ड स्कैन',
    metricTotalScansDesc: 'सभी सक्रिय गेटों पर कुल बायोमेट्रिक प्रयास',
    metricCompletedVerifications: 'पूर्ण सत्यापन',
    metricCompletedVerificationsDesc: 'डिवाइस पर स्थानीय न्यूरल मॉडल द्वारा संसाधित',
    metricVerifiedIdentities: 'सत्यापित पहचान',
    metricVerifiedIdentitiesDesc: 'सफल 128-डी कोसाइन मिलान रिकॉर्ड',
    metricAuthorizedEntries: 'अधिकृत प्रवेश',
    metricAuthorizedEntriesDesc: 'संस्थागत परिसर में प्रवेश हेतु स्वीकृत',
    metricDeniedEntries: 'अस्वीकृत प्रवेश',
    metricDeniedEntriesDesc: 'अमान्य अथवा अनधिकृत क्रेडेंशियल',
    metricPendingReviews: 'लंबित समीक्षाएं',
    metricPendingReviewsDesc: 'वरिष्ठ सुरक्षा अधिकारी की स्वीकृति की प्रतीक्षा',
    metricActiveVisitors: 'सक्रिय आगंतुक',
    metricActiveVisitorsDesc: 'परिसर में उपस्थित अतिथि और ठेकेदार पास',
    metricActiveGuards: 'सक्रिय सुरक्षा गार्ड',
    metricActiveGuardsDesc: 'मोबाइल स्टेशन पर प्रमाणित कार्यरत सुरक्षाकर्मी',
    metricActiveGates: 'सक्रिय गेट',
    metricActiveGatesDesc: 'मुख्य, अकादमिक, छात्रावास एवं सर्विस चेकपॉइंट',

    activityGraphTitle: '24-घंटे का सत्यापन विवरण',
    activityGraphSubtitle: 'आईआईएम संबलपुर गेटों पर प्रति घंटा स्कैन वॉल्यूम एवं अनुमोदन गति',
    outcomesTitle: 'सत्यापन परिणाम',
    outcomesSubtitle: 'स्वीकृत, अस्वीकृत और संदर्भित सुरक्षा चौकियों का अनुपात',
    gateActivityTitle: 'परिसर गेट गतिविधि',
    gateActivitySubtitle: 'सक्रिय आईआईएम संबलपुर चेकपॉइंट्स की वास्तविक स्थिति',
    recentStreamTitle: 'हालिया क्लीयरेंस स्ट्रीम',
    recentStreamSubtitle: 'रीयल-टाइम बायोमेट्रिक प्रवेश लॉग और क्रिप्टोग्राफ़िक हस्ताक्षर',
    viewAll: 'सभी देखें',
    auditLink: 'ऑडिट',

    colIdentity: 'पहचान',
    colIdNumber: 'आईडी संख्या',
    colGateGuard: 'गेट एवं गार्ड',
    colScore: 'मैच स्कोर',
    colTime: 'समय',
    colOutcome: 'परिणाम',
    colAction: 'कार्रवाई',

    badgeAuthorized: 'अधिकृत',
    badgeDenied: 'अस्वीकृत',
    badgeReferred: 'संदर्भित',
    badgeOperational: 'सक्रिय',
    badgeOnline: 'ऑनलाइन',

    desktopGateTitle: 'केवल डेस्कटॉप एवं लैपटॉप पहुंच',
    desktopGateDesc: 'गेटवाइज़ कमांड सेंटर विशेष रूप से डेस्कटॉप और लैपटॉप वर्कस्टेशन (न्यूनतम 1024px चौड़ाई) के लिए निर्मित है।',
    desktopGateBypass: 'कमांड सेंटर पर जारी रखें (पूर्वावलोकन)',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('gatewise_language') as Language | null;
      if (stored === 'hi' || stored === 'en') {
        setLanguageState(stored);
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('gatewise_language', lang);
    }
  };

  const t = DICTIONARY[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      language: 'en' as Language,
      setLanguage: () => {},
      t: DICTIONARY.en,
    };
  }
  return context;
}
