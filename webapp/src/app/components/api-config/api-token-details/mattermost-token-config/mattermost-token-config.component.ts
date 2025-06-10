import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ApiToken } from '../../../../shared/models/api-token.model';
import { FormatDatePipe } from "../../../../shared/pipes/format-date.pipe";

@Component({
  selector: 'app-mattermost-token-config',
  imports: [CommonModule, FormsModule, ButtonModule, TooltipModule, FormatDatePipe],
  templateUrl: './mattermost-token-config.component.html',
  styleUrl: './mattermost-token-config.component.scss'
})
export class MattermostTokenConfigComponent {
  @Input() token!: ApiToken;
  @Input() isEditing: boolean = false;
  
  @Output() copy = new EventEmitter<string>();
  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onCopy(text: string): void {
    this.copy.emit(text);
  }

  onSave(): void {
    this.save.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }

}
