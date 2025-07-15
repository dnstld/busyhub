export const useDate = () => {
  const getCurrentYearWeekdays = () => {
    const currentYear = new Date().getFullYear();
    let weekdays = 0;

    for (let month = 0; month < 12; month++) {
      const daysInMonth = new Date(currentYear, month + 1, 0).getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentYear, month, day);
        const dayOfWeek = date.getDay();
        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
          weekdays++;
        }
      }
    }

    return weekdays;
  };

  return {
    totalWeekdays: getCurrentYearWeekdays(),
  }
}