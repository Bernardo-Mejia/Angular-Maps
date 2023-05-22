import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-full-screen',
  templateUrl: './full-screen.component.html',
  styles: [
    `
      #mapa {
        height: 100%;
        width: 100%;
      }
    `,
  ],
})
export class FullScreenComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    let map = new mapboxgl.Map({
      container: 'mapa',
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-103.3529, 24],
      zoom: 4.7,
      minZoom: 4.7,
      dragPan: true,
      // interactive: false,
      dragRotate: false,
      attributionControl: false,
    }); // https://docs.mapbox.com/api/maps/styles/

    // ? info map
    const data = [
      { code: 'MEX', hdi: 0.922 },
      { code: 'Durango', hdi: 0.8 },
    ];

    // #region Para colorear México

    map.on('load', () => {
      // Add source for country polygons using the Mapbox Countries tileset
      // The polygons contain an ISO 3166 alpha-3 code which can be used to for joining the data
      // https://docs.mapbox.com/vector-tiles/reference/mapbox-countries-v1
      // * Aquí van los datos GeoJSON
      map.addSource('countries', {
        type: 'vector',
        url: 'mapbox://mapbox.country-boundaries-v1',
      });

      // Build a GL match expression that defines the color for every vector tile feature
      // Use the ISO 3166-1 alpha 3 code as the lookup key for the country shape
      const matchExpression: any = ['match', ['get', 'iso_3166_1_alpha_3']];

      // Calculate color values for each country based on 'hdi' value
      for (const row of data) {
        // Convert the range of data values to a suitable color
        const green = row['hdi'] * 255,
          red = row['hdi'] * 255,
          blue = row['hdi'] * 255;
        const color_green = `rgb(0, ${green}, 0)`;
        const color_red = `rgb(${red}, 0, 0)`;
        const color_blue = `rgb(0, 0, ${blue})`;

        matchExpression.push(row['code'], color_blue);
      }

      // Last value is the default, used where there is no data
      matchExpression.push('rgba(0, 0, 0, 0)');

      // The mapbox.country-boundaries-v1 tileset includes multiple polygons for some
      // countries with disputed borders.  The following expression filters the
      // map view to show the "US" perspective of borders for disputed countries.
      // Other world views are available, for more details, see the documentation
      // on the "worldview" feature property at
      // https://docs.mapbox.com/data/tilesets/reference/mapbox-countries-v1/#--polygon---worldview-text
      const WORLDVIEW = 'US';
      const worldview_filter = [
        'all',
        ['==', ['get', 'disputed'], 'false'],
        [
          'any',
          ['==', 'all', ['get', 'worldview']],
          ['in', WORLDVIEW, ['get', 'worldview']],
        ],
      ];

      // Add layer from the vector tile source to create the choropleth
      // Insert it below the 'admin-1-boundary-bg' layer in the style
      map.addLayer(
        {
          id: 'countries-join',
          type: 'fill',
          source: 'countries',
          'source-layer': 'country_boundaries',
          paint: {
            'fill-color': matchExpression,
          },
          filter: worldview_filter,
        },
        'admin-1-boundary-bg'
      );
    });

    //#endregion
  }
}
