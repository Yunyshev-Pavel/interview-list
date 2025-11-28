import { db } from '@/db/videos.db'
import { liveQuery } from 'dexie'
import { useObservable, from } from '@vueuse/rxjs'

export function useVideos() {
  const videos$ = from(liveQuery(() => db.videos.toArray()))

  const videos = useObservable(videos$, { initialValue: [] })

  const addVideos = async (file: File) => {
    await db.videos.add({
      name: file.name,
      blob: file,
      createdAt: Date.now(),
    })
  }

  const deleteVideo = async (id: number) => {
    await db.videos.delete(id)
  }

  return {
    videos,
    addVideos,
    deleteVideo,
  }
}
