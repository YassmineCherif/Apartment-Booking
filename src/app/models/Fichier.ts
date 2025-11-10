import { TYPE_FICHIER } from "./TYPE_FICHIER";

export interface Fichier {
  id_fichier?: number;
  typeFichier: TYPE_FICHIER;
  titre: string;
  dateCreation: string;  
}
