import React from 'react';
import {
  Pressable, StyleProp, StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle,
} from 'react-native';
import { colors, fonts, radius } from './theme';
import { GRADES, GradeKey } from './data';

export const H1 = ({ children, style }: { children: React.ReactNode; style?: any }) => (
  <Text style={[{ fontFamily: fonts.display, fontSize: 28, lineHeight: 32, color: colors.ink }, style]}>{children}</Text>
);
export const H2 = ({ children, style }: { children: React.ReactNode; style?: any }) => (
  <Text style={[{ fontFamily: fonts.displayMed, fontSize: 20, color: colors.ink }, style]}>{children}</Text>
);
export const Body = ({ children, style }: { children: React.ReactNode; style?: any }) => (
  <Text style={[{ fontFamily: fonts.body, fontSize: 15, lineHeight: 21, color: colors.ink }, style]}>{children}</Text>
);
export const Muted = ({ children, style }: { children: React.ReactNode; style?: any }) => (
  <Text style={[{ fontFamily: fonts.body, fontSize: 13, lineHeight: 18, color: colors.muted }, style]}>{children}</Text>
);
export const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <Text style={{ fontFamily: fonts.bodyBold, fontSize: 11, letterSpacing: 1.2, color: colors.rust, textTransform: 'uppercase' }}>
    {children}
  </Text>
);

export function Button({
  title, onPress, variant = 'primary', disabled, style,
}: {
  title: string; onPress: () => void; variant?: 'primary' | 'ghost' | 'light'; disabled?: boolean; style?: StyleProp<ViewStyle>;
}) {
  const bg = variant === 'primary' ? colors.rust : variant === 'light' ? colors.cream : 'transparent';
  const fg = variant === 'primary' ? '#fff' : variant === 'light' ? colors.rust : colors.ink;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: bg, opacity: disabled ? 0.4 : pressed ? 0.85 : 1, borderWidth: variant === 'ghost' ? 1 : 0, borderColor: colors.line },
        style,
      ]}
    >
      <Text style={{ fontFamily: fonts.bodyBold, fontSize: 16, color: fg }}>{title}</Text>
    </Pressable>
  );
}

export function Card({ children, style, onPress }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; onPress?: () => void }) {
  const C: any = onPress ? Pressable : View;
  return (
    <C onPress={onPress} style={[styles.card, style]}>
      {children}
    </C>
  );
}

export function Field({ label, ...p }: TextInputProps & { label: string }) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontFamily: fonts.bodyMed, fontSize: 13, color: colors.muted, marginBottom: 6 }}>{label}</Text>
      <TextInput
        placeholderTextColor="#A39C91"
        {...p}
        style={[styles.input, p.multiline && { height: 90, textAlignVertical: 'top' }]}
      />
    </View>
  );
}

export function Chip({ label, active, onPress }: { label: string; active?: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, active && { backgroundColor: colors.rust, borderColor: colors.rust }]}
    >
      <Text style={{ fontFamily: fonts.bodyMed, fontSize: 14, color: active ? '#fff' : colors.ink }}>{label}</Text>
    </Pressable>
  );
}

export function Progress({ step, total }: { step: number; total: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 6, marginBottom: 20 }}>
      {Array.from({ length: total }).map((_, i) => (
        <View key={i} style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: i < step ? colors.rust : colors.line }} />
      ))}
    </View>
  );
}

export function GradePill({ grade, compact }: { grade: GradeKey; compact?: boolean }) {
  const g = GRADES[grade];
  return (
    <View style={[styles.pill, { backgroundColor: g.color + '1A' }]}>
      <View style={[styles.dot, { backgroundColor: g.color }]}>
        <Text style={{ color: '#fff', fontSize: 11, fontFamily: fonts.bodyBold }}>{g.icon}</Text>
      </View>
      {!compact && (
        <Text style={{ fontFamily: fonts.bodyBold, fontSize: 12, color: g.color, flexShrink: 1 }}>{g.label}</Text>
      )}
    </View>
  );
}

export function Row({ left, right, bold }: { left: string; right: string; bold?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 }}>
      <Text style={{ fontFamily: bold ? fonts.bodyBold : fonts.body, fontSize: 15, color: colors.ink, flex: 1, paddingRight: 12 }}>{left}</Text>
      <Text style={{ fontFamily: bold ? fonts.bodyBold : fonts.bodyMed, fontSize: 15, color: colors.ink }}>{right}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  btn: { height: 54, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  card: { backgroundColor: colors.surface, borderRadius: radius.md, padding: 16, borderWidth: 1, borderColor: colors.line },
  input: {
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: radius.sm,
    paddingHorizontal: 14, height: 50, fontFamily: fonts.body, fontSize: 16, color: colors.ink,
  },
  chip: {
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999, borderWidth: 1, borderColor: colors.line,
    backgroundColor: colors.surface, marginRight: 8, marginBottom: 8,
  },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 999 },
  dot: { width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
});
