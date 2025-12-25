<template>
    <div class="statistics-container">
        <div class="top5-section">
            <div class="section-header">
                <i class="pi pi-chart-bar"></i>
                <h3>En Çok Satan 5 İlaç</h3>
            </div>
            <div v-if="loading" class="loading-state">
                <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
                <p>Veriler yükleniyor...</p>
            </div>
            <div v-else class="chart-container">
                <Chart v-if="top5ChartData" type="bar" :data="top5ChartData" :options="chartOptions"
                    :style="{ height: '100%', width: '100%', position: 'relative' }" />
            </div>
        </div>

        <div class="insights-section">
            <div class="section-header">
                <i class="pi pi-lightbulb"></i>
                <h3>Karar Destek Özeti</h3>
            </div>
            <div class="insights-grid">
                <div v-for="(insight, index) in insights" :key="index" class="insight-card"
                    :class="`insight-${insight.type}`">
                    <i :class="`pi ${insight.icon}`" class="insight-icon"></i>
                    <p class="insight-text">{{ insight.text }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { calculateTop5Medicines, generateInsights, filterDataByPeriod } from '../utils/medicineAnalytics';

const props = defineProps({
    cityName: {
        type: String,
        required: true
    },
    periodMonths: {
        type: Number,
        default: 12
    },
    medicineData: {
        type: Array,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    }
});

const top5Medicines = computed(() => {
    return calculateTop5Medicines(props.medicineData, props.periodMonths);
});

const insights = computed(() => {
    return generateInsights(props.medicineData, props.periodMonths);
});

const top5ChartData = computed(() => {
    if (!top5Medicines.value || top5Medicines.value.length === 0) return null;

    return {
        labels: top5Medicines.value.map(med => med.name),
        datasets: [
            {
                label: 'Toplam Satış (Adet)',
                data: top5Medicines.value.map(med => med.totalSales),
                backgroundColor: [
                    'rgba(8, 145, 178, 0.8)',
                    'rgba(6, 182, 212, 0.8)',
                    'rgba(14, 116, 144, 0.8)',
                    'rgba(34, 211, 238, 0.8)',
                    'rgba(103, 232, 249, 0.8)'
                ],
                borderColor: [
                    'rgb(8, 145, 178)',
                    'rgb(6, 182, 212)',
                    'rgb(14, 116, 144)',
                    'rgb(34, 211, 238)',
                    'rgb(103, 232, 249)'
                ],
                borderWidth: 2,
                borderRadius: 8,
            },
        ],
    };
});

const chartOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false
        },
        tooltip: {
            callbacks: {
                label: function (context) {
                    return context.parsed.x.toLocaleString() + ' adet';
                }
            },
            backgroundColor: 'rgba(8, 145, 178, 0.9)',
            padding: 10,
            titleFont: {
                size: 14,
                weight: 'bold'
            },
            bodyFont: {
                size: 13
            }
        }
    },
    scales: {
        x: {
            beginAtZero: true,
            ticks: {
                callback: function (value) {
                    return value.toLocaleString();
                },
                font: {
                    size: 11
                }
            },
            grid: {
                color: 'rgba(0, 0, 0, 0.05)',
                drawBorder: false
            }
        },
        y: {
            ticks: {
                font: {
                    size: 13,
                    weight: '600'
                },
                padding: 8
            },
            grid: {
                display: false,
                drawBorder: false
            }
        }
    }
};
</script>

<style scoped>
.statistics-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
    height: 100%;
    padding: 12px;
    overflow: hidden;
    box-sizing: border-box;
}

.top5-section,
.insights-section {
    background: rgba(255, 255, 255, 0.6);
    border-radius: 16px;
    padding: 16px;
    border: 1px solid rgba(8, 145, 178, 0.1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.insights-section {
    flex: 1.2;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
}

.top5-section {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.section-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
    flex-shrink: 0;
}

.section-header i {
    font-size: 22px;
    color: #0891b2;
    flex-shrink: 0;
}

.section-header h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 700;
    color: var(--text-primary);
}

.chart-container {
    width: 100%;
    flex: 1;
    min-height: 0;
    position: relative;
    overflow: hidden;
}

.chart-container :deep(.p-chart) {
    width: 100% !important;
    height: 100% !important;
    position: absolute !important;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}

.chart-container :deep(canvas) {
    width: 100% !important;
    height: 100% !important;
    display: block !important;
}

.loading-state {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 15px;
    color: var(--text-secondary);
}

.insights-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
    flex: 1;
    overflow-y: auto;
    padding-right: 4px;
}

.insight-card {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 14px;
    border-radius: 10px;
    border-left: 4px solid;
    transition: all 0.3s ease;
    background: white;
}

.insight-card:hover {
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.insight-success {
    border-left-color: #10b981;
    background: linear-gradient(to right, rgba(16, 185, 129, 0.05), white);
}

.insight-info {
    border-left-color: #0891b2;
    background: linear-gradient(to right, rgba(8, 145, 178, 0.05), white);
}

.insight-warning {
    border-left-color: #f59e0b;
    background: linear-gradient(to right, rgba(245, 158, 11, 0.05), white);
}

.insight-icon {
    font-size: 18px;
    margin-top: 2px;
    flex-shrink: 0;
}

.insight-success .insight-icon {
    color: #10b981;
}

.insight-info .insight-icon {
    color: #0891b2;
}

.insight-warning .insight-icon {
    color: #f59e0b;
}

.insight-text {
    margin: 0;
    font-size: 13px;
    font-weight: 500;
    color: var(--text-primary);
    line-height: 1.5;
}

@media (max-width: 1400px) {
    .statistics-container {
        padding: 12px;
        gap: 15px;
    }

    .top5-section,
    .insights-section {
        padding: 16px;
    }

    .section-header h3 {
        font-size: 16px;
    }

    .chart-container {
        min-height: 250px;
    }
}

@media (max-width: 768px) {
    .section-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }

    .insight-card {
        padding: 14px;
    }
}
</style>
