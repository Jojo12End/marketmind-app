import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Brain, Lock, ChevronRight, CheckCircle } from 'lucide-react-native';
import { Theme } from '../src/theme';
import { useStore } from '../src/store/useStore';
import { LESSONS, QUIZZES } from '../src/data/curriculum';

export default function QuizScreen() {
  const router = useRouter();
  const { completedLessons } = useStore();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Knowledge Tests</Text>
          <Text style={styles.subtitle}>Prove your understanding</Text>
        </View>

        {LESSONS.map((lesson, index) => {
          const quiz = QUIZZES.find(q => q.lessonId === lesson.id);
          const isUnlocked = completedLessons.includes(lesson.id) || index === 0;
          const isDone = false; // could track per quiz

          return (
            <TouchableOpacity
              key={lesson.id}
              style={[styles.quizCard, !isUnlocked && styles.quizCardLocked]}
              onPress={() => isUnlocked && router.push(`/quiz-player/${lesson.id}`)}
              activeOpacity={isUnlocked ? 0.75 : 1}
            >
              <View style={[styles.iconWrap, isUnlocked ? styles.iconUnlocked : styles.iconLocked]}>
                {isUnlocked
                  ? <Brain color={Theme.colors.primary} size={22} />
                  : <Lock color={Theme.colors.on_surface_variant} size={22} />
                }
              </View>

              <View style={styles.quizInfo}>
                <Text style={[styles.quizTitle, !isUnlocked && styles.lockedText]}>
                  {lesson.title}
                </Text>
                <Text style={[styles.quizMeta, !isUnlocked && styles.lockedText]}>
                  {quiz?.questions.length ?? 0} questions · +10 XP per correct
                </Text>
                {!isUnlocked && (
                  <Text style={styles.lockHint}>Complete the lesson to unlock</Text>
                )}
              </View>

              {isUnlocked && (
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
  safeArea: { flex: 1, backgroundColor: Theme.colors.background },
  container: { flex: 1 },
  contentContainer: {
    paddingHorizontal: Theme.spacing.md,
    paddingTop: Theme.spacing.lg,
    paddingBottom: 100,
  },
  header: { marginBottom: Theme.spacing.xl },
  title: {
    fontFamily: Theme.typography.fontFamily.headline,
    fontSize: 26, color: Theme.colors.on_surface, letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: 14, color: Theme.colors.on_surface_variant, marginTop: 4,
  },
  quizCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Theme.colors.surface_container,
    borderRadius: Theme.radius.xl, padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md, gap: Theme.spacing.md,
  },
  quizCardLocked: { opacity: 0.5 },
  iconWrap: {
    width: 48, height: 48, borderRadius: Theme.radius.lg,
    justifyContent: 'center', alignItems: 'center',
  },
  iconUnlocked: { backgroundColor: Theme.colors.surface_container_high },
  iconLocked: { backgroundColor: Theme.colors.surface_container_high },
  quizInfo: { flex: 1 },
  quizTitle: {
    fontFamily: Theme.typography.fontFamily.headlineMedium,
    fontSize: 15, color: Theme.colors.on_surface, marginBottom: 4,
  },
  quizMeta: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: 12, color: Theme.colors.on_surface_variant,
  },
  lockHint: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: 11, color: Theme.colors.error_container, marginTop: 4,
  },
  lockedText: { color: Theme.colors.on_surface_variant },
});
