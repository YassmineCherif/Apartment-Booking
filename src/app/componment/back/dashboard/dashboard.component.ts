import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/Services/user/user.service';
import { User } from 'src/app/models/user';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent  implements OnInit {
  email: string = '';
  numtel: string = '';
  nom: string = '';
  prenom: string = '';
  adresse: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string | null = null;
  successMessage: string | null = null;
  userId: number | null = null;

  constructor(private userService: UserService, private toastr: ToastrService) {}

  ngOnInit(): void {
    const login = sessionStorage.getItem('login'); // Get logged-in user's login
    if (login) {
      this.userService.getUserProfileByLogin(login).subscribe(profile => {
        if (profile) {
          this.userId = profile.id_user ?? null;
          this.email = profile.email;
          this.numtel = profile.numerotelephone;
          this.nom = profile.nom;
          this.prenom = profile.prenom;
          this.adresse = profile.adresse;
          this.password = '';
          this.confirmPassword = '';
        }
      });
    }
  }

  onSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null;

    if (!this.email || !this.nom || !this.prenom || !this.numtel) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Please enter a valid email.';
      return;
    }

    if (!this.isValidPhoneNumber(this.numtel)) {
      this.errorMessage = 'Please enter a valid phone number.';
      return;
    }

    if (this.password && this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    if (this.userId) {
      const updatedUser: Partial<User> = {
        nom: this.nom,
        prenom: this.prenom,
        email: this.email,
        numerotelephone: this.numtel,
        adresse: this.adresse,
        mdp: this.password || undefined
      };

      this.userService.updateUserProfile(this.userId, updatedUser).subscribe({
        next: () => {
          this.successMessage = 'Profile updated successfully.';
          this.toastr.success(this.successMessage, 'Success');
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Failed to update profile.';
             this.toastr.error(this.errorMessage ?? '', 'Error');
        }
      });
    }
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /.+@.+\..+/;
    return emailRegex.test(email);
  }

  isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^[0-9]{8}$/;
    return phoneRegex.test(phone);
  }
}
