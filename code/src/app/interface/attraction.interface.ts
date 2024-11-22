export interface Attraction {
    location_id: string;
    type: string,
    name: string;
    address_obj: {
        street1: string;
        city: string;
        country: string;
        postalcode: string;
        address_string: string;
    };
}