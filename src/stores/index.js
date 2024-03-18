import { defineStore } from 'pinia'
import axios from '@/plugins/axios';

export const useStore = defineStore('index', {
  state: () => ({
    count: 0,
  }),
  actions: {
    fetchTimesByCity(params) {
      return axios.get("timingsByCity", { params });
    },
  },
})
