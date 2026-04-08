import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { BookOpen, Lock, ChevronRight, Zap, Flame } from 'lucide-react-native';
import { Theme } from '../src/theme';
import { useStore } from '../src/store/useStore';
import { LESSONS } from '../src/data/curriculum';

export default function LearnScreen() {
  const router = useRouter();
  const { xp, level, streak, completedLessons } = useStore();

  const isLessonUnlocked = (index: number) => {
    if (index === 0) return true;
    const prevLesson = LESSONS[index - 1];
    return completedLessons.includes(prevLesson.id);
  };

  const getLessonProgress = (lessonId: string) => {
    return completedLessons.includes(lessonId) ? 100 : 0;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>MarketMind</Text>
            <Text style={styles.subGreeting}>Master financial markets</Text>
          </View>
          <View style={styles.streakBadge}>
            <Flame color={Theme.colors.tertiary} size={18} />
            <Text style={styles.streakText}>{streak}</Text>
          </View>
        </View>

        {/* XP Bar */}
        <View style={styles.xpCard}>
          <View style={styles.xpRow}>
            <View style={styles.levelChip}>
              <Zap color={Theme.colors.primary} size={14} />
              <Text style={styles.levelText}>Level {level}</Text>
            </View>
            <Text style={styles.xpValue}>{xp} XP</Text>
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${(xp % 100)}%` },
              ]}
            />
          </View>
          <Text style={styles.xpNext}>{100 - (xp % 100)} XP to Level {level + 1}</Text>
        </View>

        {/* Lessons */}
        <Text style={styles.sectionTitle}>Curriculum</Text>
        {LESSONS.map((lesson, index) => {
          const unlocked = isLessonUnlocked(index);
          const progress = getLessonProgress(lesson.id);
          const completed = completedLessons.includes(lesson.id);

          return (
            <TouchableOpacity
              key={lesson.id}
              style={[
                styles.lessonCard,
                !unlocked && styles.lessonCardLocked,
              ]}
              onPress={() => {
                if (unlocked) router.push(`/lesson/${lesson.id}`);
              }}
              activeOpacity={unlocked ? 0.7 : 1}
            >
              <View style={[styles.lessonIconWrap, completed && styles.lessonIconCompleted]}>
                {unlocked ? (
                  <BookOpen color={completed ? Theme.colors.on_primary : Theme.colors.primary} size={22} />
                ) : (
                  <Lock color={Theme.colors.on_surface_variant} size={22} />
                )}
              </View>
              <View style={styles.lessonInfo}>
                <Text style={[styles.lessonTitle, !unlocked && styles.lockedText]}>
                  {lesson.title}
                </Text>
                <Text style={[styles.lessonDesc, !unlocked && styles.lockedText]} numberOfLines={1}>
                  {lesson.description}
                </Text>
                <View style={styles.lessonProgressTrack}>
                  <View style={[styles.lessonProgressFill, { width: `${progress}%` }]} />
                </View>
                <Text style={styles.lessonProgressText}>{progress}% complete</Text>
              </View>
              {unlocked && (
                <ChevronRight color={Theme.colors.on_surface_variant} size={20} />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: Theme.spacing.md,
    paddingTop: Theme.spacing.lg,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Theme.spacing.lg,
  },
  greeting: {
    fontFamily: Theme.typography.fontFamily.headline,
    fontSize: 26,
    color: Theme.colors.on_surface,
    letterSpacing: -0.5,
  },
  subGreeting: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: 14,
    color: Theme.colors.on_surface_variant,
    marginTop: 2,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surface_container,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Theme.radius.full,
    gap: 4,
  },
  streakText: {
    fontFamily: Theme.typography.fontFamily.label,
    fontSize: 14,
    color: Theme.colors.tertiary,
  },
  xpCard: {
    backgroundColor: Theme.colors.surface_container,
    borderRadius: Theme.radius.xl,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.xl,
  },
  xpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  levelChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  levelText: {
    fontFamily: Theme.typography.fontFamily.label,
    fontSize: 14,
    color: Theme.colors.primary,
  },
  xpValue: {
    fontFamily: Theme.typography.fontFamily.headline,
    fontSize: 18,
    color: Theme.colors.on_surface,
  },
  progressTrack: {
    height: 8,
    backgroundColor: Theme.colors.surface_container_high,
    borderRadius: Theme.radius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: Theme.radius.full,
    backgroundColor: Theme.colors.primary,
  },
  xpNext: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: 12,
    color: Theme.colors.on_surface_variant,
    marginTop: 6,
  },
  sectionTitle: {
    fontFamily: Theme.typography.fontFamily.headlineMedium,
    fontSize: 18,
    color: Theme.colors.on_surface,
    marginBottom: Theme.spacing.md,
  },
  lessonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surface_container,
    borderRadius: Theme.radius.xl,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    gap: Theme.spacing.md,
  },
  lessonCardLocked: {
    opacity: 0.5,
  },
  lessonIconWrap: {
    width: 48,
    height: 48,
    borderRadius: Theme.radius.lg,
    backgroundColor: Theme.colors.surface_container_high,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lessonIconCompleted: {
    backgroundColor: Theme.colors.primary_container,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontFamily: Theme.typography.fontFamily.headlineMedium,
    fontSize: 15,
    color: Theme.colors.on_surface,
    marginBottom: 4,
  },
  lessonDesc: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: 12,
    color: Theme.colors.on_surface_variant,
    marginBottom: 8,
  },
  lockedText: {
    color: Theme.colors.on_surface_variant,
  },
  lessonProgressTrack: {
    height: 4,
    backgroundColor: Theme.colors.surface_container_high,
    borderRadius: Theme.radius.full,
    overflow: 'hidden',
  },
  lessonProgressFill: {
    height: '100%',
    borderRadius: Theme.radius.full,
    backgroundColor: Theme.colors.secondary,
  },
  lessonProgressText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: 11,
    color: Theme.colors.on_surface_variant,
    marginTop: 4,
  },
});
