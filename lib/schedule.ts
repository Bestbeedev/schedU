import { createClient } from "./client"
import { Schedule } from "@/types/tables"

type WeekSchedule = {
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

export async function getSchedulesByWeek(): Promise<WeekSchedule[]> {
  const supabase = createClient()

  // Récupérer les semaines
  const { data: weeks, error: weekError } = await supabase
    .from("weeks")
    .select("*")
    .order("start_date", { ascending: true })

  if (weekError) {
    console.error("Erreur en récupérant les semaines :", weekError.message)
    return []
  }

  const result: WeekSchedule[] = []

  for (const week of weeks) {
    const { data: schedules, error: schedError } = await supabase
      .from("schedules")
      .select(`
        *,
        rooms ( name ),
        stages ( name ),
        departments ( name )
      `)
      .eq("week_id", week.id)

    if (schedError) {
      console.error(`Erreur pour la semaine ${week.id} :`, schedError.message)
      continue
    }

    const formattedSchedules = schedules.map((s) => ({
      ...s,
      room_name: s.rooms?.name || "",
      stage_name: s.stages?.name || "",
      department_name: s.departments?.name || "",
    }))

    result.push({
      week: {
        id: week.id,
        start_date: week.start_date,
        end_date: week.end_date,
      },
      schedules: formattedSchedules,
    })
  }

  return result
}
