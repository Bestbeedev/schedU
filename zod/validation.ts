import { z } from "zod";

export const authSchema = z.object({
  email: z.string().email({
    message: "Adresse email invalide"
  }).nonempty({ message: "L'email est requis" }),
  password: z.string().min(6, {
    message: "Le mot de passe doit contenir au moins 6 caractères.",
  }).nonempty({ message: "Le mot de passe est requis" }),
})



export const scheduleSchema = z.object({
  department_id: z.string().nonempty({ message: "La filiere est requise" }),
  room_id: z.string().nonempty({ message: "La salle de cours est requise" }),
  week_id: z.string().nonempty({ message: "La semaine de cours est requise" }),
  stage_id: z.string().nonempty({ message: "Le niveau de licence est requise" }),
  day_of_weeks_start: z.enum(['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']),
  day_of_weeks_end: z.enum(['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']),
  start_time: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/, 'Format invalide. Ex: HH:MM ou HH:MM:SS')
    .nonempty({ message: "L'heure du debut est requise" }),
  end_time: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/, 'Format invalide. Ex: HH:MM ou HH:MM:SS')
    .nonempty({ message: "L'heure de la fin est requise" }),

  course_name: z.string().nonempty({ message: "Le cours est requis" }),
  teacher: z.string().nonempty({ message: "L'Enseignant est requise" }),

  tp: z.string().min(3, {
    message: "La masse travaux pratiques doit contenir au moins 3 caractères.",
  }).nonempty({ message: "La masse travaux pratiques est requise" }),
  mass_horaire: z.string().min(3, {
    message: "La masse horaire doit contenir au moins 3 caractères.",
  }).nonempty({ message: "La masse horaire du cours est requise" }),
})
  .refine(
    (data) => data.start_time < data.end_time,
    {
      message: "L'heure de début doit être inférieure à l'heure de fin",
      path: ['start_time'], // ou ['end_time']
    }
  );




  export const weekSchema = z
    .object({
      start_date: z.date({
        required_error: "La date de début est requise",
      }),
      end_date: z.date({
        required_error: "La date de fin est requise",
      }),
    })
    .refine((data) => data.start_date < data.end_date, {
      message: "La date de début doit être antérieure à la date de fin",
      path: ["end_date"],
    })
  