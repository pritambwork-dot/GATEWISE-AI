import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';
import { VerificationResult } from '../types';
import { StatusBadge } from './StatusBadge';
import { SurfaceCard } from './SurfaceCard';

interface VerificationResultCardProps {
  result: VerificationResult;
}

export function VerificationResultCard({ result }: VerificationResultCardProps) {
  const { outcome, candidate, authorization, imageQualityScore, qualityFeedback } = result;
  const isMatch = !!candidate;
  const similarityPercent = candidate ? (candidate.similarityScore * 100).toFixed(1) : null;

  const getScoreColor = (score: number) => {
    if (score >= 90) return Colors.success;
    if (score >= 70) return Colors.warning;
    return Colors.error;
  };

  return (
    <SurfaceCard variant="elevated" padding={Spacing.lg}>
      {/* Header with Outcome Badge */}
      <View style={styles.headerRow}>
        <StatusBadge status={outcome} size="large" />
        <View style={styles.qualityPill}>
          <Text style={styles.qualityText}>Quality {Math.round(imageQualityScore)}%</Text>
        </View>
      </View>

      {/* Side-by-Side Photo Comparison (if candidate or live capture present) */}
      <View style={styles.photoComparisonRow}>
        {/* Live Capture */}
        <View style={styles.photoContainer}>
          {result.capturedImageUri ? (
            <Image
              source={{ uri: result.capturedImageUri }}
              style={styles.subjectPhoto}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholderPhoto}>
              <Ionicons name="camera" size={32} color={Colors.textMuted} />
              <Text style={styles.photoPlaceholderText}>Live Capture</Text>
            </View>
          )}
          <View style={styles.photoTag}>
            <Text style={styles.photoTagText}>LIVE SCAN</Text>
          </View>
        </View>

        {/* Comparison Arrow / Match Indicator */}
        <View style={styles.comparisonCenter}>
          {candidate ? (
            <View style={styles.matchCircle}>
              <Text
                style={[
                  styles.matchScoreText,
                  { color: getScoreColor(candidate.similarityScore * 100) },
                ]}
              >
                {similarityPercent}%
              </Text>
              <Text style={styles.matchSubText}>MATCH</Text>
            </View>
          ) : (
            <View style={styles.noMatchCircle}>
              <Ionicons name="close" size={20} color={Colors.textMuted} />
            </View>
          )}
        </View>

        {/* Enrolled Reference Photo */}
        <View style={styles.photoContainer}>
          {candidate && candidate.referencePhotoUrl ? (
            <Image
              source={{ uri: candidate.referencePhotoUrl }}
              style={styles.subjectPhoto}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholderPhoto}>
              <Ionicons name="person" size={32} color={Colors.textMuted} />
              <Text style={styles.photoPlaceholderText}>No Profile</Text>
            </View>
          )}
          <View style={styles.photoTag}>
            <Text style={styles.photoTagText}>ENROLLED</Text>
          </View>
        </View>
      </View>

      {/* Candidate Details */}
      {candidate ? (
        <View style={styles.candidateDetails}>
          <Text style={styles.personName}>{candidate.personName}</Text>
          <View style={styles.metaRow}>
            <View style={styles.idBadge}>
              <Text style={styles.idText}>{candidate.personId}</Text>
            </View>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{candidate.category}</Text>
            </View>
          </View>
          <Text style={styles.departmentText}>{candidate.department}</Text>
        </View>
      ) : (
        <View style={styles.unknownDetails}>
          <Text style={styles.unknownTitle}>
            {outcome === 'IMAGE_QUALITY_INSUFFICIENT'
              ? 'Quality Analysis Failed'
              : 'Unregistered Subject'}
          </Text>
          <Text style={styles.unknownDescription}>
            {outcome === 'IMAGE_QUALITY_INSUFFICIENT'
              ? 'Motion blur or low light prevented facial feature extraction.'
              : 'Subject does not match any active student, faculty, or staff records in the database.'}
          </Text>
        </View>
      )}

      {/* Quality Feedback / Diagnostics */}
      {qualityFeedback && qualityFeedback.length > 0 && (
        <View style={styles.feedbackContainer}>
          {qualityFeedback.map((fb, idx) => (
            <View key={idx} style={styles.feedbackRow}>
              <Ionicons name="information-circle-outline" size={14} color={Colors.textSecondary} />
              <Text style={styles.feedbackText}>{fb}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Authorization Clearance Section */}
      {authorization && (
        <View
          style={[
            styles.authSection,
            authorization.isAuthorized ? styles.authGranted : styles.authDenied,
          ]}
        >
          <View style={styles.authHeader}>
            <Ionicons
              name={authorization.isAuthorized ? 'shield-checkmark' : 'alert-circle'}
              size={18}
              color={authorization.isAuthorized ? Colors.success : Colors.error}
            />
            <Text
              style={[
                styles.authTitle,
                { color: authorization.isAuthorized ? Colors.success : Colors.error },
              ]}
            >
              {authorization.isAuthorized ? 'Institutional Clearance Active' : 'Access Restricted'}
            </Text>
          </View>

          <Text style={styles.authLevelText}>
            Clearance Level: <Text style={styles.bold}>{authorization.clearanceLevel}</Text>
          </Text>

          {authorization.validUntil && (
            <Text style={styles.authValidityText}>
              Valid until: {new Date(authorization.validUntil).toLocaleDateString()}
            </Text>
          )}

          {authorization.restrictionReason && (
            <View style={styles.restrictionBox}>
              <Text style={styles.restrictionText}>{authorization.restrictionReason}</Text>
            </View>
          )}
        </View>
      )}
    </SurfaceCard>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.base,
  },
  qualityPill: {
    backgroundColor: Colors.surfaceSecondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  qualityText: {
    ...Typography.badge,
    color: Colors.textSecondary,
    fontSize: 10,
  },
  photoComparisonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.base,
  },
  photoContainer: {
    width: '42%',
    aspectRatio: 0.85,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    backgroundColor: Colors.surfaceSecondary,
    borderWidth: 1.5,
    borderColor: Colors.borderSubtle,
    position: 'relative',
  },
  subjectPhoto: {
    width: '100%',
    height: '100%',
  },
  placeholderPhoto: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceSecondary,
  },
  photoPlaceholderText: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 4,
  },
  photoTag: {
    position: 'absolute',
    bottom: 6,
    alignSelf: 'center',
    backgroundColor: 'rgba(23, 99, 70, 0.85)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  photoTagText: {
    ...Typography.badge,
    fontSize: 9,
    color: '#FFFFFF',
  },
  comparisonCenter: {
    width: '16%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.borderMedium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchScoreText: {
    fontSize: 11,
    fontWeight: '800',
  },
  matchSubText: {
    fontSize: 8,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  noMatchCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  candidateDetails: {
    marginTop: Spacing.xs,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  personName: {
    ...Typography.titleMedium,
    fontSize: 20,
    color: Colors.textPrimary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  idBadge: {
    backgroundColor: Colors.surfaceSecondary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  idText: {
    ...Typography.monoBold,
    fontSize: 12,
  },
  categoryBadge: {
    backgroundColor: Colors.lightGreen,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  categoryText: {
    ...Typography.captionBold,
    color: Colors.deep,
    fontSize: 11,
  },
  departmentText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 4,
    fontSize: 13,
  },
  unknownDetails: {
    paddingVertical: Spacing.sm,
  },
  unknownTitle: {
    ...Typography.titleSmall,
    color: Colors.textPrimary,
  },
  unknownDescription: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  feedbackContainer: {
    backgroundColor: Colors.surfaceSecondary,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.sm,
  },
  feedbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  feedbackText: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textSecondary,
    marginLeft: 6,
  },
  authSection: {
    marginTop: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  authGranted: {
    backgroundColor: '#F3FAF5',
    borderColor: '#BFE4D1',
  },
  authDenied: {
    backgroundColor: '#FDF2F2',
    borderColor: '#F8CECE',
  },
  authHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  authTitle: {
    ...Typography.captionBold,
    fontSize: 13,
    marginLeft: 6,
  },
  authLevelText: {
    ...Typography.caption,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  authValidityText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  bold: {
    fontWeight: '700',
  },
  restrictionBox: {
    marginTop: 6,
    padding: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: '#F8CECE',
  },
  restrictionText: {
    ...Typography.caption,
    color: Colors.error,
    fontWeight: '600',
    fontSize: 11,
  },
});
