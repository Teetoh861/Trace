import React from 'react';
import {
  Image, Pressable, StyleProp, StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle,
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

export function Tag({ label, color = colors.amber }: { label: string; color?: string }) {
  return (
    <View style={{ alignSelf: 'flex-start', backgroundColor: color + '26', borderRadius: 6, paddingVertical: 4, paddingHorizontal: 8 }}>
      <Text style={{ fontFamily: fonts.bodyBold, fontSize: 12, color }}>{label}</Text>
    </View>
  );
}

/** Schematic overlay of the submitted survey plan against the official record. */
export function SurveyMap() {
  const Beacons = ({ color, x, y, w, h }: { color: string; x: number; y: number; w: number; h: number }) => (
    <>
      {[[x, y], [x + w, y], [x, y + h], [x + w, y + h]].map(([bx, by], i) => (
        <View key={i} style={{ position: 'absolute', left: bx - 4, top: by - 4, width: 8, height: 8, backgroundColor: color }} />
      ))}
    </>
  );
  return (
    <View>
      <View style={{ height: 210, borderRadius: radius.md, backgroundColor: colors.sand, borderWidth: 1, borderColor: colors.line, overflow: 'hidden' }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <View key={'h' + i} style={{ position: 'absolute', left: 0, right: 0, top: 42 * i, height: 1, backgroundColor: colors.line }} />
        ))}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <View key={'v' + i} style={{ position: 'absolute', top: 0, bottom: 0, left: 46 * i, width: 1, backgroundColor: colors.line }} />
        ))}
        {/* official record */}
        <View style={{ position: 'absolute', left: 120, top: 72, width: 150, height: 100, borderWidth: 2, borderColor: colors.rust, backgroundColor: colors.rust + '14' }} />
        <Beacons color={colors.rust} x={120} y={72} w={150} h={100} />
        {/* submitted plan, offset north-west */}
        <View style={{ position: 'absolute', left: 86, top: 42, width: 150, height: 100, borderWidth: 2, borderColor: colors.blue, borderStyle: 'dashed', backgroundColor: colors.blue + '14' }} />
        <Beacons color={colors.blue} x={86} y={42} w={150} h={100} />
        <Text style={{ position: 'absolute', right: 12, top: 10, fontFamily: fonts.bodyBold, fontSize: 12, color: colors.ink }}>N ↑</Text>
      </View>
      <View style={{ flexDirection: 'row', gap: 16, marginTop: 10, flexWrap: 'wrap' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View style={{ width: 14, height: 3, backgroundColor: colors.blue }} />
          <Text style={{ fontFamily: fonts.body, fontSize: 12, color: colors.muted }}>Your survey plan</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View style={{ width: 14, height: 3, backgroundColor: colors.rust }} />
          <Text style={{ fontFamily: fonts.body, fontSize: 12, color: colors.muted }}>Official record</Text>
        </View>
      </View>
      <Muted style={{ marginTop: 6 }}>Schematic only. Offset of about 40 m north-west, with overlapping beacons.</Muted>
    </View>
  );
}

/** Site inspection photos. Add image URLs to SITE_PHOTOS in data.ts to replace the placeholders. */
export function PhotoStrip({ photos }: { photos: string[] }) {
  const slots = [0, 1, 2];
  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      {slots.map((i) => (
        <View key={i} style={{ flex: 1, height: 96, borderRadius: radius.sm, overflow: 'hidden', backgroundColor: colors.sand, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' }}>
          {photos[i] ? (
            <Image source={{ uri: photos[i] }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
          ) : (
            <Text style={{ fontFamily: fonts.bodyMed, fontSize: 12, color: colors.muted }}>Site photo {i + 1}</Text>
          )}
        </View>
      ))}
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
