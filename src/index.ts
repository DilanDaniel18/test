import express from 'express';
import dotenv from 'dotenv';

import clientRoutes from './routes/client.routes.js';
import voucherRoutes from './routes/voucher.routes.js';
import paymentRoutes from './routes/payment.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/clients', clientRoutes);
app.use('/api/vouchers', voucherRoutes);
app.use('/api/payments', paymentRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'API Online', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});