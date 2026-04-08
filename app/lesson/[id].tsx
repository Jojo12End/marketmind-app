import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, ArrowRight, ChevronLeft, CheckCircle } from 'lucide-react-native';
import { Theme } from '../../src/theme';
import { LESSONS } from '../../src/data/curriculum';

export default function LessonPlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const lesson = LESSONS.find(l => l.id === id);
  const [cardIndex, setCardIndex] = useState(0);

  if (!lesson) {
    return (
      <View style={{ flex: 1, backgroundColor: Theme.colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: Theme.colors.on_surface }}>Lesson not found</Text>
      </View>
    );
  }

  const currentCard = lesson.cards[cardIndex];
  const isLast = cardIndex === lesson.cards.length - 1;
  const progress = ((cardIndex + 1) / lesson.cards.length) * 100;

  const goNext = () => {
    if (isLast) {
      router.push(`/quiz-player/${lesson.id}`);
    } else {
      setCardIndex(cardIndex + 1);
    }
  };

  const goPrev = () => {
    if (cardIndex > 0) setCardIndex(cardIndex - 1);
    else router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={goPrev} style={styles.backBtn}>
          <ChevronLeft color={Theme.colors.on_surface} size={24} />
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        </View>
        <Text style={styles.cardCounter}>{cardIndex + 1}/{lesson.cards.length}</Text>
      </View>

      {/* Lesson title */}
      <Text style={styles.lessonTitle}>{lesson.title}</Text>

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{currentCard.title}</Text>
          <Text style={styles.cardContent}>{currentCard.content}</Text>

          {currentCard.formula && (
            <View style={styles.formulaBox}>
              <Text style={styles.formulaLabel}>FORMULA</Text>
              <Text style={styles.formulaText}>{currentCard.formula}</Text>
            </View>
          )}

          {currentCard.example && (
            <View style={styles.exampleBox}>
              <Text style={styles.exampleLabel}>💡 EXAMPLE</Text>
              <Text style={styles.exampleText}>{currentCard.example}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom actions */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.navBtn} onPress={goPrev}>
          <ArrowLeft color={Theme.colors.on_surface_variant} size={20} />
          <Text style={styles.navBtnText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.nextBtn, isLast && styles.finishBtn]}
          onPress={goNext}
        >
          {isLast ? (
            <>
              <CheckCircle color={Theme.colors.on_primary} size={20} />
              <Text style={styles.nextBtnText}>Start Quiz</Text>
            </>
          ) : (
            <>
              <Text style={styles.nextBtnText}>Next</Text>
              <ArrowRight color={Theme.colors.on_primary} size={20} />
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Theme.colors.background },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.md,
    paddingTop: Theme.spacing.sm,
    paddingBottom: Theme.spacing.sm,
    gap: Theme.spacing.sm,
  },
  backBtn: {
    width: 40, height: 40,
    borderRadius: Theme.radius.full,
    backgroundColor: Theme.colors.surface_container,
    justifyContent: 'center', alignItems: 'center',
  },
  progressContainer: { flex: 1 },
  progressTrack: {
    height: 6,
    backgroundColor: Theme.colors.surface_container,
    borderRadius: Theme.radius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: Theme.radius.full,
    backgroundColor: Theme.colors.primary,
  },
  cardCounter: {
    fontFamily: Theme.typography.fontFamily.label,
    fontSize: 13,
    color: Theme.colors.on_surface_variant,
    minWidth: 30,
    textAlign: 'right',
  },
  lessonTitle: {
    fontFamily: Theme.typography.fontFamily.headlineMedium,
    fontSize: 14,
    color: Theme.colors.on_surface_variant,
    paddingHorizontal: Theme.spacing.md,
    paddingBottom: Theme.spacing.sm,
  },
  scrollArea: { flex: 1 },
  scrollContent: {
    paddingHorizontal: Theme.spacing.md,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: Theme.colors.surface_container,
    borderRadius: Theme.radius.xl,
    padding: Theme.spacing.lg,
  },
  cardTitle: {
    fontFamily: Theme.typography.fontFamily.headline,
    fontSize: 22,
    color: Theme.colors.on_surface,
    marginBottom: Theme.spacing.md,
  },
  cardContent: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: 16,
    color: Theme.colors.on_surface,
    lineHeight: 26,
    marginBottom: Theme.spacing.md,
  },
  formulaBox: {
    backgroundColor: Theme.colors.surface_container_high,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.md,
    marginTop: Theme.spacing.sm,
    marginBottom: Theme.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Theme.colors.primary,
  },
  formulaLabel: {
    fontFamily: Theme.typography.fontFamily.label,
    fontSize: 11,
    color: Theme.colors.primary,
    letterSpacing: 1,
    marginBottom: 6,
  },
  formulaText: {
    fontFamily: Theme.typography.fontFamily.bodyBold,
    fontSize: 15,
    color: Theme.colors.on_surface,
  },
  exampleBox: {
    backgroundColor: Theme.colors.secondary_container,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.md,
    marginTop: Theme.spacing.sm,
  },
  exampleLabel: {
    fontFamily: Theme.typography.fontFamily.label,
    fontSize: 11,
    color: Theme.colors.on_secondary_container,
    letterSpacing: 1,
    marginBottom: 6,
  },
  exampleText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: 14,
    color: Theme.colors.on_secondary_container,
    lineHeight: 22,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.md,
    backgroundColor: Theme.colors.background,
    gap: Theme.spacing.md,
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 14,
    paddingHorizontal: Theme.spacing.md,
    backgroundColor: Theme.colors.surface_container,
    borderRadius: Theme.radius.xl,
  },
  navBtnText: {
    fontFamily: Theme.typography.fontFamily.label,
    fontSize: 15,
    color: Theme.colors.on_surface_variant,
  },
  nextBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    backgroundColor: Theme.colors.primary_container,
    borderRadius: Theme.radius.xl,
  },
  finishBtn: {
    backgroundColor: Theme.colors.secondary,
  },
  nextBtnText: {
    fontFamily: Theme.typography.fontFamily.label,
    fontSize: 16,
    color: Theme.colors.on_primary,
  },
});
