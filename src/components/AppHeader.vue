<script setup lang="ts">
import Menubar from 'primevue/menubar'

import { useUserStore } from '@/stores/user'
import { getAuth, signOut } from 'firebase/auth'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { ImenuItem } from '@/interfaces'
const userStore = useUserStore()
const router = useRouter()

const items = computed<ImenuItem[]>(() => [
  {
    label: 'Авторизация',
    icon: 'pi pi-user',
    path: '/auth',
    show: !userStore.userId,
  },
  {
    label: 'Добавить',
    icon: 'pi pi-plus',
    path: '/',
    show: !!userStore.userId,
  },
  {
    label: 'Список собеседований',
    icon: 'pi pi-list',
    path: '/list',
    show: !!userStore.userId,
  },
  {
    label: 'Статистика',
    icon: 'pi pi-chart-bar',
    path: '/statistic',
    show: !!userStore.userId,
  },
])

const signOutMethod = async (): Promise<void> => {
  await signOut(getAuth())
  router.push('/auth')
}
</script>

<template>
  <Menubar :model="items" class="menu">
    <template #item="{ item, props }">
      <template v-if="item.show">
        <router-link :to="item.path" v-bind="props.action" class="p-menuitem-link">
          <span :class="item.icon" class="p-menuitem-icon" />
          <span>{{ item.label }}</span>
        </router-link>
      </template>
    </template>

    <template #end>
      <span v-if="userStore.userId" @click="signOutMethod" class="menu-exit" role="button">
        <i class="pi pi-sign-out" />
        <span class="ml-2">Выход</span>
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
.p-menubar {
  border: none;
  padding: 0.5rem 1rem;
}
.menu-exit {
  cursor: pointer;
}
</style>
