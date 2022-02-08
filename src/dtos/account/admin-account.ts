import { Role } from "src/commons/enums/app-enum";

export interface AdminAccount {
    id: string;
    email: string;
    accountType: Role;
    firstname: string;
    lastname: string;
    address: string;
    postalCode: string;
    phoneNumber1: string;
    phoneNumber2: string;
}