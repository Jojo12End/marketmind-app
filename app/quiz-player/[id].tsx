import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Animated,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, CheckCircle, XCircle } from 'lucide-react-native';
import { Theme } from '../../src/theme';
import { LESSONS, QUIZZES, Question } from '../../src/data/curriculum';
import { useStore } from '../../src/store/useStore';

type AnswerState = 'unanswered' | 'correct' | 'incorrect';

export default function QuizPlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { addXp, recordAnswer, completeLesson } = useStore();

  const quiz = QUIZZES.find(q => q.lessonId === id);
  const lesson = LESSONS.find(l => l.id === id);

  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | boolean | null>(null);
  const [textAnswer, setTextAnswer] = useState('');
  const [answerState, setAnswerState] = useState<AnswerState>('unanswered');
  const [score, setScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  if (!quiz || !lesson) {
    return (
      <View style={{ flex: 1, backgroundColor: Theme.colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: Theme.colors.on_surface }}>Quiz not found</Text>
      </View>
    );
  }

  const currentQ = quiz.questions[questionIndex];
  const total = quiz.questions.length;
  const progress = ((questionIndex + 1) / total) * 100;

  const handleSubmit = () => {
    if (answerState !== 'unanswered') {
      // Go to next
      if (questionIndex + 1 < total) {
        setQuestionIndex(questionIndex + 1);
        setSelectedAnswer(null);
        setTextAnswer('');
        setAnswerState('unanswered');
      } else {
        // Quiz finished
        const pct = Math.round((score + (answerState === 'correct' ? 1 : 0)) / total * 100);
        if (pct >= 70) {
          completeLesson(lesson.id, lesson.title);
        }
        setQuizDone(true);
      }
      return;
    }

    // Evaluate answer
    let answer: string | boolean;
    if (currentQ.type === 'true_false') {
      answer = selectedAnswer as boolean;
    } else if (currentQ.type === 'fill_in_the_blank') {
      answer = textAnswer.toLowerCase().trim();
    } else {
      answer = selectedAnswer as string;
    }

    const correct = currentQ.type === 'fill_in_the_blank'
      ? (currentQ.correctAnswer as string).toLowerCase().trim() === answer
      : answer === currentQ.correctAnswer;

    if (correct) {
      setScore(s => s + 1);
      addXp(10);
    }
    recordAnswer(correct);
    setAnswerState(correct ? 'correct' : 'incorrect');
  };

  const canSubmit = () => {
    if (answerState !== 'unanswered') return true;
    if (currentQ.type === 'fill_in_the_blank') return textAnswer.trim().length > 0;
    return selectedAnswer !== null;
  };

  if (quizDone) {
    const finalScore = score;
    const pct = Math.round(finalScore / total * 100);
    const earned = finalScore * 10;
    const passed = pct >= 70;

    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.resultContainer}>
          <View style={[styles.resultBadge, passed ? styles.resultBadgePass : styles.resultBadgeFail]}>
            {passed
              ? <CheckCircle color={Theme.colors.secondary} size={64} />
              : <XCircle color={Theme.colors.error} size={64} />
            }
          </View>
          <Text style={styles.resultTitle}>{passed ? 'Great Job! 🎉' : 'Keep Practicing!'}</Text>
          <Text style={styles.scoreText}>{finalScore}/{total} Correct</Text>
          <Text style={styles.pctText}>{pct}% accuracy</Text>

          <View style={styles.earnedRow}>
            <Text style={styles.earnedLabel}>XP Earned</Text>
            <Text style={styles.earnedValue}>+{earned} XP ⚡</Text>
          </View>

          {passed && (
            <View style={styles.unlockedBadge}>
              <Text style={styles.unlockedText}>✅ Next lesson unlocked!</Text>
            </View>
          )}

          <View style={styles.resultActions}>
            <TouchableOpacity
              style={styles.retryBtn}
              onPress={() => { setQuestionIndex(0); setScore(0); setQuizDone(false); setAnswerState('unanswered'); setSelectedAnswer(null); setTextAnswer(''); }}
            >
              <Text style={styles.retryBtnText}>Retry Quiz</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.continueBtn}
              onPress={() => router.replace('/')}
            >
              <Text style={styles.continueBtnText}>Continue Learning</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft color={Theme.colors.on_surface} size={24} />
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        </View>
        <Text style={styles.counter}>{questionIndex + 1}/{total}</Text>
      </View>

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.lessonName}>{lesson.title}</Text>
        <Text style={styles.questionText}>{currentQ.text}</Text>

        {/* Multiple choice */}
        {currentQ.type === 'multiple_choice' && currentQ.options?.map((opt, i) => {
          let optStyle = styles.option;
          let textStyle = styles.optionText;
          if (answerState !== 'unanswered') {
            if (opt === currentQ.correctAnswer) {
              optStyle = { ...styles.option, ...styles.optionCorrect };
            } else if (opt === selectedAnswer && answerState === 'incorrect') {
              optStyle = { ...styles.option, ...styles.optionWrong };
            }
          } else if (selectedAnswer === opt) {
            optStyle = { ...styles.option, ...styles.optionSelected };
          }

          return (
            <TouchableOpacity
              key={i}
              style={optStyle}
              onPress={() => answerState === 'unanswered' && setSelectedAnswer(opt)}
              activeOpacity={0.75}
            >
              <Text style={textStyle}>{opt}</Text>
            </TouchableOpacity>
          );
        })}

        {/* True / False */}
        {currentQ.type === 'true_false' && (
          <View style={styles.tfRow}>
            {[true, false].map((val) => {
              let s = styles.tfBtn;
              if (answerState !== 'unanswered') {
                if (val === currentQ.correctAnswer) s = { ...styles.tfBtn, ...styles.optionCorrect };
                else if (val === selectedAnswer && answerState === 'incorrect') s = { ...styles.tfBtn, ...styles.optionWrong };
              } else if (selectedAnswer === val) {
                s = { ...styles.tfBtn, ...styles.optionSelected };
              }
              return (
                <TouchableOpacity
                  key={String(val)}
                  style={s}
                  onPress={() => answerState === 'unanswered' && setSelectedAnswer(val)}
                >
                  <Text style={styles.tfBtnText}>{val ? 'TRUE' : 'FALSE'}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Fill in blank */}
        {currentQ.type === 'fill_in_the_blank' && (
          <TextInput
            style={[
              styles.input,
              answerState === 'correct' && styles.inputCorrect,
              answerState === 'incorrect' && styles.inputWrong,
            ]}
            value={textAnswer}
            onChangeText={setTextAnswer}
            placeholder="Type your answer..."
            placeholderTextColor={Theme.colors.on_surface_variant}
            editable={answerState === 'unanswered'}
            autoCorrect={false}
            autoCapitalize="none"
          />
        )}

        {/* Explanation */}
        {answerState !== 'unanswered' && (
          <View style={[styles.explanation, answerState === 'correct' ? styles.explCorrect : styles.explWrong]}>
            <Text style={styles.explIcon}>{answerState === 'correct' ? '✅' : '❌'}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.explTitle}>{answerState === 'correct' ? 'Correct!' : 'Not quite...'}</Text>
              <Text style={styles.explText}>{currentQ.explanation}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.submitBtn, !canSubmit() && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={!canSubmit()}
        >
          <Text style={styles.submitBtnText}>
            {answerState !== 'unanswered'
              ? (questionIndex + 1 < total ? 'Next Question →' : 'See Results')
              : 'Submit Answer'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Theme.colors.background },
  topBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Theme.spacing.md, paddingVertical: Theme.spacing.sm, gap: Theme.spacing.sm,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: Theme.radius.full,
    backgroundColor: Theme.colors.surface_container, justifyContent: 'center', alignItems: 'center',
  },
  progressContainer: { flex: 1 },
  progressTrack: {
    height: 6, backgroundColor: Theme.colors.surface_container,
    borderRadius: Theme.radius.full, overflow: 'hidden',
  },
  progressFill: {
    height: '100%', borderRadius: Theme.radius.full,
    backgroundColor: Theme.colors.primary,
  },
  counter: {
    fontFamily: Theme.typography.fontFamily.label, fontSize: 13,
    color: Theme.colors.on_surface_variant, minWidth: 30, textAlign: 'right',
  },
  scrollArea: { flex: 1 },
  scrollContent: { paddingHorizontal: Theme.spacing.md, paddingBottom: 24 },
  lessonName: {
    fontFamily: Theme.typography.fontFamily.body, fontSize: 13,
    color: Theme.colors.on_surface_variant, marginBottom: 8,
  },
  questionText: {
    fontFamily: Theme.typography.fontFamily.headline, fontSize: 20,
    color: Theme.colors.on_surface, lineHeight: 30,
    marginBottom: Theme.spacing.xl,
  },
  option: {
    backgroundColor: Theme.colors.surface_container, borderRadius: Theme.radius.xl,
    padding: Theme.spacing.md, marginBottom: Theme.spacing.sm,
  },
  optionSelected: {
    backgroundColor: Theme.colors.surface_container_highest,
    borderWidth: 2, borderColor: Theme.colors.primary,
  },
  optionCorrect: {
    backgroundColor: '#0d2b1f', borderWidth: 2, borderColor: '#4ade80',
  },
  optionWrong: {
    backgroundColor: '#2b0d14', borderWidth: 2, borderColor: Theme.colors.error,
  },
  optionText: {
    fontFamily: Theme.typography.fontFamily.bodyMedium, fontSize: 15,
    color: Theme.colors.on_surface,
  },
  tfRow: { flexDirection: 'row', gap: Theme.spacing.md, marginBottom: Theme.spacing.md },
  tfBtn: {
    flex: 1, backgroundColor: Theme.colors.surface_container,
    borderRadius: Theme.radius.xl, padding: Theme.spacing.lg,
    alignItems: 'center',
  },
  tfBtnText: {
    fontFamily: Theme.typography.fontFamily.headline, fontSize: 16,
    color: Theme.colors.on_surface,
  },
  input: {
    backgroundColor: Theme.colors.surface_container, borderRadius: Theme.radius.xl,
    padding: Theme.spacing.md, fontFamily: Theme.typography.fontFamily.body,
    fontSize: 16, color: Theme.colors.on_surface, marginBottom: Theme.spacing.md,
    borderWidth: 2, borderColor: 'transparent',
  },
  inputCorrect: { borderColor: '#4ade80', backgroundColor: '#0d2b1f' },
  inputWrong: { borderColor: Theme.colors.error, backgroundColor: '#2b0d14' },
  explanation: {
    flexDirection: 'row', gap: Theme.spacing.sm,
    borderRadius: Theme.radius.lg, padding: Theme.spacing.md,
    marginTop: Theme.spacing.sm, alignItems: 'flex-start',
  },
  explCorrect: { backgroundColor: '#0d2b1f' },
  explWrong: { backgroundColor: '#2b0d14' },
  explIcon: { fontSize: 20 },
  explTitle: {
    fontFamily: Theme.typography.fontFamily.headlineMedium, fontSize: 15,
    color: Theme.colors.on_surface, marginBottom: 4,
  },
  explText: {
    fontFamily: Theme.typography.fontFamily.body, fontSize: 13,
    color: Theme.colors.on_surface_variant, lineHeight: 20,
  },
  bottomBar: {
    paddingHorizontal: Theme.spacing.md, paddingVertical: Theme.spacing.md,
    backgroundColor: Theme.colors.background,
  },
  submitBtn: {
    backgroundColor: Theme.colors.primary_container,
    borderRadius: Theme.radius.xl, padding: 18,
    alignItems: 'center',
  },
  submitBtnDisabled: { opacity: 0.4 },
  submitBtnText: {
    fontFamily: Theme.typography.fontFamily.label, fontSize: 16,
    color: Theme.colors.on_primary,
  },
  // Results
  resultContainer: {
    flex: 1, padding: Theme.spacing.xl,
    alignItems: 'center', justifyContent: 'center',
  },
  resultBadge: {
    width: 120, height: 120, borderRadius: Theme.radius.full,
    justifyContent: 'center', alignItems: 'center', marginBottom: Theme.spacing.xl,
  },
  resultBadgePass: { backgroundColor: '#0d2b1f' },
  resultBadgeFail: { backgroundColor: '#2b0d14' },
  resultTitle: {
    fontFamily: Theme.typography.fontFamily.headline, fontSize: 28,
    color: Theme.colors.on_surface, textAlign: 'center', marginBottom: Theme.spacing.sm,
  },
  scoreText: {
    fontFamily: Theme.typography.fontFamily.headline, fontSize: 48,
    color: Theme.colors.primary, marginBottom: 4,
  },
  pctText: {
    fontFamily: Theme.typography.fontFamily.body, fontSize: 16,
    color: Theme.colors.on_surface_variant, marginBottom: Theme.spacing.xl,
  },
  earnedRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    backgroundColor: Theme.colors.surface_container, borderRadius: Theme.radius.xl,
    padding: Theme.spacing.md, width: '100%', marginBottom: Theme.spacing.md,
  },
  earnedLabel: {
    fontFamily: Theme.typography.fontFamily.bodyMedium, fontSize: 15,
    color: Theme.colors.on_surface_variant,
  },
  earnedValue: {
    fontFamily: Theme.typography.fontFamily.headline, fontSize: 16,
    color: Theme.colors.secondary,
  },
  unlockedBadge: {
    backgroundColor: '#0d2b1f', borderRadius: Theme.radius.lg,
    padding: Theme.spacing.md, marginBottom: Theme.spacing.xl, width: '100%',
  },
  unlockedText: {
    fontFamily: Theme.typography.fontFamily.label, fontSize: 14,
    color: '#4ade80', textAlign: 'center',
  },
  resultActions: { width: '100%', gap: Theme.spacing.md },
  retryBtn: {
    backgroundColor: Theme.colors.surface_container,
    borderRadius: Theme.radius.xl, padding: 16, alignItems: 'center',
  },
  retryBtnText: {
    fontFamily: Theme.typography.fontFamily.label, fontSize: 16,
    color: Theme.colors.on_surface,
  },
  continueBtn: {
    backgroundColor: Theme.colors.primary_container,
    borderRadius: Theme.radius.xl, padding: 16, alignItems: 'center',
  },
  continueBtnText: {
    fontFamily: Theme.typography.fontFamily.label, fontSize: 16,
    color: Theme.colors.on_primary,
  },
});
