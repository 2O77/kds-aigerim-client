<template>
  <div class="map" id="map"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const map = ref(null)
const geoJsonUrl = '/tr-cities-utf8.json'
const selectedLayer = ref(null)

const emit = defineEmits(['openSidebar'])

const loadMap = () => {
  map.value = L.map('map', {
    center: [38.9637, 35.2433],
    zoom: 6.7,
    minZoom: 5,
    maxZoom: 10,
    zoomDelta: 0.5,
    zoomSnap: 0.5
  })

  // OpenStreetMap katmanını ekle
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://github.com/ertugrulakdag/vue3-map-leafletjs" target="_blank">github.com/ertugrulakdag/vue3-map-leafletjs</a>'
  }).addTo(map.value)

  loadGeoJsonLayer()
}

// Türkiye İl sınırları GeoJSON katmanını haritaya ekleyen fonksiyon
const loadGeoJsonLayer = async () => {
  try {
    const response = await fetch(geoJsonUrl)
    if (!response.ok) {
      throw new Error("İl sınırları GeoJSON verisi yüklenirken hata oluştu.")
    }

    const geoJsonData = await response.json()
    console.log('GeoJSON Verisi:', geoJsonData)

    L.geoJSON(geoJsonData, {
      style: {
        color: '#0891b2',
        weight: 2,
        opacity: 0.8,
        fillColor: '#06b6d4',
        fillOpacity: 0.2
      },
      onEachFeature: (feature, layer) => {
        layer.on('click', () => {
          if (selectedLayer.value) {
            selectedLayer.value.setStyle({
              color: '#0891b2',
              fillColor: '#06b6d4',
              fillOpacity: 0.2
            })
          }

          layer.setStyle({
            fillColor: '#0e7490',
            fillOpacity: 0.8,
            color: '#155e75',
            weight: 3
          })

          selectedLayer.value = layer
          emit('openSidebar', feature.properties.name)

        })
      }
    }).addTo(map.value)

  } catch (error) {
    console.error("GeoJSON verisi yüklenirken hata oluştu:", error)
  }
}

onMounted(() => {
  loadMap()
})
</script>

<style>
.map {
  width: 1300px;
  height: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
}

@media screen and (max-width: 1850px) {
  .map {
    width: 1000px;
  }
}

@media screen and (max-width: 1500px) {
  .map {
    width: 800px;
  }
}

@media screen and (max-width: 950px) {
  .map {
    width: 700px;
  }
}

@media screen and (max-width: 750px) {
  .map {
    width: 500px;
  }
}
</style>