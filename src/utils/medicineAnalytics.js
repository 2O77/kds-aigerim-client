export const filterDataByPeriod = (monthlySales, periodMonths = 12) => {
  if (!monthlySales || monthlySales.length !== 12) return monthlySales;
  
  if (periodMonths === 6) {
    return monthlySales.slice(-6);
  }
  return monthlySales;
};

export const calculateTop5Medicines = (medicines, periodMonths = 12) => {
  if (!medicines || medicines.length === 0) return [];
  
  const medicinesWithTotal = medicines.map(med => {
    const salesData = filterDataByPeriod(med.monthlySales, periodMonths);
    const totalSales = salesData.reduce((sum, val) => sum + val, 0);
    return {
      ...med,
      totalSales,
      salesData
    };
  });
  
  return medicinesWithTotal
    .sort((a, b) => b.totalSales - a.totalSales)
    .slice(0, 5);
};

export const calculateSeasonalTotals = (medicines, periodMonths = 12) => {
  let winterTotal = 0, springTotal = 0, summerTotal = 0, fallTotal = 0;
  
  medicines.forEach(med => {
    const sales = filterDataByPeriod(med.monthlySales, periodMonths);
    if (periodMonths === 12) {
      winterTotal += sales.slice(0, 3).reduce((sum, val) => sum + val, 0);
      springTotal += sales.slice(3, 6).reduce((sum, val) => sum + val, 0);
      summerTotal += sales.slice(6, 9).reduce((sum, val) => sum + val, 0);
      fallTotal += sales.slice(9, 12).reduce((sum, val) => sum + val, 0);
    } else if (periodMonths === 6) {
      const currentMonth = new Date().getMonth();
      const startMonth = (currentMonth - 5 + 12) % 12;
      
      for (let i = 0; i < 6; i++) {
        const monthIdx = (startMonth + i) % 12;
        const season = Math.floor(monthIdx / 3);
        
        if (season === 0) winterTotal += sales[i];
        else if (season === 1) springTotal += sales[i];
        else if (season === 2) summerTotal += sales[i];
        else fallTotal += sales[i];
      }
    }
  });
  
  return {
    'Kış': winterTotal,
    'İlkbahar': springTotal,
    'Yaz': summerTotal,
    'Sonbahar': fallTotal
  };
};

export const generateInsights = (medicines, periodMonths = 12) => {
  if (!medicines || medicines.length === 0) return [];
  
  const insights = [];
  const top5 = calculateTop5Medicines(medicines, periodMonths);
  
  if (top5.length > 0) {
    insights.push({
      type: 'success',
      icon: 'pi-trophy',
      text: `En çok satan ilaç: ${top5[0].name} (${top5[0].totalSales.toLocaleString()} adet)`
    });
    
    if (top5.length >= 2) {
      const marketLeader = top5[0];
      const secondPlace = top5[1];
      const difference = ((marketLeader.totalSales - secondPlace.totalSales) / secondPlace.totalSales * 100).toFixed(0);
      insights.push({
        type: 'info',
        icon: 'pi-percentage',
        text: `${marketLeader.name}, ikinci sıradaki ${secondPlace.name}'dan %${difference} daha fazla satıyor`
      });
    }
  }
  
  const seasonTotals = calculateSeasonalTotals(medicines, periodMonths);
  
  const dominantSeason = Object.keys(seasonTotals).reduce((a, b) => 
    seasonTotals[a] > seasonTotals[b] ? a : b
  );
  
  const totalSeasonalSales = Object.values(seasonTotals).reduce((sum, val) => sum + val, 0);
  const dominantPercentage = ((seasonTotals[dominantSeason] / totalSeasonalSales) * 100).toFixed(0);
  
  insights.push({
    type: 'info',
    icon: 'pi-calendar',
    text: `${dominantSeason} mevsiminde satışların %${dominantPercentage}'i gerçekleşiyor`
  });
  
  const weakestSeason = Object.keys(seasonTotals).reduce((a, b) => 
    seasonTotals[a] < seasonTotals[b] ? a : b
  );
  
  if (seasonTotals[weakestSeason] < totalSeasonalSales * 0.15) {
    insights.push({
      type: 'warning',
      icon: 'pi-info-circle',
      text: `${weakestSeason} mevsiminde satışlar düşük - stok planlaması yapılabilir`
    });
  }
  
  const totalSales = medicines.reduce((sum, med) => {
    const sales = filterDataByPeriod(med.monthlySales, periodMonths);
    return sum + sales.reduce((a, b) => a + b, 0);
  }, 0);
  
  const top3Sales = top5.slice(0, 3).reduce((sum, med) => sum + med.totalSales, 0);
  const top3Percentage = ((top3Sales / totalSales) * 100).toFixed(0);
  
  insights.push({
    type: 'info',
    icon: 'pi-chart-pie',
    text: `İlk 3 ilaç toplam satışların %${top3Percentage}'ini oluşturuyor`
  });
  
  const highPerformers = medicines.filter(med => {
    const sales = filterDataByPeriod(med.monthlySales, periodMonths);
    const avgSales = sales.reduce((sum, val) => sum + val, 0) / sales.length;
    const consistentMonths = sales.filter(val => val >= avgSales * 0.8).length;
    return consistentMonths >= sales.length * 0.8;
  });
  
  if (highPerformers.length > 0) {
    const medicineNames = highPerformers.slice(0, 3).map(m => m.name).join(', ');
    const remaining = highPerformers.length > 3 ? ` ve ${highPerformers.length - 3} diğer ilaç` : '';
    insights.push({
      type: 'success',
      icon: 'pi-check-circle',
      text: `${medicineNames}${remaining} istikrarlı satış performansı gösteriyor (Tahmin edilebilir talep)`
    });
  }
  
  const volatileMeds = medicines.filter(med => {
    const sales = filterDataByPeriod(med.monthlySales, periodMonths);
    const avgSales = sales.reduce((sum, val) => sum + val, 0) / sales.length;
    const maxSales = Math.max(...sales);
    const minSales = Math.min(...sales);
    return (maxSales - minSales) / avgSales > 1.5;
  });
  
  if (volatileMeds.length > 0) {
    insights.push({
      type: 'warning',
      icon: 'pi-exclamation-triangle',
      text: `${volatileMeds[0].name} gibi ${volatileMeds.length} ilaçta satış dalgalanması yüksek`
    });
  }
  
  return insights;
};

