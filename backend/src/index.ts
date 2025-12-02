import dotenv from 'dotenv';
dotenv.config();
import app from './app';
import { log } from './logger';

const port = process.env.PORT || 4000;

app.listen(port, () => {
  log.info(`Server listening on port ${port} — env=${process.env.NODE_ENV || 'development'}`);
});
