import { Attraction } from "./attraction.interface";
import { Hotel } from "./hotel.interface";
import { Restaurant } from "./restaurant.interface";

export interface Travel {
    name: string,
    location : string,
    startDate : string,
    services: (Restaurant | Hotel | Attraction)[],
    endDate: string;
}   