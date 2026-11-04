import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Screen } from './Layout';
import { Body, Button, Card, Eyebrow, GradePill, H1, H2, Muted, PhotoStrip, Row, SurveyMap, Tag } from '../ui';
import { useStore } from '../store';
import { GRADES, GradeKey, INVESTIGATION_STEPS, SITE_PHOTOS, naira } from '../data';
import { colors, fonts } from '../theme';
import { P } from '../nav';

export function CaseScreen({ route, navigation }: P<'Case'>) {
  const { cases, advance } = useStore();
  const c = cases.find((x) => x.id === route.params.id);
  if (!c) return <Screen><Body>Case not found.</Body></Screen>;
  const done = c.progress >= 6;
  return (
    <Screen
      footer={
        done ? (
          <Button title="View report" onPress={() => navigation.navigate('Report', { id: c.id })} />
        ) : (
          <Button title="Simulate next update" variant="light" onPress={() => advance(c.id)} />
        )
      }
    >
      <Eyebrow>{c.id}</Eyebrow>
      <H1 style={{ marginTop: 4, marginBottom: 4 }}>{c.address}</H1>
      <Muted style={{ marginBottom: 20 }}>
        {c.type} · {c.size} · {naira(c.total)} {c.paid ? '· Paid' : ''}
      </Muted>
      {INVESTIGATION_STEPS.map((s, i) => {
        const state = i < c.progress ? 'done' : i === c.progress ? 'now' : 'todo';
        return (
          <View key={s.id} style={{ flexDirection: 'row', marginBottom: 4 }}>
            <View style={{ alignItems: 'center', marginRight: 14 }}>
              <View
                style={{
                  width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center',
                  backgroundColor: state === 'done' ? colors.rust : state === 'now' ? colors.yellow : colors.line,
                }}
              >
                <Text style={{ color: state === 'done' ? '#fff' : colors.ink, fontFamily: fonts.bodyBold, fontSize: 12 }}>
                  {state === 'done' ? '✓' : i + 1}
                </Text>
              </View>
              {i < INVESTIGATION_STEPS.length - 1 && (
                <View style={{ width: 2, flex: 1, minHeight: 28, backgroundColor: i < c.progress - 1 ? colors.rust : colors.line }} />
              )}
            </View>
            <View style={{ flex: 1, paddingBottom: 16 }}>
              <Text style={{ fontFamily: fonts.bodyBold, fontSize: 15, color: state === 'todo' ? colors.muted : colors.ink }}>{s.title}</Text>
              <Muted>{s.detail}</Muted>
            </View>
          </View>
        );
      })}
    </Screen>
  );
}

export function Report({ route, navigation }: P<'Report'>) {
  const { cases } = useStore();
  const c = cases.find((x) => x.id === route.params.id);
  if (!c) return <Screen><Body>Report not found.</Body></Screen>;
  return (
    <Screen>
      <Eyebrow>Report · {c.id}</Eyebrow>
      <H1 style={{ marginTop: 4, marginBottom: 14 }}>{c.address}</H1>

      <Card style={{ backgroundColor: GRADES[c.overall].color, borderColor: GRADES[c.overall].color }}>
        <Text style={{ fontFamily: fonts.bodyBold, fontSize: 12, color: '#fff', opacity: 0.85, letterSpacing: 1 }}>CONCLUSION</Text>
        <Text style={{ fontFamily: fonts.displayMed, fontSize: 19, color: '#fff', marginTop: 6, lineHeight: 25 }}>{c.conclusion}</Text>
      </Card>

      <View style={{ marginTop: 24 }}>
        <H2 style={{ marginBottom: 10 }}>Evidence</H2>
        {c.findings.map((f) => (
          <Card key={f.id} style={{ marginBottom: 10 }} onPress={() => navigation.navigate('Finding', { id: c.id, fid: f.id })}>
            <Text style={{ fontFamily: fonts.displayMed, fontSize: 16, color: colors.ink, marginBottom: 6 }}>{f.title}</Text>
            <GradePill grade={f.grade} />
            <Muted style={{ marginTop: 8 }}>{f.summary}</Muted>
          </Card>
        ))}
      </View>
      <Pressable onPress={() => navigation.navigate('Grades')}>
        <Muted style={{ marginTop: 8, color: colors.rust, fontFamily: fonts.bodyBold }}>How grades work ›</Muted>
      </Pressable>
      <Muted style={{ marginTop: 16 }}>
        This report states what the records show in the sources searched. It is not legal advice or a guarantee of title.
      </Muted>
    </Screen>
  );
}

export function FindingScreen({ route }: P<'Finding'>) {
  const { cases } = useStore();
  const f = cases.find((x) => x.id === route.params.id)?.findings.find((x) => x.id === route.params.fid);
  if (!f) return <Screen><Body>Finding not found.</Body></Screen>;
  const g = GRADES[f.grade];
  return (
    <Screen>
      <H1 style={{ marginBottom: 12 }}>{f.title}</H1>
      <GradePill grade={f.grade} />
      {f.grade === 'discrepancy' && (
        <View style={{ marginTop: 10 }}>
          <Tag label="Title in dispute" />
        </View>
      )}
      {f.id === 'f-survey' && (
        <View style={{ marginTop: 16 }}>
          <SurveyMap />
        </View>
      )}
      {f.id === 'f-phy' && (
        <View style={{ marginTop: 16 }}>
          <PhotoStrip photos={SITE_PHOTOS} />
        </View>
      )}
      <Body style={{ marginTop: 16 }}>{f.detail}</Body>
      <Card style={{ marginTop: 20 }}>
        <Muted>What this grade means</Muted>
        <Body style={{ marginTop: 4 }}>{g.meaning}</Body>
      </Card>
    </Screen>
  );
}

export function Grades() {
  return (
    <Screen>
      <H1 style={{ marginBottom: 6 }}>Five grades</H1>
      <Muted style={{ marginBottom: 20 }}>Each finding says how certain it is, not just what it is.</Muted>
      {(Object.keys(GRADES) as GradeKey[]).map((k) => (
        <Card key={k} style={{ marginBottom: 10 }}>
          <GradePill grade={k} />
          <Muted style={{ marginTop: 8 }}>{GRADES[k].meaning}</Muted>
        </Card>
      ))}
    </Screen>
  );
}
