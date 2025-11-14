import { User } from './user';
import { Message } from './Message';

export interface Conversation {
  id_conversation?: number;
  subject: string;
  createdAt: string;         
  lastMessageAt: string; 
  messages?: Message[];
  participants?: User[];
}
