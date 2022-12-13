import {
  assertBrandedString,
  DateString,
  EventTypes_Enum,
  UuidString,
  TimestampString,
} from '@/generated/graphql';

export type GroupEventType = `${EventTypes_Enum}`;

export const groupEventTypes = Object.entries(EventTypes_Enum).map(
  ([, v]) => v
);

// TODO: データベースから取得する
export const groupEventTypeMap: Record<GroupEventType, string> = {
  financial_results_briefing: '決算説明会',
  briefing_for_corp: '機関投資家向け説明会',
  briefing_for_individual: '個人投資家向け説明会',
  streaming: '動画配信',
  sns: 'SNS',
  analyst_reports: 'アナリストレポート',
  media_exposure: 'メディアレポート',
  other: 'その他',
};

const typeToEnumMap = Object.fromEntries(
  Object.entries(EventTypes_Enum).map<[GroupEventType, EventTypes_Enum]>(
    ([, v]) => [v, v]
  )
);

export const toEnum = (value: GroupEventType): EventTypes_Enum =>
  typeToEnumMap[value];

export const gqlString = <T extends string>(value: string): T => {
  assertBrandedString<T>(value);
  return value;
};

export const uuidString = (value: string): UuidString =>
  gqlString<UuidString>(value);

export const dateString = (value: string): DateString =>
  gqlString<DateString>(value);

export const timestampString = (value: string): TimestampString =>
  gqlString<TimestampString>(value);

export type GroupStockIssueListId = string;
export type GroupListedStockIssueId = string;
