import { Router } from 'express';
import * as CartController from '../controllers/cartController';
import { validateBody } from '../middlewares/validateMiddleware';
import { addItemSchema } from '../dtos/cartDto';

const router = Router();

router.post('/', CartController.createCart);
router.get('/:cartId', CartController.getCart);
router.post('/:cartId/items', validateBody(addItemSchema), CartController.addItem);

export default router;