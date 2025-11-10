import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './componment/front/home/home.component';
import { PostulationsComponent } from './componment/front/postulations/postulations.component';
import { SubjectsComponent } from './componment/front/subjects/subjects.component';
import { LoginComponent } from './componment/front/login/login.component';
import { AdminComponent } from './componment/back/admin/admin.component';
import { ResidenceComponent } from './componment/front/residence/residence.component';
import { RegisterComponent } from './componment/front/login/register.component';
import { ComplaintsComponent } from './componment/front/complaints/complaints.component';
import { ForumComponent } from './componment/back/forum/forum.component';
import { DashboardComponent } from './componment/back/dashboard/dashboard.component';
import { ReadComponent } from './componment/back/appartement/read/read.component';
 import { ApartementsComponent } from './componment/front/reservation/apartements/apartements.component';
 import { MesReservationsComponent } from './componment/front/reservation/mes-reservations/mes-reservations.component';
import { BlocComponent } from './componment/back/bloc/bloc.component';
import { PaysComponent } from './componment/back/pays/pays.component';
import { ResidencesComponent } from './componment/back/residences/residences.component';
import { RespondReservationComponent } from './componment/back/respond-reservation/respond-reservation.component';
import { PendingComponent } from './componment/back/pending/accepted.component';
 import { UpdateProfileComponent } from './componment/front/profile/profile.component';
 import { ForgotComponent } from './componment/front/login/forgot-password/forgot/forgot.component';


const routes: Routes = [

  { path: 'home', component: HomeComponent },
  { path: 'postulations', component: PostulationsComponent },
  { path: 'subjects', component: SubjectsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'residence', component: ResidenceComponent}, 
  { path: 'complaints', component: ComplaintsComponent },
  { path: 'forum', component: ForumComponent },
  { path: 'app', component: ApartementsComponent },
  { path: 'mesres', component: MesReservationsComponent },
   {path: 'profile', component: UpdateProfileComponent },
   {path: 'forgot', component: ForgotComponent },
  // back office (nested under /admin)
  { 
    path: 'admin', 
    component: AdminComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'blocs', component: BlocComponent },
      { path: 'apartements', component: ReadComponent },
      { path: 'pays', component: PaysComponent },
      { path: 'residences', component: ResidencesComponent },
      { path: 'respond', component: RespondReservationComponent },
      { path: 'forum', component: ForumComponent },
      { path: 'pending', component: PendingComponent }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
