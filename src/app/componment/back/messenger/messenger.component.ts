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

  selectedContactName = '';
  errorMessage = '';
  isLoading = false;

  // New chat functionality
  showNewChatModal = false;
  newChatSearchTerm = '';
  filteredContactsForNewChat: User[] = [];
  selectedContactForNewChat?: User;
  newChatMessage = '';

  constructor(
    private chatService: ChatService,
    private userService: UserService
  ) {}

  ngOnInit() {
    const login = sessionStorage.getItem('login');

    if (login) {
      this.userService.getUserProfileByLogin(login).subscribe(user => {
        this.currentUser = user;

        // Fetch all users excluding current user's role and logged-in user
        const roleToExclude = this.currentUser?.user_role || 'ADMIN';
        this.chatService.getAllUsers(roleToExclude).subscribe({
          next: (users) => {
            this.allUsers = users.filter(u => u.id_user !== this.currentUser?.id_user);
            this.contacts = this.allUsers; // contacts visible in sidebar
          },
          error: (err) => {
            console.error('Error loading contacts:', err);
            this.allUsers = [];
            this.contacts = [];
          }
        });

        // Load conversations after current user is loaded
        this.loadConversations();
      });
    } else {
      // If no login, still try to load conversations (though they'll be filtered)
      this.loadConversations();
    }
  }

  private loadConversations() {
    // Load all conversations
    this.isLoading = true;
    this.chatService.getConversations().subscribe({
      next: (convs) => {
        // Filter conversations to only show those where current user is a participant
        this.conversations = this.filterConversationsByUser(convs);
        this.filteredConversations = [...this.conversations];
        
        // Load last message for each conversation to display in the list
        this.loadLastMessagesForConversations();
        
        this.isLoading = false;
        this.errorMessage = '';
      },
      error: (err) => {
        console.error('Error loading conversations:', err);
        console.error('Full error object:', JSON.stringify(err, null, 2));
        console.error('Error error property:', err.error);
        const errorMsg = this.extractErrorMessage(err);
        this.errorMessage = `Failed to load conversations: ${errorMsg}`;
        this.isLoading = false;
        this.conversations = [];
        this.filteredConversations = [];
      }
    });
  }

  private loadLastMessagesForConversations() {
    // Load messages for each conversation to get the last message for display
    // Only show conversations that have messages
    this.conversations.forEach(conv => {
      if (conv.id_conversation && (!conv.messages || conv.messages.length === 0)) {
        this.chatService.getMessages(conv.id_conversation).subscribe({
          next: (msgs) => {
            // Only keep conversations that have messages
            if (msgs && msgs.length > 0) {
              // Update the conversation with messages
              const convIndex = this.conversations.findIndex(c => c.id_conversation === conv.id_conversation);
              if (convIndex !== -1) {
                this.conversations[convIndex].messages = msgs;
                // Update filtered conversations as well
                const filteredIndex = this.filteredConversations.findIndex(c => c.id_conversation === conv.id_conversation);
                if (filteredIndex !== -1) {
                  this.filteredConversations[filteredIndex].messages = msgs;
                }
              }
            } else {
              // Remove conversation if it has no messages
              this.conversations = this.conversations.filter(c => c.id_conversation !== conv.id_conversation);
              this.filteredConversations = this.filteredConversations.filter(c => c.id_conversation !== conv.id_conversation);
            }
          },
          error: (err) => {
            // Remove conversation if we can't load messages (might not exist or have no messages)
            this.conversations = this.conversations.filter(c => c.id_conversation !== conv.id_conversation);
            this.filteredConversations = this.filteredConversations.filter(c => c.id_conversation !== conv.id_conversation);
            console.warn('Failed to load messages for conversation:', conv.id_conversation);
          }
        });
      } else if (conv.messages && conv.messages.length === 0) {
        // If conversation already has empty messages array, remove it
        this.conversations = this.conversations.filter(c => c.id_conversation !== conv.id_conversation);
        this.filteredConversations = this.filteredConversations.filter(c => c.id_conversation !== conv.id_conversation);
      }
    });
  }

  private filterConversationsByUser(convs: Conversation[]): Conversation[] {
    // Only return conversations where current user is a participant
    // Messages will be checked after they're loaded
    if (!this.currentUser) {
      return [];
    }
    return convs.filter(conv => 
      conv.participants?.some(p => p.id_user === this.currentUser?.id_user)
    );
  }

  selectConversation(conv: Conversation) {
    this.selectedConversation = conv;
    
    // Always set contact name from participants when selecting a conversation
    const otherParticipant = this.getOtherParticipant(conv);
    if (otherParticipant) {
      this.selectedContactName = `${otherParticipant.nom} ${otherParticipant.prenom}`;
    } else {
      this.selectedContactName = 'Unknown Contact';
    }
    
    if (conv.id_conversation) {
      this.chatService.getMessages(conv.id_conversation).subscribe({
        next: (msgs) => {
          if (this.selectedConversation && this.selectedConversation.id_conversation === conv.id_conversation) {
            this.selectedConversation.messages = msgs || [];
            this.isLoading = false;
          }
        },
        error: (err) => {
          console.error('Error loading messages:', err);
          const errorMsg = this.extractErrorMessage(err);
          this.errorMessage = `Failed to load messages: ${errorMsg}`;
          if (this.selectedConversation && this.selectedConversation.id_conversation === conv.id_conversation) {
            this.selectedConversation.messages = [];
          }
          this.isLoading = false;
        }
      });
    } else {
      this.isLoading = false;
    }
  }


