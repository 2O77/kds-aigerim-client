<template>
    <div class="sidebar">
        <div class="title-box">
            <div class="title-text">
                <h1 class="text">{{ cityName }}</h1>
                <p class="text" v-if="selectedMedicine">{{ selectedMedicine.name }} - {{ selectedMedicine.manufacturer }}</p>
                <p class="text" v-else>İlaç seçiniz</p>
            </div>
        </div>
        <div class="sidebar-content">
            <div v-if="loading" class="loading-message">
                <p>Veriler yükleniyor...</p>
            </div>
            <div v-else-if="error" class="error-message">
                <p>Hata: {{ error }}</p>
            </div>
            <template v-else>
                <div class="search-section">
                    <AutoComplete 
                        v-model="searchQuery" 
                        :suggestions="filteredMedicines" 
                        @complete="searchMedicines"
                        @item-select="selectMedicine"
                        placeholder="İlaç ara..."
                        optionLabel="name"
                        class="medicine-search"
                        forceSelection
                        :pt="{
                            root: { style: 'width: 100%' },
                            input: { style: 'width: 100%' }
                        }"
                    >
                        <template #option="slotProps">
                            <div class="medicine-option">
                                <div class="medicine-name">{{ slotProps.option.name }}</div>
                                <div class="medicine-manufacturer">{{ slotProps.option.manufacturer }}</div>
                            </div>
                        </template>
                    </AutoComplete>
                </div>
                <div class="medicine-list" v-if="!selectedMedicine">
                <h3>Mevcut İlaçlar</h3>
                <div class="medicine-items">
                    <div 
                        v-for="medicine in medicineData" 
                        :key="medicine.id"
                        class="medicine-item"
                        @click="selectMedicineFromList(medicine)"
                    >
                        <div class="medicine-item-name">{{ medicine.name }}</div>
                        <div class="medicine-item-manufacturer">{{ medicine.manufacturer }}</div>
                    </div>
                </div>
            </div>
            <div class="sidebar-content-item" v-if="selectedMedicine">
                <div class="chart-header">
                    <h3>12 Aylık Satış Verisi</h3>
                    <Button 
                        size="small" 
                        severity="secondary" 
                        outlined 
                        @click="clearSelection"
                        label="Temizle"
                    />
                </div>
                <div class="chart-box">
                    <Chart v-if="salesChartData" type="bar" :data="salesChartData" :options="chartOptions" />
                </div>
            </div>
            <div class="sidebar-content-item" v-if="selectedMedicine">
                <h3>Mevsimsel Satış Dağılımı</h3>
                <div class="chart-box">
                    <Chart v-if="seasonalChartData" type="bar" :data="seasonalChartData" :options="seasonalChartOptions" />
                </div>
            </div>
            <div class="sidebar-content-item" v-if="selectedMedicine">
                <h3>Pazar Payı</h3>
                <div class="chart-box">
                    <Chart v-if="marketShareChartData" type="doughnut" :data="marketShareChartData" :options="doughnutChartOptions" />
                </div>
            </div>
            </template>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
    cityName: String,
    medicineData: Array,
    loading: Boolean,
    error: String,
});

const searchQuery = ref('');
const selectedMedicine = ref(null);
const filteredMedicines = ref([]);

const months = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz',
    'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

const calculateSeasonalSales = (monthlySales) => {
    if (!monthlySales || monthlySales.length !== 12) return null;
    
    const winter = monthlySales.slice(0, 3).reduce((sum, val) => sum + val, 0);
    const spring = monthlySales.slice(3, 6).reduce((sum, val) => sum + val, 0);
    const summer = monthlySales.slice(6, 9).reduce((sum, val) => sum + val, 0);
    const fall = monthlySales.slice(9, 12).reduce((sum, val) => sum + val, 0);
    
    const total = winter + spring + summer + fall;
    
    if (total === 0) return { Kış: 0, İlkbahar: 0, Yaz: 0, Sonbahar: 0 };
    
    return {
        Kış: Math.round((winter / total) * 100),
        İlkbahar: Math.round((spring / total) * 100),
        Yaz: Math.round((summer / total) * 100),
        Sonbahar: Math.round((fall / total) * 100)
    };
};

const calculateMarketShare = (medicineId) => {
    if (!props.medicineData || props.medicineData.length === 0) return 0;
    
    const totalSales = props.medicineData.reduce((sum, med) => {
        const medTotal = med.monthlySales ? med.monthlySales.reduce((a, b) => a + b, 0) : 0;
        return sum + medTotal;
    }, 0);
    
    if (totalSales === 0) return 0;
    
    const currentMedicine = props.medicineData.find(m => m.id === medicineId);
    if (!currentMedicine || !currentMedicine.monthlySales) return 0;
    
    const currentTotal = currentMedicine.monthlySales.reduce((a, b) => a + b, 0);
    return Number(((currentTotal / totalSales) * 100).toFixed(1));
};

const searchMedicines = (event) => {
    const query = event.query.toLowerCase();
    if (!query) {
        filteredMedicines.value = props.medicineData;
    } else {
        filteredMedicines.value = props.medicineData.filter(medicine => 
            medicine.name.toLowerCase().includes(query) || 
            medicine.manufacturer.toLowerCase().includes(query)
        );
    }
};

const selectMedicine = (event) => {
    selectedMedicine.value = event.value;
    searchQuery.value = '';
};

const selectMedicineFromList = (medicine) => {
    selectedMedicine.value = medicine;
    searchQuery.value = '';
};

