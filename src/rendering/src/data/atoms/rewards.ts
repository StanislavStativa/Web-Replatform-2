import { atom } from 'jotai';

export const showStatementAtom = atom<boolean>(false);
export const monthAtom = atom<string | null>(null);
export const rewardIdAtom = atom<string | undefined>(undefined);
export const spendTotalAtom = atom<string | undefined>(undefined);
export const referralTotalAtom = atom<string | undefined>(undefined);
export const orderIdToView = atom<string | null>(null);
