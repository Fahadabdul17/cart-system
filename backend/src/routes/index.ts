import { Router } from 'express';
import products from './productRoutes';
import carts from './cartRoutes';

const router = Router();

router.use('/products', products);
router.use('/carts', carts);

export default router;