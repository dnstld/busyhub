import { useEvents } from '@/hooks/use-events';
import { useCalendar } from '@/providers/events-provider';
import { useMemo } from 'react';

export interface DailyTotal {
  date: string;
  meetingCount: number;
  totalHours: number;
  earliestStart: string;
  latestEnd: string;
  morningMeetings: number;
  afternoonMeetings: number;
  workdayLength: number;
}

export interface WeeklyDistribution {
  weekdayTotals: number[];
  weekdayNames: string[];
  heaviestDay: string;
  lightestDay: string;
  heaviestCount: number;
  lightestCount: number;
}

export interface MonthlyTrends {
  monthlyData: { [key: string]: { meetings: number; hours: number } };
  sortedMonths: string[];
  trend: string;
}

export interface MeetingGaps {
  backToBackDays: number;
  spreadOutDays: number;
  avgGapMinutes: number;
  backToBackPercentage: number;
}

export interface WorkdayPatterns {
  earlyStarts: number;
  lateEnds: number;
  longDays: number;
  normalHours: number;
  earlyStartPercentage: number;
  lateEndPercentage: number;
}

export interface MeetingTypes {
  recurringMeetings: number;
  oneOffMeetings: number;
  internalMeetings: number;
  externalMeetings: number;
  recurringPercentage: number;
  externalPercentage: number;
}

export interface HeavyStreaks {
  maxStreak: number;
  allStreaks: number[];
}

export interface InsightData {
  dailyTotals: DailyTotal[];
  weeklyDistribution: WeeklyDistribution;
  monthlyTrends: MonthlyTrends;
  meetingGaps: MeetingGaps;
  workdayPatterns: WorkdayPatterns;
  meetingTypes: MeetingTypes;
  heavyStreaks: HeavyStreaks;
  totalMeetingHours: number;
  avgMeetingHoursPerDay: string;
  heavyDays: DailyTotal[];
  aiPrompt: string;
}

