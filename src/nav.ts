import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootParams = {
  Welcome: undefined;
  Phone: undefined;
  Otp: { phone: string };
  Tabs: undefined;
  Describe: undefined;
  Docs: undefined;
  Scope: undefined;
  Review: undefined;
  Quote: undefined;
  Payment: undefined;
  Receipt: { id: string };
  Case: { id: string };
  Messages: { id: string };
  Report: { id: string };
  Finding: { id: string; fid: string };
  Verify: { id?: string } | undefined;
  Grades: undefined;
  Notifications: undefined;
  Help: undefined;
};

export type P<K extends keyof RootParams> = NativeStackScreenProps<RootParams, K>;
