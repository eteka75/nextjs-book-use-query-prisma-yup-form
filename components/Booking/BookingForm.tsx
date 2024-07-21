"use client";

import React from "react";
import { Formik, Form, Field, FieldProps } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import DatePicker from "../DatePicker";
import { BookingSchema } from "@/lib/schemas/validationSchemas";
import { Input } from "../ui/input";

const today = new Date();
today.setHours(0, 0, 0, 0); // Assurez-vous que la date est à minuit

// const BookingSchema = Yup.object().shape({
//   startDate: Yup.date()
//     .required("Required")
//     // .nullable()
//     .min(today, "Start date must be today or later"),
//   endDate: Yup.date().required("Required").nullable(),
//   // .min(Yup.ref("startDate"), "End date must be later than start date"),
// });

interface BookingFormProps {
  onSuccess?: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ onSuccess }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newBooking: {
      name: string;
      startDate: Date | null;
      endDate: Date | null;
    }) => axios.post("/api/bookings", newBooking),
    onSuccess: () => {
      queryClient.invalidateQueries(["bookings"]);
      if (onSuccess) onSuccess();
    },
  });

  return (
    <Formik
      initialValues={{ name: "", startDate: null, endDate: null }}
      validationSchema={BookingSchema}
      onSubmit={(values, { setSubmitting, resetForm, setErrors }) => {
        mutation.mutate(values, {
          onSuccess: () => {
            setSubmitting(false);
            resetForm();
          },
          onError: (error: any) => {
            setSubmitting(false);
            if (error.response && error.response.data.errors) {
              const formErrors: Record<string, string> = {};
              error.response.data.errors.forEach((e: string) => {
                if (e.includes("name")) formErrors.name = e;
                if (e.includes("Start date")) formErrors.startDate = e;
                if (e.includes("End date")) formErrors.endDate = e;
              });
              setErrors(formErrors);
            }
          },
        });
      }}
    >
      {({ setFieldValue, isSubmitting, errors, touched, values }) => (
        <Form>
          <div className="flex flex-col mb-4 gap-2">
            <Label htmlFor="name">Name</Label>
            <Field name="name">
              {({ field }: FieldProps) => (
                <Input
                  {...field}
                  value={values.name}
                  onChange={(e) => setFieldValue("name", e.target.value)}
                />
              )}
            </Field>
            {errors.name && touched.name ? (
              <div className="text-red-400 text-xs">{errors.name}</div>
            ) : null}
          </div>
          <div className="flex flex-col mb-4 gap-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Field name="startDate">
              {() => (
                <DatePicker
                  value={values.startDate}
                  onChange={(date) => setFieldValue("startDate", date)}
                  minDate={today} // Assurer que la date minimale est aujourd'hui
                />
              )}
            </Field>
            {errors.startDate && touched.startDate ? (
              <div className="text-red-400 text-xs">{errors.startDate}</div>
            ) : null}
          </div>
          <div className="flex flex-col mb-4 gap-2">
            <Label htmlFor="endDate">End Date</Label>
            <Field name="endDate">
              {() => (
                <DatePicker
                  value={values.endDate}
                  onChange={(date) => setFieldValue("endDate", date)}
                  minDate={values.startDate || today} // Assurer que la date minimale est la date de début ou aujourd'hui
                />
              )}
            </Field>
            {errors.endDate && touched.endDate ? (
              <div className="text-red-400 text-xs">{errors.endDate}</div>
            ) : null}
          </div>
          <div className="pt-4">
            <Button type="submit" disabled={isSubmitting || mutation.isLoading}>
              {isSubmitting || mutation.isLoading ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default BookingForm;
