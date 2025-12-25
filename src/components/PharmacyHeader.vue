<template>
    <div class="topbar">
        <div class="contents">
            <div class="brand-section">
                <i class="pi pi-shopping-bag brand-icon"></i>
                <div class="info-box">
                    <h2 class="title">İzmir Farma</h2>
                    <p class="description">Karar Destek Sistemi</p>
                </div>
            </div>
            <div class="city-info" @click="handleCityClick" :class="{ clickable: cityName !== 'Türkiye Geneli' }">
                <i class="pi pi-map-marker city-icon"></i>
                <span class="city-text">{{ cityName }} için veri görüntülüyorsunuz</span>
                <i v-if="cityName !== 'Türkiye Geneli'" class="pi pi-times clear-icon"></i>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    cityName: {
        type: String,
        default: 'Türkiye Geneli'
    }
});

const emit = defineEmits(['reset-to-turkey']);

const handleCityClick = () => {
    if (props.cityName !== 'Türkiye Geneli') {
        emit('reset-to-turkey');
    }
};
</script>

<style scoped>
.topbar {
    display: flex;
    align-items: center;
    height: 100px;
    justify-content: flex-start;
    padding: 0 40px;
    border: none;
    border-radius: 0;
    background: var(--background-color);
    border-bottom: 1px solid rgba(8, 145, 178, 0.1);
}

.contents {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    gap: 30px;
}

.brand-section {
    display: flex;
    align-items: center;
    gap: 15px;
}

.brand-icon {
    font-size: 36px;
    color: #0891b2;
}

.info-box {
    display: flex;
    flex-direction: column;
    gap: 5px;
    align-items: flex-start;
}

.title {
    margin: 0;
    padding: 0;
    font-size: 28px;
    font-weight: 700;
    background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.description {
    margin: 0;
    padding: 0;
    font-size: 14px;
    color: var(--text-secondary);
    font-weight: 500;
}

.city-info {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: rgba(8, 145, 178, 0.1);
    border-radius: 8px;
    border: 1px solid rgba(8, 145, 178, 0.2);
    transition: all 0.3s ease;
}

.city-info.clickable {
    cursor: pointer;
}

.city-info.clickable:hover {
    background: rgba(8, 145, 178, 0.15);
    border-color: rgba(8, 145, 178, 0.3);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(8, 145, 178, 0.2);
}

.clear-icon {
    font-size: 14px;
    color: #0e7490;
    margin-left: 4px;
}

.city-icon {
    font-size: 16px;
    color: #0891b2;
}

.city-text {
    font-size: 15px;
    font-weight: 700;
    color: #0e7490;
}

@media screen and (max-width: 1400px) {
    .topbar {
        padding: 0 20px;
    }
}

@media screen and (max-width: 950px) {
    .topbar {
        height: auto;
        padding: 15px;
    }

    .contents {
        flex-wrap: wrap;
        gap: 15px;
    }

    .brand-icon {
        font-size: 28px;
    }

    .title {
        font-size: 22px;
    }

    .description {
        font-size: 12px;
    }

    .city-info {
        width: 100%;
        justify-content: center;
    }

    .city-text {
        font-size: 13px;
    }
}
</style>
