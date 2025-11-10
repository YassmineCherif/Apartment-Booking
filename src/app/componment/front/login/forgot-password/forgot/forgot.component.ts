import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { UserService } from 'src/app/Services/user/user.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css']
})
export class ForgotComponent implements OnInit, OnDestroy {
  email: string = '';
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private renderer: Renderer2, private userService: UserService) {}

  ngOnInit(): void {
    this.renderer.setStyle(
      document.body,
      'background',
      "url('assets/images/FigeacFro.webp') no-repeat center center fixed"
    );
    this.renderer.setStyle(document.body, 'backgroundSize', 'cover');
  }

  ngOnDestroy(): void {
    this.renderer.removeStyle(document.body, 'background');
    this.renderer.removeStyle(document.body, 'backgroundSize');
  }


  

  onSubmit() {
  this.errorMessage = null;
  this.successMessage = null;

  if (!this.email) {
    this.errorMessage = "Veuillez entrer votre adresse e-mail.";
    return;
  }

  const emailRegex = /.+@.+\..+/;
  if (!emailRegex.test(this.email)) {
    this.errorMessage = "Veuillez entrer une adresse e-mail valide.";
    return;
  }

this.userService.sendRecoveryEmail(this.email).subscribe({
  next: (res: any) => {
    this.successMessage = res || "Un e-mail de récupération a été envoyé.";
  },
  error: (err) => {
    this.errorMessage = err.error || "Impossible d'envoyer l'e-mail de récupération.";
  }
});

}




}
