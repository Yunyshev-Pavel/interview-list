<script setup lang="ts">
import { ref } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import { useAppToast } from '@/composables/useAppToast'

const showUploadDialog = ref(false)
const videos = ref<[]>([])
const { successToast } = useAppToast()

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file && file.type.startsWith('video/')) {
    successToast('Добавлен файл', file.name)
    showUploadDialog.value = false
  }
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
              <i class="pi pi-cloud-upload video-page__upload-icon" style="font-size: 3rem"></i>
              <p class="video-page__upload-text">Нажмите чтобы выбрать видео файл</p>
            </div>
          </div>

          <template #footer>
            <Button
              label="Отмена"
              class="video-page__cancel-button"
              @click="showUploadDialog = false"
            />
          </template>
        </Dialog>

        <div v-if="videos.length === 0" class="video-page__empty">
          <i class="pi pi-video video-page__empty-icon" style="font-size: 3rem"></i>
          <p class="video-page__empty-text">Пока нет видеозаписей</p>
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

.upload-area {
  position: relative;
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
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
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 3rem 2rem;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s ease;
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
