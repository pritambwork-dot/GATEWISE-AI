import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../../src/theme';
import { VisitorService } from '../../../src/services/visitor.service';
import { VisitorPass } from '../../../src/types';
import {
  StationTelemetryBar,
  InputField,
  StatusBadge,
  SurfaceCard,
  PrimaryButton,
  EmptyState,
} from '../../../src/components';

export default function VisitorManagementScreen() {
  const router = useRouter();
  const [visitors, setVisitors] = useState<VisitorPass[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('EXPECTED');
  const [refreshing, setRefreshing] = useState(false);

  const loadVisitors = async () => {
    try {
      const data = await VisitorService.getVisitors();
      setVisitors(data);
    } catch {}
  };

  useEffect(() => {
    loadVisitors();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadVisitors();
    setRefreshing(false);
  };

  const handleQuickCheckIn = async (passCode: string) => {
    try {
      await VisitorService.checkInVisitor(passCode);
      Alert.alert('Checked In', `Pass ${passCode} marked as Checked In.`);
      loadVisitors();
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  const handleQuickCheckOut = async (passCode: string) => {
    try {
      await VisitorService.checkOutVisitor(passCode);
      Alert.alert('Checked Out', `Pass ${passCode} marked as Checked Out.`);
      loadVisitors();
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  const filteredVisitors = visitors.filter((v) => {
    const matchesSearch =
      v.visitorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.passCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.hostName.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedFilter === 'EXPECTED') {
      return v.status === 'EXPECTED';
    }
    if (selectedFilter === 'CHECKED_IN') {
      return v.status === 'CHECKED_IN';
    }
    return true;
  });

  const expectedCount = visitors.filter((v) => v.status === 'EXPECTED').length;
  const checkedInCount = visitors.filter((v) => v.status === 'CHECKED_IN').length;
  const checkedOutCount = visitors.filter((v) => v.status === 'CHECKED_OUT').length;

  const renderVisitorItem = ({ item }: { item: VisitorPass }) => {
    return (
      <SurfaceCard
        variant="elevated"
        padding={Spacing.base}
        onPress={() => router.push(`/(guard)/visitors/${item.id}`)}
      >
        <View style={styles.cardHeader}>
          <View style={styles.passCodePill}>
            <Ionicons name="qr-code-outline" size={14} color={Colors.deep} />
            <Text style={styles.passCodeText}>{item.passCode}</Text>
          </View>
          <StatusBadge status={item.status} size="small" />
        </View>

        <Text style={styles.visitorName}>{item.visitorName}</Text>
        <Text style={styles.hostInfo}>
          Host: <Text style={styles.bold}>{item.hostName}</Text> ({item.hostDepartment})
        </Text>
        <Text style={styles.purposeText} numberOfLines={1}>
          Purpose: {item.purpose}
        </Text>

        <View style={styles.cardFooter}>
          <View style={styles.timeRow}>
            <Ionicons name="time-outline" size={13} color={Colors.textSecondary} />
            <Text style={styles.validTimeText}>Valid until {item.validUntilTime}</Text>
          </View>

          {/* Quick Action Button */}
          {item.status === 'EXPECTED' && (
            <TouchableOpacity
              onPress={() => handleQuickCheckIn(item.passCode)}
              style={styles.quickCheckInBtn}
              activeOpacity={0.75}
            >
              <Ionicons name="log-in-outline" size={14} color="#FFFFFF" />
              <Text style={styles.quickBtnText}>Check In</Text>
            </TouchableOpacity>
          )}

          {item.status === 'CHECKED_IN' && (
            <TouchableOpacity
              onPress={() => handleQuickCheckOut(item.passCode)}
              style={styles.quickCheckOutBtn}
              activeOpacity={0.75}
            >
              <Ionicons name="log-out-outline" size={14} color={Colors.deep} />
              <Text style={styles.quickCheckOutText}>Check Out</Text>
            </TouchableOpacity>
          )}
        </View>
      </SurfaceCard>
    );
  };

  return (
    <View style={styles.container}>
      <StationTelemetryBar />

      <View style={styles.topControlContainer}>
        {/* Pass Search Field */}
        <InputField
          placeholder="Search pass code or visitor name..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery('')}
          leftIcon={<Ionicons name="search" size={18} color={Colors.textSecondary} />}
          containerStyle={styles.searchField}
        />

        {/* Counters & New Intake CTA */}
        <View style={styles.countersRow}>
          <View style={styles.counterBox}>
            <Text style={styles.counterNum}>{expectedCount}</Text>
            <Text style={styles.counterLbl}>Expected</Text>
          </View>
          <View style={styles.counterBox}>
            <Text style={[styles.counterNum, { color: Colors.primary }]}>{checkedInCount}</Text>
            <Text style={styles.counterLbl}>Inside</Text>
          </View>
          <View style={styles.counterBox}>
            <Text style={styles.counterNum}>{checkedOutCount}</Text>
            <Text style={styles.counterLbl}>Exited</Text>
          </View>

          <TouchableOpacity
            style={styles.newIntakeButton}
            onPress={() => router.push('/(guard)/visitors/intake')}
            activeOpacity={0.8}
          >
            <Ionicons name="person-add-outline" size={16} color="#FFFFFF" />
            <Text style={styles.newIntakeText}>Walk-In</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Pills */}
        <View style={styles.filtersRow}>
          {[
            { id: 'EXPECTED', label: 'Expected Today' },
            { id: 'CHECKED_IN', label: 'Currently On Campus' },
            { id: 'ALL', label: 'All Passes' },
          ].map((f) => (
            <TouchableOpacity
              key={f.id}
              style={[
                styles.filterPill,
                selectedFilter === f.id && styles.filterPillActive,
              ]}
              onPress={() => setSelectedFilter(f.id)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === f.id && styles.filterTextActive,
                ]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={filteredVisitors}
        keyExtractor={(item) => item.id}
        renderItem={renderVisitorItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
          />
        }
        ListEmptyComponent={
          <EmptyState
            title="No Visitor Passes"
            description="No visitor passes found for this filter. Use Walk-In button to register a new visitor."
            icon="people-outline"
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topControlContainer: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  searchField: {
    marginBottom: Spacing.xs,
  },
  countersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
  },
  counterBox: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  counterNum: {
    ...Typography.titleMedium,
    fontSize: 18,
    color: Colors.textPrimary,
  },
  counterLbl: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.textSecondary,
  },
  newIntakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.lg,
  },
  newIntakeText: {
    ...Typography.captionBold,
    color: '#FFFFFF',
    fontSize: 12,
    marginLeft: 4,
  },
  filtersRow: {
    flexDirection: 'row',
    paddingVertical: Spacing.sm,
  },
  filterPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceSecondary,
    marginRight: 6,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  filterPillActive: {
    backgroundColor: Colors.lightGreen,
    borderColor: Colors.mint,
  },
  filterText: {
    ...Typography.captionBold,
    fontSize: 11,
    color: Colors.textSecondary,
  },
  filterTextActive: {
    color: Colors.deep,
  },
  listContent: {
    padding: Spacing.base,
    paddingBottom: Spacing['3xl'],
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  passCodePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSecondary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  passCodeText: {
    ...Typography.monoBold,
    fontSize: 12,
    color: Colors.deep,
    marginLeft: 4,
  },
  visitorName: {
    ...Typography.titleSmall,
    fontSize: 17,
    color: Colors.textPrimary,
  },
  hostInfo: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
    fontSize: 12,
  },
  bold: {
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  purposeText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
    fontSize: 12,
    fontStyle: 'italic',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  validTimeText: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  quickCheckInBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
  },
  quickBtnText: {
    ...Typography.captionBold,
    color: '#FFFFFF',
    fontSize: 11,
    marginLeft: 4,
  },
  quickCheckOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSecondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  quickCheckOutText: {
    ...Typography.captionBold,
    color: Colors.deep,
    fontSize: 11,
    marginLeft: 4,
  },
});
