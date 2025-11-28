<script setup lang="ts">
import Menubar from 'primevue/menubar'

import { useUserStore } from '@/stores/user'
import { getAuth, signOut } from 'firebase/auth'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { ImenuItem } from '@/interfaces'
import { PATH } from '@/router/path'
const userStore = useUserStore()
const router = useRouter()

const items = computed<ImenuItem[]>(() => [
  {
    label: 'Авторизация',
    icon: 'pi pi-user',
    path: PATH.AUTH,
    show: !userStore.userId,
  },

  {
    label: 'Добавить',
    icon: 'pi pi-plus',
    path: PATH.HOME,
    show: !!userStore.userId,
  },
  {
    label: 'Список собеседований',
    icon: 'pi pi-list',
    path: PATH.LIST,
    show: !!userStore.userId,
  },
  {
    label: 'Статистика',
    icon: 'pi pi-chart-bar',
    path: PATH.STATISTIC,
    show: !!userStore.userId,
  },
  {
    label: 'Видео',
    icon: 'pi pi-video',
    path: PATH.VIDEO,
    show: !!userStore.userId,
  },
  {
    label: 'Вопросы',
    icon: 'pi pi-star',
    path: PATH.QUESTIONS,
    show: !!userStore.userId,
  },
])

const signOutMethod = async (): Promise<void> => {
  await signOut(getAuth())
  router.push(PATH.AUTH)
}
</script>

<template>
  <Menubar :model="items" class="menu">
    <template #item="{ item, props }">
      <template v-if="item.show">
        <router-link :to="item.path" class="menu__link" v-bind="props.action">
          <span :class="item.icon" class="menu__icon" />
          <span class="menu__label">{{ item.label }}</span>
        </router-link>
      </template>
    </template>

    <template #end>
      <span v-if="userStore.userId" @click="signOutMethod" class="menu__exit" role="button">
        <span class="menu__exit-icon pi pi-sign-out" />
        <span class="menu__exit-label">Выход</span>
      </span>
    </template>
  </Menubar>
</template>

<style scoped>
.menu {
  margin: 30px 0;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}
.menu__link {
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 0.5rem 1rem;
}
.menu__icon {
  font-size: 1.2rem;
  margin-right: 0.5rem;
}

.menu__label {
  font-weight: 500;
}
.menu__exit {
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.menu__exit-icon {
  font-size: 1.2rem;
  margin-right: 0.5rem;
}
.menu__exit-label {
  font-weight: 500;
}
</style>
