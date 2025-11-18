import { ETAT_RECLAMATION } from './ETAT_RECLAMATION';
import { User } from './user';

export interface Reclamation {
  id_reclamation?: number;
  titre: string;
  description: string;
  localisation: string;
  etatReclamation?: ETAT_RECLAMATION;
  date?: string; 
   user?: User;
}