export const useInsight = (): InsightData | null => {
  const events = useCalendar();
  const { confirmedEvents, dailyEvents } = useEvents(events);

  return useMemo(() => {
    if (confirmedEvents.length === 0) {
      return null;
    }

    const getDailyTotals = (): DailyTotal[] => {
      const dailyTotals: DailyTotal[] = [];

      for (const [date, events] of dailyEvents) {
        let totalHours = 0;
        let earliestStart: Date | null = null;
        let latestEnd: Date | null = null;
        let morningMeetings = 0;
        let afternoonMeetings = 0;

        events.forEach((event) => {
          if (event.start?.dateTime && event.end?.dateTime) {
            const start = new Date(event.start.dateTime);
            const end = new Date(event.end.dateTime);

            // Calculate duration in hours
            const durationHours =
              (end.getTime() - start.getTime()) / (1000 * 60 * 60);
            totalHours += durationHours;

            // Track earliest start
            if (!earliestStart || start < earliestStart) {
              earliestStart = start;
            }

            // Track latest end
            if (!latestEnd || end > latestEnd) {
              latestEnd = end;
            }

            // Count morning vs afternoon meetings
            const hour = start.getHours();
            if (hour < 12) {
              morningMeetings++;
            } else {
              afternoonMeetings++;
            }
          }
        });

        let earliestTime = 'N/A';
        let latestTime = 'N/A';
        let workdayHours = 0;

        if (earliestStart) {
          // Use UTC time to ensure consistent timezone handling
          const utcHours = (earliestStart as Date).getUTCHours().toString().padStart(2, '0');
          const utcMinutes = (earliestStart as Date).getUTCMinutes().toString().padStart(2, '0');
          earliestTime = `${utcHours}:${utcMinutes}`;
        }
        if (latestEnd) {
          // Use UTC time to ensure consistent timezone handling
          const utcHours = (latestEnd as Date).getUTCHours().toString().padStart(2, '0');
          const utcMinutes = (latestEnd as Date).getUTCMinutes().toString().padStart(2, '0');
          latestTime = `${utcHours}:${utcMinutes}`;
        }
        if (earliestStart && latestEnd) {
          workdayHours =
            Math.round(
              (((latestEnd as Date).getTime() - (earliestStart as Date).getTime()) /
                (1000 * 60 * 60)) *
                10
            ) / 10;
        }

        dailyTotals.push({
          date,
          meetingCount: events.length,
          totalHours: Math.round(totalHours * 10) / 10,
          earliestStart: earliestTime,
          latestEnd: latestTime,
          morningMeetings,
          afternoonMeetings,
          workdayLength: workdayHours,
        });
      }

      return dailyTotals.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    };

    const getWeeklyDistribution = (dailyTotals: DailyTotal[]): WeeklyDistribution => {
      const weekdayTotals = [0, 0, 0, 0, 0, 0, 0]; // Sun, Mon, Tue, Wed, Thu, Fri, Sat
      const weekdayNames = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ];

      dailyTotals.forEach((day) => {
        const dayOfWeek = new Date(day.date).getDay();
        weekdayTotals[dayOfWeek] += day.meetingCount;
      });

      const maxDay = weekdayTotals.indexOf(Math.max(...weekdayTotals));
      const minDay = weekdayTotals.indexOf(Math.min(...weekdayTotals));

      return {
        weekdayTotals,
        weekdayNames,
        heaviestDay: weekdayNames[maxDay],
        lightestDay: weekdayNames[minDay],
        heaviestCount: weekdayTotals[maxDay],
        lightestCount: weekdayTotals[minDay],
      };
    };

    const getMonthlyTrends = (): MonthlyTrends => {
      const monthlyData: { [key: string]: { meetings: number; hours: number } } = {};

      for (const [date, events] of dailyEvents) {
        const monthKey = date.substring(0, 7); // YYYY-MM format
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { meetings: 0, hours: 0 };
        }

        let totalHours = 0;
        events.forEach((event) => {
          if (event.start?.dateTime && event.end?.dateTime) {
            const duration =
              (new Date(event.end.dateTime).getTime() -
                new Date(event.start.dateTime).getTime()) /
              (1000 * 60 * 60);
            totalHours += duration;
          }
        });

        monthlyData[monthKey].meetings += events.length;
        monthlyData[monthKey].hours += totalHours;
      }

      const sortedMonths = Object.keys(monthlyData).sort();
      const recent6Months = sortedMonths.slice(-6);

      let trend = 'stable';
      if (recent6Months.length >= 3) {
        const early = monthlyData[recent6Months[0]].meetings;
        const late =
          monthlyData[recent6Months[recent6Months.length - 1]].meetings;
        const change = ((late - early) / early) * 100;

        if (change > 15) trend = 'increasing';
        else if (change < -15) trend = 'decreasing';
      }

      return { monthlyData, sortedMonths, trend };
    };

    const getMeetingGaps = (): MeetingGaps => {
      let backToBackDays = 0;
      let spreadOutDays = 0;
      let totalGapMinutes = 0;
      let gapCount = 0;

      for (const [, events] of dailyEvents) {
        if (events.length < 2) continue;

        const sortedEvents = events
          .filter((event) => event.start?.dateTime && event.end?.dateTime)
          .sort(
            (a, b) =>
              new Date(a.start.dateTime!).getTime() -
              new Date(b.start.dateTime!).getTime()
          );

        let dayBackToBack = 0;
        let dayGaps = 0;

        for (let i = 1; i < sortedEvents.length; i++) {
          const prevEnd = new Date(sortedEvents[i - 1].end.dateTime!);
          const currentStart = new Date(sortedEvents[i].start.dateTime!);
          const gapMinutes =
            (currentStart.getTime() - prevEnd.getTime()) / (1000 * 60);

          totalGapMinutes += gapMinutes;
          gapCount++;

          if (gapMinutes <= 15) {
            dayBackToBack++;
          } else {
            dayGaps++;
          }
        }

        if (dayBackToBack > dayGaps) {
          backToBackDays++;
        } else {
          spreadOutDays++;
        }
      }

      const avgGapMinutes =
        gapCount > 0 ? Math.round(totalGapMinutes / gapCount) : 0;

      return {
        backToBackDays,
        spreadOutDays,
        avgGapMinutes,
        backToBackPercentage:
          totalGapMinutes > 0
            ? Math.round(
                (backToBackDays / (backToBackDays + spreadOutDays)) * 100
              )
            : 0,
      };
    };

    const getWorkdayPatterns = (dailyTotals: DailyTotal[]): WorkdayPatterns => {
      let earlyStarts = 0; // Before 8 AM
      let lateEnds = 0; // After 6 PM
      let longDays = 0; // 10+ hours
      let normalHours = 0; // 9 AM - 5 PM

      dailyTotals.forEach((day) => {
        const startTime = day.earliestStart;
        const endTime = day.latestEnd;

        if (startTime !== 'N/A' && startTime < '08:00') {
          earlyStarts++;
        }
        if (endTime !== 'N/A' && endTime > '18:00') {
          lateEnds++;
        }
        if (day.workdayLength >= 10) {
          longDays++;
        }
        if (startTime >= '09:00' && endTime <= '17:00') {
          normalHours++;
        }
      });

      return {
        earlyStarts,
        lateEnds,
        longDays,
        normalHours,
        earlyStartPercentage: Math.round(
          (earlyStarts / dailyTotals.length) * 100
        ),
        lateEndPercentage: Math.round((lateEnds / dailyTotals.length) * 100),
      };
    };

    const getMeetingTypes = (): MeetingTypes => {
      let recurringMeetings = 0;
      let oneOffMeetings = 0;
      let internalMeetings = 0;
      let externalMeetings = 0;

      // Simple heuristics for meeting classification
      confirmedEvents.forEach((event) => {
        // Recurring vs one-off (simple check based on summary patterns)
        const summary = event.summary?.toLowerCase() || '';
        if (
          summary.includes('weekly') ||
          summary.includes('daily') ||
          summary.includes('standup') ||
          summary.includes('recurring') ||
          summary.includes('1:1') ||
          summary.includes('sync')
        ) {
          recurringMeetings++;
        } else {
          oneOffMeetings++;
        }

        // Internal vs external (simple heuristic based on attendee count and summary)
        const hasExternalIndicators =
          summary.includes('external') ||
          summary.includes('client') ||
          summary.includes('customer') ||
          summary.includes('vendor') ||
          summary.includes('demo') ||
          summary.includes('presentation');

        if (hasExternalIndicators) {
          externalMeetings++;
        } else {
          internalMeetings++;
        }
      });

      return {
        recurringMeetings,
        oneOffMeetings,
        internalMeetings,
        externalMeetings,
        recurringPercentage: Math.round(
          (recurringMeetings / confirmedEvents.length) * 100
        ),
        externalPercentage: Math.round(
          (externalMeetings / confirmedEvents.length) * 100
        ),
      };
    };

    const getHeavyStreaks = (dailyTotals: DailyTotal[]): HeavyStreaks => {
      let currentStreak = 0;
      let maxStreak = 0;
      const streaks: number[] = [];

      dailyTotals.forEach((day) => {
        // Heavy day = 5+ meetings OR 6+ hours OR 12+ hour workday
        const isHeavyDay =
          day.meetingCount >= 5 || day.totalHours >= 6 || day.workdayLength >= 12;

        if (isHeavyDay) {
          currentStreak++;
          maxStreak = Math.max(maxStreak, currentStreak);
        } else {
          if (currentStreak >= 2) {
            streaks.push(currentStreak);
          }
          currentStreak = 0;
        }
      });

      return { maxStreak, allStreaks: streaks };
    };

    const dailyTotals = getDailyTotals();
    const weeklyDistribution = getWeeklyDistribution(dailyTotals);
    const monthlyTrends = getMonthlyTrends();
    const meetingGaps = getMeetingGaps();
    const workdayPatterns = getWorkdayPatterns(dailyTotals);
    const meetingTypes = getMeetingTypes();
    const heavyStreaks = getHeavyStreaks(dailyTotals);

    // Calculate summary statistics
    const totalMeetingHours = dailyTotals.reduce(
      (sum, day) => sum + day.totalHours,
      0
    );
    const avgMeetingHoursPerDay =
      dailyTotals.length > 0
        ? (totalMeetingHours / dailyTotals.length).toFixed(1)
        : '0';
    const heavyDays = dailyTotals.filter(
      (day) =>
        day.meetingCount >= 5 || day.totalHours >= 6 || day.workdayLength >= 12
    );

    const currentYear = new Date().getFullYear();
    const aiPrompt = `Act as a productivity and time management consultant.Analyze this calendar data as a productivity consultant. Write a natural, flowing paragraph that's pleasant to read. Focus on key patterns like meeting density, overload streaks, and work boundaries. Give practical advice in a conversational tone. Avoid lists, bullet points, or line breaks. Keep it under 500 characters and make it enjoyable to read.

📊 ${currentYear} Daily Meeting Totals:
${dailyTotals
  .map(
    (day) =>
      `${day.date}: ${day.meetingCount} meetings, ${day.totalHours}h, ${day.earliestStart}-${day.latestEnd} (${day.workdayLength}h workday)`
  )
  .join('\n')}

🔍 Deep Pattern Analysis:

📅 Weekly Distribution:
• Heaviest day: ${weeklyDistribution.heaviestDay} (${
      weeklyDistribution.heaviestCount
    } total meetings)
• Lightest day: ${weeklyDistribution.lightestDay} (${
      weeklyDistribution.lightestCount
    } total meetings)
• Distribution: ${weeklyDistribution.weekdayNames
      .map((day, i) => `${day.slice(0, 3)}: ${weeklyDistribution.weekdayTotals[i]}`)
      .join(', ')}

📈 Monthly Trends:
• 6-month trend: ${monthlyTrends.trend}
• Monthly breakdown: ${Object.entries(monthlyTrends.monthlyData)
      .slice(-6)
      .map(
        ([month, data]: [string, { meetings: number; hours: number }]) =>
          `${month}: ${data.meetings}m`
      )
      .join(', ')}

⏱️ Meeting Spacing:
• Back-to-back days: ${meetingGaps.backToBackDays} (${
      meetingGaps.backToBackPercentage
    }% of multi-meeting days)
• Spread-out days: ${meetingGaps.spreadOutDays}
• Average gap between meetings: ${meetingGaps.avgGapMinutes} minutes

🕐 Workday Boundaries:
• Early starts (<8AM): ${workdayPatterns.earlyStarts} days (${
      workdayPatterns.earlyStartPercentage
    }%)
• Late ends (>6PM): ${workdayPatterns.lateEnds} days (${
      workdayPatterns.lateEndPercentage
    }%)
• 10+ hour workdays: ${workdayPatterns.longDays} days
• Normal hours (9-5): ${workdayPatterns.normalHours} days

📋 Meeting Types:
• Recurring pattern meetings: ${meetingTypes.recurringMeetings} (${
      meetingTypes.recurringPercentage
    }%)
• One-off meetings: ${meetingTypes.oneOffMeetings}
• External-facing meetings: ${meetingTypes.externalMeetings} (${
      meetingTypes.externalPercentage
    }%)
• Internal meetings: ${meetingTypes.internalMeetings}

⚡ Key Risk Indicators:
• Heavy day streaks: Max ${heavyStreaks.maxStreak} consecutive days
• Total overload days: ${
      heavyDays.length
    } (5+ meetings OR 6+ hours OR 12+ workday)
• Avg meeting hours per active day: ${avgMeetingHoursPerDay}h
• Context-switch risk: ${
      meetingGaps.backToBackPercentage
    }% back-to-back meeting days
• Personal time intrusion: ${
      workdayPatterns.earlyStartPercentage + workdayPatterns.lateEndPercentage
    }% days outside 8AM-6PM`;

    return {
      dailyTotals,
      weeklyDistribution,
      monthlyTrends,
      meetingGaps,
      workdayPatterns,
      meetingTypes,
      heavyStreaks,
      totalMeetingHours,
      avgMeetingHoursPerDay,
      heavyDays,
      aiPrompt,
    };
  }, [confirmedEvents, dailyEvents]);
};
