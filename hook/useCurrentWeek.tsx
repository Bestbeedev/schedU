"use client"

const useCurrentWeek = () => {
  const getStartAndEndOfCurrentWeek = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    
    const daysToMonday = (dayOfWeek === 0 ? 6 : dayOfWeek - 1);  // Si aujourd'hui est dimanche (0), alors on veut revenir à -6 jours
    
    const monday = new Date(today);
    monday.setDate(today.getDate() - daysToMonday);
    monday.setHours(0, 0, 0, 0);
    
    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);
    friday.setHours(23, 59, 59, 999);
    
    return { monday, friday };
  };

  const { monday, friday } = getStartAndEndOfCurrentWeek();
  return { monday, friday };
};

export default useCurrentWeek;
