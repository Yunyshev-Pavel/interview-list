export interface Interview {
  id: string
  company: string
  vacancyLink: string
  hrName: string
  contactTelegram?: string
  contactPhone?: string
  createdAt: Date
  salaryFrom?: number
  salaryTo?: number
  stages?: IStage[]
  result?: 'Offer' | 'Refusal'
  questions?: InterviewQuestion[]
  questionTemplates?: string[]
}

export interface InterviewQuestion {
  id: string
  text: string
  type: 'technical' | 'behavioral' | 'hr' | 'cultural' | 'custom'
  difficulty: 'easy' | 'medium' | 'hard'
  category?: string
  answer?: string
  isPrepared: boolean
  createdAt: Date
}

export interface ImenuItem {
  label: string
  icon: string
  path: string
  show: boolean
}

export interface IStage {
  name: string
  date: Date | null
  description: string
}

export interface VideoRecord {
  id?: number
  name: string
  blob: Blob
  createdAt: number
}
