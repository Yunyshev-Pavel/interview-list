import type { VideoRecord } from '@/interfaces'
import { Dexie, type Table } from 'dexie'

export class VideosDB extends Dexie {
  videos!: Table<VideoRecord>
  constructor() {
    super('VideosDB')

    this.version(1).stores({
      videos: '++id, createdAt',
    })
  }
}

export const db = new VideosDB()
