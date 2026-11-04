import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme';
import { Card, GradePill, H1, H2, Muted } from '../ui';
import { useStore } from '../store';
import { naira } from '../data';

export function Cases({ navigation }: any) {
  const { cases } = useStore();
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.cream }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <H1 style={{ marginBottom: 16 }}>Your cases</H1>
        {cases.map((c) => {
          const done = c.progress >= 6;
          return (
            <Card
              key={c.id}
              style={{ marginBottom: 12 }}
              onPress={() => navigation.navigate(done ? 'Report' : 'Case', { id: c.id })}
            >
              <H2>{c.address}</H2>
              <Muted style={{ marginTop: 2, marginBottom: 10 }}>
                {c.id} · {c.type} · {c.createdAt} · {naira(c.total)}
              </Muted>
              {done ? <GradePill grade={c.overall} /> : <Muted>In progress · step {c.progress} of 6</Muted>}
            </Card>
          );
        })}
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
