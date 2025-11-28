<script setup lang="ts">
import { ref } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import { useAppToast } from '@/composables/useAppToast'
import { useVideos } from '@/composables/useVideos'

const { addVideos, deleteVideo, videos } = useVideos()

const showUploadDialog = ref(false)
const file = ref<File | null>(null)

const blobUrl = (b: Blob) => URL.createObjectURL(b)

const { successToast, errorToast } = useAppToast()

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  const selected = input.files?.[0]
  if (!selected) return

  if (!selected.type.startsWith('video/')) {
    errorToast('Ошибка', 'Выбранный файл не является видео')
    return
  }

  file.value = selected
}

const onUpload = async () => {
  if (!file.value) {
    errorToast('Ошибка', 'Сначала выберите файл')
    return
  }
  try {
    await addVideos(file.value)
    successToast('Видео добавлено', file.value.name)
  } catch (err) {
    console.error('Ошибка при сохранении видео:', err)
  }

  file.value = null
  showUploadDialog.value = false
}

const onDelete = async (id?: number) => {
  if (!id) return
  await deleteVideo(id)
  successToast('Удалено', 'Видео удалено')
}
</script>

<template>
  <div class="video-page">
    <Card>
      <template #title>
        <div class="video-page__header">
          <span>Мои видеозаписи собеседований</span>

          <Button
            label="Добавить видео"
            class="video-page__add-button"
            icon="pi pi-plus"
            @click="showUploadDialog = true"
          />
        </div>
      </template>

      <template #content>
        <Dialog
          v-model:visible="showUploadDialog"
          class="video-page__dialog"
          header="Добавить видео"
          :style="{ width: '500px' }"
        >
          <div class="video-page__upload">
            <input
              type="file"
              accept="video/*"
              @change="handleFileSelect"
              class="video-page__file-input"
            />
            <div class="video-page__upload-placeholder">
              <i class="pi pi-cloud-upload video-page__upload-icon"></i>
              <p class="video-page__upload-text">Нажмите чтобы выбрать видео файл</p>
            </div>
            <div v-if="file" class="video-page__selected-file">Выбран файл: {{ file.name }}</div>
          </div>

          <template #footer>
            <Button
              label="Отмена"
              severity="secondary"
              class="video-page__cancel-button"
              @click="showUploadDialog = false"
            />
            <Button label="Загрузить" @click="onUpload" />
          </template>
        </Dialog>

        <div v-if="videos.length === 0" class="video-page__empty">
          <i class="pi pi-video video-page__empty-icon" style="font-size: 3rem"></i>
          <p class="video-page__empty-text">Пока нет видеозаписей</p>
        </div>
        <div v-else class="video-page__list">
          <div v-for="v in videos" :key="v.id" class="video-page__item">
            <video controls :src="blobUrl(v.blob)" class="video-page__video"></video>
            <div class="video-page__item-footer">
              <span>{{ v.name }}</span>
              <Button icon="pi pi-trash" severity="danger" text @click="onDelete(v.id)" />
            </div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.video-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}
.video-page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.video-page__list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
}

.video-page__item {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
}
.video-page__video {
  width: 100%;
  border-radius: 6px;
}

.video-page__item-footer {
  margin-top: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.video-page__title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
}
.video-page__add-button {
  white-space: nowrap;
}

.video-page__dialog {
  width: 500px;
}

.video-page__file-input {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0;
  cursor: pointer;
}
.video-page__upload {
  position: relative;
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 2rem;
  position: relative;
  text-align: center;
  cursor: pointer;
}

.video-page__selected-file {
  margin-top: 1rem;
  color: #374151;
  font-size: 0.9rem;
  font-weight: 500;
}

.video-page__upload-icon {
  font-size: 3rem;
  color: #9ca3af;
  margin-bottom: 1rem;
}
.video-page__upload-placeholder {
  color: #6b7280;
}
.video-page__upload-text {
  color: #6b7280;
  margin: 0;
  font-size: 1rem;
}

.video-page__cancel-button {
  background: #6b7280;
  border: none;
}

.video-page__empty {
  text-align: center;
  padding: 4rem 2rem;
}

.video-page__empty-icon {
  font-size: 3rem;
  color: #d1d5db;
  margin-bottom: 1rem;
}

.video-page__empty-text {
  color: #6b7280;
  margin: 0;
  font-size: 1.1rem;
}
</style>