contactClicked(user: User) {
  if (!this.currentUser) return;

  // Save clicked contact name for header
  this.selectedContactName = `${user.nom} ${user.prenom}`;
  this.errorMessage = '';
  this.isLoading = true;

  this.chatService.getOrCreateConversation(this.currentUser.id_user!, user.id_user!)
    .subscribe({
      next: (conv) => {
        // Verify that current user is a participant before adding
        const isParticipant = conv.participants?.some(p => p.id_user === this.currentUser?.id_user);
        if (!isParticipant) {
          console.warn('Conversation does not include current user, skipping');
          this.isLoading = false;
          return;
        }

        // Add conversation to the list if it doesn't exist
        const existingIndex = this.conversations.findIndex(c => c.id_conversation === conv.id_conversation);
        if (existingIndex === -1) {
          this.conversations.unshift(conv); // Add to beginning
          this.filteredConversations = [...this.conversations]; // Update filtered list
        } else {
          // Update existing conversation
          this.conversations[existingIndex] = conv;
          this.filteredConversations = [...this.conversations];
        }
        // Select and load messages for this conversation
        this.selectConversation(conv);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error getting/creating conversation:', err);
        console.error('Full error object:', JSON.stringify(err, null, 2));
        console.error('Error error property:', err.error);
        const errorMsg = this.extractErrorMessage(err);
        this.errorMessage = `Failed to start conversation with ${user.nom} ${user.prenom}. ${errorMsg}`;
        this.isLoading = false;
      }
    });
}

  searchContacts() {
    if (!this.searchTerm.trim()) {
      // If search is empty, show all conversations
      this.filteredConversations = [...this.conversations];
      return;
    }

    const term = this.searchTerm.toLowerCase().trim();
    // Filter conversations by participant name
    this.filteredConversations = this.conversations.filter(c => {
      const participantName = this.getParticipantName(c).toLowerCase();
      return participantName.includes(term);
    });
  }

  filterConversations() {
    // Keep this method for backward compatibility, but redirect to searchContacts
    this.searchContacts();
  }

  getLastMessage(conv: Conversation): string {
    if (!conv.messages || conv.messages.length === 0) {
      return 'Aucun message';
    }
    
    const lastMessage = conv.messages[conv.messages.length - 1];
    const messageContent = lastMessage.content || '';
    const maxLength = 50; // Maximum characters before truncation
    
    // Check if the message was sent by the current user
    const isFromCurrentUser = lastMessage.sender?.id_user === this.currentUser?.id_user;
    
    // Truncate if too long
    let displayText = messageContent;
    if (messageContent.length > maxLength) {
      displayText = messageContent.substring(0, maxLength) + '.....';
    }
    
    // Add "Vous : " prefix if message is from current user
    if (isFromCurrentUser) {
      return `Vous : ${displayText}`;
    }
    
    return displayText;
  }

  attachFiles(event: any) {
    this.selectedFiles = Array.from(event.target.files);
  }

  get selectedConversationParticipants(): string {
    if (!this.selectedConversation?.participants) return '';
    return this.selectedConversation.participants.map(p => p.login).join(', ');
  }

  getContactInitials(): string {
    if (this.selectedContactName) {
      return this.selectedContactName.slice(0, 2).toUpperCase();
    }
    const otherParticipant = this.getOtherParticipant(this.selectedConversation);
    if (otherParticipant) {
      return `${otherParticipant.nom} ${otherParticipant.prenom}`.slice(0, 2).toUpperCase();
    }
    return '??';
  }

  getOtherParticipant(conv: Conversation | undefined): User | null {
    if (!conv || !conv.participants || !this.currentUser) return null;
    return conv.participants.find(p => p.id_user !== this.currentUser?.id_user) || null;
  }

  getParticipantName(conv: Conversation): string {
    const otherParticipant = this.getOtherParticipant(conv);
    if (otherParticipant) {
      return `${otherParticipant.nom} ${otherParticipant.prenom}`;
    }
    return 'Unknown';
  }

  getParticipantInitials(conv: Conversation): string {
    const otherParticipant = this.getOtherParticipant(conv);
    if (otherParticipant) {
      const name = `${otherParticipant.nom} ${otherParticipant.prenom}`;
      return name.slice(0, 2).toUpperCase();
    }
    return '??';
  }

  sendMessage() {
    if (!this.selectedConversation || !this.currentUser) return;
    if (!this.newMessage.trim() && this.selectedFiles.length === 0) return;

    this.chatService.sendMessage(
      this.selectedConversation.id_conversation!,
      this.currentUser.id_user!,
      this.newMessage,
      this.selectedFiles
    ).subscribe({
      next: (msg) => {
        if (!this.selectedConversation!.messages) this.selectedConversation!.messages = [];
        this.selectedConversation!.messages.push(msg);
        this.newMessage = '';
        this.selectedFiles = [];
        this.errorMessage = '';
      },
      error: (err) => {
        console.error('Error sending message:', err);
        const errorMsg = this.extractErrorMessage(err);
        this.errorMessage = `Failed to send message: ${errorMsg}`;
      }
    });
  }

  fileUrl(f: any): string {
    // If file has a chemin (path), use it (for assets folder)
    if (f.chemin) {
      return f.chemin.startsWith('http') ? f.chemin : `/assets/Documents/${f.chemin}`;
    }
    // Fallback to API endpoint
    return `http://localhost:8089/api/chat/files/${f.id_fichier}`;
  }

  isImage(f: any): boolean {
    if (!f.typeFichier) return false;
    const type = f.typeFichier.toString().toUpperCase();
    return type === 'IMAGE' || 
           (f.titre && /\.(jpg|jpeg|png|gif|webp)$/i.test(f.titre));
  }

  isPdf(f: any): boolean {
    if (!f.typeFichier) {
      return f.titre && /\.pdf$/i.test(f.titre);
    }
    return f.typeFichier.toString().toUpperCase() === 'FACTURE' ||
           (f.titre && /\.pdf$/i.test(f.titre));
  }

  openImageInNewTab(url: string) {
    window.open(url, '_blank');
  }

  handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.style.display = 'none';
    }
  }

  // New chat methods
  openNewChat() {
    this.showNewChatModal = true;
    this.newChatSearchTerm = '';
    this.filteredContactsForNewChat = [];
    this.selectedContactForNewChat = undefined;
    this.newChatMessage = '';
  }

  closeNewChat() {
    this.showNewChatModal = false;
    this.newChatSearchTerm = '';
    this.filteredContactsForNewChat = [];
    this.selectedContactForNewChat = undefined;
    this.newChatMessage = '';
  }

  searchContactsForNewChat() {
    if (!this.newChatSearchTerm.trim()) {
      this.filteredContactsForNewChat = [];
      return;
    }

    const term = this.newChatSearchTerm.toLowerCase().trim();
    this.filteredContactsForNewChat = this.contacts.filter(user => {
      const fullName = `${user.nom} ${user.prenom}`.toLowerCase();
      const login = (user.login || '').toLowerCase();
      return fullName.includes(term) || login.includes(term);
    });
  }

  selectContactForNewChat(user: User) {
    this.selectedContactForNewChat = user;
    this.newChatSearchTerm = `${user.nom} ${user.prenom}`;
    this.filteredContactsForNewChat = [];
  }

  startNewConversation() {
    if (!this.selectedContactForNewChat || !this.currentUser) return;
    if (!this.newChatMessage.trim() && this.selectedFiles.length === 0) {
      this.errorMessage = 'Please enter a message or attach a file';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Create or get conversation
    this.chatService.getOrCreateConversation(
      this.currentUser.id_user!,
      this.selectedContactForNewChat.id_user!
    ).subscribe({
      next: (conv) => {
        // Send the first message
        this.chatService.sendMessage(
          conv.id_conversation!,
          this.currentUser!.id_user!,
          this.newChatMessage,
          this.selectedFiles
        ).subscribe({
          next: (msg) => {
            // Add conversation to list
            const existingIndex = this.conversations.findIndex(c => c.id_conversation === conv.id_conversation);
            if (existingIndex === -1) {
              conv.messages = [msg];
              this.conversations.unshift(conv);
              this.filteredConversations = [...this.conversations];
            }

            // Select the conversation
            this.selectConversation(conv);
            if (this.selectedContactForNewChat) {
              this.selectedContactName = `${this.selectedContactForNewChat.nom} ${this.selectedContactForNewChat.prenom}`;
            }

            // Close modal and reset
            this.closeNewChat();
            this.selectedFiles = [];
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Error sending message:', err);
            const errorMsg = this.extractErrorMessage(err);
            this.errorMessage = `Failed to send message: ${errorMsg}`;
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        console.error('Error creating conversation:', err);
        const errorMsg = this.extractErrorMessage(err);
        this.errorMessage = `Failed to start conversation: ${errorMsg}`;
        this.isLoading = false;
      }
    });
  }

  private extractErrorMessage(err: any): string {
    // Log full error for debugging
    if (err.error) {
      // If error is a string
      if (typeof err.error === 'string') {
        return err.error;
      }
      
      // Spring Boot error format: { "error": "...", "message": "...", "path": "..." }
      if (err.error.message) {
        return err.error.message;
      }
      if (err.error.error) {
        const errorType = err.error.error;
        const errorMessage = err.error.message || '';
        return errorMessage ? `${errorType}: ${errorMessage}` : errorType;
      }
      
      // Try to get any error details
      if (err.error.details) {
        return err.error.details;
      }
      
      // If error is an object, try to stringify it
      try {
        const errorStr = JSON.stringify(err.error);
        if (errorStr && errorStr !== '{}') {
          return errorStr;
        }
      } catch (e) {
        // Ignore JSON stringify errors
      }
    }
    
    // Fallback to status message
    if (err.message) {
      return err.message;
    }
    
    // Final fallback
    const statusText = err.statusText || 'Internal Server Error';
    return `HTTP ${err.status || 500} - ${statusText}. Check backend server logs for details.`;
  }
}
