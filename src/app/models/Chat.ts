    import { Fichier } from "./Fichier";

export interface Chat {
  id_chat?: number;
  content: string;
  subject: string;
  date: string;  
  expediteur: string;
  destinataire: string;
  fichiers?: Fichier[];
}
