"use client";

import React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  minDate?: Date; // Propriété pour spécifier la date minimale
}

const formatDate = (date: Date | null): string => {
  return date ? format(date, "dd/MM/yyyy") : "Pick a date";
};

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  minDate,
}) => {
  const [showCalendar, setShowCalendar] = React.useState(false);

  const handleDateChange = (date: Date | null) => {
    onChange(date);
    // Optionnel: Vous pouvez définir la visibilité du calendrier ici si nécessaire
    // setShowCalendar(false); // Cacher le calendrier après sélection, si souhaité
  };

  return (
    <Popover open={showCalendar} onOpenChange={setShowCalendar}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={`w-full justify-start text-left font-normal ${
            !value ? "text-muted-foreground" : ""
          }`}
          onClick={() => setShowCalendar(true)} // Ouvrir le calendrier au clic
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formatDate(value)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => handleDateChange(date as Date)}
          initialFocus
          minDate={minDate || new Date()} // Utiliser minDate ou la date actuelle
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
