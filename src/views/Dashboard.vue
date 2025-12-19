<template>
    <div class="dashboard-page">
        <div class="main">
            <div class="topbar-section">
                <DashboardTopbar />
            </div>
            <div class="map-section">
                <TurkiyeCitiesMapComponent @openSidebar="openSidebar" />
            </div>
        </div>
        <div class="sidebar-section">
            <DashboardSidebar :cityName="selectedCity" :medicineData="medicineData" :loading="loading" :error="error" />
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import TurkiyeCitiesMapComponent from '../components/TurkiyeCitiesMapComponent.vue'
import DashboardTopbar from '../components/DashboardTopbar.vue'
import DashboardSidebar from '../components/DashboardSidebar.vue'

const selectedCity = ref("Türkiye Geneli")
const medicineData = ref([])
const loading = ref(false)
const error = ref(null)

const fetchMedicines = async (city) => {
    loading.value = true
    error.value = null
    
    try {
        const response = await fetch(`http://localhost:3000/api/medicines?city=${encodeURIComponent(city)}`)
        
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
    height: 100%;
    display: flex;
    background: var(--background-color);
}

.sidebar-section {
    width: 700px;
}

.topbar-section {
    height: 100px;
    width: 100%;
}

.map-section {
    display: flex;
    width: 100%;
    height: 100%;
    margin-bottom: 20px;
    margin-left: 20px;
    margin-right: 20px;
    justify-content: center;
    align-items: center;
}

.main {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

@media (max-width: 1300px) {
    .sidebar-section {
        position: absolute;
        top: 0;
        right: 0;
        width: 100%;
        height: 100%;
        background: var(--background-color);
        z-index: 10000;
    }

    .map-section {
        margin: 10px;
    }
}
</style>
