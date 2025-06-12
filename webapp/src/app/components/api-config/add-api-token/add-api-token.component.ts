import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateApiTokenDto } from '../../../shared/models/api-token.model';
import { CommonModule} from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IntegrationServices } from '../../../shared/models/integration-services.model';
import { IntegrationService } from '../../services/api-services/integration-service.service';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-add-api-token',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SelectModule, ButtonModule],
  templateUrl: './add-api-token.component.html',
  styleUrl: './add-api-token.component.scss'
})
export class AddApiTokenComponent {

  @Output() created = new EventEmitter<CreateApiTokenDto>();
  @Output() cancel = new EventEmitter<void>();
  form!: FormGroup;
  submitted = false;

  servicios: IntegrationServices[] = [];
  integrationService = inject(IntegrationService)

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      integrationServiceId: [null, Validators.required],
      apiKey: ['', Validators.required],
      serverUrl: [''],
      descripcion: ['', Validators.required],
      estado: ['conectado'],
    });

    this.form.get('integrationServiceId')!.valueChanges.subscribe(id => {
      const selected = this.servicios.find(s => s.id === id);
      const urlCtrl = this.form.get('serverUrl')!;
      if (selected?.nombre === 'Plane.so') {
        urlCtrl.disable();
        urlCtrl.setValue('');
      } else {
        urlCtrl.enable();
      }
    });
  }

  ngOnInit() {
    this.loadIntegrationService();    
  }

  getSelectedServiceName(): string {
    const id = this.form.get('integrationServiceId')?.value;
    const selected = this.servicios.find(s => s.id === id);
    return selected?.nombre || '';
  }

  private loadIntegrationService(): void {
    this.integrationService.getIntegrationServices().subscribe({
      next: (services) => {
        this.servicios = services
      },
      error: err => console.log("Error cargando los servicios de integración")
    })
  }

  submit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    const dto: CreateApiTokenDto = {
      integrationServiceId: this.form.value.integrationServiceId,
      descripcion: this.form.value.descripcion,
      estado: this.form.value.estado,
      apiKey: this.form.value.apiKey,
      serverUrl: this.form.value.serverUrl || undefined,
    };

    this.created.emit(dto)
  }

  onCancel(){
    this.form.reset({ estado: 'conectado' });
    this.submitted = false;
    this.cancel.emit();
  }

}
