import { Router } from 'express';
import * as ProductController from '../controllers/productController';
import { validateBody } from '../middlewares/validateMiddleware';
import { createProductSchema } from '../dtos/productDto';

const router = Router();

router.get('/', ProductController.list);
router.post('/', validateBody(createProductSchema), ProductController.create);

export default router;