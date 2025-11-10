import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8089/users';

  constructor(private http: HttpClient) {}

  login(login: string, password: string): Observable<any> {
    const body = new HttpParams().set('login', login).set('password', password).toString();
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this.http.post<any>(`${this.apiUrl}/login`, body, { headers, withCredentials: true });
  }

  isLoggedIn(): boolean {
    return sessionStorage.getItem('isAuthenticated') === 'true';
  }

  logout(): void {
    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('login');
    sessionStorage.removeItem('role');
  }

  register(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, user, { withCredentials: true });
  }

  getPendingUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pending`, { withCredentials: true });
  }




  setApproval(id: number, approved: number): Observable<void> {
  return this.http.put<void>(`${this.apiUrl}/${id}/approval`, null, {
    params: { approved },
    withCredentials: true
  });
}


getUserProfileByLogin(login: string) {
  return this.http.get<User>(`${this.apiUrl}/profile/${login}`, { withCredentials: true });
}


updateUserProfile(id: number, userData: Partial<User>): Observable<any> {
  return this.http.put(`${this.apiUrl}/${id}`, userData, { withCredentials: true });
}





sendRecoveryEmail(email: string): Observable<string> {
  return this.http.post(
    `${this.apiUrl}/forgot-password/${encodeURIComponent(email)}`,
    null,
    { responseType: 'text' }  
  );
}



}