const clearSelection = () => {
    selectedMedicine.value = null;
    searchQuery.value = '';
};

const salesChartData = computed(() => {
    if (!selectedMedicine.value) return null;

    return {
        labels: months,
        datasets: [
            {
                label: 'Satış Miktarı (Adet)',
                data: selectedMedicine.value.monthlySales,
                backgroundColor: 'rgba(6, 182, 212, 0.2)',
                borderColor: '#0891b2',
                borderWidth: 2,
                hoverBackgroundColor: 'rgba(6, 182, 212, 0.4)',
                hoverBorderColor: '#0e7490',
            },
        ],
    };
});

const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
        legend: {
            display: true,
            position: 'top',
        },
    },
    scales: {
        y: {
            beginAtZero: true,
            ticks: {
                stepSize: 100
            }
        }
    }
};

const seasonalChartData = computed(() => {
    if (!selectedMedicine.value || !selectedMedicine.value.monthlySales) return null;

    const seasonalSales = calculateSeasonalSales(selectedMedicine.value.monthlySales);
    if (!seasonalSales) return null;

    return {
        labels: Object.keys(seasonalSales),
        datasets: [
            {
                label: 'Mevsimsel Satış Dağılımı (%)',
                data: Object.values(seasonalSales),
                backgroundColor: [
                    'rgba(59, 130, 246, 0.6)',
                    'rgba(16, 185, 129, 0.6)',
                    'rgba(251, 191, 36, 0.6)',
                    'rgba(249, 115, 22, 0.6)'
                ],
                borderColor: [
                    'rgb(59, 130, 246)',
                    'rgb(16, 185, 129)',
                    'rgb(251, 191, 36)',
                    'rgb(249, 115, 22)'
                ],
                borderWidth: 2,
            },
        ],
    };
});

const seasonalChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
        legend: {
            display: false,
        },
        tooltip: {
            callbacks: {
                label: function(context) {
                    return context.label + ': %' + context.parsed.y;
                }
            }
        }
    },
    scales: {
        y: {
            beginAtZero: true,
            max: 50,
            ticks: {
                callback: function(value) {
                    return '%' + value;
                }
            }
        }
    }
};

const marketShareChartData = computed(() => {
    if (!selectedMedicine.value) return null;

    const currentShare = calculateMarketShare(selectedMedicine.value.id);
    const otherShare = 100 - currentShare;

    return {
        labels: [selectedMedicine.value.name, 'Diğer İlaçlar'],
        datasets: [
            {
                data: [currentShare, otherShare],
                backgroundColor: [
                    'rgba(8, 145, 178, 0.8)',
                    'rgba(203, 213, 225, 0.5)'
                ],
                borderColor: [
                    'rgb(8, 145, 178)',
                    'rgb(203, 213, 225)'
                ],
                borderWidth: 2,
            },
        ],
    };
});

const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
        legend: {
            display: true,
            position: 'bottom',
        },
        tooltip: {
            callbacks: {
                label: function(context) {
                    return context.label + ': %' + context.parsed.toFixed(1);
                }
            }
        }
    }
};

watch(() => props.cityName, () => {
    clearSelection();
});

watch(() => props.medicineData, () => {
    clearSelection();
    if (props.medicineData && props.medicineData.length > 0) {
        filteredMedicines.value = props.medicineData;
    }
}, { immediate: true });
</script>


<style scoped>
.sidebar {
    width: 100%;
    height: 100%;
    border: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
    background: var(--background-color);
}

.title-box {
    width: 100%;
    height: 111px;
    min-height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 8px;
    border: none;
    position: relative;
    background: var(--background-color);
}

.text {
    padding: 0;
    margin: 0;
    color: var(--text-primary);
}

.text:first-child {
    font-weight: 700;
    font-size: 20px;
    color: var(--primary-color);
}

.sidebar-content {
    width: 90%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 30px;
    padding-bottom: 30px;
    padding-right: 10px;
    padding-left: 10px;
    gap: 30px;
}

.search-section {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.medicine-search {
    width: 100%;
}

.medicine-option {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.medicine-name {
    font-weight: 600;
    font-size: 14px;
    color: var(--text-primary);
}

.medicine-manufacturer {
    font-size: 12px;
    color: var(--text-muted);
}

.medicine-list {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.medicine-list h3 {
    color: var(--text-primary);
    font-weight: 600;
    margin: 0;
}

.medicine-items {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.medicine-item {
    padding: 16px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    background: rgba(255, 255, 255, 0.5);
}

.medicine-item:hover {
    background-color: rgba(6, 182, 212, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.medicine-item-name {
    font-weight: 600;
    font-size: 15px;
    margin-bottom: 4px;
    color: var(--text-primary);
}

.medicine-item-manufacturer {
    font-size: 13px;
    color: var(--text-secondary);
}

.sidebar-content-item {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    gap: 15px;
    padding: 20px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 12px;
    border: none;
}

.chart-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.chart-header h3 {
    margin: 0;
    color: var(--text-primary);
    font-weight: 600;
}

.title-text {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}

.chart-box {
    width: 100%;
    height: auto;
}

.loading-message, .error-message {
    width: 100%;
    padding: 20px;
    text-align: center;
    color: var(--text-secondary);
}

.error-message {
    color: #dc2626;
}

@media (max-width: 1300px) {
    .title-box {
        flex-direction: row;
        justify-content: center;
        padding: 0 10px;
    }
}
</style>
