import { Component, effect, inject, OnInit } from '@angular/core';
import { ApiConfigService } from '../services/api-config/api-config.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { TabsModule } from 'primeng/tabs';
import { TagModule } from 'primeng/tag';
import { ApiToken, CreateApiTokenDto, EditingState, ExpandedRowsState, OriginalValues, UpdateApiTokenDto, } from '../../shared/models/api-token.model';
import { ApiTokenRowComponent } from './api-token-row/api-token-row.component';
import { ApiTokenDetailsComponent } from './api-token-details/api-token-details.component';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ModalComponent } from '../../shared/modal/modal.component';
import { AddApiTokenComponent } from './add-api-token/add-api-token.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-api-config',
  imports: [ CommonModule, FormsModule, DropdownModule, TableModule, TooltipModule, ButtonModule, MessageModule, ToastModule, TabsModule, TagModule, ApiTokenRowComponent, ApiTokenDetailsComponent, ModalComponent, AddApiTokenComponent, ProgressSpinnerModule, SkeletonModule],
  providers: [MessageService],
  templateUrl: './api-config.component.html',
  styleUrl: './api-config.component.scss',
})
export default class ApiConfigComponent implements OnInit {
  private apiConfigService = inject(ApiConfigService);
  private messageService = inject(MessageService);
  showAddModal = false;

  // ESTADO LOCAL
  tokens: ApiToken[] = [];
  expandedRows: ExpandedRowsState = {};
  isEditing: EditingState = {};
  originalValues: OriginalValues = {};
  isLoading: boolean = false;
  isInit: boolean = true;

  constructor(){
    effect(() => {
      this.tokens = this.apiConfigService.tokens();
    });
  }

  ngOnInit(): void {
    this.loadTokens();
  }

  openAddModal() {
    this.showAddModal = true;
  }

  closeAddModal(){
    this.showAddModal = false;
  }

  onTokenCreated(token: CreateApiTokenDto) {
    this.showAddModal = false;
    this.isLoading = true;
    this.apiConfigService.createApiToken(token).subscribe({
      next: (data) =>{
        this.isLoading = false;
        this.messageService.add({
        severity: 'success',
        summary: 'Token creado',
        detail: 'El token se ha creado crrectamente',
      });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo crear el token',
        });
        this.isLoading = false;
      },
    })
  }

  private loadTokens(): void {
    this.isInit = true;
    this.apiConfigService.getApiTokens().subscribe({
      next: (tokens) => {
        this.tokens = tokens
        this.isInit = false;
      },
      error: (err) => {
        this.isInit = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error al cargar los datos',
          detail: 'No se lograron obtener los api key guardados'
        })
      } 
    });
  }

  onEdit(token: ApiToken): void {
    this.originalValues[token.id] = { ...token };
    this.isEditing[token.id] = true;
    this.expandedRows[token.id] = true;
  }

  saveToken(token: ApiToken): void {
    const dto: UpdateApiTokenDto = {
      descripcion: token.descripcion,
      estado: token.estado,
      apiKey: token.apiKey,
      serverUrl: token.serverUrl,
    };

    this.isLoading = true;
    this.apiConfigService.updateApiToken(token.id, dto).subscribe({
      next: (updated) => {
        this.tokens = this.tokens.map((t) =>
          t.id === updated.id ? updated : t
        );
        this.isEditing[token.id] = false;
        delete this.originalValues[token.id];
        this.messageService.add({
          severity: 'success',
          summary: 'Token actualizado',
          detail: 'El token se ha actualizado correctamente',
        });
        this.isLoading = false;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error al guardar',
          detail: 'No se pudo actualizar el token',
        });
        this.isLoading = false;
        this.cancelEdit(token);
      },
    });
  }

  cancelEdit(token: ApiToken): void {
    Object.assign(token, this.originalValues[token.id]);
    delete this.originalValues[token.id];
    this.isEditing[token.id] = false;
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text)
  }

  onDelete(token: ApiToken): void {
    if (
      !confirm(
        `¿Seguro que quieres desactivar el token "${token.descripcion}"?`
      )
    ) {
      return;
    }
    this.isLoading = true;
    this.apiConfigService.deleteApiToken(token.id).subscribe({
      next: () => {
        this.tokens = this.tokens.filter((t) => t.id !== token.id);
        this.messageService.add({
          severity: 'success',
          summary: 'Token eliminado',
          detail: 'El token se ha eliminado correctamente',
        });
        this.isLoading = false;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error al eliminar',
          detail: 'No se pudo desactivar el token',
        });
        this.isLoading = false;
      },
    });
  }
}
