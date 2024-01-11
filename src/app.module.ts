import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { UserModule } from './user/user.module';
import { RideModule } from './ride/ride.module';
import { PaymentModule } from './payment/payment.module';
import { User } from './user/entities/user.entity';
import { Payment } from './payment/entities/payment.entity';
import { Ride } from './ride/entities/ride.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_NAME || 'test',
      synchronize: true,
      autoLoadEntities: true,
    }),
    UserModule,
    RideModule,
    PaymentModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly connection: DataSource) {}
}
