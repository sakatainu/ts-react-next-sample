declare namespace NodeJS {
  interface ProcessEnv {
    readonly [key: string]: string | undefined;
  }
}

declare type StockIssueCode = string;
declare type StockIssue = {
  code: StockIssueCode;
  name: string;
  nameEn?: string;
  fiscalMonth?: number;
  homepage?: string;
  avatar?: string;
};

declare type StockPrice = {
  stockIssueCode: StockIssueCode;
  date: Date;
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
  turnover: number;
};

declare type Period = {
  start: Date;
  end: Date;
};

declare type Contract = {
  planCode: string;
  maxUsers: number;
  expireAt: Date;
  startAt: Date;
};

declare type GroupId = string;
declare type Group = {
  id: GroupId;
  name: string;
  stockIssue: StockIssue | null;
  contract: Contract;
};

declare type DateString = string;
declare type DateTimeString = string;

declare type UserId = string;

declare type User = {
  id: UserId;
  name: string;
  email: string;
};

declare type SignedInUser = User & {
  auth: import('firebase/auth').User;
  role: import('~/contexts/client/firebase/auth').Role;
};
