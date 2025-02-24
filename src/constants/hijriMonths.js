export const hijriMonths = [
  {
    id: 1,
    name: 'Muharram',
    nameTR: 'Muharrem'
  },
  {
    id: 2,
    name: 'Safar',
    nameTR: 'Safer'
  },
  {
    id: 3,
    name: 'Rabi Al-Awwal',
    nameTR: 'Rebiülevvel'
  },
  {
    id: 4,
    name: 'Rabi Al-Thani',
    nameTR: 'Rebiülahir'
  },
  {
    id: 5,
    name: 'Jumada Al-Awwal',
    nameTR: 'Cemaziyelevvel'
  },
  {
    id: 6,
    name: 'Jumada Al-Thani',
    nameTR: 'Cemaziyelahir'
  },
  {
    id: 7,
    name: 'Rajab',
    nameTR: 'Recep'
  },
  {
    id: 8,
    name: 'Shaban',
    nameTR: 'Şaban'
  },
  {
    id: 9,
    name: 'Ramadan',
    nameTR: 'Ramazan'
  },
  {
    id: 10,
    name: 'Shawwal',
    nameTR: 'Şevval'
  },
  {
    id: 11,
    name: 'Dhul Qadah',
    nameTR: 'Zilkade'
  },
  {
    id: 12,
    name: 'Dhul Hijjah',
    nameTR: 'Zilhicce'
  }
];

// Helper function to get month name by ID
export const getHijriMonthById = (id) => {
  return hijriMonths.find(month => month.id === id);
};
