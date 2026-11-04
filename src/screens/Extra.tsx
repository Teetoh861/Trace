import React from 'react';
import { Linking, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Screen } from './Layout';
import { Body, Button, Card, Eyebrow, Field, GradePill, H1, H2, Muted, Qr, Row } from '../ui';
import { useStore } from '../store';
import { NOTIFICATIONS, naira } from '../data';
import { colors, fonts, radius } from '../theme';
import { P } from '../nav';

/* ---------- Sign in ---------- */

export function Welcome({ navigation }: P<'Welcome'>) {
  const { signIn } = useStore();
  const points = [
    ['Describe a property', 'Pin it, attach the seller’s documents, pick the checks.'],
    ['We investigate', 'Registry, survey, litigation and a site visit, step by step.'],
    ['Read a graded report', 'Every finding says how certain it is.'],
  ];
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.rust }}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 48, flexGrow: 1 }}>
        <Text style={{ fontFamily: fonts.display, fontSize: 20, color: '#fff', letterSpacing: 6 }}>TRACE</Text>
        <Text style={{ fontFamily: fonts.display, fontSize: 36, lineHeight: 40, color: '#fff', marginTop: 40 }}>
          Know what the records say before you act on a property.
        </Text>
        <View style={{ marginTop: 32 }}>
          {points.map(([t, d], i) => (
            <View key={t} style={{ flexDirection: 'row', marginBottom: 18 }}>
              <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
                <Text style={{ fontFamily: fonts.bodyBold, color: colors.rust }}>{i + 1}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: fonts.bodyBold, fontSize: 16, color: '#fff' }}>{t}</Text>
                <Text style={{ fontFamily: fonts.body, fontSize: 14, color: '#F7D9CF', marginTop: 2 }}>{d}</Text>
              </View>
            </View>
          ))}
        </View>
        <View style={{ flex: 1, minHeight: 24 }} />
        <Button title="Get started" variant="light" onPress={() => navigation.navigate('Phone')} />
        <Pressable onPress={() => signIn('+234 803 555 0142')} style={{ alignItems: 'center', marginTop: 16, padding: 8 }}>
          <Text style={{ fontFamily: fonts.bodyBold, color: '#fff', fontSize: 15 }}>Continue as demo user</Text>
        </Pressable>
        <Text style={{ fontFamily: fonts.body, fontSize: 12, color: '#F7D9CF', textAlign: 'center', marginTop: 10 }}>
          Concept prototype. Demo data only.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

export function Phone({ navigation }: P<'Phone'>) {
  const [phone, setPhone] = React.useState('+234 803 555 0142');
  const ok = phone.replace(/\D/g, '').length >= 10;
  return (
    <Screen footer={<Button title="Send code" disabled={!ok} onPress={() => navigation.navigate('Otp', { phone })} />}>
      <H1 style={{ marginBottom: 6 }}>Your phone number</H1>
      <Muted style={{ marginBottom: 20 }}>We will text you a 6-digit code. Case updates are sent to this number.</Muted>
      <Field label="Phone number" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
      <Muted>By continuing you agree to the Terms and the Privacy Notice.</Muted>
    </Screen>
  );
}

