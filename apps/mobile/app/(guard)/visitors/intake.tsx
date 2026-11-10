import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../../src/theme';
import { VisitorService } from '../../../src/services/visitor.service';
import { useAuth } from '../../../src/providers/AuthProvider';
import { InputField, PrimaryButton, SecondaryButton, SurfaceCard } from '../../../src/components';

const ID_TYPES = ['Aadhaar Card', 'Driving License', 'PAN Card', 'Passport'];

export default function VisitorIntakeScreen() {
  const router = useRouter();
  const { assignedGate } = useAuth();

  const [visitorName, setVisitorName] = useState('');
  const [phone, setPhone] = useState('');
  const [idType, setIdType] = useState('Aadhaar Card');
  const [idNumber, setIdNumber] = useState('');
  const [hostName, setHostName] = useState('');
  const [hostDepartment, setHostDepartment] = useState('Administration');
  const [purpose, setPurpose] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!visitorName.trim() || !phone.trim() || !idNumber.trim() || !hostName.trim()) {
      Alert.alert('Required Fields', 'Please complete visitor name, phone, ID number, and host name.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newPass = await VisitorService.registerIntake({
        visitorName: visitorName.trim(),
        phone: phone.trim(),
        idType,
        idNumber: idNumber.trim(),
        hostName: hostName.trim(),
        hostDepartment: hostDepartment.trim(),
        purpose: purpose.trim() || 'General Institutional Visit',
        gateId: assignedGate?.id || 'gate-post-02',
      });

      Alert.alert(
        'Visitor Registered',
        `Pass ${newPass.passCode} issued for ${newPass.visitorName}. Visitor is now Checked In.`,
        [
          {
            text: 'View Pass',
            onPress: () => router.replace(`/(guard)/visitors/${newPass.id}`),
          },
        ]
      );
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to register visitor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardContainer}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <SurfaceCard variant="elevated" padding={Spacing.lg}>
          <View style={styles.formHeader}>
            <View style={styles.iconCircle}>
              <Ionicons name="person-add" size={24} color={Colors.primary} />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.title}>Walk-In Visitor Registration</Text>
              <Text style={styles.subtitle}>
                Issue instant digital pass at Main Campus Gate · Post 02
              </Text>
            </View>
          </View>

          {/* Visitor Personal Details */}
          <InputField
            label="Visitor Full Name"
            placeholder="e.g. Vikramaditya Das"
            value={visitorName}
            onChangeText={setVisitorName}
            leftIcon={<Ionicons name="person-outline" size={18} color={Colors.textSecondary} />}
          />

          <InputField
            label="Mobile Phone Number"
            placeholder="+91 98765 43210"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            leftIcon={<Ionicons name="call-outline" size={18} color={Colors.textSecondary} />}
          />

          {/* ID Type Selector */}
          <Text style={styles.fieldLabel}>Government ID Document Type</Text>
          <View style={styles.idTypesRow}>
            {ID_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.idTypePill,
                  idType === type && styles.idTypePillActive,
                ]}
                onPress={() => setIdType(type)}
              >
                <Text
                  style={[
                    styles.idTypeText,
                    idType === type && styles.idTypeTextActive,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <InputField
            label="Document ID Number"
            placeholder="e.g. •••• •••• 9812 or DL-12345"
            value={idNumber}
            onChangeText={setIdNumber}
            leftIcon={<Ionicons name="card-outline" size={18} color={Colors.textSecondary} />}
          />

          {/* Host Information */}
          <InputField
            label="Institutional Host Officer / Faculty"
            placeholder="e.g. Dr. Rajesh Rao"
            value={hostName}
            onChangeText={setHostName}
            leftIcon={<Ionicons name="business-outline" size={18} color={Colors.textSecondary} />}
          />

          <InputField
            label="Host Department"
            placeholder="e.g. Finance & Accounting"
            value={hostDepartment}
            onChangeText={setHostDepartment}
          />

          <InputField
            label="Purpose of Visit"
            placeholder="e.g. Academic Research Meeting"
            value={purpose}
            onChangeText={setPurpose}
          />

          <PrimaryButton
            title="Register & Check In Visitor"
            onPress={handleSubmit}
            loading={isSubmitting}
            icon={<Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />}
            style={styles.submitBtn}
          />

          <SecondaryButton
            title="Cancel"
            onPress={() => router.back()}
            variant="ghost"
          />
        </SurfaceCard>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    padding: Spacing.base,
    paddingBottom: Spacing['3xl'],
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.base,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.lightGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  headerText: {
    flex: 1,
  },
  title: {
    ...Typography.titleSmall,
    color: Colors.textPrimary,
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  fieldLabel: {
    ...Typography.captionBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  idTypesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Spacing.base,
  },
  idTypePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    marginRight: 6,
    marginBottom: 6,
  },
  idTypePillActive: {
    backgroundColor: Colors.lightGreen,
    borderColor: Colors.mint,
  },
  idTypeText: {
    ...Typography.captionBold,
    fontSize: 11,
    color: Colors.textSecondary,
  },
  idTypeTextActive: {
    color: Colors.deep,
  },
  submitBtn: {
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
});
