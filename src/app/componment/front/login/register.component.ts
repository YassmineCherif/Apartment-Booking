import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/Services/user/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {
  nom: string = '';
  prenom: string = '';
  email: string = '';
  numerotelephone: string = '';
  adresse: string = '';
  login: string = '';
  mdp: string = '';
  userRole: 'CLIENT' | 'CONCIERGE' | 'ADMIN' = 'CLIENT';
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private router: Router,
    private renderer: Renderer2,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.renderer.setStyle(document.body, 'background', "url('assets/images/FigeacFro.webp') no-repeat center center fixed");
    this.renderer.setStyle(document.body, 'backgroundSize', 'cover');
  }

  ngOnDestroy(): void {
    this.renderer.removeStyle(document.body, 'background');
    this.renderer.removeStyle(document.body, 'backgroundSize');
  }

onSubmit() {
  this.errorMessage = null;
  this.successMessage = null;

  // Vérification des champs obligatoires
  if (!this.nom || !this.prenom || !this.email || !this.numerotelephone || !this.adresse || !this.login || !this.mdp) {
    this.errorMessage = 'Veuillez remplir tous les champs obligatoires.';
    return;
  }

  // Vérification du format email
  if (!this.isValidEmail(this.email)) {
    this.errorMessage = 'Veuillez entrer un e-mail valide.';
    return;
  }

  // Vérification numéro de téléphone
  if (!this.isValidPhoneNumber(this.numerotelephone)) {
    this.errorMessage = 'Le numéro de téléphone doit contenir exactement 8 chiffres.';
    return;
  }

  const user = {
    nom: this.nom,
    prenom: this.prenom,
    email: this.email,
    numerotelephone: this.numerotelephone,
    adresse: this.adresse,
    login: this.login,
    mdp: this.mdp,
    userRole: this.userRole,
    actif: true,
    approved: 2,
    cin: '',
    derniercnx: ''
  };

  this.userService.register(user).subscribe({
    next: (res) => {
      this.successMessage = 'Inscription réussie ! Vous pouvez maintenant vous connecter.';
      this.router.navigate(['/login']);
    },
    error: (err) => {
      // The backend sends the message in err.error.message
      if (err.error && err.error.message) {
        this.errorMessage = err.error.message;
      } else {
        this.errorMessage = "L'inscription a échoué. Veuillez réessayer.";
      }
    }
  });
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
