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
const citySalesData = ref({})
const maxSales = ref(0)
const minSales = ref(0)

const emit = defineEmits(['openSidebar'])

const formatNumber = (num) => {
  return new Intl.NumberFormat('tr-TR').format(num)
}

const getColorBySales = (sales) => {
  if (!sales || maxSales.value === 0) return '#06b6d4'
  
  const normalized = (sales - minSales.value) / (maxSales.value - minSales.value)
  
  const colors = [
    '#dbeafe', // çok açık mavi (en düşük)
    '#bfdbfe', // açık mavi
    '#93c5fd', // orta-açık mavi
    '#60a5fa', // orta mavi
    '#3b82f6', // mavi
    '#2563eb', // koyu mavi
    '#1d4ed8', // daha koyu mavi
    '#1e40af', // çok koyu mavi
    '#1e3a8a', // en koyu mavi (en yüksek)
    '#172554'  // ultra koyu mavi
  ]
  
  const index = Math.floor(normalized * (colors.length - 1))
  return colors[Math.max(0, Math.min(index, colors.length - 1))]
}

const getBorderColorBySales = (sales) => {
  if (!sales || maxSales.value === 0) return '#0891b2'
  
  const normalized = (sales - minSales.value) / (maxSales.value - minSales.value)
  
  if (normalized > 0.7) return '#155e75'
  if (normalized > 0.4) return '#0891b2'
  return '#06b6d4'
}

const fetchCitySales = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/medicines/total-sales')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    console.log('API Response:', data)
    
    if (!data.cities || !Array.isArray(data.cities)) {
      console.error('Geçersiz API response formatı:', data)
      return {}
    }
    
    const salesMap = {}
    
    data.cities.forEach(city => {
      salesMap[city.city] = city.totalSales
    })
    
    console.log('Oluşturulan satış haritası (ilk 5):', Object.entries(salesMap).slice(0, 5))
    
    citySalesData.value = salesMap
    
    if (data.cities.length > 0) {
      const salesValues = data.cities.map(c => c.totalSales)
      maxSales.value = Math.max(...salesValues)
      minSales.value = Math.min(...salesValues)
      console.log('Min sales:', minSales.value, 'Max sales:', maxSales.value)
    }
    
    return salesMap
  } catch (error) {
    console.error('Satış verileri yüklenirken hata:', error)
    return {}
  }
}

const loadMap = () => {
  map.value = L.map('map', {
    center: [38.9637, 35.2433],
    zoom: 6.7,
    minZoom: 5,
    maxZoom: 10,
    zoomDelta: 0.5,
    zoomSnap: 0.5
  })

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://github.com/ertugrulakdag/vue3-map-leafletjs" target="_blank">github.com/ertugrulakdag/vue3-map-leafletjs</a>'
  }).addTo(map.value)
}

const loadGeoJsonLayer = async (salesData) => {
  try {
    const response = await fetch(geoJsonUrl)
    if (!response.ok) {
      throw new Error("İl sınırları GeoJSON verisi yüklenirken hata oluştu.")
    }

    const geoJsonData = await response.json()
    
    console.log('Satış verileri (toplam):', Object.keys(salesData).length, 'şehir')
    console.log('Satış verileri (örnekler):', Object.keys(salesData).slice(0, 10))
    
    if (geoJsonData.features && geoJsonData.features.length > 0) {
      const geoCityNames = geoJsonData.features.map(f => f.properties.name)
      console.log('GeoJSON şehir isimleri (ilk 10):', geoCityNames.slice(0, 10))
      
      // Eşleşmeyen şehirleri bul
      const salesCityNames = Object.keys(salesData)
      const unmatched = geoCityNames.filter(geoName => !salesCityNames.includes(geoName))
      if (unmatched.length > 0) {
        console.warn('Eşleşmeyen GeoJSON şehirleri (ilk 10):', unmatched.slice(0, 10))
      }
      
      // Sales'te olup GeoJSON'da olmayan şehirler
      const unmatchedSales = salesCityNames.filter(salesName => !geoCityNames.includes(salesName))
      if (unmatchedSales.length > 0) {
        console.warn('Eşleşmeyen API şehirleri (ilk 10):', unmatchedSales.slice(0, 10))
      }
    }

    L.geoJSON(geoJsonData, {
      style: (feature) => {
        const cityName = feature.properties.name
        const sales = salesData[cityName] || 0
        
        return {
          color: getBorderColorBySales(sales),
          weight: 2,
          opacity: 0.8,
          fillColor: getColorBySales(sales),
          fillOpacity: 0.6
        }
      },
      onEachFeature: (feature, layer) => {
        const cityName = feature.properties.name
        const sales = salesData[cityName] || 0
        
        layer._cityName = cityName
        layer._sales = sales
        
        layer.bindTooltip(`
          <div style="font-weight: bold; font-size: 14px; margin-bottom: 4px;">${cityName}</div>
          <div style="font-size: 12px;">Toplam Satış: ${formatNumber(sales)}</div>
        `, {
          permanent: false,
          direction: 'auto',
          className: 'city-tooltip'
        })

        layer.on('mouseover', (e) => {
          const layer = e.target
          if (selectedLayer.value !== layer) {
            const citySales = layer._sales || 0
            layer.setStyle({
              color: getBorderColorBySales(citySales),
              fillColor: getColorBySales(citySales),
              weight: 3,
              fillOpacity: 0.8
            })
          }
        })

        layer.on('mouseout', (e) => {
          const layer = e.target
          if (selectedLayer.value !== layer) {
            const citySales = layer._sales || 0
            layer.setStyle({
              color: getBorderColorBySales(citySales),
              fillColor: getColorBySales(citySales),
              weight: 2,
              fillOpacity: 0.6
            })
          }
        })

        layer.on('click', () => {
          if (selectedLayer.value && selectedLayer.value._cityName) {
            const prevSales = selectedLayer.value._sales || 0
            selectedLayer.value.setStyle({
              color: getBorderColorBySales(prevSales),
              fillColor: getColorBySales(prevSales),
              fillOpacity: 0.6,
              weight: 2
            })
          }

          layer.setStyle({
            fillColor: '#0e7490',
            fillOpacity: 0.9,
            color: '#155e75',
            weight: 3
          })

          layer._cityName = cityName
          layer._sales = sales
          selectedLayer.value = layer
          emit('openSidebar', cityName)
        })
      }
    }).addTo(map.value)

  } catch (error) {
    console.error("GeoJSON verisi yüklenirken hata oluştu:", error)
  }
}

onMounted(async () => {
  loadMap()
  const salesData = await fetchCitySales()
  await loadGeoJsonLayer(salesData)
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

:deep(.city-tooltip) {
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid #0891b2;
  border-radius: 6px;
  padding: 8px 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  font-family: 'Inter', sans-serif;
  pointer-events: none;
}

:deep(.leaflet-tooltip-top:before),
:deep(.leaflet-tooltip-bottom:before),
:deep(.leaflet-tooltip-left:before),
:deep(.leaflet-tooltip-right:before) {
  border-top-color: #0891b2;
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