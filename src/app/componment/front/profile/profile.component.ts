import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/Services/user/user.service';
import { User } from 'src/app/models/user';
import { ToastrService } from 'ngx-toastr';

@Component({ 
  selector: 'app-profile', 
  templateUrl: './profile.component.html', 
  styleUrls: ['./profile.component.css'] 
})
export class UpdateProfileComponent implements OnInit {
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
    const login = sessionStorage.getItem('login'); // Récupérer le login de l'utilisateur connecté
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
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires.';
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Veuillez entrer un email valide.';
      return;
    }

    if (!this.isValidPhoneNumber(this.numtel)) {
      this.errorMessage = 'Veuillez entrer un numéro de téléphone valide.';
      return;
    }

    if (this.password && this.password !== this.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas.';
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
          this.successMessage = 'Profil mis à jour avec succès.';
          this.toastr.success(this.successMessage, 'Succès');
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Échec de la mise à jour du profil.';
          this.toastr.error(this.errorMessage ?? '', 'Erreur');
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
