import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/Services/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  login: string = '';
  password: string = '';
  errorMessage: string | null = null;

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
    this.userService.login(this.login, this.password).subscribe({
      next: (response: any) => {
        sessionStorage.setItem('isAuthenticated', 'true');
        sessionStorage.setItem('login', this.login);
        if (response?.role) {
          sessionStorage.setItem('role', response.role.toUpperCase()); // store role
        }

        // Redirect based on role
        const role = (response?.role || '').toUpperCase();
        if (role === 'ADMIN') {
          this.router.navigate(['/admin']);
        } else if (role === 'CONCIERGE') {
          this.router.navigate(['/admin']);  
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        if (err?.status === 403) {
          this.errorMessage = 'Compte non encore approuvé';
        } else {
          this.errorMessage = 'Identifiant ou mot de passe incorrect';
        }
      }
    });
  }
}
