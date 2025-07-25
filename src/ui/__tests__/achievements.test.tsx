import { CalendarEvent } from '@/app/actions/get-events';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Achievements from '../achievements';

// Mock the hooks
vi.mock('@/hooks/use-achievements', () => ({
  useAchievements: vi.fn(),
}));

vi.mock('@/hooks/use-date', () => ({
  useDate: vi.fn(),
}));

vi.mock('@/hooks/use-events', () => ({
  useEvents: vi.fn(),
}));

vi.mock('@/providers/events-provider', () => ({
  useCalendar: vi.fn(),
}));

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    className,
  }: {
    src: string;
    alt: string;
    className?: string;
  }) => (
    <div
      data-src={src}
      data-alt={alt}
      className={className}
      data-testid={`achievement-${alt.split(' ')[0].toLowerCase()}`}
    ></div>
  ),
}));

import { useAchievements } from '@/hooks/use-achievements';
import { useDate } from '@/hooks/use-date';
import { useEvents } from '@/hooks/use-events';
import { useCalendar } from '@/providers/events-provider';

describe('Achievements Component', () => {
  const mockEvents: CalendarEvent[] = [];

  const mockUseCalendar = vi.mocked(useCalendar);
  const mockUseEvents = vi.mocked(useEvents);
  const mockUseDate = vi.mocked(useDate);
  const mockUseAchievements = vi.mocked(useAchievements);

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Set up default mock returns
    mockUseCalendar.mockReturnValue(mockEvents);
    mockUseEvents.mockReturnValue({
      sanitized: [],
      confirmedEvents: [],
      dailyEvents: new Map(),
      totalEvents: 0,
      dailyStats: [],
      weeklyStats: [],
      monthlyStats: [],
      getHistoryData: vi.fn(),
      getEventsByDateRange: vi.fn(),
      getEventsForDate: vi.fn(),
      filterEventsByTimeframe: vi.fn(),
      parseEventDate: vi.fn(),
    });
    mockUseDate.mockReturnValue({
      totalWeekdays: 100,
    });
    mockUseAchievements.mockReturnValue({
      welcome: false,
      beginner: false,
      onFire: false,
      king: false,
    });
  });

  it('should render all achievement badges', () => {
    render(<Achievements />);

    expect(screen.getByTestId('achievement-welcome')).toBeInTheDocument();
    expect(screen.getByTestId('achievement-beginner')).toBeInTheDocument();
    expect(screen.getByTestId('achievement-on')).toBeInTheDocument();
    expect(screen.getByTestId('achievement-the')).toBeInTheDocument();
  });

  it('should show unlocked achievements without opacity', () => {
    mockUseAchievements.mockReturnValue({
      welcome: true,
      beginner: true,
      onFire: false,
      king: false,
    });

    render(<Achievements />);

    const welcomeBadge = screen.getByTestId('achievement-welcome');
    const beginnerBadge = screen.getByTestId('achievement-beginner');
    const onFireBadge = screen.getByTestId('achievement-on');
    const kingBadge = screen.getByTestId('achievement-the');

    expect(welcomeBadge.className).not.toContain('opacity-15');
    expect(beginnerBadge.className).not.toContain('opacity-15');
    expect(onFireBadge.className).toContain('opacity-15');
    expect(kingBadge.className).toContain('opacity-15');
  });

  it('should show locked achievements with low opacity', () => {
    mockUseAchievements.mockReturnValue({
      welcome: false,
      beginner: false,
      onFire: false,
      king: false,
    });

    render(<Achievements />);

    const badges = [
      screen.getByTestId('achievement-welcome'),
      screen.getByTestId('achievement-beginner'),
      screen.getByTestId('achievement-on'),
      screen.getByTestId('achievement-the'),
    ];

    badges.forEach((badge) => {
      expect(badge.className).toContain('opacity-15');
    });
  });

  it('should pass correct props to useAchievements hook', () => {
    const mockDailyEvents = new Map();
    const mockTotalEvents = 150;
    const mockTotalWeekdays = 250;

    mockUseEvents.mockReturnValue({
      sanitized: [],
      confirmedEvents: [],
      dailyEvents: mockDailyEvents,
      totalEvents: mockTotalEvents,
      dailyStats: [],
      weeklyStats: [],
      monthlyStats: [],
      getHistoryData: vi.fn(),
      getEventsByDateRange: vi.fn(),
      getEventsForDate: vi.fn(),
      filterEventsByTimeframe: vi.fn(),
      parseEventDate: vi.fn(),
    });
    mockUseDate.mockReturnValue({
      totalWeekdays: mockTotalWeekdays,
    });

    render(<Achievements />);

    expect(mockUseAchievements).toHaveBeenCalledWith({
      dailyEvents: mockDailyEvents,
      totalEvents: mockTotalEvents,
      totalWeekdays: mockTotalWeekdays,
    });
  });

  it('should handle mixed achievement states correctly', () => {
    mockUseAchievements.mockReturnValue({
      welcome: true,
      beginner: false,
      onFire: true,
      king: false,
    });

    render(<Achievements />);

    expect(screen.getByTestId('achievement-welcome').className).not.toContain(
      'opacity-15'
    );
    expect(screen.getByTestId('achievement-beginner').className).toContain(
      'opacity-15'
    );
    expect(screen.getByTestId('achievement-on').className).not.toContain(
      'opacity-15'
    );
    expect(screen.getByTestId('achievement-the').className).toContain(
      'opacity-15'
    );
  });
});