export function Otp({ route }: P<'Otp'>) {
  const { signIn } = useStore();
  const [code, setCode] = React.useState('');
  const [secs, setSecs] = React.useState(30);
  React.useEffect(() => {
    if (secs <= 0) return;
    const t = setTimeout(() => setSecs((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secs]);
  return (
    <Screen footer={<Button title="Verify and continue" disabled={code.length < 6} onPress={() => signIn(route.params.phone)} />}>
      <H1 style={{ marginBottom: 6 }}>Enter the code</H1>
      <Muted style={{ marginBottom: 20 }}>Sent to {route.params.phone}. For this demo any 6 digits work.</Muted>
      <TextInput
        value={code}
        onChangeText={(t) => setCode(t.replace(/\D/g, '').slice(0, 6))}
        keyboardType="number-pad"
        placeholder="••••••"
        placeholderTextColor="#A39C91"
        maxLength={6}
        style={{
          height: 64, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.line, borderRadius: radius.md,
          fontFamily: fonts.display, fontSize: 30, letterSpacing: 14, textAlign: 'center', color: colors.ink,
        }}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 14 }}>
        <Pressable onPress={() => setCode('123456')}><Text style={{ fontFamily: fonts.bodyBold, color: colors.rust }}>Use demo code</Text></Pressable>
        <Pressable disabled={secs > 0} onPress={() => setSecs(30)}>
          <Text style={{ fontFamily: fonts.bodyMed, color: secs > 0 ? colors.muted : colors.rust }}>
            {secs > 0 ? `Resend in ${secs}s` : 'Resend code'}
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
}

/* ---------- Receipt ---------- */

export function Receipt({ route, navigation }: P<'Receipt'>) {
  const { cases } = useStore();
  const c = cases.find((x) => x.id === route.params.id);
  if (!c) return <Screen><Body>Receipt not found.</Body></Screen>;
  const ref = 'PSK_' + c.id.replace('TR-', '') + 'A7F3';
  return (
    <Screen footer={<Button title="Track my case" onPress={() => navigation.reset({ index: 1, routes: [{ name: 'Tabs' }, { name: 'Case', params: { id: c.id } }] })} />}>
      <View style={{ alignItems: 'center', marginTop: 12, marginBottom: 24 }}>
        <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 36, fontFamily: fonts.bodyBold }}>✓</Text>
        </View>
        <H1 style={{ marginTop: 16, textAlign: 'center' }}>Payment received</H1>
        <Muted style={{ marginTop: 6, textAlign: 'center' }}>Your investigation has started. We will message you at every step.</Muted>
      </View>
      <Card>
        <Row left="Case" right={c.id} />
        <Row left="Property" right={c.address} />
        <Row left="Reference" right={ref} />
        <Row left="Method" right="Card ····4417" />
        <View style={{ height: 1, backgroundColor: colors.line, marginVertical: 8 }} />
        <Row left="Amount paid" right={naira(c.total)} bold />
      </Card>
      <Muted style={{ marginTop: 14 }}>Prototype: no real charge was made. A receipt would also be emailed.</Muted>
    </Screen>
  );
}

/* ---------- Messages ---------- */

export function Messages({ route }: P<'Messages'>) {
  const { messages, sendMessage, cases } = useStore();
  const list = messages[route.params.id] || [];
  const c = cases.find((x) => x.id === route.params.id);
  const [text, setText] = React.useState('');
  const ref = React.useRef<ScrollView>(null);
  React.useEffect(() => { setTimeout(() => ref.current?.scrollToEnd({ animated: true }), 50); }, [list.length]);
  const send = () => {
    const t = text.trim();
    if (!t) return;
    sendMessage(route.params.id, t);
    setText('');
  };
  return (
    <Screen
      scroll={false}
      style={{ padding: 0 }}
      footer={
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TextInput
            value={text}
            onChangeText={setText}
            onSubmitEditing={send}
            placeholder="Message your investigator"
            placeholderTextColor="#A39C91"
            style={{ flex: 1, height: 48, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.line, borderRadius: 24, paddingHorizontal: 16, fontFamily: fonts.body, fontSize: 15, color: colors.ink }}
          />
          <Pressable onPress={send} style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: colors.rust, alignItems: 'center', justifyContent: 'center', opacity: text.trim() ? 1 : 0.4 }}>
            <Text style={{ color: '#fff', fontSize: 20 }}>↑</Text>
          </Pressable>
        </View>
      }
    >
      <ScrollView ref={ref} contentContainerStyle={{ padding: 20 }}>
        <Muted style={{ textAlign: 'center', marginBottom: 14 }}>{c ? c.address : 'Case'} · {route.params.id}</Muted>
        {list.length === 0 && <Muted style={{ textAlign: 'center' }}>No messages yet. Say hello.</Muted>}
        {list.map((m) => (
          <View key={m.id} style={{ alignSelf: m.from === 'me' ? 'flex-end' : 'flex-start', maxWidth: '82%', marginBottom: 10 }}>
            <View style={{ backgroundColor: m.from === 'me' ? colors.rust : '#fff', borderRadius: 18, borderBottomRightRadius: m.from === 'me' ? 4 : 18, borderBottomLeftRadius: m.from === 'me' ? 18 : 4, borderWidth: m.from === 'me' ? 0 : 1, borderColor: colors.line, paddingVertical: 10, paddingHorizontal: 14 }}>
              <Text style={{ fontFamily: fonts.body, fontSize: 15, lineHeight: 21, color: m.from === 'me' ? '#fff' : colors.ink }}>{m.text}</Text>
            </View>
            <Text style={{ fontFamily: fonts.body, fontSize: 11, color: colors.muted, marginTop: 3, alignSelf: m.from === 'me' ? 'flex-end' : 'flex-start' }}>
              {m.from === 'inv' ? 'Ada · ' : ''}{m.at}
            </Text>
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}

/* ---------- Notifications ---------- */

export function Notifications({ navigation }: P<'Notifications'>) {
  const { markRead, cases } = useStore();
  React.useEffect(() => { markRead(); }, []);
  return (
    <Screen>
      <H1 style={{ marginBottom: 16 }}>Notifications</H1>
      {NOTIFICATIONS.map((n) => (
        <Card
          key={n.id}
          style={{ marginBottom: 10 }}
          onPress={n.caseId ? () => {
            const c = cases.find((x) => x.id === n.caseId);
            if (c) navigation.navigate(c.progress >= 6 ? 'Report' : 'Case', { id: c.id });
          } : undefined}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontFamily: fonts.displayMed, fontSize: 16, color: colors.ink }}>{n.title}</Text>
            <Muted>{n.when}</Muted>
          </View>
          <Muted style={{ marginTop: 4 }}>{n.body}</Muted>
        </Card>
      ))}
    </Screen>
  );
}

