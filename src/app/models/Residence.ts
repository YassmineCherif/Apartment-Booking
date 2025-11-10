import { Bloc } from "./bloc";
export interface Residence {
  id_residence?: number;
  nom: string;
  nombrebloc: number;
  blocs?: Bloc[];
  id_pays?: number;
}
