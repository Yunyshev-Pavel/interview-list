<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { Button } from 'primevue'
import { computed, ref } from 'vue'
import type { ComputedRef } from 'vue'
const userStore = useUserStore()

interface ImenuItem {
  label: string
  icon: string
  path: string
  show: ComputedRef<boolean>
}

const items = ref<ImenuItem[]>([
  {
    label: 'Авторизация',
    icon: 'pi pi-user',
    path: '/auth',
    show: computed((): boolean => !userStore.userId),
  },
  {
    label: 'Добавить',
    icon: 'pi pi-plus',
    path: '/',
    show: computed((): boolean => !!userStore.userId),
  },
  {
    label: 'Список собеседований',
    icon: 'pi pi-list',
    path: '/list',
    show: computed((): boolean => !!userStore.userId),
  },
  {
    label: 'Статистика',
    icon: 'pi pi-chart-bar',
    path: '/statistic',
    show: computed((): boolean => !!userStore.userId),
  },
])

const exitClick = () => {
  alert('выход')
  userStore.userId = ''
}
</script>

<template>
  <Menubar :model="items" class="menu">
    <template #item="{ item, props }">
      <template v-if="item.show">
        <router-link :to="item.path" v-bind="props.action" class="p-menuitem-link">
          <span :class="item.icon" class="p-menuitem-icon" />
          <span class="p-menuitem-text">{{ item.label }}</span>
        </router-link>
      </template>
    </template>
    <template #end>
      <Button class="pi pi-sign-out" label="Выход" @click="exitClick" />
    </template>
  </Menubar>
</template>

<style scoped>
.menu {
  margin: 30px 0;
}
.menu-exit {
  cursor: pointer;
}
</style>
