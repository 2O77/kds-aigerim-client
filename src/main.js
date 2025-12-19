import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import PrimeVue from 'primevue/config'
import { definePreset } from '@primevue/themes'
import 'primeicons/primeicons.css'
import router from './router'
import Aura from '@primevue/themes/aura'

const app = createApp(App)

app.use(router)

const MedicalBlue = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{cyan.50}',
      100: '{cyan.100}',
      200: '{cyan.200}',
      300: '{cyan.300}',
      400: '{cyan.400}',
      500: '{cyan.500}',
      600: '{cyan.600}',
      700: '{cyan.700}',
      800: '{cyan.800}',
      900: '{cyan.900}',
      950: '{cyan.950}',
    },
    colorScheme: {
      light: {
        primary: {
          color: '#0891b2',
          inverseColor: '#ffffff',
          hoverColor: '#0e7490',
          activeColor: '#06b6d4',
        },
        surface: {
          0: '#ffffff',
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
      },
    },
  },
})

app.use(PrimeVue, {
  theme: {
    preset: MedicalBlue,
    options: {
      darkModeSelector: false,
    },
  },
})

import {
  Button,
  Slider,
  Toolbar,
  InputText,
  InputNumber,
  Listbox,
  MultiSelect,
  RadioButton,
  Rating,
  Checkbox,
  Select,
  InputOtp,
  AutoComplete,
} from 'primevue'

import Chart from 'primevue/chart'

app.component('Toolbar', Toolbar)
app.component('Button', Button)
app.component('Slider', Slider)
app.component('InputText', InputText)
app.component('ListBox', Listbox)
app.component('MultiSelect', MultiSelect)
app.component('RadioButton', RadioButton)
app.component('Rating', Rating)
app.component('Checkbox', Checkbox)
app.component('Chart', Chart)
app.component('InputNumber', InputNumber)
app.component('Select', Select)
app.component('InputOtp', InputOtp)
app.component('AutoComplete', AutoComplete)

app.mount('#app')
