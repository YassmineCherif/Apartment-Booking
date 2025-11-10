import { Appartement } from "./appartement";
import { User } from "./user";

export interface Reservation {
  id_reservation?: number;
  dateDebut: string;  
  dateFin: string;   
  approved: number;
  appartements?: Appartement;


    // Infos récupérées manuellement
  blocNom?: string;
  residenceNom?: string;
  paysNom?: string;

  user?: User;
} 
