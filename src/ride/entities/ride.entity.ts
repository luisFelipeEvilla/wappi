import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, Point, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Ride {
  @PrimaryGeneratedColumn()
  ride_id: number;

  @ManyToOne(() => User, { eager: true })
  rider: User;

  @ManyToOne(() => User, { eager: true, nullable: true })
  driver: User;

  @Column({ type: 'geometry', spatialFeatureType: 'Point', srid: 4326 })
  start_location: Point;

  @Column({ type: 'geometry', nullable: true, spatialFeatureType: 'Point', srid: 4326 })
  end_location: Point;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  ride_started_at: Date;

  @Column({ type: 'timestamptz', nullable: true })
  ride_ended_at: Date;

  @Column({ type: 'integer', default: 3500 })
  total_cost: number;

  @Column({ type: 'boolean', default: false })
  completed: boolean;
}