export interface IInterview {
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
