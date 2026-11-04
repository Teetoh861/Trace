import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts } from '../theme';
import { Card, H1, Muted, Row } from '../ui';
import { useStore } from '../store';

export function Profile() {
  const { cases } = useStore();
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.cream }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <H1 style={{ marginBottom: 16 }}>Profile</H1>
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: colors.rust, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#fff', fontFamily: fonts.display, fontSize: 20 }}>T</Text>
            </View>
            <View>
              <Text style={{ fontFamily: fonts.displayMed, fontSize: 18, color: colors.ink }}>Trace user</Text>
              <Muted>{cases.length} case{cases.length === 1 ? '' : 's'}</Muted>
            </View>
          </View>
        </Card>
        <Card style={{ marginTop: 14 }}>
          <Row left="Notifications" right="On" />
          <Row left="Payment method" right="Card ····4417" />
          <Row left="Help & support" right="›" />
        </Card>
        <Muted style={{ marginTop: 20 }}>
          TRACE reports state what the records show in the sources searched. They are not legal advice or a guarantee of title.
        </Muted>
      </ScrollView>
    </SafeAreaView>
  );
}
