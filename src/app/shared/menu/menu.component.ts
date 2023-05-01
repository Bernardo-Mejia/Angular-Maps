import { Component } from '@angular/core';

interface IMenuItems {
  ruta: string;
  nombre: string;
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styles: [
    `
      li {
        cursor: pointer;
      }
    `,
  ],
})
export class MenuComponent {
  constructor() {}

  menuItems: IMenuItems[] = [
    {
      ruta: '/mapas/fullscreen',
      nombre: 'Fullscreen',
    },
    {
      ruta: '/mapas/zoom-range',
      nombre: 'Zoom Range',
    },
    {
      ruta: '/mapas/marcadores',
      nombre: 'Marcadores',
    },
    {
      ruta: '/mapas/propiedades',
      nombre: 'Propiedades',
    },
  ];
}
