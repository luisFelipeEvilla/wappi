import { IsNumber,  } from "class-validator";
import { Point } from "typeorm";

export class CreateRideDto {
    @IsNumber()
    rider_id: number;

    start_location: Point;
}
