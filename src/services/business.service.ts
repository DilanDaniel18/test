import { addDays, differenceInDays } from 'date-fns';

/**
 * REGLA: fecha creacion + 15 días naturales [cite: 50, 51]
 */
export const calculatePaymentDate = (createdAt: Date): Date => {
  return addDays(createdAt, 15);
};

/**
 * REGLA: Días entre la fecha de creación y la fecha del último pago [cite: 58, 59]
 */
export const getDaysElapsedForCommission = (createdAt: Date, lastPaymentDate: Date): number => {
  return differenceInDays(lastPaymentDate, createdAt);
};