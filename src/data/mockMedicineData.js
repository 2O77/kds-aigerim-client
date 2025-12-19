const generateMonthlySales = (baseAmount, variance) => {
  return Array.from({ length: 12 }, () =>
    Math.floor(baseAmount + (Math.random() - 0.5) * variance)
  );
};

const generateSeasonalSales = (dominantSeason) => {
  const seasons = {
    winter: { Kış: 45, İlkbahar: 20, Yaz: 10, Sonbahar: 25 },
    spring: { Kış: 20, İlkbahar: 40, Yaz: 25, Sonbahar: 15 },
    summer: { Kış: 15, İlkbahar: 25, Yaz: 45, Sonbahar: 15 },
    fall: { Kış: 25, İlkbahar: 15, Yaz: 15, Sonbahar: 45 },
  };
  return seasons[dominantSeason];
};

export const mockMedicineData = {
  İstanbul: [
    {
      id: 1,
      name: "Parol",
      manufacturer: "Atabay",
      monthlySales: generateMonthlySales(5000, 1000),
      seasonalSales: generateSeasonalSales("winter"),
      marketShare: 18.5,
    },
    {
      id: 2,
      name: "Aspirin",
      manufacturer: "Bayer",
      monthlySales: generateMonthlySales(4500, 900),
      seasonalSales: generateSeasonalSales("winter"),
      marketShare: 16.8,
    },
    {
      id: 3,
      name: "Majezik",
      manufacturer: "Sanofi",
      monthlySales: generateMonthlySales(3800, 800),
      seasonalSales: generateSeasonalSales("spring"),
      marketShare: 14.2,
    },
    {
      id: 4,
      name: "Voltaren",
      manufacturer: "Novartis",
      monthlySales: generateMonthlySales(3200, 700),
      seasonalSales: generateSeasonalSales("fall"),
      marketShare: 12.0,
    },
    {
      id: 5,
      name: "Apranax",
      manufacturer: "Abdi İbrahim",
      monthlySales: generateMonthlySales(2900, 600),
      seasonalSales: generateSeasonalSales("winter"),
      marketShare: 10.8,
    },
    {
      id: 6,
      name: "Coraspin",
      manufacturer: "Bayer",
      monthlySales: generateMonthlySales(2500, 500),
      seasonalSales: generateSeasonalSales("spring"),
      marketShare: 9.3,
    },
    {
      id: 7,
      name: "Augmentin",
      manufacturer: "GlaxoSmithKline",
      monthlySales: generateMonthlySales(3500, 750),
      seasonalSales: generateSeasonalSales("winter"),
      marketShare: 13.1,
    },
    {
      id: 8,
      name: "Calpol",
      manufacturer: "Johnson & Johnson",
      monthlySales: generateMonthlySales(4200, 850),
      seasonalSales: generateSeasonalSales("summer"),
      marketShare: 15.7,
    },
  ],
  Ankara: [
    {
      id: 1,
      name: "Parol",
      manufacturer: "Atabay",
      monthlySales: generateMonthlySales(3500, 700),
      seasonalSales: generateSeasonalSales("winter"),
      marketShare: 19.2,
    },
    {
      id: 2,
      name: "Aspirin",
      manufacturer: "Bayer",
      monthlySales: generateMonthlySales(3200, 650),
      seasonalSales: generateSeasonalSales("winter"),
      marketShare: 17.6,
    },
    {
      id: 3,
      name: "Majezik",
      manufacturer: "Sanofi",
      monthlySales: generateMonthlySales(2800, 600),
      seasonalSales: generateSeasonalSales("spring"),
      marketShare: 15.4,
    },
    {
      id: 4,
      name: "Voltaren",
      manufacturer: "Novartis",
      monthlySales: generateMonthlySales(2400, 500),
      seasonalSales: generateSeasonalSales("fall"),
      marketShare: 13.2,
    },
    {
      id: 5,
      name: "Apranax",
      manufacturer: "Abdi İbrahim",
      monthlySales: generateMonthlySales(2100, 450),
      seasonalSales: generateSeasonalSales("winter"),
      marketShare: 11.5,
    },
    {
      id: 6,
      name: "Coraspin",
      manufacturer: "Bayer",
      monthlySales: generateMonthlySales(1800, 400),
      seasonalSales: generateSeasonalSales("spring"),
      marketShare: 9.9,
    },
    {
      id: 7,
      name: "Augmentin",
      manufacturer: "GlaxoSmithKline",
      monthlySales: generateMonthlySales(2600, 550),
      seasonalSales: generateSeasonalSales("winter"),
      marketShare: 14.3,
    },
  ],
  İzmir: [
    {
      id: 1,
      name: "Parol",
      manufacturer: "Atabay",
      monthlySales: generateMonthlySales(3000, 600),
      seasonalSales: generateSeasonalSales("winter"),
      marketShare: 20.5,
    },
    {
      id: 2,
      name: "Aspirin",
      manufacturer: "Bayer",
      monthlySales: generateMonthlySales(2800, 550),
      seasonalSales: generateSeasonalSales("winter"),
      marketShare: 19.2,
    },
    {
      id: 3,
      name: "Majezik",
      manufacturer: "Sanofi",
      monthlySales: generateMonthlySales(2400, 500),
      seasonalSales: generateSeasonalSales("spring"),
      marketShare: 16.4,
    },
    {
      id: 4,
      name: "Voltaren",
      manufacturer: "Novartis",
      monthlySales: generateMonthlySales(2100, 450),
      seasonalSales: generateSeasonalSales("fall"),
      marketShare: 14.4,
    },
    {
      id: 5,
      name: "Apranax",
      manufacturer: "Abdi İbrahim",
      monthlySales: generateMonthlySales(1900, 400),
      seasonalSales: generateSeasonalSales("winter"),
      marketShare: 13.0,
    },
    {
      id: 6,
      name: "Coraspin",
      manufacturer: "Bayer",
      monthlySales: generateMonthlySales(1600, 350),
      seasonalSales: generateSeasonalSales("spring"),
      marketShare: 11.0,
    },
  ],
  "Türkiye Geneli": [
    {
      id: 1,
      name: "Parol",
      manufacturer: "Atabay",
      monthlySales: generateMonthlySales(45000, 5000),
      seasonalSales: generateSeasonalSales("winter"),
      marketShare: 15.8,
    },
    {
      id: 2,
      name: "Aspirin",
      manufacturer: "Bayer",
      monthlySales: generateMonthlySales(42000, 4500),
      seasonalSales: generateSeasonalSales("winter"),
      marketShare: 14.7,
    },
    {
      id: 3,
      name: "Majezik",
      manufacturer: "Sanofi",
      monthlySales: generateMonthlySales(38000, 4000),
      seasonalSales: generateSeasonalSales("spring"),
      marketShare: 13.3,
    },
    {
      id: 4,
      name: "Voltaren",
      manufacturer: "Novartis",
      monthlySales: generateMonthlySales(35000, 3800),
      seasonalSales: generateSeasonalSales("fall"),
      marketShare: 12.3,
    },
    {
      id: 5,
      name: "Apranax",
      manufacturer: "Abdi İbrahim",
      monthlySales: generateMonthlySales(32000, 3500),
      seasonalSales: generateSeasonalSales("winter"),
      marketShare: 11.2,
    },
    {
      id: 6,
      name: "Coraspin",
      manufacturer: "Bayer",
      monthlySales: generateMonthlySales(28000, 3000),
      seasonalSales: generateSeasonalSales("spring"),
      marketShare: 9.8,
    },
    {
      id: 7,
      name: "Augmentin",
      manufacturer: "GlaxoSmithKline",
      monthlySales: generateMonthlySales(40000, 4200),
      seasonalSales: generateSeasonalSales("winter"),
      marketShare: 14.0,
    },
    {
      id: 8,
      name: "Calpol",
      manufacturer: "Johnson & Johnson",
      monthlySales: generateMonthlySales(43000, 4500),
      seasonalSales: generateSeasonalSales("summer"),
      marketShare: 15.1,
    },
  ],
};

export const getDefaultCity = () => "Türkiye Geneli";

export const getMedicinesByCity = (cityName) => {
  return mockMedicineData[cityName] || mockMedicineData["Türkiye Geneli"];
};

export const getAllCities = () => {
  return Object.keys(mockMedicineData);
};
