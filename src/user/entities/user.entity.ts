import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column()
  email: string;

  // a user can be a driver, a passenger, or both
  // like in Uber, a driver can also be a passenger
  @Column()
  is_driver: boolean;

  @Column({ type: 'integer', nullable: true })
  payment_source_id: number;
}