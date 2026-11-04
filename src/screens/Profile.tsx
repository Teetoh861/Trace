import React from 'react';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts } from '../theme';
import { Card, H1, Muted, Tag } from '../ui';
import { useStore } from '../store';

function Line({ label, right, onPress, last }: { label: string; right: React.ReactNode; onPress?: () => void; last?: boolean }) {
  const C: any = onPress ? Pressable : View;
  return (
    <C onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 13, borderBottomWidth: last ? 0 : 1, borderBottomColor: colors.line }}>
      <Text style={{ fontFamily: fonts.body, fontSize: 15, color: colors.ink }}>{label}</Text>
      {typeof right === 'string' ? <Text style={{ fontFamily: fonts.bodyMed, fontSize: 15, color: colors.muted }}>{right}</Text> : right}
    </C>
  );
}

export function Profile({ navigation }: any) {
  const { cases, phone, prefs, setPref, signOut, reset } = useStore();
  const done = cases.filter((c) => c.progress >= 6).length;
  const track = { true: colors.rust, false: colors.line };
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.cream }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <H1 style={{ marginBottom: 16 }}>Profile</H1>
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: colors.rust, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#fff', fontFamily: fonts.display, fontSize: 22 }}>T</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: fonts.displayMed, fontSize: 18, color: colors.ink }}>Trace user</Text>
              <Muted>{phone}</Muted>
              <View style={{ marginTop: 6 }}><Tag label="✓ Identity verified" color={colors.green} /></View>
            </View>
          </View>
          <View style={{ flexDirection: 'row', marginTop: 16, gap: 10 }}>
            <View style={{ flex: 1, backgroundColor: colors.cream, borderRadius: 12, padding: 12 }}>
              <Text style={{ fontFamily: fonts.display, fontSize: 22, color: colors.ink }}>{cases.length}</Text>
              <Muted>Cases</Muted>
            </View>
            <View style={{ flex: 1, backgroundColor: colors.cream, borderRadius: 12, padding: 12 }}>
              <Text style={{ fontFamily: fonts.display, fontSize: 22, color: colors.ink }}>{done}</Text>
              <Muted>Reports</Muted>
            </View>
          </View>
        </Card>

        <Card style={{ marginTop: 14, paddingVertical: 4 }}>
          <Line label="Push notifications" right={<Switch value={prefs.notifications} onValueChange={(v) => setPref('notifications', v)} trackColor={track} thumbColor="#fff" />} />
          <Line label="WhatsApp updates" right={<Switch value={prefs.whatsapp} onValueChange={(v) => setPref('whatsapp', v)} trackColor={track} thumbColor="#fff" />} />
          <Line label="Payment method" right="Card ····4417" />
          <Line label="Verify a report" right="›" onPress={() => navigation.navigate('Verify')} />
          <Line label="Help & support" right="›" onPress={() => navigation.navigate('Help')} last />
        </Card>

        <Pressable onPress={signOut} style={{ marginTop: 20, alignItems: 'center', padding: 12 }}>
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: 15, color: colors.red }}>Sign out</Text>
        </Pressable>
        <Pressable onPress={reset} style={{ alignItems: 'center', padding: 8 }}>
          <Text style={{ fontFamily: fonts.bodyMed, fontSize: 13, color: colors.muted }}>Reset demo data</Text>
        </Pressable>
        <Muted style={{ marginTop: 14 }}>
          TRACE reports state what the records show in the sources searched. They are not legal advice or a guarantee of title.
        </Muted>
      </ScrollView>
    </SafeAreaView>
  );
}
