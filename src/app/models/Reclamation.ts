import { ETAT_RECLAMATION } from "./ETAT_RECLAMATION";

export interface Reclamation {
  id_reclamation?: number;
  description: string;
  titre: string;
  localisation: string;
  etatReclamation: ETAT_RECLAMATION;
  date: string;  
}