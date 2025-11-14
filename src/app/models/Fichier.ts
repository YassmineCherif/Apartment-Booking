export enum TYPE_FICHIER {
  FACTURE = 'FACTURE',
  IMAGE = 'IMAGE'
}

export interface Fichier {
  id_fichier?: number;
  titre: string;
  typeFichier: TYPE_FICHIER;
  dateCreation: string;  
}
