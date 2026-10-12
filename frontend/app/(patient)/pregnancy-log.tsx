import Typo from '@/components/Typo';
import { Button, Input, Screen } from '@/components/ui';
import { lightTheme, spacingX, spacingY } from '@/constants/theme';
import { verticalScale } from '@/utils/styling';
import RNDateTimePicker, {
  type DateTimePickerChangeEvent,
} from '@react-native-community/datetimepicker';
import { useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
  StyleSheet,
  Alert,
} from 'react-native';
import * as Icon from 'phosphor-react-native';
import { logService } from '@/services/logService';
import { getApiErrorMessage } from '@/utils/apiError';

const DateCaret = () => (
  <Icon.CaretDownIcon color={lightTheme.text.primary} size={verticalScale(18)} />
);

const severityOptions = [
  { value: 1, label: 'Mild', color: lightTheme.semantic.success },
  { value: 2, label: 'Mild', color: lightTheme.semantic.success },
  { value: 3, label: 'High', color: lightTheme.semantic.warning },
  { value: 4, label: 'High', color: lightTheme.semantic.warning },
  { value: 5, label: 'Very severe', color: lightTheme.semantic.error },
];

const experienceData = [
  { id: 1, title: 'Nausea' },
  { id: 2, title: 'Fatigue' },
  { id: 3, title: 'Headache' },
  { id: 4, title: 'Back pain' },
  { id: 5, title: 'Cramps' },
  { id: 6, title: 'Heartburn' },
  { id: 7, title: 'Dizziness' },
  { id: 8, title: 'Swelling' },
  { id: 9, title: 'Mood changes' },
  { id: 10, title: '+ Other', isOther: true },
];

const moreExperienceData = [
  { id: 11, title: 'Constipation' },
  { id: 12, title: 'Insomnia' },
  { id: 13, title: 'Shortness of breath' },
  { id: 14, title: 'Breast tenderness' },
  { id: 15, title: 'Frequent urination' },
  { id: 16, title: 'Vaginal discharge' },
  { id: 17, title: 'Leg cramps' },
  { id: 18, title: 'Food cravings' },
];

