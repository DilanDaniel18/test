import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

const router = Router();

router.post('/', async (req, res) => {
  const { name, commissions } = req.body; 

  try {
    const client = await prisma.client.create({
      data: {
        name,
        commissions: {
          create: commissions 
        }
      },
      include: { commissions: true }
    });
    res.status(201).json(client);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear cliente', details: error });
  }
});

router.get('/', async (req, res) => {
  const clients = await prisma.client.findMany({
    include: { commissions: true }
  });
  res.json(clients);
});

export default router;