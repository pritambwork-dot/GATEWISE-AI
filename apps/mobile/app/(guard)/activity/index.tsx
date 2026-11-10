import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../../src/theme';
import { ActivityService } from '../../../src/services/activity.service';
import { VerificationEventRecord } from '../../../src/types';
import {
  StationTelemetryBar,
  InputField,
  StatusBadge,
  SurfaceCard,
  EmptyState,
} from '../../../src/components';

export default function ActivityFeedScreen() {
  const router = useRouter();
  const [events, setEvents] = useState<VerificationEventRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');
  const [refreshing, setRefreshing] = useState(false);

  const loadActivity = async () => {
    try {
      const data = await ActivityService.getRecentActivity('gate-post-02', 50);
      setEvents(data);
    } catch {}
  };

  useEffect(() => {
    loadActivity();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadActivity();
    setRefreshing(false);
  };

  const filteredEvents = events.filter((evt) => {
    // Search query filter
    const matchesSearch =
      (evt.personName && evt.personName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (evt.personId && evt.personId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      evt.outcome.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Category filter
    if (selectedFilter === 'AUTHORIZED') {
      return evt.decision === 'GRANT_ENTRY' || evt.outcome === 'VERIFIED_AUTHORIZED';
    }
    if (selectedFilter === 'DENIED') {
      return (
        evt.decision === 'DENY_ENTRY' ||
        evt.outcome === 'AUTHORIZATION_EXPIRED' ||
        evt.outcome === 'IDENTIFIED_UNAUTHORIZED'
      );
    }
    if (selectedFilter === 'REVIEW') {
      return (
        evt.outcome === 'POTENTIAL_MATCH' ||
        evt.decision === 'ESCALATE_TO_ADMIN' ||
        evt.decision === 'REFER_TO_VISITOR_DESK'
      );
    }

    return true;
  });

  const renderItem = ({ item }: { item: VerificationEventRecord }) => {
    const formattedTime = new Date(item.timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <SurfaceCard
        variant="elevated"
        padding={Spacing.base}
        onPress={() => router.push(`/(guard)/activity/${item.id}`)}
      >
        <View style={styles.eventHeader}>
          <View style={styles.personHeaderRow}>
            <View style={styles.personAvatar}>
              <Ionicons name="person" size={18} color={Colors.deep} />
            </View>
            <View style={styles.personTextColumn}>
              <Text style={styles.personName}>{item.personName || 'Unregistered Individual'}</Text>
              <Text style={styles.personId}>
                {item.personId ? `${item.personId} · ` : ''}
                {item.personCategory || 'Unknown'}
              </Text>
            </View>
          </View>
          <Text style={styles.timeText}>{formattedTime}</Text>
        </View>

        <View style={styles.badgesRow}>
          <StatusBadge status={item.outcome} size="small" />
          {item.decision && (
            <StatusBadge
              status={item.decision}
              size="small"
              style={styles.decisionBadge}
            />
          )}
          {item.similarityScore && (
            <View style={styles.scorePill}>
              <Text style={styles.scoreText}>
                {Math.round(item.similarityScore * 100)}% match
              </Text>
            </View>
          )}
        </View>

        {item.decisionReason && (
          <Text style={styles.reasonText} numberOfLines={1}>
            Note: {item.decisionReason}
          </Text>
        )}

        <View style={styles.footerRow}>
          <Text style={styles.officerText}>Officer: {item.guardName}</Text>
          <View style={styles.syncRow}>
            <Ionicons name="cloud-done-outline" size={13} color={Colors.primary} />
            <Text style={styles.syncText}>Signed & Logged</Text>
          </View>
        </View>
      </SurfaceCard>
    );
  };

  return (
    <View style={styles.container}>
      <StationTelemetryBar />

      <View style={styles.searchFilterContainer}>
        <InputField
          placeholder="Search by name, ID or status..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery('')}
          leftIcon={<Ionicons name="search" size={18} color={Colors.textSecondary} />}
          containerStyle={styles.searchField}
        />

        {/* Filter Pills */}
        <View style={styles.filtersRow}>
          {[
            { id: 'ALL', label: 'All Events' },
            { id: 'AUTHORIZED', label: 'Authorized' },
            { id: 'DENIED', label: 'Denied' },
            { id: 'REVIEW', label: 'Reviews / Referrals' },
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
        data={filteredEvents}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
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
            title="No Gate Events Found"
            description="No verification events match your search or filter parameters."
            icon="calendar-outline"
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
  searchFilterContainer: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  searchField: {
    marginBottom: Spacing.xs,
  },
  filtersRow: {
    flexDirection: 'row',
    paddingVertical: Spacing.sm,
  },
  filterPill: {
    paddingHorizontal: 12,
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
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  personHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  personAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  personTextColumn: {
    flex: 1,
  },
  personName: {
    ...Typography.captionBold,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  personId: {
    ...Typography.caption,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  timeText: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textMuted,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginVertical: 6,
  },
  decisionBadge: {
    marginLeft: 6,
  },
  scorePill: {
    backgroundColor: Colors.surfaceSecondary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    marginLeft: 6,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  scoreText: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  reasonText: {
    ...Typography.caption,
    fontSize: 12,
    color: Colors.textSecondary,
    marginVertical: 4,
    fontStyle: 'italic',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
  },
  officerText: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textSecondary,
  },
  syncRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  syncText: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.primary,
    marginLeft: 4,
    fontWeight: '600',
  },
});
