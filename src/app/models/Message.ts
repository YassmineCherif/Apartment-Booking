import { User } from './user';
import { Fichier } from './Fichier';
import { Conversation } from './Conversation';

export interface Message {
  id_message?: number;
  content: string;
  dateCreation: string; // ISO string
  sender: User;
  conversation?: Conversation;
  fichiers?: Fichier[];
}
