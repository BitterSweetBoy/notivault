import { Component, EventEmitter, Input, Output, output, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ApiToken } from '../../../shared/models/api-token.interface';

@Component({
  selector: 'app-api-token-row',
  imports: [CommonModule, FormsModule, ButtonModule, TooltipModule],
  templateUrl: './api-token-row.component.html',
  styleUrl: './api-token-row.component.scss',
  encapsulation: ViewEncapsulation.None,  // para que el estilo se aplique al host
  host: {
    '[style.display]': `'contents'`
  }
})
export class ApiTokenRowComponent {

  @Input() token!: ApiToken;
  @Input() expanded: boolean = false;

  @Output() edit = new EventEmitter<ApiToken>();
  @Output() delete = new EventEmitter<ApiToken>();
  @Output() toggleExpand  = new EventEmitter<ApiToken>();

  onEditClick(): void {
    this.edit.emit(this.token);
  }

  onDeleteClick(): void {
    this.delete.emit(this.token);
  }

  onToggleExpand(): void {
    this.toggleExpand.emit(this.token);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

}
