import { CONFIG, getTargetDate } from '../config.js';
import { StorageManager } from './storage.js';

/**
 * Week manager for generating and managing weeks data
 */
export class WeekManager {
  static generateAllWeeks() {
    const allWeeks = [];
    const now = new Date();
    const targetDate = getTargetDate();
    const totalWeeks = Math.floor((targetDate - CONFIG.BIRTH_DATE) / (7 * 24 * 60 * 60 * 1000));

    for (let i = 1; i <= totalWeeks; i++) {
      const weekStartDate = new Date(CONFIG.BIRTH_DATE);
      weekStartDate.setDate(weekStartDate.getDate() + (i - 1) * 7);

      const weekEndDate = new Date(weekStartDate);
      weekEndDate.setDate(weekEndDate.getDate() + 6);

      const isPassed = weekEndDate < now;
      const isCurrent = weekStartDate <= now && now <= weekEndDate;
      const weekData = StorageManager.getWeekData(i);

      allWeeks.push({
        number: i,
        startDate: weekStartDate,
        endDate: weekEndDate,
        isPassed,
        isCurrent,
        highlights: weekData.highlights,
        attachments: weekData.attachments,
        important: !!weekData.important
      });
    }

    return allWeeks;
  }

  static calculateStats(allWeeks) {
    const now = new Date();
    const targetDate = getTargetDate();
    const totalWeeks = allWeeks.length;
    const weeksPassed = allWeeks.filter(w => w.isPassed).length;
    const weeksRemaining = totalWeeks - weeksPassed;

    let ageYears = now.getFullYear() - CONFIG.BIRTH_DATE.getFullYear();
    const monthDiff = now.getMonth() - CONFIG.BIRTH_DATE.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < CONFIG.BIRTH_DATE.getDate())) {
      ageYears--;
    }

    const yearsRemaining = CONFIG.TARGET_AGE - ageYears;

    return {
      totalWeeks,
      weeksPassed,
      weeksRemaining,
      currentAge: ageYears,
      yearsRemaining,
      targetDate,
      now
    };
  }

  static filterWeeks(weeks, showOnlyRemaining = true, searchTerm = '') {
    let filtered = [...weeks];

    if (showOnlyRemaining) {
      const now = new Date();
      filtered = filtered.filter(week => week.endDate >= now);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(week =>
        week.number.toString().includes(term) ||
        week.startDate.toDateString().toLowerCase().includes(term)
      );
    }

    return filtered;
  }
}
