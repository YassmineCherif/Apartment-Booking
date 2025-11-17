import { User } from './user';
import { Message } from './Message';

export interface Conversation {
  id_conversation?: number;
  createdAt: string;         
  lastMessageAt: string; 
  messages?: Message[];
  participants?: User[];
}
