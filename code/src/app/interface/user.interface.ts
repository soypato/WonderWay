import { Travel } from "./travel.interface";

export interface User {
    id?: number,
    name: string,
    email: string,
    password: string,
    role: string,
    active: boolean,
    travel?: Travel[]
}