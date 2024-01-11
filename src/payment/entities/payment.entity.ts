import { Ride } from "src/ride/entities/ride.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Payment {
    @PrimaryGeneratedColumn()
    payment_id: number;

    @Column()
    amount: number;

    @Column()
    currency: string;

    @Column()
    wompi_id: string;

    @Column()
    reference: string;

    @Column()
    payment_method_id: number;

    @Column({ default: "PENDING"})
    status: string;

    // probably we wanna see all payments from a user, so we add this
    @ManyToOne(() => User, { eager: true })
    user: User;

    @ManyToOne(() => Ride, { eager: true })
    ride: Ride;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    created_at: string;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    updated_at: string;
}
