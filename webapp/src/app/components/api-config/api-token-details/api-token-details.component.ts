import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { ApiToken } from '../../../shared/models/api-token.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { MattermostTokenConfigComponent } from "./mattermost-token-config/mattermost-token-config.component";
import { PlaneTokenConfigComponent } from "./plane-token-config/plane-token-config.component";
@Component({
  selector: 'app-api-token-details',
  imports: [CommonModule, FormsModule, ButtonModule, TooltipModule, MattermostTokenConfigComponent, PlaneTokenConfigComponent],
  templateUrl: './api-token-details.component.html',
  styleUrl: './api-token-details.component.scss',
  encapsulation: ViewEncapsulation.None,  // para que el estilo se aplique al host
  host: {
    '[style.display]': `'contents'`
  }
})
export class ApiTokenDetailsComponent {
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
