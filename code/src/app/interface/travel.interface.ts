import { Flight } from "./flight.interface";
import { Hotel } from "./hotel.interface";
import { Restaurant } from "./restaurant.interface";

export interface Travel {
    name: string,
    location : string,
    startDate : string,
    services: (Restaurant | Hotel | Flight)[];

}   