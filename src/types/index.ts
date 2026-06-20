// Domain types for the Appido dashboard. Additive type layer.
export type Lang = "en" | "fa" | "ar" | "tr" | "ru";
export type Theme = "light" | "dark";
export type LangDir = "ltr" | "rtl";

export interface Payment {
  d: string;
  amt: string;
  gw: string;
  st: string;
}

export interface Channel {
  id: string;
  name: string;
  username: string;
  members: number;
  date: string;
  rev: number;
  growth: number;
  paid: boolean;
  planName?: string;
  daysLeft: number;
  daysTotal: number;
  payments: Payment[];
}

export interface Txn {
  name: string;
  amount: string;
  gw: string;
  status: "ok" | "fail";
  time: string;
  plan: number;
}

export interface Receipt {
  token: string;
  chain: string;
  net: string;
  explorer: string;
  url: string;
  conf: number;
  hash: string;
  from: string;
  to: string;
  block: number;
}

export interface NotifPrefs {
  brief: boolean;
  time: number;
  telegram: boolean;
  email: boolean;
  push: boolean;
  hot: boolean;
  churn: boolean;
  pay: boolean;
  summary: boolean;
}
