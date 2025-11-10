import { USER_ROLE } from "./USER_ROLE";
import { Pays } from "./Pays";
import { Reservation } from "./Reservation";
import { ETAT_RECLAMATION } from "./ETAT_RECLAMATION";
import { Chat } from "./Chat";
import { Reclamation } from "./Reclamation";






export interface User {
  id_user?: number;
  nom: string;
  prenom: string;
  email: string;
  cin: string;
  approved: number;
  numerotelephone: string;
  user_role: USER_ROLE;
  adresse: string;
  login: string;
  mdp: string;
  actif: boolean;
  derniercnx: string;
  pays?: Pays[];
  reservations?: Reservation[];
  chats?: Chat[];
  reclamations?: Reclamation[];
}
