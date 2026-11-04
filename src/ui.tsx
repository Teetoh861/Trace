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

/** Tap-to-pin mock map of Lagos. Stores coordinates as display strings. */
export function MapPicker({ pin, onPick }: { pin: { lat: string; lng: string } | null; onPick: (p: { lat: string; lng: string }) => void }) {
  const [size, setSize] = React.useState({ w: 320, h: 190 });
  const [xy, setXy] = React.useState<{ x: number; y: number } | null>(pin ? { x: size.w * 0.55, y: size.h * 0.45 } : null);
  return (
    <View>
      <View
        onLayout={(e) => setSize({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })}
        onStartShouldSetResponder={() => true}
        onResponderRelease={(e) => {
          const x = e.nativeEvent.locationX, y = e.nativeEvent.locationY;
          setXy({ x, y });
          onPick({ lat: (6.62 - (y / size.h) * 0.27).toFixed(4), lng: (3.18 + (x / size.w) * 0.5).toFixed(4) });
        }}
        style={{ height: 190, borderRadius: radius.md, backgroundColor: '#E9E0CF', borderWidth: 1, borderColor: colors.line, overflow: 'hidden' }}
      >
        <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 44, backgroundColor: '#C9D8DD' }} />
        <View pointerEvents="none" style={{ position: 'absolute', left: '8%', top: '12%', width: 70, height: 48, borderRadius: 10, backgroundColor: '#D3DDBF' }} />
        {[18, 46, 74].map((p) => (
          <View key={'r' + p} pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: `${p}%`, height: 7, backgroundColor: '#fff', opacity: 0.85 }} />
        ))}
        {[22, 52, 80].map((p) => (
          <View key={'c' + p} pointerEvents="none" style={{ position: 'absolute', top: 0, bottom: 0, left: `${p}%`, width: 6, backgroundColor: '#fff', opacity: 0.85 }} />
        ))}
        <View pointerEvents="none" style={{ position: 'absolute', left: -20, right: -20, top: '58%', height: 10, backgroundColor: '#F4D675', transform: [{ rotate: '-8deg' }] }} />
        <View pointerEvents="none" style={{ position: 'absolute', right: 10, bottom: 12 }}>
          <Text style={{ fontFamily: fonts.bodyMed, fontSize: 11, color: '#6b7f86' }}>Atlantic Ocean</Text>
        </View>
        <View pointerEvents="none" style={{ position: 'absolute', left: 12, top: '62%' }}>
          <Text style={{ fontFamily: fonts.bodyMed, fontSize: 10, color: '#8a6d12' }}>Lekki–Epe Expressway</Text>
        </View>
        {xy && (
          <View pointerEvents="none" style={{ position: 'absolute', left: xy.x - 14, top: xy.y - 34, alignItems: 'center' }}>
            <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: colors.rust, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#fff' }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' }} />
            </View>
            <View style={{ width: 3, height: 8, backgroundColor: colors.rust }} />
          </View>
        )}
        {!xy && (
          <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ backgroundColor: '#fff', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 999, borderWidth: 1, borderColor: colors.line }}>
              <Text style={{ fontFamily: fonts.bodyMed, fontSize: 13, color: colors.ink }}>Tap the map to drop a pin</Text>
            </View>
          </View>
        )}
      </View>
      {pin && <Muted style={{ marginTop: 8 }}>📍 {pin.lat}° N, {pin.lng}° E</Muted>}
    </View>
  );
}

/** Decorative QR-style code, deterministic for a given value (mock; not a scannable QR). */
export function Qr({ value, size = 168 }: { value: string; size?: number }) {
  const n = 21;
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) { h ^= value.charCodeAt(i); h = Math.imul(h, 16777619); }
  const rnd = () => { h = (h + 0x6d2b79f5) | 0; let t = Math.imul(h ^ (h >>> 15), 1 | h); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const finder = (r: number, c: number) => {
    const inBox = (r0: number, c0: number) => r >= r0 && r < r0 + 7 && c >= c0 && c < c0 + 7;
    for (const [r0, c0] of [[0, 0], [0, n - 7], [n - 7, 0]]) {
      if (inBox(r0, c0)) {
        const rr = r - r0, cc = c - c0;
        return rr === 0 || rr === 6 || cc === 0 || cc === 6 || (rr >= 2 && rr <= 4 && cc >= 2 && cc <= 4);
      }
    }
    return null;
  };
  const cell = size / n;
  const rows = Array.from({ length: n }, (_, r) =>
    Array.from({ length: n }, (_, c) => {
      const f = finder(r, c);
      return f === null ? rnd() > 0.52 : f;
    }),
  );
  return (
    <View style={{ width: size, height: size, backgroundColor: '#fff', padding: 0 }}>
      {rows.map((row, r) => (
        <View key={r} style={{ flexDirection: 'row' }}>
          {row.map((on, c) => (
            <View key={c} style={{ width: cell, height: cell, backgroundColor: on ? colors.ink : '#fff' }} />
          ))}
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
