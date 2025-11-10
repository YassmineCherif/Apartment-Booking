import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appartement } from 'src/app/models/appartement';

@Injectable({
  providedIn: 'root'
})
export class AppartementService {

  private baseUrl = 'http://localhost:8089/appartement'; 

  constructor(private http: HttpClient) {}

  // ===================== PAYS =====================
  getAllPays(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/pays`);
  }

  getPaysById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/pays/${id}`);
  }

  addPays(pays: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/pays`, pays);
  }

  updatePays(pays: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/pays`, pays);
  }

  deletePays(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/pays/${id}`);
  }

  // ===================== RESIDENCE =====================
  getAllResidences(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/residences`);
  }

  getResidenceById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/residences/${id}`);
  }

  getResidencesByPays(paysId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/residences/byPays/${paysId}`);
  }

  addResidence(residence: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/residences`, residence);
  }

  updateResidence(residence: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/residences`, residence);
  }

  deleteResidence(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/residences/${id}`);
  }


  // ===================== BLOC =====================
  getAllBlocs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/blocs`);
  }

  getBlocById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/blocs/${id}`);
  }

  getBlocsByResidence(residenceId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/blocs/byResidence/${residenceId}`);
  }

  addBloc(bloc: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/blocs`, bloc);
  }

  updateBloc(bloc: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/blocs`, bloc);
  }

  deleteBloc(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/blocs/${id}`);
  }

  // ===================== APPARTEMENT =====================
  getAllAppartements(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/appartements`);
  }

  getAppartementById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/appartements/${id}`);
  }

  getAppartementsByBloc(blocId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/appartements/byBloc/${blocId}`);
  }

  addAppartement(appartement: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/appartements`, appartement);
  }

  updateAppartement(appartement: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/appartements`, appartement);
  }

  deleteAppartement(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/appartements/${id}`);
  }


uploadImage(fileData: FormData) {
  return this.http.post(`${this.baseUrl}/uploadImage`, fileData);
}



addAppartementWithImage(formData: FormData) {
  return this.http.post<Appartement>(`${this.baseUrl}/appartements/upload`, formData);
}



}
