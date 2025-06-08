import { Component, inject, OnInit } from '@angular/core';
import { ApiConfigService } from '../services/api-config/api-config.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {DropdownModule} from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { TabsModule } from 'primeng/tabs';
import { TagModule } from 'primeng/tag';
import { ApiToken, EditingState, ExpandedRowsState, OriginalValues } from '../../shared/models/api-token.interface';
import { ApiTokenRowComponent } from "./api-token-row/api-token-row.component";
import { ApiTokenDetailsComponent } from "./api-token-details/api-token-details.component";

@Component({
  selector: 'app-api-config',
  imports: [CommonModule, FormsModule, DropdownModule, TableModule, TooltipModule, ButtonModule, MessageModule, TabsModule, TagModule, ApiTokenRowComponent, ApiTokenDetailsComponent],
  templateUrl: './api-config.component.html',
  styleUrl: './api-config.component.scss'
})
export default class ApiConfigComponent implements OnInit {
  
  private apiConfigService = inject(ApiConfigService);
  tokens: ApiToken[] = [];

  expandedRows: ExpandedRowsState = {};
  isEditing: EditingState = {};
  originalValues: OriginalValues = {};

  ngOnInit(): void {
    this.tokens = this.apiConfigService.getApiTokens();
  }

  onRowExpand(event: any): void {
    console.log('Fila expandida:', event.data);
  }

  onRowCollapse(event: any): void {
    console.log('Fila colapsada:', event.data);
    if (this.isEditing[event.data.id]) {
      this.cancelEdit(event.data);
    }
  }

  onEdit(token: ApiToken): void {
    this.originalValues[token.id] = { ...token };
    this.isEditing[token.id] = true;
    this.expandedRows[token.id] = true;
  }

  saveToken(token: ApiToken): void {
    console.log('Guardando token:', token);
    this.isEditing[token.id] = false;
    delete this.originalValues[token.id];
    token.ultimaModificacion = new Date();
  }

  cancelEdit(token: ApiToken): void {
    if (this.originalValues[token.id]) {
      Object.assign(token, this.originalValues[token.id]);
      delete this.originalValues[token.id];
    }
    this.isEditing[token.id] = false;
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Copiado al portapapeles');
    });
  }

  onDelete(token: ApiToken): void {
    console.log('Eliminar:', token);
  }

}
