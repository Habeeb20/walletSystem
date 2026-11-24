import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { type ComponentProps } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

type IconName = ComponentProps<typeof MaterialIcons>['name'];

interface PrimaryProps {
  text: string;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  icon?: IconName;
  gradient?: readonly [string, string];
}

export function PrimaryButton({
  text,
  onPress,
  loading = false,
  disabled = false,
  icon,
  gradient = [colors.primary500, colors.primary600],
}: PrimaryProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={loading || disabled}
      className="active:opacity-90"
      style={{
        opacity: disabled ? 0.6 : 1,
        borderRadius: 16,
        shadowColor: gradient[0],
        shadowOpacity: 0.4,
        shadowRadius: 15,
        shadowOffset: { width: 0, height: 8 },
        elevation: 8,
      }}
    >
      <LinearGradient
        colors={[gradient[0], gradient[1]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          height: 56,
          borderRadius: 16,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
        }}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            {icon ? <MaterialIcons name={icon} size={22} color="#fff" style={{ marginRight: 10 }} /> : null}
            <Text className="text-[17px] font-semibold tracking-wide text-white">{text}</Text>
          </>
        )}
      </LinearGradient>
    </Pressable>
  );
}

interface SecondaryProps {
  text: string;
  onPress?: () => void;
  loading?: boolean;
  icon: IconName;
  color?: string;
}

export function SecondaryButton({ text, onPress, loading = false, icon, color = colors.secondary500 }: SecondaryProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      className="h-14 flex-row items-center justify-center rounded-2xl border-[1.5px] bg-white shadow-sm active:opacity-80"
      style={{ borderColor: `${color}4D` }}
    >
      {loading ? (
        <ActivityIndicator color={color} />
      ) : (
        <View className="flex-row items-center">
          <MaterialIcons name={icon} size={26} color={color} />
          <Text className="ml-3 text-[17px] font-semibold tracking-wide" style={{ color }}>
            {text}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

/** Small tappable text link (e.g. "Forgot Password?"). */
export function LinkText({ text, onPress, disabled }: { text: string; onPress: () => void; disabled?: boolean }) {
  return (
    <Pressable onPress={onPress} disabled={disabled} hitSlop={8}>
      <Text className={`text-sm font-semibold ${disabled ? 'text-ink-muted' : 'text-primary-500'}`}>{text}</Text>
    </Pressable>
  );
}
