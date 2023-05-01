import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

interface IMarkerColor {
  color: string;
  marker?: mapboxgl.Marker;
  center?: [number, number];
}

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [
    `
      .mapa-container {
        height: 100%;
        width: 100%;
      }

      .list-group {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 99;
      }

      li {
        cursor: pointer;
      }
    `,
  ],
})
export class MarcadoresComponent implements AfterViewInit {
  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  zoomLevel: number = 10;
  center: [number, number] = [-98.8433249286521, 19.251896786056903];

  // Markers Array
  markers: IMarkerColor[] = [];

  constructor() {}

  ngAfterViewInit(): void {
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: this.center,
      zoom: this.zoomLevel,
    });

    /* const marketHtml: HTMLElement = document.createElement('div');
    marketHtml.innerHTML = `Hola mundo`;

    const marker = new mapboxgl.Marker()
      .setLngLat(this.center)
      .addTo(this.mapa); */

    this.readLocalStorage();
  }

  addMarker() {
    const color = '#xxxxxx'.replace(/x/g, (y) =>
        ((Math.random() * 16) | 0).toString(16)
      ),
      newMarker = new mapboxgl.Marker({
        draggable: true,
        color,
      })
        .setLngLat(this.center)
        .addTo(this.mapa);

    this.markers.push({
      color,
      marker: newMarker,
    });

    this.saveMarkerInLocalStorage();
    this.dragMarker(newMarker);
  }

  goToMarker(marker: mapboxgl.Marker) {
    this.mapa.flyTo({
      center: marker.getLngLat(),
    });
  }

  saveMarkerInLocalStorage() {
    const lngLatArr: IMarkerColor[] = [];
    this.markers.forEach((m) => {
      const color = m.color,
        { lng, lat } = m.marker!.getLngLat();

      lngLatArr.push({
        color,
        center: [lng, lat],
      });
    });

    localStorage.setItem('markers', JSON.stringify(lngLatArr));
  }

  readLocalStorage() {
    if (!localStorage.getItem('markers')) return;

    const lngLatArr: IMarkerColor[] = JSON.parse(
      localStorage.getItem('markers')!
    );

    lngLatArr.forEach((m) => {
      const newMarker = new mapboxgl.Marker({
        color: m.color,
        draggable: true,
      })
        .setLngLat(m.center!)
        .addTo(this.mapa);

      this.markers.push({
        marker: newMarker,
        color: m.color,
      });

      this.dragMarker(newMarker);
    });
  }

  deleteMarker(index: number) {
    this.markers[index].marker?.remove();
    this.markers.splice(index, 1);
    this.saveMarkerInLocalStorage();
  }

  dragMarker(markerDrag: mapboxgl.Marker) {
    markerDrag.on('dragend', () => {
      this.saveMarkerInLocalStorage();
    });
  }
}
