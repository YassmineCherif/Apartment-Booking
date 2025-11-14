import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Conversation } from 'src/app/models/Conversation';
import { Message } from 'src/app/models/Message';
import { User } from 'src/app/models/user';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:8089/api/chat';

  constructor(private http: HttpClient) {}

  // Get all conversations
  getConversations(): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(`${this.apiUrl}/conversations`, { withCredentials: true });
  }

  // Get messages of a conversation
  getMessages(conversationId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/${conversationId}`, { withCredentials: true });
  }

  // Get or create a conversation between two users
  getOrCreateConversation(user1Id: number, user2Id: number): Observable<Conversation> {
    return this.http.post<Conversation>(
      `${this.apiUrl}/conversation-or-create?user1Id=${user1Id}&user2Id=${user2Id}`,
      {}
    );
  }

  // Send message with optional files
  sendMessage(conversationId: number, senderId: number, content: string, files?: File[]): Observable<Message> {
    const formData = new FormData();
    if (content) formData.append('content', content);
    if (files) files.forEach(f => formData.append('files', f, f.name));
    return this.http.post<Message>(
      `${this.apiUrl}/${conversationId}/${senderId}`,
      formData,
      { withCredentials: true }
    );
  }



getAllUsers(excludeRole: string): Observable<User[]> {
  const role = excludeRole || 'ADMIN'; // fallback if undefined
  return this.http.get<User[]>(`${this.apiUrl}/contacts?excludeRole=${role}`, { withCredentials: true });
}


}
