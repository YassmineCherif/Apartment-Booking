import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/Services/Chat/chat.service';
import { UserService } from 'src/app/Services/user/user.service';
import { Conversation } from 'src/app/models/Conversation';
import { Message } from 'src/app/models/Message';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-messenger',
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.component.css']
})
export class MessengerComponent implements OnInit {
  currentUser: User | null = null;
  allUsers: User[] = [];
  contacts: User[] = [];

  conversations: Conversation[] = [];
  filteredConversations: Conversation[] = [];
  selectedConversation?: Conversation;

  newMessage = '';
  selectedFiles: File[] = [];
  searchTerm = '';

  constructor(
    private chatService: ChatService,
    private userService: UserService
  ) {}

  ngOnInit() {
    const login = sessionStorage.getItem('login');

    if (login) {
  this.userService.getUserProfileByLogin(login).subscribe(user => {
    this.currentUser = user;

      // Exclude current user's role
      const roleToExclude = this.currentUser?.user_role || 'ADMIN';
      this.chatService.getAllUsers(roleToExclude).subscribe(users => {
        // Remove the logged-in user from the contacts
        this.allUsers = users.filter(u => u.id_user !== this.currentUser?.id_user);
        this.contacts = this.allUsers; // contacts the current user can reach
      });
    });
}


    // Load all conversations
    this.chatService.getConversations().subscribe(convs => {
      this.conversations = convs;
      this.filteredConversations = convs;
    });
  }

  loadContacts() {
    if (!this.currentUser || !this.allUsers.length) return;
    this.contacts = this.allUsers.filter(u =>
      this.currentUser!.user_role === 'CONCIERGE' ? u.user_role === 'CLIENT' : u.user_role === 'CONCIERGE'
    );
  }

  selectConversation(conv: Conversation) {
    this.selectedConversation = conv;
    if (conv.id_conversation) {
      this.chatService.getMessages(conv.id_conversation).subscribe(msgs => {
        this.selectedConversation!.messages = msgs;
      });
    }
  }

  contactClicked(user: User) {
    if (!this.currentUser) return;
    this.chatService.getOrCreateConversation(this.currentUser.id_user!, user.id_user!)
      .subscribe(conv => this.selectConversation(conv));
  }

  filterConversations() {
    const term = this.searchTerm.toLowerCase();
    this.filteredConversations = this.conversations.filter(c =>
      c.subject.toLowerCase().includes(term) ||
      c.messages?.some(m => m.content.toLowerCase().includes(term))
    );
  }

  getLastMessage(conv: Conversation): string {
    if (!conv.messages || conv.messages.length === 0) return 'No messages';
    return conv.messages[conv.messages.length - 1].content;
  }

  attachFiles(event: any) {
    this.selectedFiles = Array.from(event.target.files);
  }

  get selectedConversationParticipants(): string {
    if (!this.selectedConversation?.participants) return '';
    return this.selectedConversation.participants.map(p => p.login).join(', ');
  }

  sendMessage() {
    if (!this.selectedConversation || !this.currentUser) return;
    this.chatService.sendMessage(
      this.selectedConversation.id_conversation!,
      this.currentUser.id_user!,
      this.newMessage,
      this.selectedFiles
    ).subscribe(msg => {
      if (!this.selectedConversation!.messages) this.selectedConversation!.messages = [];
      this.selectedConversation!.messages.push(msg);
      this.newMessage = '';
      this.selectedFiles = [];
    });
  }

  fileUrl(f: any): string {
    return `http://localhost:8089/api/chat/files/${f.id_fichier}`;
  }
}
