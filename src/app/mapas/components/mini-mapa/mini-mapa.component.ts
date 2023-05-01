import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-mini-mapa',
  templateUrl: './mini-mapa.component.html',
  styles: [
    `
      div {
        width: 100%;
        height: 150px;
        margin: 0;
      }
    `,
  ],
})
export class MiniMapaComponent implements AfterViewInit {
  @Input() LngLat: [number, number] = [0, 0];
  @ViewChild('map') divMapa!: ElementRef;
  constructor() {}

  ngAfterViewInit(): void {
    let map = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/navigation-night-v1',
      // style: 'mapbox://styles/mapbox/navigation-day-v1',
      center: this.LngLat,
      zoom: 15,
      interactive: false,
    }); // https://docs.mapbox.com/api/maps/styles/

    new mapboxgl.Marker().setLngLat(this.LngLat).addTo(map);
  }
}
