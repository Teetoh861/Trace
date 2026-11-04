import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Screen } from './Layout';
import { Body, Button, Card, Chip, Field, H1, MapPicker, Muted, Progress, Row } from '../ui';
import { useStore } from '../store';
import { CHECKS, DOC_TYPES, PAYMENT_OPTIONS, PROPERTY_TYPES, naira } from '../data';
import { colors, fonts } from '../theme';
import { Pressable, Text } from 'react-native';
import { P } from '../nav';

export function Describe({ navigation }: P<'Describe'>) {
  const { draft, setDraft } = useStore();
  const ok = draft.address.trim().length > 3;
  return (
    <Screen footer={<Button title="Continue" disabled={!ok} onPress={() => navigation.navigate('Docs')} />}>
      <Progress step={1} total={4} />
      <H1 style={{ marginBottom: 6 }}>Describe the property</H1>
      <Muted style={{ marginBottom: 20 }}>The more precisely you describe it, the faster the search.</Muted>
      <Field label="Address or location" placeholder="e.g. Plot 14, Okun Ajah, Lagos" value={draft.address} onChangeText={(address) => setDraft({ address })} />
      <Muted style={{ marginBottom: 8 }}>Pin the location (optional)</Muted>
      <View style={{ marginBottom: 18 }}>
        <MapPicker pin={draft.pin} onPick={(pin) => setDraft({ pin })} />
      </View>
      <Muted style={{ marginBottom: 8 }}>Property type</Muted>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 }}>
        {PROPERTY_TYPES.map((t) => (
          <Chip key={t} label={t} active={draft.type === t} onPress={() => setDraft({ type: t })} />
        ))}
      </View>
      <Field label="Approximate size (optional)" placeholder="e.g. 600 sqm" value={draft.size} onChangeText={(size) => setDraft({ size })} />
    </Screen>
  );
}

export function Docs({ navigation }: P<'Docs'>) {
  const { draft, setDraft } = useStore();
  const toggle = (d: string) => {
    if (draft.docs.includes(d)) {
      const { [d]: _removed, ...rest } = draft.files;
      setDraft({ docs: draft.docs.filter((x) => x !== d), files: rest });
    } else {
      setDraft({ docs: [...draft.docs, d] });
    }
  };
  const attach = async (d: string) => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'], copyToCacheDirectory: false,
      });
      if (!res.canceled && res.assets?.[0]) setDraft({ files: { ...draft.files, [d]: res.assets[0].name } });
    } catch {
      /* picker unavailable: leave the document unattached */
    }
  };
  return (
    <Screen footer={<Button title="Continue" onPress={() => navigation.navigate('Scope')} />}>
      <Progress step={2} total={4} />
      <H1 style={{ marginBottom: 6 }}>What documents do you have?</H1>
      <Muted style={{ marginBottom: 20 }}>Select what the seller gave you, then attach a scan or photo. You can proceed without any.</Muted>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 }}>
        {DOC_TYPES.map((d) => (
          <Chip key={d} label={d} active={draft.docs.includes(d)} onPress={() => toggle(d)} />
        ))}
      </View>
      {draft.docs.length > 0 && (
        <View style={{ marginBottom: 16 }}>
          <Muted style={{ marginBottom: 8 }}>Attach your documents (PDF or image)</Muted>
          {draft.docs.map((d) => (
            <Card key={d} style={{ marginBottom: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={{ fontFamily: fonts.bodyMed, fontSize: 14, color: colors.ink }}>{d}</Text>
                <Muted>{draft.files[d] ? '✓ ' + draft.files[d] : 'No file attached'}</Muted>
              </View>
              <Pressable onPress={() => attach(d)}>
                <Text style={{ fontFamily: fonts.bodyBold, fontSize: 14, color: colors.rust }}>
                  {draft.files[d] ? 'Replace' : 'Attach'}
                </Text>
              </Pressable>
            </Card>
          ))}
        </View>
      )}
      <Field label="Notes for the investigator (optional)" multiline placeholder="Anything unusual, names of sellers, agent details…" value={draft.notes} onChangeText={(notes) => setDraft({ notes })} />
    </Screen>
  );
}

export function Scope({ navigation }: P<'Scope'>) {
  const { draft, setDraft } = useStore();
  const toggle = (id: any) =>
    setDraft({ checks: draft.checks.includes(id) ? draft.checks.filter((x) => x !== id) : [...draft.checks, id] });
  return (
    <Screen footer={<Button title="Review request" disabled={!draft.checks.length} onPress={() => navigation.navigate('Review')} />}>
      <Progress step={3} total={4} />
      <H1 style={{ marginBottom: 6 }}>What should we check?</H1>
      <Muted style={{ marginBottom: 20 }}>Choose the checks that matter. The quote updates as you go.</Muted>
      {CHECKS.map((c) => {
        const on = draft.checks.includes(c.id);
        return (
          <Pressable key={c.id} onPress={() => toggle(c.id)} style={{ marginBottom: 12 }}>
            <Card style={{ borderColor: on ? colors.rust : colors.line, borderWidth: on ? 2 : 1 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontFamily: fonts.displayMed, fontSize: 17, color: colors.ink, flex: 1 }}>{c.title}</Text>
                <Text style={{ fontFamily: fonts.bodyBold, color: colors.rust }}>{naira(c.price)}</Text>
              </View>
              <Muted style={{ marginTop: 4 }}>{c.desc}</Muted>
              <Muted style={{ marginTop: 6 }}>~{c.days} working days</Muted>
            </Card>
          </Pressable>
        );
      })}
    </Screen>
  );
}

