import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { User, Zap, Flame, Target, BookOpen, Award } from 'lucide-react-native';
import { Theme } from '../src/theme';
import { useStore } from '../src/store/useStore';
import { LESSONS } from '../src/data/curriculum';

function StatCard({ icon, label, value, color }: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: color + '22' }]}>{icon}</View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function ProfileScreen() {
  const { username, xp, level, streak, completedLessons, masteredTopics, totalAnswers, correctAnswers } = useStore();

  const accuracy = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;
  const xpForNextLevel = level * 100;
  const xpProgress = xp % 100;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarWrap}>
            <User color={Theme.colors.primary} size={36} />
          </View>
          <Text style={styles.username}>{username}</Text>
          <View style={styles.levelPill}>
            <Zap color={Theme.colors.primary} size={14} />
            <Text style={styles.levelPillText}>Level {level}</Text>
          </View>
        </View>

        {/* XP Progress */}
        <View style={styles.xpCard}>
          <View style={styles.xpRow}>
            <Text style={styles.xpCurrent}>{xp} XP</Text>
            <Text style={styles.xpTarget}>/ {xpForNextLevel} XP</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${xpProgress}%` }]} />
          </View>
          <Text style={styles.xpHint}>{100 - xpProgress} XP to reach Level {level + 1}</Text>
        </View>

        {/* Stats grid */}
        <Text style={styles.sectionTitle}>Your Stats</Text>
        <View style={styles.statsGrid}>
          <StatCard
            icon={<Flame color={Theme.colors.tertiary} size={22} />}
            label="Day Streak"
            value={streak}
            color={Theme.colors.tertiary}
          />
          <StatCard
            icon={<Target color={Theme.colors.secondary} size={22} />}
            label="Accuracy"
            value={`${accuracy}%`}
            color={Theme.colors.secondary}
          />
          <StatCard
            icon={<BookOpen color={Theme.colors.primary} size={22} />}
            label="Lessons Done"
            value={completedLessons.length}
            color={Theme.colors.primary}
          />
          <StatCard
            icon={<Zap color="#f59e0b" size={22} />}
            label="Total XP"
            value={xp}
            color="#f59e0b"
          />
        </View>

        {/* Completed Lessons */}
        <Text style={styles.sectionTitle}>Completed Lessons</Text>
        {completedLessons.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No lessons completed yet. Start learning!</Text>
          </View>
        ) : (
          completedLessons.map((lessonId) => {
            const l = LESSONS.find(x => x.id === lessonId);
            return l ? (
              <View key={lessonId} style={styles.completedRow}>
                <View style={styles.completedDot} />
                <Text style={styles.completedText}>{l.title}</Text>
              </View>
            ) : null;
          })
        )}

        {/* Mastered Topics */}
        <Text style={styles.sectionTitle}>Mastered Topics</Text>
        {masteredTopics.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Score ≥ 70% on any quiz to master a topic.</Text>
          </View>
        ) : (
          <View style={styles.tagsWrap}>
            {masteredTopics.map((topic) => (
              <View key={topic} style={styles.tag}>
                <Award color={Theme.colors.secondary} size={14} />
                <Text style={styles.tagText}>{topic}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Theme.colors.background },
  container: { flex: 1 },
  contentContainer: {
    paddingHorizontal: Theme.spacing.md,
    paddingTop: Theme.spacing.lg,
    paddingBottom: 100,
  },
  profileHeader: {
    alignItems: 'center', marginBottom: Theme.spacing.xl,
  },
  avatarWrap: {
    width: 80, height: 80, borderRadius: Theme.radius.full,
    backgroundColor: Theme.colors.surface_container_high,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  username: {
    fontFamily: Theme.typography.fontFamily.headline,
    fontSize: 24, color: Theme.colors.on_surface, marginBottom: 8,
  },
  levelPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Theme.colors.surface_container,
    paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: Theme.radius.full,
  },
  levelPillText: {
    fontFamily: Theme.typography.fontFamily.label,
    fontSize: 14, color: Theme.colors.primary,
  },
  xpCard: {
    backgroundColor: Theme.colors.surface_container,
    borderRadius: Theme.radius.xl, padding: Theme.spacing.md,
    marginBottom: Theme.spacing.xl,
  },
  xpRow: {
    flexDirection: 'row', alignItems: 'baseline', gap: 4,
    marginBottom: Theme.spacing.sm,
  },
  xpCurrent: {
    fontFamily: Theme.typography.fontFamily.headline,
    fontSize: 22, color: Theme.colors.on_surface,
  },
  xpTarget: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: 14, color: Theme.colors.on_surface_variant,
  },
  progressTrack: {
    height: 8, backgroundColor: Theme.colors.surface_container_high,
    borderRadius: Theme.radius.full, overflow: 'hidden',
  },
  progressFill: {
    height: '100%', borderRadius: Theme.radius.full,
    backgroundColor: Theme.colors.primary,
  },
  xpHint: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: 12, color: Theme.colors.on_surface_variant, marginTop: 6,
  },
  sectionTitle: {
    fontFamily: Theme.typography.fontFamily.headlineMedium,
    fontSize: 17, color: Theme.colors.on_surface,
    marginBottom: Theme.spacing.md, marginTop: Theme.spacing.sm,
  },
  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    gap: Theme.spacing.sm, marginBottom: Theme.spacing.lg,
  },
  statCard: {
    flex: 1, minWidth: '45%',
    backgroundColor: Theme.colors.surface_container,
    borderRadius: Theme.radius.xl, padding: Theme.spacing.md,
    alignItems: 'center', gap: 6,
  },
  statIcon: {
    width: 44, height: 44, borderRadius: Theme.radius.full,
    justifyContent: 'center', alignItems: 'center',
  },
  statValue: {
    fontFamily: Theme.typography.fontFamily.headline,
    fontSize: 24, color: Theme.colors.on_surface,
  },
  statLabel: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: 12, color: Theme.colors.on_surface_variant, textAlign: 'center',
  },
  emptyBox: {
    backgroundColor: Theme.colors.surface_container,
    borderRadius: Theme.radius.lg, padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  emptyText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: 13, color: Theme.colors.on_surface_variant, textAlign: 'center',
  },
  completedRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Theme.colors.surface_container,
    borderRadius: Theme.radius.lg, padding: Theme.spacing.md,
    marginBottom: Theme.spacing.sm, gap: Theme.spacing.sm,
  },
  completedDot: {
    width: 8, height: 8, borderRadius: Theme.radius.full,
    backgroundColor: Theme.colors.secondary,
  },
  completedText: {
    fontFamily: Theme.typography.fontFamily.bodyMedium,
    fontSize: 14, color: Theme.colors.on_surface,
  },
  tagsWrap: {
    flexDirection: 'row', flexWrap: 'wrap', gap: Theme.spacing.sm,
  },
  tag: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Theme.colors.secondary_container,
    paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: Theme.radius.full,
  },
  tagText: {
    fontFamily: Theme.typography.fontFamily.label,
    fontSize: 13, color: Theme.colors.on_secondary_container,
  },
});
