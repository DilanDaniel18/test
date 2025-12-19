import { addDays, differenceInDays } from 'date-fns';

export const calculatePaymentDate = (createdAt: Date): Date => {
  return addDays(createdAt, 15);
};

export const getDaysElapsedForCommission = (createdAt: Date, lastPaymentDate: Date): number => {
  return differenceInDays(lastPaymentDate, createdAt);
};