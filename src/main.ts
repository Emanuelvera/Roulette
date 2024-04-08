import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

process.env.PGPASSWORD;
process.env.PGHOST;
process.env.PGUSER;
process.env.PGPASSWORD;
process.env.PGDATABASE;

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
