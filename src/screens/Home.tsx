import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts, radius } from '../theme';
import { Body, Button, Card, Eyebrow, GradePill, H1, H2, Muted } from '../ui';
import { useStore } from '../store';
import { GRADES, naira } from '../data';

export function Home({ navigation }: any) {
  const { cases, resetDraft } = useStore();
  const active = cases.filter((c) => c.progress < 6);
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.cream }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <Text style={{ fontFamily: fonts.display, fontSize: 18, color: colors.rust, letterSpacing: 2, marginBottom: 18 }}>TRACE</Text>
        <H1>Know what the records say before you act on a property.</H1>
        <Muted style={{ marginTop: 8, marginBottom: 20 }}>
          Describe a property and we investigate title, survey and encumbrances, then give you a graded report.
        </Muted>
        <Button
          title="Start a new review"
          onPress={() => { resetDraft(); navigation.navigate('Describe'); }}
        />

        <View style={{ marginTop: 28 }}>
          <Eyebrow>In progress</Eyebrow>
          {active.length === 0 ? (
            <Muted style={{ marginTop: 8 }}>No active investigations.</Muted>
          ) : (
            active.map((c) => (
              <Card key={c.id} style={{ marginTop: 10 }} onPress={() => navigation.navigate('Case', { id: c.id })}>
                <H2>{c.address}</H2>
                <Muted style={{ marginTop: 2 }}>{c.id} · step {c.progress} of 6</Muted>
                <View style={{ height: 6, backgroundColor: colors.line, borderRadius: 3, marginTop: 12 }}>
                  <View style={{ width: `${(c.progress / 6) * 100}%`, height: 6, backgroundColor: colors.rust, borderRadius: 3 }} />
                </View>
              </Card>
            ))
          )}
        </View>

        <View style={{ marginTop: 28 }}>
          <Eyebrow>Latest report</Eyebrow>
          {cases.filter((c) => c.progress >= 6).slice(0, 1).map((c) => (
            <Card key={c.id} style={{ marginTop: 10 }} onPress={() => navigation.navigate('Report', { id: c.id })}>
              <H2>{c.address}</H2>
              <Muted style={{ marginTop: 2, marginBottom: 10 }}>{c.id} · {naira(c.total)}</Muted>
              <GradePill grade={c.overall} />
              <Body style={{ marginTop: 10 }}>{c.conclusion}</Body>
            </Card>
          ))}
        </View>

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
