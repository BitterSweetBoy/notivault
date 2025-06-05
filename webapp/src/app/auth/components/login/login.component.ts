import { Component, inject } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { login } from '../../interfaces/loginDTO';
import { finalize } from 'rxjs';
import { LoadingSpinnerComponent } from "../../../shared/loading-spinner/loading-spinner.component";

@Component({
  selector: 'app-login',
  imports: [ToastModule, CommonModule, ReactiveFormsModule, LoadingSpinnerComponent],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export default class LoginComponent {
  loginForm: FormGroup;
  userData: login | undefined;
  isLoading: boolean = false;

  private authService = inject(AuthService);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  onLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    const { email, password } = this.loginForm.value;
    this.userData = { email, password };
    console.log(this.userData);
    this.authService
      .login(this.userData)
      .subscribe({
        next: (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Login exitoso',
            detail: 'Bienvenido de nuevo',
          });
          this.router.navigate(['/']);
          this.isLoading = false
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error en el login',
            detail: err.error.message || 'Credenciales incorrectas',
          });
          this.isLoading = false
        },
      });
  }
}