export function Review({ navigation }: P<'Review'>) {
  const { draft } = useStore();
  return (
    <Screen footer={<Button title="Get my quote" onPress={() => navigation.navigate('Quote')} />}>
      <Progress step={4} total={4} />
      <H1 style={{ marginBottom: 16 }}>Review your request</H1>
      <Card>
        <Row left="Property" right={draft.address} />
        <Row left="Location" right={draft.pin ? `${draft.pin.lat}, ${draft.pin.lng}` : 'Not pinned'} />
        <Row left="Type" right={draft.type} />
        <Row left="Size" right={draft.size || '—'} />
        <Row left="Documents" right={`${draft.docs.length} (${Object.keys(draft.files).length} attached)`} />
        <Row left="Checks" right={String(draft.checks.length)} />
      </Card>
      {draft.notes ? (
        <Card style={{ marginTop: 12 }}>
          <Muted>Notes</Muted>
          <Body style={{ marginTop: 4 }}>{draft.notes}</Body>
        </Card>
      ) : null}
    </Screen>
  );
}

export function Quote({ navigation }: P<'Quote'>) {
  const { quote } = useStore();
  const q = quote();
  const valid = new Date(Date.now() + 48 * 3600 * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  return (
    <Screen footer={<Button title={`Accept & pay ${naira(q.total)}`} onPress={() => navigation.navigate('Payment')} />}>
      <H1 style={{ marginBottom: 6 }}>Your quote</H1>
      <Muted style={{ marginBottom: 20 }}>A fixed price, a clear scope and a validity date.</Muted>
      <Card>
        <Muted style={{ marginBottom: 6 }}>1 · Total fee</Muted>
        {q.lines.map((l) => (
          <Row key={l.title} left={l.title} right={naira(l.price)} />
        ))}
        <Row left="Service fee (5%)" right={naira(q.fee)} />
        <View style={{ height: 1, backgroundColor: colors.line, marginVertical: 8 }} />
        <Row left="Total" right={naira(q.total)} bold />
      </Card>
      <Card style={{ marginTop: 12 }}>
        <Muted style={{ marginBottom: 6 }}>2 · Explicit scope</Muted>
        <Body>{q.lines.length} check{q.lines.length === 1 ? '' : 's'} covered. Anything not listed is outside this quote.</Body>
      </Card>
      <Card style={{ marginTop: 12 }}>
        <Muted style={{ marginBottom: 6 }}>3 · Validity</Muted>
        <Body>Valid until {valid}. Estimated delivery in {q.days} working days after payment.</Body>
      </Card>
    </Screen>
  );
}

export function Payment({ navigation }: P<'Payment'>) {
  const { quote, submitCase } = useStore();
  const [sel, setSel] = React.useState('full');
  const q = quote();
  const [busy, setBusy] = React.useState(false);
  const pay = () => {
    setBusy(true);
    setTimeout(() => {
      const id = submitCase(true);
      navigation.reset({
        index: 1,
        routes: [{ name: 'Tabs' }, { name: 'Receipt', params: { id } }],
      });
    }, 1800);
  };
  if (busy) {
    return (
      <Screen scroll={false} style={{ alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.rust} />
        <H1 style={{ marginTop: 24, textAlign: 'center' }}>Processing payment…</H1>
        <Muted style={{ marginTop: 8, textAlign: 'center' }}>Please do not close this page.</Muted>
      </Screen>
    );
  }
  return (
    <Screen footer={<Button title={`Pay ${naira(sel === 'split' ? Math.round(q.total * 0.6) : q.total)}`} onPress={pay} />}>
      <H1 style={{ marginBottom: 6 }}>Payment</H1>
      <Muted style={{ marginBottom: 20 }}>Choose how you want to pay. Prototype: no real charge is made.</Muted>
      {PAYMENT_OPTIONS.map((o) => (
        <Pressable key={o.id} onPress={() => setSel(o.id)} style={{ marginBottom: 12 }}>
          <Card style={{ borderColor: sel === o.id ? colors.rust : colors.line, borderWidth: sel === o.id ? 2 : 1 }}>
            <Text style={{ fontFamily: fonts.displayMed, fontSize: 17, color: colors.ink }}>{o.title}</Text>
            <Muted style={{ marginTop: 4 }}>{o.desc}</Muted>
          </Card>
        </Pressable>
      ))}
    </Screen>
  );
}