/* ---------- Verify a report ---------- */

export function Verify({ route }: P<'Verify'>) {
  const { cases } = useStore();
  const [input, setInput] = React.useState(route.params?.id || 'TR-20418');
  const [checked, setChecked] = React.useState<string | null>(route.params?.id || null);
  const found = checked ? cases.find((x) => x.id.toLowerCase() === checked.trim().toLowerCase() && x.progress >= 6) : null;
  return (
    <Screen>
      <H1 style={{ marginBottom: 6 }}>Verify a report</H1>
      <Muted style={{ marginBottom: 20 }}>Every TRACE report has a unique ID. Enter it, or scan the QR code on the PDF, to confirm it is genuine and unaltered.</Muted>
      <Field label="Report ID" autoCapitalize="characters" value={input} onChangeText={setInput} placeholder="e.g. TR-20418" />
      <Button title="Check report" onPress={() => setChecked(input)} />
      {checked !== null && (
        <View style={{ marginTop: 24 }}>
          {found ? (
            <Card style={{ borderColor: colors.green, borderWidth: 2 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: '#fff', fontFamily: fonts.bodyBold }}>✓</Text>
                </View>
                <H2>Authentic report</H2>
              </View>
              <Row left="Report ID" right={found.id} />
              <Row left="Property" right={found.address} />
              <Row left="Issued" right={found.createdAt} />
              <Row left="Reviewed by" right="2 people" />
              <View style={{ marginTop: 8 }}><GradePill grade={found.overall} /></View>
              <View style={{ alignItems: 'center', marginTop: 18 }}>
                <Qr value={found.id} />
                <Muted style={{ marginTop: 8 }}>trace.app/verify/{found.id}</Muted>
              </View>
            </Card>
          ) : (
            <Card style={{ borderColor: colors.red, borderWidth: 2 }}>
              <H2 style={{ color: colors.red }}>No matching report</H2>
              <Muted style={{ marginTop: 6 }}>We could not find a released report with that ID. Check the ID, or be cautious: it may not be a genuine TRACE report.</Muted>
            </Card>
          )}
        </View>
      )}
    </Screen>
  );
}

/* ---------- Help ---------- */

const FAQ: [string, string][] = [
  ['How long does a review take?', 'Between 3 and 6 working days depending on the checks. The quote shows the estimate before you pay.'],
  ['What if you find a discrepancy?', 'The report explains what conflicts, shows the evidence and recommends the next step. You decide what to do.'],
  ['Can I get a refund?', 'If we cannot start the investigation, you are refunded in full. Once a check is complete its fee is not refundable.'],
  ['Is this legal advice?', 'No. A report states what the records show in the sources searched. It is not legal advice or a guarantee of title.'],
];

export function Help() {
  const [open, setOpen] = React.useState<number | null>(0);
  const link = (url: string) => { try { Linking.openURL(url); } catch { /* ignore */ } };
  return (
    <Screen>
      <H1 style={{ marginBottom: 16 }}>Help &amp; support</H1>
      {FAQ.map(([q, a], i) => (
        <Card key={q} style={{ marginBottom: 10 }} onPress={() => setOpen(open === i ? null : i)}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontFamily: fonts.bodyBold, fontSize: 15, color: colors.ink, flex: 1, paddingRight: 10 }}>{q}</Text>
            <Text style={{ color: colors.rust, fontSize: 18 }}>{open === i ? '−' : '+'}</Text>
          </View>
          {open === i && <Muted style={{ marginTop: 8 }}>{a}</Muted>}
        </Card>
      ))}
      <Eyebrow>Contact us</Eyebrow>
      <View style={{ marginTop: 10, gap: 10 }}>
        <Button title="Chat on WhatsApp" variant="light" onPress={() => link('https://wa.me/2348035550142')} />
        <Button title="Email support" variant="ghost" onPress={() => link('mailto:support@trace.example')} />
      </View>
      <Muted style={{ marginTop: 16 }}>Support hours: Monday to Friday, 8am to 6pm WAT. Demo contact details.</Muted>
    </Screen>
  );
}
