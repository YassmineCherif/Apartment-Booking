import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Reclamation } from 'src/app/models/Reclamation';
import { Observable } from 'rxjs';
import { ETAT_RECLAMATION } from 'src/app/models/ETAT_RECLAMATION';

@Injectable({
  providedIn: 'root'
})



export class ReclamationService {

  private apiUrl = 'http://localhost:8089/api/reclamations';

  constructor(private http: HttpClient) {}

  // ✔ Add reclamation
  addReclamation(userId: number, rec: Reclamation): Observable<Reclamation> {
    return this.http.post<Reclamation>(`${this.apiUrl}/add/${userId}`, rec);
  }

  // ✔ Get reclamations of a specific user
  getUserReclamations(userId: number): Observable<Reclamation[]> {
    return this.http.get<Reclamation[]>(`${this.apiUrl}/user/${userId}`);
  }

  // ✔ Get all reclamations
  getAll(): Observable<Reclamation[]> {
    return this.http.get<Reclamation[]>(`${this.apiUrl}/all`);
  }

  // ✔ Update reclamation details
  updateReclamation(id: number, rec: Reclamation): Observable<Reclamation> {
    return this.http.put<Reclamation>(`${this.apiUrl}/update/${id}`, rec);
  }

  // ✔ Update status (APPROUVE / REJETE / EN_ATTENTE)
  updateStatus(id: number, status: ETAT_RECLAMATION): Observable<Reclamation> {
    return this.http.put<Reclamation>(`${this.apiUrl}/status/${id}?status=${status}`, {});
  }

  // ✔ Delete reclamation
  deleteReclamation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

}