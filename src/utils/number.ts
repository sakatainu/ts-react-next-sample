import Decimal from 'decimal.js';
import { round } from 'mathjs';

export const decimalAdd = (arg1: number, arg2: number) =>
  Decimal.add(arg1, arg2).toNumber();

export const decimalSub = (arg1: number, arg2: number) =>
  Decimal.sub(arg1, arg2).toNumber();

export const calcParentLine = (arg: number[]) => {
  const fixed = arg.reduce<number[]>((r, v, i) => {
    if (v) {
      r.push(v);
      return r;
    }

    r.push(r[i - 1]);
    return r;
  }, []);

  return fixed.map((v, i, arr) => {
    const past = arr[0];
    const roc = ((v - past) / past) * 100;
    return round(roc, 1);
  });
};
