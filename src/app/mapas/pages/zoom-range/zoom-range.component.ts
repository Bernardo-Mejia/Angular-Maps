import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styles: [
    `
      .mapa-container {
        height: 100%;
        width: 100%;
      }

      .row {
        background-color: white;
        bottom: 50px;
        left: 50px;
        border-radius: 5px;
        padding: 10px;
        position: fixed;
        z-index: 999;
      }

      button {
        font-size: 30px;
      }
    `,
  ],
})
export class ZoomRangeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  zoomLevel: number = 10;
  center: [number, number] = [-98.8433249286521, 19.251896786056903];

  constructor() {}

  ngOnDestroy(): void {
    this.mapa.off('zoom', () => {});
    this.mapa.off('zoomend', () => {});
    this.mapa.off('move', () => {});
  }

  ngAfterViewInit(): void {
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: this.center,
      zoom: this.zoomLevel,
    });

    this.mapa.on('zoom', () => (this.zoomLevel = this.mapa.getZoom()));

    this.mapa.on('zoomend', () => {
      if (this.mapa.getZoom() > 18) this.mapa.zoomTo(18);
    });

    this.mapa.on('move', (e) => {
      const target = e.target;
      const { lng, lat } = target.getCenter();
      this.center = [lng, lat];
    });
  }

  zoomOut() {
    this.mapa.zoomOut();
    // this.zoomLevel = this.mapa.getZoom();
  }

  zoomIn() {
    this.mapa.zoomIn();
    // this.zoomLevel = this.mapa.getZoom();
  }

  zoomChanges(val: string) {
    this.mapa.zoomTo(Number(val));
  }
}
