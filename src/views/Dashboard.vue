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
            <DashboardSidebar :cityName="selectedCity" :medicineData="medicineData" />
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import TurkiyeCitiesMapComponent from '../components/TurkiyeCitiesMapComponent.vue'
import DashboardTopbar from '../components/DashboardTopbar.vue'
import DashboardSidebar from '../components/DashboardSidebar.vue'
import { getMedicinesByCity } from '../data/mockMedicineData'

const selectedCity = ref("Türkiye Geneli")

const medicineData = computed(() => {
    return getMedicinesByCity(selectedCity.value)
})

const openSidebar = (cityName) => {
    selectedCity.value = cityName
}

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
