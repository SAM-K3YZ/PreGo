import { useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, TextInput, View } from 'react-native';
import { CaretDownIcon, MagnifyingGlassIcon, XIcon } from 'phosphor-react-native';
import { useTheme } from '@/hooks/useTheme';
import { scale, verticalScale } from '@/utils/styling';
import Typo from '@/components/Typo';
import { countries, Country } from '@/constants/countries';
import { PhoneInputProps } from '@/types';

const PhoneInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  country,
  onCountryChange,
  helperText,
  errorText,
  containerStyle,
}: PhoneInputProps) => {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredCountries = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return countries;
    return countries.filter(
      (c) => c.name.toLowerCase().includes(query) || c.dialCode.includes(query),
    );
  }, [search]);

  const borderColor = errorText
    ? theme.semantic.error
    : isFocused
      ? theme.accent.default
      : theme.border;

  const handleSelect = (selected: Country) => {
    onCountryChange(selected);
    setIsPickerOpen(false);
    setSearch('');
  };

  return (
    <View style={containerStyle}>
      {label ? (
        <Typo
          size={13}
          fontWeight="600"
          color={theme.text.secondary}
          style={{ marginBottom: verticalScale(6) }}
        >
          {label}
        </Typo>
      ) : null}

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor,
          borderRadius: scale(12),
          backgroundColor: theme.background.card,
        }}
      >
        <Pressable
          onPress={() => setIsPickerOpen(true)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: verticalScale(14),
            paddingLeft: scale(14),
            paddingRight: scale(8),
            gap: scale(4),
          }}
        >
          <Typo size={16}>{country.flag}</Typo>
          <Typo size={15} color={theme.text.primary}>
            {country.dialCode}
          </Typo>
          <CaretDownIcon size={scale(14)} color={theme.text.secondary} />
        </Pressable>

        <View
          style={{
            width: 1,
            alignSelf: 'stretch',
            marginVertical: verticalScale(10),
            backgroundColor: theme.border,
          }}
        />

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.text.secondary}
          keyboardType="phone-pad"
          autoComplete="tel"
          textContentType="telephoneNumber"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{
            flex: 1,
            paddingVertical: verticalScale(14),
            paddingHorizontal: scale(10),
            fontSize: verticalScale(15),
            color: theme.text.primary,
          }}
        />
      </View>

      {errorText ? (
        <Typo size={12} color={theme.semantic.error} style={{ marginTop: verticalScale(4) }}>
          {errorText}
        </Typo>
      ) : helperText ? (
        <Typo size={12} color={theme.text.secondary} style={{ marginTop: verticalScale(4) }}>
          {helperText}
        </Typo>
      ) : null}

      <Modal
        visible={isPickerOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setIsPickerOpen(false)}
      >
        <Pressable
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}
          onPress={() => setIsPickerOpen(false)}
        >
          <Pressable
            style={{
              backgroundColor: theme.background.card,
              borderTopLeftRadius: scale(20),
              borderTopRightRadius: scale(20),
              paddingTop: verticalScale(16),
              paddingHorizontal: scale(20),
              maxHeight: '70%',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: verticalScale(12),
              }}
            >
              <Typo size={16} fontWeight="700">
                Select a country
              </Typo>
              <Pressable onPress={() => setIsPickerOpen(false)} hitSlop={8}>
                <XIcon size={scale(20)} color={theme.text.secondary} />
              </Pressable>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: theme.border,
                borderRadius: 999,
                paddingHorizontal: scale(14),
                marginBottom: verticalScale(12),
              }}
            >
              <MagnifyingGlassIcon size={scale(16)} color={theme.text.secondary} />
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search country or code"
                placeholderTextColor={theme.text.secondary}
                style={{
                  flex: 1,
                  paddingVertical: verticalScale(10),
                  paddingHorizontal: scale(8),
                  fontSize: verticalScale(14),
                  color: theme.text.primary,
                }}
              />
            </View>

            <FlatList
              data={filteredCountries}
              keyExtractor={(item) => item.iso2}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => handleSelect(item)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: verticalScale(10),
                    gap: scale(10),
                  }}
                >
                  <Typo size={18}>{item.flag}</Typo>
                  <Typo size={15} color={theme.text.primary} style={{ flex: 1 }}>
                    {item.name}
                  </Typo>
                  <Typo size={14} color={theme.text.secondary}>
                    {item.dialCode}
                  </Typo>
                </Pressable>
              )}
              ListEmptyComponent={
                <Typo
                  size={14}
                  color={theme.text.secondary}
                  style={{ textAlign: 'center', paddingVertical: verticalScale(20) }}
                >
                  No countries match your search
                </Typo>
              }
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

export default PhoneInput;
