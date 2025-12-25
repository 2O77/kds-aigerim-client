<template>
    <div class="dashboard-page">
        <div class="topbar-section">
            <PharmacyHeader :cityName="selectedCity" @reset-to-turkey="resetToTurkey" />
        </div>
        <div class="dashboard-content">
            <div class="map-section">
                <TurkeyMapViewer @openSidebar="openSidebar" />
            </div>
            <div class="statistics-section">
                <SalesInsightsPanel 
                    :cityName="selectedCity" 
                    :periodMonths="selectedPeriod"
                    :medicineData="medicineData"
                    :loading="loading"
                    @period-change="handlePeriodChange"
                />
            </div>
            <div class="sidebar-section">
                <MedicineDetailsPanel 
                    :cityName="selectedCity" 
                    :medicineData="medicineData" 
                    :loading="loading" 
                    :error="error"
                    :periodMonths="selectedPeriod"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import TurkeyMapViewer from '../components/TurkeyMapViewer.vue'
import PharmacyHeader from '../components/PharmacyHeader.vue'
import MedicineDetailsPanel from '../components/MedicineDetailsPanel.vue'
import SalesInsightsPanel from '../components/SalesInsightsPanel.vue'

const selectedCity = ref("Türkiye Geneli")
const medicineData = ref([])
const loading = ref(false)
const error = ref(null)
const selectedPeriod = ref(12)

const handlePeriodChange = (period) => {
    selectedPeriod.value = period
}

const resetToTurkey = () => {
    selectedCity.value = 'Türkiye Geneli'
}

const fetchMedicines = async (city) => {
    loading.value = true
    error.value = null
    
    try {
        let url = 'http://localhost:3000/api/medicines'
        
        if (city && city !== 'Türkiye Geneli') {
            url += `?city=${encodeURIComponent(city)}`
        }
        
        const response = await fetch(url)
        
        if (!response.ok) {
            throw new Error('Veri yüklenemedi')
        }
        
        const data = await response.json()
        medicineData.value = data.medicines || []
    } catch (err) {
        console.error('API hatası:', err)
        error.value = err.message
        medicineData.value = []
    } finally {
        loading.value = false
    }
}

const openSidebar = (cityName) => {
    selectedCity.value = cityName
}

watch(selectedCity, (newCity) => {
    if (newCity) {
        fetchMedicines(newCity)
    }
}, { immediate: true })

onMounted(() => {
    fetchMedicines(selectedCity.value)
})

</script>

<style scoped>
.dashboard-page {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--background-color);
}

.topbar-section {
    height: 100px;
    width: 100%;
    flex-shrink: 0;
}

.dashboard-content {
    flex: 1;
    display: grid;
    grid-template-columns: 1.2fr 0.7fr 500px;
    gap: 0;
    overflow: hidden;
    min-height: 0;
}

.map-section {
    display: flex;
    width: 100%;
    height: 100%;
    padding: 15px 5px 15px 15px;
    justify-content: center;
    align-items: center;
    overflow: hidden;
}

.statistics-section {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 15px 10px 15px 5px;
    overflow: hidden;
    box-sizing: border-box;
}

.sidebar-section {
    width: 100%;
    height: 100%;
    overflow-y: auto;
}

@media (max-width: 1600px) {
    .dashboard-content {
        grid-template-columns: 1.2fr 0.7fr 480px;
    }
}

@media (max-width: 1400px) {
    .dashboard-content {
        grid-template-columns: 1fr 450px;
    }

    .statistics-section {
        display: none;
    }
}

@media (max-width: 1100px) {
    .dashboard-content {
        grid-template-columns: 1fr 400px;
    }

    .map-section {
        padding: 10px;
    }
}

@media (max-width: 900px) {
    .dashboard-content {
        grid-template-columns: 1fr;
    }

    .sidebar-section {
        display: none;
    }
}
</style>
