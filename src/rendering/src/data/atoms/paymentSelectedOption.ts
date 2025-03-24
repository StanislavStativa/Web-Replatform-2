import { PAYMENTOPTIONS } from '@/utils/constants';
import { atom } from 'jotai';

export const paymentSelectedOption = atom<null | PAYMENTOPTIONS>(null);
export const paymentSelectedType = atom<string>('');
