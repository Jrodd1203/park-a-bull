import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../utils/theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSearch: () => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChangeText,
  onSearch,
  placeholder = 'Search for a building...',
}: SearchBarProps) {
  const theme = useTheme();

  const handleClear = () => {
    onChangeText('');
  };

  return (
    <View
      className='flex-row items-center rounded-2xl px-4 py-3'
      style={{
        backgroundColor: theme.surface,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: theme.isDark ? 0.3 : 0.1,
        shadowRadius: 8,
        elevation: 4,
      }}
    >
      <Ionicons name='search' size={22} color={theme.primary} />
      <TextInput
        className='flex-1 px-3 text-base'
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSearch}
        returnKeyType='search'
        style={{
          minHeight: 44,
          color: theme.textPrimary,
          fontSize: 16,
        }}
      />
      {value.length > 0 && (
        <TouchableOpacity
          onPress={handleClear}
          activeOpacity={0.6}
          className='p-1'
        >
          <Ionicons name='close-circle' size={22} color={theme.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

