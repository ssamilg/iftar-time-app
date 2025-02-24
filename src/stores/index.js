import { defineStore } from 'pinia'
import axios from '@/plugins/axios';
import dayjs from 'dayjs';

export const useStore = defineStore('index', {
  state: () => ({
    selectedCity: localStorage.getItem('selectedCity') || 'Ankara',
    prayerTimes: null,
    nextDayTimes: null,
    isLoading: false,
  }),

  actions: {
    setSelectedCity(city) {
      this.selectedCity = city;
      localStorage.setItem('selectedCity', city);
    },

    async fetchTimesByCity(params) {
      this.isLoading = true;
      try {
        const { data: response } = await axios.get("timingsByCity", {
          params: {
            ...params,
            city: this.selectedCity
          }
        });
        this.prayerTimes = response;
        return { data: response };
      } catch (error) {
        console.error('Error fetching prayer times:', error);
        throw error;
      }
    },

    async fetchTimesByCityAndDate(date, params) {
      try {
        const { data: response } = await axios.get(`timingsByCity/${date}`, {
          params: {
            ...params,
            city: this.selectedCity
          }
        });
        this.nextDayTimes = response;
        return { data: response };
      } catch (error) {
        console.error('Error fetching next day times:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchAllTimes() {
      try {
        const params = {
          country: 'Turkey',
          method: 13,
        };

        await this.fetchTimesByCity(params);

        let nextDay = new Date();
        nextDay.setDate(nextDay.getDate() + 1);
        nextDay = dayjs(nextDay).format('DD-MM-YYYY');

        await this.fetchTimesByCityAndDate(nextDay, params);

        return {
          prayerTimes: this.prayerTimes,
          nextDayTimes: this.nextDayTimes
        };
      } catch (error) {
        console.error('Error fetching all times:', error);
        throw error;
      }
    }
  },
})
