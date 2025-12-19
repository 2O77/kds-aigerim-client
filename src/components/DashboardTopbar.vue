<template>
    <div class="topbar">
        <div class="contents">
            <div class="info-box">
                <h2 class="title">İlaç Satış Analiz Platformu</h2>
                <p class="description">Türkiye genelinde ilaç satış verilerini şehir bazında inceleyin</p>
            </div>
        </div>
    </div>
</template>

<script setup>
</script>

<style scoped>
.topbar {
    display: flex;
    align-items: center;
    height: 100px;
    justify-content: flex-start;
    gap: 10px;
    padding-left: 60px;
    padding-top: 20px;
    border: none;
    border-radius: 0;
    background: var(--background-color);
}

.contents {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 30px;
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
    font-size: 26px;
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

@media screen and (max-width: 950px) {
    .topbar {
        overflow-x: auto;
        white-space: nowrap;
        padding: 0 15px;
    }

    .title {
        font-size: 20px;
    }

    .description {
        font-size: 12px;
    }
}
</style>
