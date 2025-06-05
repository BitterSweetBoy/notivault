import { Component, } from '@angular/core';
import {RouterOutlet, RouterLink, RouterLinkActive} from '@angular/router';
import {CommonModule} from '@angular/common';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {heroSquares2x2, heroCog8Tooth, heroBell, heroArchiveBox, heroUser} from '@ng-icons/heroicons/outline';


@Component({
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, NgIcon, RouterLinkActive],
  providers: [provideIcons({heroSquares2x2, heroCog8Tooth, heroBell, heroArchiveBox, heroUser})],
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  userName = 'Denis Dueñas';
  userImage = '';

  mainNav = [
    { label: 'Dashboard', icon: "heroSquares2x2", route: '/dashboard' },
    { label: 'Configuración de APIs', icon: "heroCog8Tooth", route: '/apis' },
    { label: 'Notificaciones', icon: "heroBell", route: '/notificaciones' },
    { label: 'Historial de Actividad', icon: "heroArchiveBox", route: '/actividad' },
  ];
}
