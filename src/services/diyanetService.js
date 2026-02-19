import axios from 'axios';

const API_BASE = 'https://ezanvakti.emushaf.net';
const CITIES_CACHE_KEY = 'diyanet_cache_cities';

function getDateStr(date) {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  return `${dd}.${mm}.${date.getFullYear()}`;
}

function normalizeTurkish(str) {
  return str
    .replace(/İ/g, 'I')
    .replace(/ı/g, 'i')
    .replace(/Ş/g, 'S')
    .replace(/ş/g, 's')
    .replace(/Ç/g, 'C')
    .replace(/ç/g, 'c')
    .replace(/Ğ/g, 'G')
    .replace(/ğ/g, 'g')
    .replace(/Ü/g, 'U')
    .replace(/ü/g, 'u')
    .replace(/Ö/g, 'O')
    .replace(/ö/g, 'o')
    .toUpperCase();
}

function parseHijriDate(hijriStr) {
  let result = null;

  if (hijriStr) {
    const [day, month, year] = hijriStr.split('.');
    result = {
      day: parseInt(day, 10),
      month: { number: parseInt(month, 10) },
      year: parseInt(year, 10),
    };
  }

  return result;
}

function formatResponse(dayData) {
  return {
    data: {
      timings: {
        Fajr: dayData.Imsak,
        Sunrise: dayData.Gunes,
        Dhuhr: dayData.Ogle,
        Asr: dayData.Ikindi,
        Maghrib: dayData.Aksam,
        Isha: dayData.Yatsi,
      },
      date: {
        hijri: parseHijriDate(dayData.HicriTarihKisa),
      },
    },
  };
}

function getCachedCities() {
  const raw = localStorage.getItem(CITIES_CACHE_KEY);
  let result = null;

  if (raw) {
    result = JSON.parse(raw);
  }

  return result;
}

function setCachedCities(data) {
  localStorage.setItem(CITIES_CACHE_KEY, JSON.stringify(data));
}

function getCachedTimes(cityName) {
  const raw = localStorage.getItem(`diyanet_cache_${cityName}`);
  let result = null;

  if (raw) {
    const parsed = JSON.parse(raw);
    const todayStr = getDateStr(new Date());
    const hasToday = parsed.some(
      item => item.MiladiTarihKisa === todayStr
    );

    if (hasToday) {
      result = parsed;
    }
  }

  return result;
}

function setCachedTimes(cityName, data) {
  localStorage.setItem(
    `diyanet_cache_${cityName}`,
    JSON.stringify(data)
  );
}

async function fetchDistrictID(cityName) {
  const normalizedCity = normalizeTurkish(cityName);

  let cities = getCachedCities();
  if (!cities) {
    const { data } = await axios.get(`${API_BASE}/sehirler/2`);
    cities = data;
    setCachedCities(cities);
  }

  const city = cities.find(
    c => normalizeTurkish(c.SehirAdi) === normalizedCity
  );

  if (!city) {
    throw new Error(`City not found: ${cityName}`);
  }

  const { data: districts } = await axios.get(
    `${API_BASE}/ilceler/${city.SehirID}`
  );
  const district = districts.find(
    d => normalizeTurkish(d.IlceAdi) === normalizedCity
  );

  if (!district) {
    throw new Error(`District not found: ${cityName}`);
  }

  return district.IlceID;
}

export async function getDiyanetPrayerTimes(cityName) {
  let timesArray = getCachedTimes(cityName);

  if (!timesArray) {
    const districtID = await fetchDistrictID(cityName);
    const { data } = await axios.get(
      `${API_BASE}/vakitler/${districtID}`
    );
    timesArray = data;
    setCachedTimes(cityName, timesArray);
  }

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayData = timesArray.find(
    item => item.MiladiTarihKisa === getDateStr(today)
  );
  const tomorrowData = timesArray.find(
    item => item.MiladiTarihKisa === getDateStr(tomorrow)
  );

  return {
    today: todayData ? formatResponse(todayData) : null,
    tomorrow: tomorrowData ? formatResponse(tomorrowData) : null,
    monthly: timesArray,
  };
}
