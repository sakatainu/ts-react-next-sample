import Color from 'color';
import dayjs from 'dayjs';
import Decimal from 'decimal.js';
import hash from 'string-hash';

export * from './number';

export const getRelativeTime = (
  value: Date | string | undefined,
  format = 'LL'
) => {
  if (!value) {
    return null;
  }

  const daysValue = dayjs.isDayjs(value) ? value : dayjs(value);

  if (daysValue.isValid()) {
    if (daysValue.isBefore(dayjs().add(-1, 'day'), 'day')) {
      return daysValue.format(format);
    }

    return daysValue.fromNow();
  }

  return null;
};

export const uniqueId = ((length = 36) => {
  let count = 0;

  return () => {
    count += 1;
    return hash(count.toString()).toString(length);
  };
})();

// 参考: https://github.com/mui/material-ui/blob/v5.9.3/docs/data/material/components/avatars/BackgroundLetterAvatars.tsx
export const getAvatarColor = (value: string) => {
  let hashNum = 0;

  /* eslint-disable no-bitwise */
  for (let i = 0; i < value.length; i += 1) {
    hashNum = value.charCodeAt(i) + ((hashNum << 5) - hashNum);
  }

  let color = '#';

  for (let i = 0; i < 3; i += 1) {
    const colorValue = (hashNum >> (i * 8)) & 0xff;
    color += `00${colorValue.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
};

export const removeLegalType = (value: string): string => {
  const excludes = ['（株）', '\\(株\\)', '株式会社'];
  const reg = new RegExp(excludes.join('|'), 'g');
  return value.replace(reg, '');
};

export const getAvatarShortLabel = (value: string): string =>
  removeLegalType(value).trim().slice(0, 2);

export const getFontColor = (colorValue: string) => {
  const color = Color(colorValue);

  return color.isLight() ? 'rgba(0, 0, 0, 0.87)' : 'white';
};

export const toDateString = (value: Date, template = 'L') =>
  dayjs(value).format(template);

export type Order = 'asc' | 'desc';

export const numberCompare = (order: Order) => (a: unknown, b: unknown) => {
  const value1 = Number(a);
  const value2 = Number(b);

  if (Number.isNaN(value1) && Number.isNaN(value2)) return 0;
  if (Number.isNaN(value1) && !Number.isNaN(value2)) return 1;
  if (!Number.isNaN(value1) && Number.isNaN(value2)) return -1;
  return Decimal.sub(value1, value2)
    .mul(order === 'asc' ? 1 : -1)
    .toNumber();
};

export const distinct = <T>(value: T[]): T[] => Array.from(new Set(value));
