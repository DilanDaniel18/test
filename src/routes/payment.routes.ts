import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { getDaysElapsedForCommission } from '../services/business.service.js';

const router = Router();

router.post('/', async (req, res) => {
  const { voucherId, amount } = req.body;

  if (amount <= 0) return res.status(400).json({ error: 'El pago debe ser mayor a cero' });

  try {
    const voucher = await prisma.voucher.findUnique({
      where: { id: voucherId },
      include: { client: { include: { commissions: true } } }
    });

    if (!voucher) return res.status(404).json({ error: 'Vale no encontrado' });
    
    if (voucher.status === 'PAGADO') return res.status(400).json({ error: 'El vale ya está pagado' });

    let appliedPayment = amount;
    let overpayment = 0;

    if (amount > voucher.balance) {
      overpayment = amount - voucher.balance;
      appliedPayment = voucher.balance;
    }

    await prisma.payment.create({
      data: { amount: appliedPayment, voucherId }
    });

    const newBalance = voucher.balance - appliedPayment;

    if (newBalance === 0) {
      const daysElapsed = getDaysElapsedForCommission(voucher.createdAt, new Date());
      
      const range = voucher.client.commissions.find(r => 
        daysElapsed >= r.minDays && (r.maxDays === null || daysElapsed <= r.maxDays)
      );

      const percentage = range ? range.percentage : 0;
      const commissionAmount = voucher.totalAmount * (percentage / 100);

      await prisma.voucher.update({
        where: { id: voucherId },
        data: { status: 'PAGADO', balance: 0 }
      });

      if (overpayment > 0) {
        await prisma.client.update({
          where: { id: voucher.clientId },
          data: { creditBalance: { increment: overpayment } }
        });
      }

      return res.json({
        status: 'PAGADO',
        commissionPercentage: `${percentage}%`,
        commissionAmount,
        overpaymentApplied: overpayment
      });
    }

    await prisma.voucher.update({
      where: { id: voucherId },
      data: { balance: newBalance }
    });

    res.json({ status: 'ACTIVO', remainingBalance: newBalance });

  } catch (error) {
    res.status(500).json({ error: 'Error procesando el pago' });
  }
});

export default router;