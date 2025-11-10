import { Appartement } from "./appartement";

export interface Bloc {
  id_bloc?: number;
  nom: string;
  nombreEtages: number;
  appartement?: Appartement;
 id_residence?: number;
}
