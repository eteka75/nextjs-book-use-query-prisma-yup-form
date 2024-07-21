// validationSchemas.ts
import * as Yup from "yup";

const today = new Date();
today.setHours(0, 0, 0, 0);

export const BookingSchema = Yup.object().shape({
  name: Yup.string()
    .required("Required")
    .min(3, "minumm 3 caractères")
    .max(100, "Maximum 100 caractères"),
  startDate: Yup.date()
    .required("Start date is required")
    .min(today, "Start date must be today or later"),
  endDate: Yup.date()
    .required("End date is required")
    .min(Yup.ref("startDate"), "End date must be later than start date"),
});
