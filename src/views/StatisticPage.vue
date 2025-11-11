<script setup lang="ts">
import Chart from 'primevue/chart'
import { computed, onMounted, ref } from 'vue'
import type { Interview } from '@/interfaces'
import { useInterview } from '@/composables/useInterviews'

const { getAllInterviews } = useInterview()

const interviews = ref<Interview[]>([])
const chartOption = ref()
const chartData = ref()

const stats = computed(() => {
  const total = interviews.value.length
  const offers = interviews.value.filter((el) => el.result === 'Offer').length
  const refusals = interviews.value.filter((el) => el.result === 'Refusal').length

  const inProgress = total - offers - refusals
  return {
    total,
    offers,
    refusals,
    inProgress,
  }
})

onMounted(async () => {
  interviews.value = await getAllInterviews()
  chartData.value = setChartData()
  chartOption.value = setChartOptions()
})

const setChartData = () => {
  const documentStyle = getComputedStyle(document.body)
  const counts = { offer: 0, refusal: 0, process: 0 }
  interviews.value.forEach((interview: Interview) => {
    if (interview.result === 'Offer') counts.offer++
    else if (interview.result === 'Refusal') counts.refusal++
    else counts.process++
  })

  return {
    labels: ['Оффер', 'Отказ', 'В процессе'],
    datasets: [
      {
        data: [counts.offer, counts.refusal, counts.process],
        backgroundColor: [
          documentStyle.getPropertyValue('--p-cyan-500'),
          documentStyle.getPropertyValue('--p-orange-500'),
          documentStyle.getPropertyValue('--p-gray-500'),
        ],
        hoverBackgroundColor: [
          documentStyle.getPropertyValue('--p-cyan-400'),
          documentStyle.getPropertyValue('--p-orange-400'),
          documentStyle.getPropertyValue('--p-gray-400'),
        ],
      },
    ],
  }
}

const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement)
  const textColor = documentStyle.getPropertyValue('--p-text-color')

  return {
    plugins: {
      legend: {
        labels: {
          usePointStyle: true,
          color: textColor,
        },
      },
    },
  }
}
</script>
<template>
  <h1>Page statistic</h1>
  <div class="stats">
    <div class="stat-card__total">
      <h3>Всего</h3>
      <strong>{{ stats.total }}</strong>
    </div>
    <div class="stat-card__offer">
      <h3>Офферы</h3>
      <strong>{{ stats.offers }}</strong>
    </div>
    <div class="stat-card__refusal">
      <h3>Отказы</h3>
      <strong>{{ stats.refusals }}</strong>
    </div>
    <div class="stat-card__progress">
      <h3>В процессе</h3>
      <strong>{{ stats.inProgress }}</strong>
    </div>
  </div>
  <div class="chart-container">
    <Chart type="pie" :data="chartData" :options="chartOption" class="w-full md:w-[30rem]" />
  </div>
</template>
<style scoped>
.chart-container {
  max-width: 30rem;
  margin: 0 auto;
}

.stats {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
  justify-content: space-between;
}
</style>
