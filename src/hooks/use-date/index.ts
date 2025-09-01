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

  const getCurrentMonthKey = () => {
    const currentDate = new Date();
    return currentDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  };

  const getMonthDisplayName = (monthKey: string) => {
    try {
      const parts = monthKey.trim().split(' ');
      if (parts.length >= 1) {
        const fullMonthName = parts[0];
        const monthMap: { [key: string]: string } = {
          January: 'Jan',
          February: 'Feb',
          March: 'Mar',
          April: 'Apr',
          May: 'May',
          June: 'Jun',
          July: 'Jul',
          August: 'Aug',
          September: 'Sep',
          October: 'Oct',
          November: 'Nov',
          December: 'Dec',
        };
        return monthMap[fullMonthName] || fullMonthName.slice(0, 3);
      }
      return monthKey;
    } catch {
      return monthKey;
    }
  };

  const getCurrentYear = () => {
    return new Date().getFullYear();
  };

  const getCurrentMonth = () => {
    return new Date().getMonth();
  };

  const getCurrentDate = () => {
    return new Date();
  };

  const formatMonthYear = (month: string) => {
    // month is in format "January 2024" from getMonthDisplayKey
    // Format it properly for display
    try {
      // Since the input is already in "Month Year" format, we can return it directly
      // or parse it to ensure consistent formatting
      const parts = month.trim().split(' ');
      if (parts.length >= 2) {
        return month; // Already in correct format
      }
      
      // Fallback: try to parse as date
      const date = new Date(month);
      if (isNaN(date.getTime())) return month; // Return original if parsing fails

      return date.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return month; // Return original if any error occurs
    }
  };

  const getDateKey = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const isCurrentYear = (date: Date) => {
    return date.getFullYear() === getCurrentYear();
  };

  const isCurrentMonth = (date: Date) => {
    const now = new Date();
    return date.getFullYear() === now.getFullYear() && 
           date.getMonth() === now.getMonth();
  };

  return {
    totalWeekdays: getCurrentYearWeekdays(),
    getCurrentMonthKey,
    getMonthDisplayName,
    getCurrentYear,
    getCurrentMonth,
    getCurrentDate,
    formatMonthYear,
    getDateKey,
    isCurrentYear,
    isCurrentMonth,
  };
};
