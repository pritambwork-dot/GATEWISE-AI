import React, { createContext, useContext, useState } from 'react';
import {
  VerificationResult,
  GuardDecisionActionType,
} from '../types';
import { VerificationService } from '../services/verification.service';

interface VerificationContextType {
  capturedUri: string | null;
  capturedBase64: string | null;
  ambientLightScore: number;
  mockState: string | null;
  verificationResult: VerificationResult | null;
  isProcessing: boolean;
  processingStep: number;
  processingError: string | null;
  selectedDecision: GuardDecisionActionType | null;
  decisionSignature: string | null;
  setCapturedImage: (uri: string, base64: string) => void;
  setMockState: (state: string | null) => void;
  setAmbientLightScore: (score: number) => void;
  runVerification: (gateId: string) => Promise<VerificationResult>;
  submitGuardDecision: (
    action: GuardDecisionActionType,
    notes?: string,
    overrideReason?: string
  ) => Promise<{ cryptographicSignature: string }>;
  resetVerification: () => void;
}

const VerificationContext = createContext<VerificationContextType | undefined>(undefined);

export function VerificationProvider({ children }: { children: React.ReactNode }) {
  const [capturedUri, setCapturedUri] = useState<string | null>(null);
  const [capturedBase64, setCapturedBase64] = useState<string | null>(null);
  const [ambientLightScore, setAmbientLightScore] = useState<number>(88);
  const [mockState, setMockState] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStep, setProcessingStep] = useState<number>(0);
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [selectedDecision, setSelectedDecision] = useState<GuardDecisionActionType | null>(null);
  const [decisionSignature, setDecisionSignature] = useState<string | null>(null);

  const setCapturedImage = (uri: string, base64: string) => {
    setCapturedUri(uri);
    setCapturedBase64(base64);
  };

  const runVerification = async (gateId: string): Promise<VerificationResult> => {
    setIsProcessing(true);
    setProcessingError(null);
    setProcessingStep(1);

    try {
      // Step 1: Image Quality Analysis
      await new Promise((r) => setTimeout(r, 200));
      setProcessingStep(2);

      // Step 2: Face Detection & Geometry
      await new Promise((r) => setTimeout(r, 200));
      setProcessingStep(3);

      // Step 3: Anti-Spoofing & Liveness
      await new Promise((r) => setTimeout(r, 200));
      setProcessingStep(4);

      // Step 4: Feature Embedding Extraction
      await new Promise((r) => setTimeout(r, 200));
      setProcessingStep(5);

      // Step 5: Vector DB Similarity Lookup
      await new Promise((r) => setTimeout(r, 250));
      setProcessingStep(6);

      // Step 6: Access Clearance & Gate Schedule
      await new Promise((r) => setTimeout(r, 200));
      setProcessingStep(7);

      const result = await VerificationService.verifyFace({
        gateId,
        imageBase64: capturedBase64 || '',
        ambientLightScore,
        mockState: mockState || undefined,
      });

      result.capturedImageUri = capturedUri || undefined;
      setVerificationResult(result);
      return result;
    } catch (err: any) {
      setProcessingError(err.message || 'Verification pipeline encountered an error.');
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  const submitGuardDecision = async (
    action: GuardDecisionActionType,
    notes?: string,
    overrideReason?: string
  ) => {
    if (!verificationResult) {
      throw new Error('No active verification event to record decision for.');
    }

    const res = await VerificationService.submitDecision({
      eventId: verificationResult.eventId,
      action,
      notes,
      overrideReason,
    });

    setSelectedDecision(action);
    setDecisionSignature(res.cryptographicSignature);
    return res;
  };

  const resetVerification = () => {
    setCapturedUri(null);
    setCapturedBase64(null);
    setVerificationResult(null);
    setIsProcessing(false);
    setProcessingStep(0);
    setProcessingError(null);
    setSelectedDecision(null);
    setDecisionSignature(null);
    // Keep mockState intact if user selected it for demonstration
  };

  return (
    <VerificationContext.Provider
      value={{
        capturedUri,
        capturedBase64,
        ambientLightScore,
        mockState,
        verificationResult,
        isProcessing,
        processingStep,
        processingError,
        selectedDecision,
        decisionSignature,
        setCapturedImage,
        setMockState,
        setAmbientLightScore,
        runVerification,
        submitGuardDecision,
        resetVerification,
      }}
    >
      {children}
    </VerificationContext.Provider>
  );
}

export function useVerification() {
  const context = useContext(VerificationContext);
  if (!context) {
    throw new Error('useVerification must be used within a VerificationProvider');
  }
  return context;
}
