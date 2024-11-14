export interface Flight{
    id?: number,
    duration: number,
    originAirportCode: string,
    destinationAirportCode: string,
    travelDate: string,
    returnDate: string,
    scale: number,
    class: string
}