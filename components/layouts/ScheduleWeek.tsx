import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WeekSchedule } from "@/types/tables";
import { Delete, FilePenLine, GraduationCap, Users } from "lucide-react";
import { Button } from "../ui/button";
import { useAuthStore } from "@/stores/auth";

interface ScheduleWeekProps {
  schedulesByWeek: WeekSchedule[];
  selectedStage?: string;
  selectedDepartment?: string;
  showAll?: boolean;
}

// Fonction utilitaire pour formater l'heure (ex: "07:00:00" -> "07H")
const formatTime = (timeString: string): string => {
  if (!timeString) return "";
  const [hours] = timeString.split(":"); // on prend juste la première partie
  return `${hours}H`;
};

export default function ScheduleWeek({
  schedulesByWeek,
  selectedStage,
  selectedDepartment,
  showAll = false,
}: ScheduleWeekProps) {
  const { user } = useAuthStore();

  // Vérifier s'il y a des cours pour la semaine
  const hasSchedules = schedulesByWeek.some(({ schedules }) => {
    const filteredSchedules = schedules.filter((schedule) => {
      if (showAll) return true;
      const stageMatch =
        !selectedStage || schedule.stage_name === selectedStage;
      const departmentMatch =
        !selectedDepartment || schedule.department_name === selectedDepartment;
      return stageMatch && departmentMatch;
    });
    return filteredSchedules.length > 0;
  });

  if (!hasSchedules) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-6 max-w-md">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
            Aucun cours disponible
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400">
            {selectedStage || selectedDepartment
              ? "Aucun cours ne correspond aux filtres sélectionnés pour cette semaine."
              : "Aucun cours n'est programmé pour cette semaine."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {schedulesByWeek.map(({ week, schedules }) => {
        // Filtrer les programmes selon les critères sélectionnés
        const filteredSchedules = schedules.filter((schedule) => {
          if (showAll) return true;
          const stageMatch =
            !selectedStage || schedule.stage_name === selectedStage;
          const departmentMatch =
            !selectedDepartment ||
            schedule.department_name === selectedDepartment;
          return stageMatch && departmentMatch;
        });

        // Regrouper les programmes par filière et niveau
        const groupedSchedules = filteredSchedules.reduce((acc, schedule) => {
          const key = `${schedule.department_name}-${schedule.stage_name}`;
          if (!acc[key]) {
            acc[key] = {
              department_name: schedule.department_name || "",
              stage_name: schedule.stage_name || "",
              schedules: [],
            };
          }
          acc[key].schedules.push(schedule);
          return acc;
        }, {} as Record<string, { department_name: string; stage_name: string; schedules: typeof schedules }>);

        // Si aucun programme ne correspond aux filtres, ne pas afficher la semaine
        if (Object.keys(groupedSchedules).length === 0) {
          return null;
        }

        return (
          <Card
            key={week.id}
            className="border shadow-xl dark:bg-neutral-900/50 dark:border-neutral-700 border-neutral-200"
          >
            <CardContent className="p-6 overflow-x-auto w-full ">
              <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20">
                <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
                  <h2 className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400">
                    Semaine du{" "}
                    {format(new Date(week.start_date), "dd MMMM yyyy", {
                      locale: fr,
                    })}{" "}
                    au{" "}
                    {format(new Date(week.end_date), "dd MMMM yyyy", {
                      locale: fr,
                    })}
                  </h2>

                  {user &&
                    user?.role === "ADMIN" &&
                    !showAll &&
                    (selectedStage || selectedDepartment) && (
                      <div className="flex gap-2 text-sm">
                        <Button className="dark:bg-green-600 bg-green-600">
                          <FilePenLine className="text-white" />
                        </Button>
                        <Button className="dark:bg-red-600 bg-red-600">
                          <Delete className="text-white" />
                        </Button>
                      </div>
                    )}
                </div>
              </div>

              {Object.values(groupedSchedules).map((group, index) => (
                <div key={index} className="mb-8 last:mb-0">
                  <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-purple-500" />
                      <span className="font-semibold text-purple-600 dark:text-purple-400">
                        {group.department_name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-orange-500" />
                      <span className="font-semibold text-orange-600 dark:text-orange-400">
                        {group.stage_name}
                      </span>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-center">
                      <thead>
                        <tr className="border-b dark:border-neutral-700 text-center border-neutral-200">
                          <th className="py-3 px-4 text-center text-sm font-semibold text-neutral-600 dark:text-neutral-300">
                            Cours Programme
                          </th>
                          <th className="py-3 px-4 text-center text-sm font-semibold text-neutral-600 dark:text-neutral-300">
                            Horaires
                          </th>
                          <th className="py-3 px-4 text-center text-sm font-semibold text-neutral-600 dark:text-neutral-300">
                            Masse Horaires
                          </th>
                          <th className="py-3 px-4 text-center text-sm font-semibold text-neutral-600 dark:text-neutral-300">
                            Salle de cours
                          </th>
                          <th className="py-3 px-4 text-center text-sm font-semibold text-neutral-600 dark:text-neutral-300">
                            Enseignant
                          </th>
                          <th className="py-3 px-4 text-center text-sm font-semibold text-neutral-600 dark:text-neutral-300">
                            TP
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.schedules.map((course) => (
                          <tr
                            key={course.id}
                            className="border-b dark:border-neutral-700 text-sm text-center border-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700/60 transition-colors"
                          >
                            <td className="py-4 px-4">
                              <div className="font-medium  text-neutral-900 dark:text-neutral-100">
                                {course.course_name}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="secondary"
                                  className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                                >
                                  {formatTime(course.start_time)}
                                </Badge>
                                <span className="text-neutral-400">-</span>
                                <Badge
                                  variant="secondary"
                                  className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                                >
                                  {formatTime(course.end_time)}
                                </Badge>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <Badge
                                variant="outline"
                                className="bg-neutral-100 dark:bg-neutral-800"
                              >
                                {course.mass_horaire}
                              </Badge>
                            </td>
                            <td className="py-4 px-4">
                              <Badge
                                variant="outline"
                                className="bg-neutral-100 dark:bg-neutral-800"
                              >
                                {course.room_name}
                              </Badge>
                            </td>
                            <td className="py-4 px-4">
                              <div className="text-neutral-700 dark:text-neutral-300">
                                {course.teacher}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <Badge
                                variant="outline"
                                className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                              >
                                {course.tp}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
