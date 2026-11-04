import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts } from '../theme';
import { Body, Button, Card, Eyebrow, GradePill, H1, H2, Muted } from '../ui';
import { useStore } from '../store';
import { naira } from '../data';

export function Home({ navigation }: any) {
  const { cases, resetDraft, unread } = useStore();
  const active = cases.filter((c) => c.progress < 6);
  const latest = cases.filter((c) => c.progress >= 6)[0];
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.cream }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <Text style={{ fontFamily: fonts.display, fontSize: 18, color: colors.rust, letterSpacing: 2 }}>TRACE</Text>
          <Pressable onPress={() => navigation.navigate('Notifications')} accessibilityLabel="Notifications" style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 17 }}>🔔</Text>
            {unread && <View style={{ position: 'absolute', top: 8, right: 9, width: 10, height: 10, borderRadius: 5, backgroundColor: colors.rust, borderWidth: 2, borderColor: '#fff' }} />}
          </Pressable>
        </View>
        <Muted>{greet}</Muted>
        <H1 style={{ marginTop: 4 }}>Know what the records say before you act on a property.</H1>
        <Muted style={{ marginTop: 8, marginBottom: 20 }}>
          Describe a property and we investigate title, survey and encumbrances, then give you a graded report.
        </Muted>
        <Button title="Start a new review" onPress={() => { resetDraft(); navigation.navigate('Describe'); }} />

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
          <Pressable onPress={() => navigation.navigate('Verify')} style={{ flex: 1 }}>
            <Card style={{ padding: 14 }}>
              <Text style={{ fontSize: 18 }}>🔍</Text>
              <Text style={{ fontFamily: fonts.bodyBold, fontSize: 14, color: colors.ink, marginTop: 6 }}>Verify a report</Text>
              <Muted>Check an ID is genuine</Muted>
            </Card>
          </Pressable>
          <Pressable onPress={() => navigation.navigate('Help')} style={{ flex: 1 }}>
            <Card style={{ padding: 14 }}>
              <Text style={{ fontSize: 18 }}>💬</Text>
              <Text style={{ fontFamily: fonts.bodyBold, fontSize: 14, color: colors.ink, marginTop: 6 }}>Help &amp; support</Text>
              <Muted>FAQ and contact</Muted>
            </Card>
          </Pressable>
        </View>

        <View style={{ marginTop: 28 }}>
          <Eyebrow>In progress</Eyebrow>
          {active.length === 0 ? (
            <Muted style={{ marginTop: 8 }}>No active investigations.</Muted>
          ) : (
            active.map((c) => (
              <Card key={c.id} style={{ marginTop: 10 }} onPress={() => navigation.navigate('Case', { id: c.id })}>
                <H2>{c.address}</H2>
                <Muted style={{ marginTop: 2 }}>{c.id} · step {c.progress} of 6 · {naira(c.total)}</Muted>
                <View style={{ height: 6, backgroundColor: colors.line, borderRadius: 3, marginTop: 12 }}>
                  <View style={{ width: `${(c.progress / 6) * 100}%`, height: 6, backgroundColor: colors.rust, borderRadius: 3 }} />
                </View>
              </Card>
            ))
          )}
        </View>

        {latest && (
          <View style={{ marginTop: 28 }}>
            <Eyebrow>Latest report</Eyebrow>
            <Card style={{ marginTop: 10 }} onPress={() => navigation.navigate('Report', { id: latest.id })}>
              <H2>{latest.address}</H2>
              <Muted style={{ marginTop: 2, marginBottom: 10 }}>{latest.id} · {naira(latest.total)}</Muted>
              <GradePill grade={latest.overall} />
              <Body style={{ marginTop: 10 }}>{latest.conclusion}</Body>
            </Card>
          </View>
        )}

        <Pressable onPress={() => navigation.navigate('Grades')} style={{ marginTop: 28 }}>
          <Card style={{ backgroundColor: colors.rust, borderColor: colors.rust }}>
            <Text style={{ fontFamily: fonts.displayMed, fontSize: 17, color: '#fff' }}>How findings are graded</Text>
            <Text style={{ fontFamily: fonts.body, fontSize: 13, color: '#F7D9CF', marginTop: 4 }}>
              Five grades that say how certain each finding is.
            </Text>
          </Card>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
