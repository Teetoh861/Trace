import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootParams = {
  Tabs: undefined;
  Describe: undefined;
  Docs: undefined;
  Scope: undefined;
  Review: undefined;
  Quote: undefined;
  Payment: undefined;
  Case: { id: string };
  Report: { id: string };
  Finding: { id: string; fid: string };
  Grades: undefined;
};

export type P<K extends keyof RootParams> = NativeStackScreenProps<RootParams, K>;
