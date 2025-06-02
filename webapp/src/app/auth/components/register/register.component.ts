import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { confirmPasswordValidator } from '../../validators/confirm-password.validator';
import { AuthService } from '../../services/auth.service';
import { register } from '../../interfaces/registerDTO';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, ToastModule, CommonModule],
  providers: [MessageService],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export default class RegisterComponent {
  registerForm;
  isLoading: boolean = false;
  userData: register | undefined;

  private authService = inject(AuthService);

  constructor(private fb: FormBuilder, private messageService: MessageService) {
    this.registerForm = this.fb.group(
      {
        name: this.fb.nonNullable.control('', Validators.required),
        email: this.fb.nonNullable.control('', [
          Validators.required,
          Validators.email,
        ]),
        password: this.fb.nonNullable.control('', [
          Validators.required,
          Validators.minLength(6),
        ]),
        confirmPassword: this.fb.nonNullable.control('', [
          Validators.required,
          Validators.minLength(6),
        ]),
      },
      { validators: confirmPasswordValidator }
    );
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      if (this.registerForm.hasError('passwordMismatch')) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Las contraseñas no coinciden',
          detail: 'Revisa los campos de contraseña.',
        });
      }
      return;
    }

    const { name, email, password } = this.registerForm.value;
    this.userData = { name, email, password } as register;

    this.authService
      .register(this.userData)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Registro exitoso',
            detail: 'Usuario registrado correctamente.',
          });
          this.registerForm.reset();
        },
        error: (error) => {
          console.error('Error en el registro:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error en el registro',
            detail: 'No se pudo registrar el usuario. Inténtalo de nuevo.',
          });
        },
      });
  }
}
