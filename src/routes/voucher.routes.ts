import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { calculatePaymentDate } from '../services/business.service.js';

const router = Router();

router.post('/', async (req, res) => {
  const { clientId, totalAmount } = req.body;

  try {
    const createdAt = new Date();
    const paymentDate = calculatePaymentDate(createdAt); 

    const voucher = await prisma.voucher.create({
      data: {
        totalAmount,
        balance: totalAmount, 
        createdAt,
        paymentDate,
        clientId,
        status: 'ACTIVO'
      }
    });
    if (totalAmount <= 0) {
      return res.status(400).json({ error: 'El monto total del vale debe ser mayor a cero' });
    }
    else{
      res.status(201).json(voucher);
    }
      
    } 
    catch (error) {
      res.status(400).json({ error: 'Error al crear el vale' });
    }
});

export default router;