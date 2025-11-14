import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';  // ✅ Add this
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './componment/front/home/home.component';
import { SubjectsComponent } from './componment/front/subjects/subjects.component';
import { PostulationsComponent } from './componment/front/postulations/postulations.component';

import { LoginComponent } from './componment/front/login/login.component';
import { RegisterComponent } from './componment/front/login/register.component';
import { NavbarComponent } from './componment/front/navbar/navbar.component';
import { AdminComponent } from './componment/back/admin/admin.component';


import { ResidenceComponent } from './componment/front/residence/residence.component';
import { ChatComponent } from './componment/front/chat/chat.component';
import { ComplaintsComponent } from './componment/front/complaints/complaints.component';
import { ForumComponent } from './componment/back/forum/forum.component';
import { DashboardComponent } from './componment/back/dashboard/dashboard.component';
 import { ReadComponent } from './componment/back/appartement/read/read.component';
import { HttpClient } from '@angular/common/http';
import { ApartementsComponent } from './componment/front/reservation/apartements/apartements.component';
 import { MesReservationsComponent } from './componment/front/reservation/mes-reservations/mes-reservations.component';
import { ToastrModule } from 'ngx-toastr';
import { BlocComponent } from './componment/back/bloc/bloc.component';
import { PaysComponent } from './componment/back/pays/pays.component';
import { ResidencesComponent } from './componment/back/residences/residences.component';
import { RespondReservationComponent } from './componment/back/respond-reservation/respond-reservation.component';
import { PendingComponent } from './componment/back/pending/accepted.component';
import { MessengerComponent } from './componment/back/messenger/messenger.component';
import { UpdateProfileComponent } from './componment/front/profile/profile.component';
import { ForgotComponent } from './componment/front/login/forgot-password/forgot/forgot.component';
 
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SubjectsComponent,
    PostulationsComponent,

    
    LoginComponent,
    RegisterComponent,
    NavbarComponent,
  
    
    
  
    AdminComponent,
    ResidenceComponent,
    ChatComponent,
    ComplaintsComponent,
    ForumComponent,
    DashboardComponent,
     ReadComponent,
    ApartementsComponent,
     MesReservationsComponent,
    BlocComponent,
    PaysComponent,
    ResidencesComponent,
    RespondReservationComponent,
    PendingComponent,
    MessengerComponent,
    UpdateProfileComponent,
    ForgotComponent,
 
    
    
    

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule, 
    ReactiveFormsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',  
      preventDuplicates: true,
      toastClass: 'ngx-toastr custom-toast',   
    })

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
