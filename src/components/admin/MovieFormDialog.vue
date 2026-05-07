<script setup lang="ts">
import { reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { MovieFormData } from '@/types/movie'

const props = defineProps<{
  visible: boolean
  movie?: MovieFormData | null
}>()

const emit = defineEmits<{
  close: []
  submit: [data: MovieFormData]
}>()

const form = reactive<MovieFormData>({
  title: '',
  overview: '',
  releaseDate: '',
  tmdbId: undefined,
  posterUrl: '',
  genres: []
})

watch(() => props.visible, (val) => {
  if (val && props.movie) {
    Object.assign(form, props.movie)
  } else if (val) {
    form.title = ''
    form.overview = ''
    form.releaseDate = ''
    form.tmdbId = undefined
    form.posterUrl = ''
    form.genres = []
  }
})

function handleSubmit() {
  if (!form.title.trim()) {
    ElMessage.warning('请输入电影标题')
    return
  }
  emit('submit', { ...form })
}
</script>

<template>
  <el-dialog
    :model-value="visible"
    :title="movie ? '编辑电影' : '添加电影'"
    width="560px"
    @close="emit('close')"
  >
    <el-form :model="form" label-width="80px">
      <el-form-item label="标题" required>
        <el-input v-model="form.title" placeholder="电影标题" />
      </el-form-item>
      <el-form-item label="简介">
        <el-input v-model="form.overview" type="textarea" :rows="3" placeholder="电影简介" />
      </el-form-item>
      <el-form-item label="上映年份">
        <el-input v-model="form.releaseDate" placeholder="2026" />
      </el-form-item>
      <el-form-item label="TMDB ID">
        <el-input-number v-model="form.tmdbId" :min="0" placeholder="TMDB ID" />
      </el-form-item>
      <el-form-item label="海报URL">
        <el-input v-model="form.posterUrl" placeholder="海报图片链接" />
      </el-form-item>
      <el-form-item label="类型">
        <el-select v-model="form.genres" multiple placeholder="选择类型">
          <el-option label="动作" value="动作" />
          <el-option label="喜剧" value="喜剧" />
          <el-option label="科幻" value="科幻" />
          <el-option label="悬疑" value="悬疑" />
          <el-option label="爱情" value="爱情" />
          <el-option label="动画" value="动画" />
          <el-option label="纪录片" value="纪录片" />
          <el-option label="恐怖" value="恐怖" />
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="emit('close')">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>