export default function Log() {
  // Replace this placeholder with the assigned doctor from the backend.
  const doctor = { name: 'Dr. Adeyemi', initials: 'TA' };
  const scrollViewRef = useRef<ScrollView>(null);
  const noteFocused = useRef(false);

  // Wait for the keyboard insets to settle before revealing the final form field.
  useEffect(() => {
    let frame: number | undefined;
    const subscription = Keyboard.addListener('keyboardDidShow', () => {
      if (noteFocused.current) {
        frame = requestAnimationFrame(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        });
      }
    });
    return () => {
      subscription.remove();
      if (frame !== undefined) cancelAnimationFrame(frame);
    };
  }, []);

  const [logDate, setLogDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [selectedExperiences, setSelectedExperiences] = useState<number[]>([]);
  const [customExperiences, setCustomExperiences] = useState<{ id: number; title: string }[]>([]);
  const [experienceSearch, setExperienceSearch] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState(severityOptions[0]);
  const [visibility, setVisibility] = useState(false);
  const [note, setNote] = useState('');
  const canSubmit = selectedExperiences.length > 0;
  const [isSaving, setIsSaving] = useState(false);
  const savingRef = useRef(false);

  const handleDateChange = (_event: DateTimePickerChangeEvent, selectedDate: Date) => {
    setLogDate(selectedDate);

    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
  };

  const dateLabel = logDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const toggleExperience = (id: number) => {
    setSelectedExperiences((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const displayedExperiences = [
    ...experienceData,
    ...moreExperienceData.filter((experience) => selectedExperiences.includes(experience.id)),
    ...customExperiences,
  ];

  const filteredMoreExperiences = moreExperienceData.filter((experience) =>
    experience.title.toLowerCase().includes(experienceSearch.trim().toLowerCase()),
  );

  const addCustomExperience = () => {
    const title = experienceSearch.trim();
    if (!title) return;

    const existing = [...experienceData, ...moreExperienceData, ...customExperiences].find(
      (experience) => experience.title.toLowerCase() === title.toLowerCase(),
    );

    if (existing) {
      if (!selectedExperiences.includes(existing.id)) toggleExperience(existing.id);
    } else {
      const id = Date.now();
      setCustomExperiences((current) => [...current, { id, title }]);
      setSelectedExperiences((current) => [...current, id]);
    }

    setExperienceSearch('');
  };

  const handleSaveEntry = async () => {
    if (!canSubmit || savingRef.current) return;

    savingRef.current = true;
    setIsSaving(true);
    Keyboard.dismiss();

    try {
      await logService.saveSymptomEntry({
        experiences: [...experienceData, ...moreExperienceData, ...customExperiences]
          .filter((experience) => selectedExperiences.includes(experience.id))
          .map(({ id, title }) => ({ id, title })),
        severity: selectedSeverity.value,
        note: note.trim() || undefined,
        loggedAt: logDate.toISOString(),
        visibility,
      });

      setSelectedExperiences([]);
      setCustomExperiences([]);
      setExperienceSearch('');
      setNote('');
      setSelectedSeverity(severityOptions[0]);
      setLogDate(new Date());
      setVisibility(false);
      Alert.alert('Entry saved', 'Your symptom entry has been saved.');
    } catch (error) {
      Alert.alert('Unable to save entry', getApiErrorMessage(error, 'Please try again.'));
    } finally {
      savingRef.current = false;
      setIsSaving(false);
    }
  };

  return (
    <Screen scroll keyboardAware scrollViewRef={scrollViewRef}>
      {/* top */}
      <View style={styles.top}>
        <View>
          <Typo size={verticalScale(20)} fontWeight={'bold'} color={lightTheme.text.primary}>
            Log Symtomps
          </Typo>
          <Typo size={verticalScale(14)} fontWeight={'regular'} color={lightTheme.text.primary}>
            How are you feeling today?
          </Typo>
        </View>
        {/* history button */}
        <Button
          title="History"
          variant="outline"
          borderColor={lightTheme.text.secondary}
          color={lightTheme.text.secondary}
          style={{ padding: spacingY.md }}
        />
      </View>

      {/* body */}
      <View style={{ gap: 15 }} pointerEvents={isSaving ? 'none' : 'auto'}>
        {/* calendar */}
        <Pressable onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
          <Typo size={16} color={lightTheme.text.primary}>
            {dateLabel}
          </Typo>
          <DateCaret />
        </Pressable>
        {showDatePicker && Platform.OS === 'android' ? (
          <RNDateTimePicker
            mode="date"
            value={logDate}
            onValueChange={handleDateChange}
            onDismiss={() => setShowDatePicker(false)}
            display="default"
          />
        ) : null}
        {Platform.OS === 'ios' ? (
          <Modal
            visible={showDatePicker}
            transparent
            animationType="fade"
            onRequestClose={() => setShowDatePicker(false)}
          >
            <View style={styles.modalBackdrop}>
              <View style={styles.iosPickerCard}>
                <RNDateTimePicker
                  mode="date"
                  value={logDate}
                  onValueChange={handleDateChange}
                  onDismiss={() => setShowDatePicker(false)}
                  display="spinner"
                />
                <Pressable onPress={() => setShowDatePicker(false)} style={styles.doneButton}>
                  <Typo size={16} fontWeight="600" color={lightTheme.accent.default}>
                    Done
                  </Typo>
                </Pressable>
              </View>
            </View>
          </Modal>
        ) : null}

        {/* experincing */}
        <View style={styles.experince}>
          <View style={{ gap: 8 }}>
            <Typo size={verticalScale(16)} fontWeight={'medium'} color={lightTheme.text.primary}>
              What are you experincing?
            </Typo>
            <Typo size={verticalScale(12)} fontWeight={'regular'} color={lightTheme.text.primary}>
              Select all that apply
            </Typo>
          </View>
          <View style={styles.experienceGrid}>
            {displayedExperiences.map((experience) => {
              const isOther = 'isOther' in experience && experience.isOther;
              const isSelected = !isOther && selectedExperiences.includes(experience.id);

              return (
                <Pressable
                  key={experience.id}
                  onPress={() =>
                    isOther ? setShowExperienceModal(true) : toggleExperience(experience.id)
                  }
                  style={[styles.experienceOption, isSelected && styles.selectedExperience]}
                >
                  <Typo
                    size={verticalScale(13)}
                    fontWeight="medium"
                    color={isSelected ? lightTheme.background.card : lightTheme.text.primary}
                  >
                    {experience.title}
                  </Typo>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Severity */}
        <View style={styles.severity}>
          <View style={styles.severityHeader}>
            <Typo size={verticalScale(16)} fontWeight={'medium'} color={lightTheme.text.primary}>
              Severity
            </Typo>
            <Typo
              size={verticalScale(14)}
              fontWeight="medium"
              color={selectedSeverity.color}
              textProps={{ accessibilityLiveRegion: 'polite' }}
            >
              {selectedSeverity.value}/5 - {selectedSeverity.label}
            </Typo>
          </View>
          <View style={styles.severityOptions}>
            {severityOptions.map((option) => {
              const isSelected = selectedSeverity.value === option.value;

              return (
                <Pressable
                  key={option.value}
                  accessibilityRole="button"
                  accessibilityLabel={`${option.value} out of 5 - ${option.label}`}
                  accessibilityState={{ selected: isSelected }}
                  onPress={() => setSelectedSeverity(option)}
                  style={[
                    styles.severityOption,
                    {
                      borderColor: option.color,
                      backgroundColor: isSelected ? option.color : lightTheme.background.card,
                    },
                  ]}
                >
                  <Typo
                    size={verticalScale(16)}
                    fontWeight="semibold"
                    color={isSelected ? lightTheme.background.card : option.color}
                  >
                    {option.value}
                  </Typo>
                </Pressable>
              );
            })}
          </View>
          <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
            <Typo color={lightTheme.text.primary} size={verticalScale(12)} fontWeight={'regular'}>
              Minimal
            </Typo>
            <Typo color={lightTheme.text.primary} size={verticalScale(12)} fontWeight={'regular'}>
              Severe
            </Typo>
          </View>
        </View>

        {/* note */}
        <View style={styles.note}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Typo size={verticalScale(16)} fontWeight={'bold'}>
              Add a note
            </Typo>
            <Typo size={verticalScale(12)} fontWeight={'light'}>
              (optional)
            </Typo>
          </View>
          <View>
            <Input
              multiline
              textAlignVertical="top"
              accessibilityLabel="Add a note"
              value={note}
              onChangeText={setNote}
              onFocus={() => {
                noteFocused.current = true;
                scrollViewRef.current?.scrollToEnd({ animated: true });
              }}
              onBlur={() => {
                noteFocused.current = false;
              }}
              height={verticalScale(80)}
              width={'100%'}
              placeholderTextColor={lightTheme.text.secondary}
              placeholder="Describe how you are feeling in more detail..."
            ></Input>
          </View>
        </View>

        {/* visibility */}
        <Pressable
          accessibilityRole="switch"
          accessibilityLabel={`Share this log with ${doctor.name}`}
          accessibilityState={{ checked: visibility }}
          onPress={() => setVisibility((current) => !current)}
          style={styles.visibilityCard}
        >
          {visibility && (
            <View style={styles.doctorAvatar}>
              <Typo
                size={verticalScale(10)}
                fontWeight="semibold"
                color={lightTheme.secondary.dark}
              >
                {doctor.initials}
              </Typo>
            </View>
          )}
          <View style={styles.visibilityLabel}>
            <Typo
              size={verticalScale(13)}
              fontWeight="medium"
              color={visibility ? lightTheme.text.primary : lightTheme.text.secondary}
            >
              {visibility ? `Visible to ${doctor.name}` : 'Private — not shared'}
            </Typo>
          </View>
          <View style={[styles.visibilityTrack, visibility && styles.visibilityTrackActive]}>
            <View style={[styles.visibilityThumb, visibility && styles.visibilityThumbActive]} />
          </View>
        </Pressable>

        {/* save entry */}
        <Button
          title="Save Entry"
          disabled={!canSubmit || isSaving}
          accessibilityRole="button"
          accessibilityState={{ disabled: !canSubmit || isSaving, busy: isSaving }}
          onPress={handleSaveEntry}
          loading={isSaving}
        />
      </View>

      <Modal
        visible={showExperienceModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowExperienceModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.experienceModalCard}>
            <View style={styles.modalHeader}>
              <Typo size={verticalScale(18)} fontWeight="bold" color={lightTheme.text.primary}>
                Add an experience
              </Typo>
              <Pressable
                accessibilityLabel="Close experiences"
                hitSlop={8}
                onPress={() => setShowExperienceModal(false)}
              >
                <Icon.XIcon color={lightTheme.text.secondary} size={verticalScale(22)} />
              </Pressable>
            </View>
            <View style={styles.searchBox}>
              <Icon.MagnifyingGlassIcon
                color={lightTheme.text.secondary}
                size={verticalScale(18)}
              />
              <TextInput
                value={experienceSearch}
                onChangeText={setExperienceSearch}
                placeholder="Search experiences"
                placeholderTextColor={lightTheme.text.secondary}
                style={styles.searchInput}
                returnKeyType="done"
                onSubmitEditing={addCustomExperience}
              />
            </View>
            <ScrollView contentContainerStyle={styles.moreExperienceList}>
              {filteredMoreExperiences.map((experience) => {
                const isSelected = selectedExperiences.includes(experience.id);

                return (
                  <Pressable
                    key={experience.id}
                    onPress={() => toggleExperience(experience.id)}
                    style={[styles.moreExperienceOption, isSelected && styles.selectedExperience]}
                  >
                    <Typo
                      size={verticalScale(14)}
                      fontWeight="medium"
                      color={isSelected ? lightTheme.background.card : lightTheme.text.primary}
                    >
                      {experience.title}
                    </Typo>
                    {isSelected ? (
                      <Icon.CheckIcon color={lightTheme.background.card} size={verticalScale(18)} />
                    ) : null}
                  </Pressable>
                );
              })}
              {experienceSearch.trim() &&
              !filteredMoreExperiences.some(
                (experience) =>
                  experience.title.toLowerCase() === experienceSearch.trim().toLowerCase(),
              ) ? (
                <Pressable onPress={addCustomExperience} style={styles.moreExperienceOption}>
                  <Typo
                    size={verticalScale(14)}
                    fontWeight="medium"
                    color={lightTheme.text.primary}
                  >
                    Add "{experienceSearch.trim()}"
                  </Typo>
                  <Icon.PlusIcon color={lightTheme.accent.default} size={verticalScale(18)} />
                </Pressable>
              ) : null}
            </ScrollView>
            <Pressable onPress={() => setShowExperienceModal(false)} style={styles.modalDoneButton}>
              <Typo size={verticalScale(15)} fontWeight="600" color="#FFFFFF">
                Done
              </Typo>
            </Pressable>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingX.sm,
    alignSelf: 'flex-start',
    backgroundColor: '#F0E9E7',
    borderRadius: 999,
    marginVertical: spacingX.md,
    paddingHorizontal: spacingX.lg,
    paddingVertical: spacingY.sm,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(43, 36, 34, 0.35)',
    paddingHorizontal: spacingX.xl,
  },
  iosPickerCard: {
    alignItems: 'center',
    backgroundColor: lightTheme.background.card,
    borderRadius: 16,
    padding: spacingX.lg,
  },
  doneButton: {
    alignSelf: 'stretch',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: lightTheme.border,
    marginTop: spacingY.sm,
    paddingTop: spacingY.md,
  },
  experince: {
    gap: 13,
  },
  experienceHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addExperienceButton: {
    alignItems: 'center',
    borderColor: lightTheme.accent.default,
    borderRadius: 999,
    borderWidth: 1,
    height: verticalScale(30),
    justifyContent: 'center',
    width: verticalScale(30),
  },
  searchBox: {
    alignItems: 'center',
    backgroundColor: lightTheme.background.card,
    borderColor: lightTheme.border,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: spacingY.md,
    paddingHorizontal: spacingX.md,
  },
  searchInput: {
    color: lightTheme.text.primary,
    flex: 1,
    fontSize: verticalScale(14),
    paddingHorizontal: spacingX.sm,
    paddingVertical: spacingY.md,
  },
  experienceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacingX.sm,
  },
  experienceOption: {
    alignItems: 'center',
    backgroundColor: lightTheme.background.card,
    borderColor: lightTheme.border,
    borderRadius: 12,
    borderWidth: 1,
    minWidth: '31%',
    paddingHorizontal: spacingX.md,
    paddingVertical: spacingY.md,
  },
  selectedExperience: {
    backgroundColor: lightTheme.accent.default,
    borderColor: lightTheme.accent.default,
  },
  experienceModalCard: {
    backgroundColor: lightTheme.background.app,
    borderRadius: 20,
    maxHeight: '80%',
    padding: spacingX.lg,
  },
  modalHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: spacingY.md,
  },
  moreExperienceList: {
    gap: spacingY.sm,
  },
  moreExperienceOption: {
    alignItems: 'center',
    backgroundColor: lightTheme.background.card,
    borderColor: lightTheme.border,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacingX.md,
    paddingVertical: spacingY.md,
  },
  modalDoneButton: {
    alignItems: 'center',
    backgroundColor: lightTheme.accent.default,
    borderRadius: 999,
    marginTop: spacingY.md,
    paddingVertical: spacingY.md,
  },

  severity: {
    gap: 13,
    marginTop: spacingX.md,
  },

  note: {
    gap: 13,
    marginTop: spacingX.md,
  },
  severityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: spacingX.sm,
  },
  severityOptions: {
    flexDirection: 'row',
    gap: spacingX.sm,
  },
  severityOption: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: spacingY.md,
  },
  visibilityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingX.sm,
    minHeight: 50,
    marginTop: spacingY.md,
    paddingHorizontal: spacingX.md,
    paddingVertical: spacingY.sm,
    backgroundColor: lightTheme.background.card,
    borderColor: lightTheme.border,
    borderWidth: 1,
    borderRadius: 16,
  },
  doctorAvatar: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#E8F2E5',
    borderColor: '#D8E8D3',
    borderWidth: 1,
  },
  visibilityLabel: {
    flex: 1,
  },
  visibilityTrack: {
    width: 38,
    height: 22,
    borderRadius: 999,
    backgroundColor: lightTheme.border,
    padding: 2,
    justifyContent: 'center',
  },
  visibilityTrackActive: {
    backgroundColor: lightTheme.secondary.default,
    borderColor: lightTheme.secondary.default,
  },
  visibilityThumb: {
    width: 16,
    height: 16,
    borderRadius: 999,
    backgroundColor: lightTheme.background.card,
    alignSelf: 'flex-start',
  },
  visibilityThumbActive: {
    alignSelf: 'flex-end',
  },
});
