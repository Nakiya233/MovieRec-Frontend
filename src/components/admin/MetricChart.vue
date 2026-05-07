<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { MetricsItem } from '@/types/admin'

use([BarChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer])

const props = defineProps<{
  metrics: MetricsItem[]
}>()

const prOption = computed(() => {
  const kValues = [...new Set(props.metrics.map(m => m.k))].sort((a, b) => a - b)
  const algorithms = [...new Set(props.metrics.map(m => m.algorithm))]

  return {
    tooltip: { trigger: 'axis' as const },
    legend: { data: algorithms.flatMap(a => [`${a} Precision`, `${a} Recall`]) },
    xAxis: { type: 'category' as const, data: kValues.map(k => `K=${k}`) },
    yAxis: { type: 'value' as const, name: '值' },
    series: algorithms.flatMap(algo => [
      {
        name: `${algo} Precision`,
        type: 'bar' as const,
        data: kValues.map(k => {
          const m = props.metrics.find(x => x.k === k && x.algorithm === algo)
          return m?.precision ?? 0
        })
      },
      {
        name: `${algo} Recall`,
        type: 'bar' as const,
        data: kValues.map(k => {
          const m = props.metrics.find(x => x.k === k && x.algorithm === algo)
          return m?.recall ?? 0
        })
      }
    ])
  }
})

const coverageOption = computed(() => {
  const algorithms = [...new Set(props.metrics.map(m => m.algorithm))]
  // Use first K value's metrics
  const k0 = props.metrics[0]?.k
  const subset = props.metrics.filter(m => m.k === k0)

  return {
    tooltip: { trigger: 'axis' as const },
    legend: { data: ['Coverage', 'Novelty'] },
    xAxis: { type: 'category' as const, data: algorithms },
    yAxis: { type: 'value' as const },
    series: [
      {
        name: 'Coverage',
        type: 'bar' as const,
        data: algorithms.map(a => {
          const m = subset.find(x => x.algorithm === a)
          return m?.coverage ?? 0
        })
      },
      {
        name: 'Novelty',
        type: 'bar' as const,
        data: algorithms.map(a => {
          const m = subset.find(x => x.algorithm === a)
          return m?.novelty ?? 0
        })
      }
    ]
  }
})
</script>

<template>
  <div class="space-y-8">
    <div class="stat-card rounded-sm p-5" v-if="metrics.length > 0">
      <h3 class="text-sm font-semibold mb-4">Precision@K / Recall@K 对比</h3>
      <VChart :option="prOption" style="height:320px" autoresize />
    </div>
    <div class="stat-card rounded-sm p-5" v-if="metrics.length > 0">
      <h3 class="text-sm font-semibold mb-4">Coverage / Novelty 对比</h3>
      <VChart :option="coverageOption" style="height:320px" autoresize />
    </div>
  </div>
</template>
