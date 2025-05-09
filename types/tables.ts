

export type Filiere={
    id :string;
    name:string
}

export type Weeks={
    id :string;
    start_date:string
    end_date:string
}

export type Schedule = {
    id: string
    week_id: string
    department_id: string
    room_id: string | null
    stage_id: string
    day_of_weeks_start: 'Lundi' | 'Mardi' | 'Mercredi' | 'Jeudi' | 'Vendredi' | 'Samedi'
    day_of_weeks_end: 'Lundi' | 'Mardi' | 'Mercredi' | 'Jeudi' | 'Vendredi' | 'Samedi'
    start_time: string // format: 'HH:MM:SS'
    end_time: string   // format: 'HH:MM:SS'
    course_name: string
    teacher: string | null
    tp: string
    mass_horaire: string
  
    // Jointures Supabase
    rooms?: {
      name: string
    } | null
  
    stages?: {
      name: string
    }
  
    departments?: {
      name: string
    }
  }

  export type WeekSchedule = {
    week: {
      id: string
      start_date: string
      end_date: string
    }
    schedules: Array<Schedule & {
      room_name?: string
      stage_name?: string
      department_name?: string
    }>
  }
  