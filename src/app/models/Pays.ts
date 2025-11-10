import { Residence } from "./Residence";

export interface Pays {
  id_country?: number;
  pays: string;
  localisation: string;
  adress: string;
  ville: string;
  residences?: Residence[];
}
