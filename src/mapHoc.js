import mapboxgl from "mapbox-gl";
import L from "leaflet";
import {} from "mapbox-gl-leaflet";
import * as RL from "react-leaflet";

window.mapboxgl = mapboxgl;

class MapBoxGLLayer extends RL.GridLayer {
  createLeafletElement(props) {
    return L.mapboxGL(props);
  }
}

export default RL.withLeaflet(MapBoxGLLayer);
