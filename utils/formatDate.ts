// utils/formatDate.ts
import { formatDistanceToNow, format, isToday } from "date-fns";
import { fr } from "date-fns/locale";

const formatDate = (date: Date | string): string => {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }

  if (isNaN(date.getTime())) {
    return "Date invalide";
  }

  const now = new Date();
  const distance = formatDistanceToNow(date, { addSuffix: true, locale: fr });

  if (isToday(date)) {
    return `Aujourd'hui à ${format(date, "HH:mm", { locale: fr })}`;
  }

  if (now.getFullYear() === date.getFullYear()) {
    return format(date, "d MMMM", { locale: fr });
  }

  return format(date, "d MMMM yyyy", { locale: fr });
};

export default formatDate;
