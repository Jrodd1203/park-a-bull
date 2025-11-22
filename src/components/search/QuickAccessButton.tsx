import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../utils/theme';

interface QuickAccessButtonProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

export default function QuickAccessButton({
  title,
  icon,
  onPress,
}: QuickAccessButtonProps) {
  const theme = useTheme();

  return (
    <TouchableOpacity
      className='flex-1 rounded-2xl overflow-hidden'
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        minHeight: 100,
        backgroundColor: theme.surface,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: theme.isDark ? 0.4 : 0.1,
        shadowRadius: 12,
        elevation: 6,
      }}
    >
      <View className='flex-1 p-4 justify-center items-center'>
        <View
          className='rounded-full p-3 mb-2'
          style={{
            backgroundColor: theme.primary + '20',
          }}
        >
          <Ionicons name={icon} size={28} color={theme.primary} />
        </View>
        <Text
          className='text-sm font-semibold text-center'
          style={{ color: theme.textPrimary }}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
