import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

const router = Router();

// Create
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
    console.error(error);
    res.status(400).json({ error: 'Error al crear el cliente y sus rangos' });
  }
});

// Read
router.get('/', async (req, res) => {
  const clients = await prisma.client.findMany({
    include: { commissions: true }
  });
  res.json(clients);
});

// Update
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, creditBalance } = req.body;
  try {
    const updated = await prisma.client.update({
      where: { id: Number(id) },
      data: { name, creditBalance }
    });
    res.json(updated);
  } catch (error) {
    res.status(404).json({ error: 'Cliente no encontrado' });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.client.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ 
      error: 'No se puede eliminar: el cliente tiene vales o historial activo' 
    });
  }
});

export default router;