'use client';

import { useState, useRef, useEffect } from 'react';
import { Calendar, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays, isBefore, isSameDay, startOfToday } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DateRangePickerProps {
    onRangeSelect: (start: Date | null, end: Date | null) => void;
    initialStart?: Date | null;
    initialEnd?: Date | null;
    className?: string;
}

export default function DateRangePicker({ onRangeSelect, initialStart, initialEnd, className }: DateRangePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [startDate, setStartDate] = useState<Date | null>(initialStart || null);
    const [endDate, setEndDate] = useState<Date | null>(initialEnd || null);
    const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setHoveredDate(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, []);

    const handleDateClick = (date: Date) => {
        if (!startDate || (startDate && endDate)) {
            setStartDate(date);
            setEndDate(null);
            onRangeSelect(date, null);
        } else if (startDate && !endDate) {
            if (isBefore(date, startDate)) {
                setStartDate(date);
                setEndDate(null);
                onRangeSelect(date, null);
            } else {
                setEndDate(date);
                onRangeSelect(startDate, date);
                setIsOpen(false); // Close after range selected
                setHoveredDate(null);
            }
        }
    };

    const renderCalendar = () => {
        const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
        const startDateOfCalendar = new Date(monthStart);
        startDateOfCalendar.setDate(startDateOfCalendar.getDate() - startDateOfCalendar.getDay());

        const days = [];
        const day = new Date(startDateOfCalendar);

        while (day <= monthEnd || day.getDay() !== 0) {
            const currentDay = new Date(day);
            const isSelected = (startDate && isSameDay(currentDay, startDate)) || (endDate && isSameDay(currentDay, endDate));
            const isInRange = startDate && endDate && currentDay > startDate && currentDay < endDate;
            const isHoverRange = startDate && !endDate && hoveredDate && currentDay > startDate && currentDay <= hoveredDate;
            const isToday = isSameDay(currentDay, startOfToday());
            const isPast = isBefore(currentDay, startOfToday());
            const isDifferentMonth = currentDay.getMonth() !== currentMonth.getMonth();

            days.push(
                <button
                    key={day.toISOString()}
                    type="button"
                    disabled={isPast}
                    onClick={() => handleDateClick(currentDay)}
                    onMouseEnter={() => !isPast && startDate && !endDate && setHoveredDate(currentDay)}
                    className={cn(
                        "h-9 w-9 text-xs rounded-lg transition-all flex items-center justify-center relative touch-manipulation cursor-pointer",
                        isPast ? "text-slate-600 cursor-not-allowed" : "text-slate-200 hover:bg-blue-500/20 active:bg-blue-500/30",
                        isDifferentMonth && !isSelected && "opacity-30",
                        isSelected && "bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/40 z-10 scale-105",
                        isInRange && "bg-blue-500/20 text-blue-300 rounded-none",
                        isHoverRange && "bg-blue-500/15 text-blue-300 rounded-none border-y border-blue-500/20",
                        isToday && !isSelected && "border border-blue-500/50 font-bold text-blue-400"
                    )}
                >
                    {currentDay.getDate()}
                </button>
            );
            day.setDate(day.getDate() + 1);
        }

        return (
            <div className="grid grid-cols-7 gap-1">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                    <div key={d} className="h-7 flex items-center justify-center text-[10px] font-black text-slate-400 uppercase tracking-wider">
                        {d}
                    </div>
                ))}
                {days}
            </div>
        );
    };

    const displayValue = startDate && endDate
        ? `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d')}`
        : startDate
            ? `${format(startDate, 'MMM d')}...`
            : "Select Dates";

    return (
        <div className={cn("relative", className)} ref={containerRef}>
            <div
                role="button"
                tabIndex={0}
                onClick={() => setIsOpen(!isOpen)}
                onKeyDown={(e) => e.key === 'Enter' && setIsOpen(!isOpen)}
                className="flex items-center w-full px-4 py-3 glass-input rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none transition-all cursor-pointer group min-h-[48px]"
            >
                <Calendar className="w-5 h-5 text-slate-300 mr-3 shrink-0 group-hover:text-blue-400 transition-colors pointer-events-none" />
                <span className={cn(
                    "bg-transparent w-full outline-none font-medium text-base truncate pointer-events-none",
                    !startDate ? "text-slate-400" : "text-white"
                )}>
                    {displayValue}
                </span>
                {(startDate || endDate) && (
                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            setStartDate(null);
                            setEndDate(null);
                            setHoveredDate(null);
                            onRangeSelect(null, null);
                        }}
                        className="ml-2 p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer relative z-20 min-w-[36px] min-h-[36px] flex items-center justify-center"
                        role="button"
                        aria-label="Clear dates"
                    >
                        <X className="w-3.5 h-3.5 text-slate-400 hover:text-white" />
                    </div>
                )}
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 mt-2 z-[9999] bg-slate-900/98 backdrop-blur-2xl border border-white/15 rounded-3xl p-4 shadow-2xl w-[300px] max-w-[calc(100vw-2rem)]"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <button
                                type="button"
                                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                                className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white min-w-[36px] min-h-[36px] flex items-center justify-center cursor-pointer transition-colors"
                                aria-label="Previous month"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="text-xs font-black text-slate-200 uppercase tracking-widest">
                                {format(currentMonth, 'MMMM yyyy')}
                            </span>
                            <button
                                type="button"
                                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                                className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white min-w-[36px] min-h-[36px] flex items-center justify-center cursor-pointer transition-colors"
                                aria-label="Next month"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        {renderCalendar()}

                        {/* Quick Presets */}
                        <div className="mt-4 pt-3 border-t border-white/10 flex flex-col gap-2">
                            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                                <button
                                    type="button"
                                    onClick={() => {
                                        const nextFri = addDays(startOfToday(), (5 - startOfToday().getDay() + 7) % 7);
                                        const nextSun = addDays(nextFri, 2);
                                        setStartDate(nextFri);
                                        setEndDate(nextSun);
                                        onRangeSelect(nextFri, nextSun);
                                        setIsOpen(false);
                                    }}
                                    className="flex-1 text-[11px] font-bold bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white py-1.5 px-2 rounded-lg border border-white/5 transition-all whitespace-nowrap cursor-pointer text-center"
                                >
                                    This Weekend
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const nextWeekFri = addDays(startOfToday(), ((5 - startOfToday().getDay() + 7) % 7) + 7);
                                        const nextWeekSun = addDays(nextWeekFri, 2);
                                        setStartDate(nextWeekFri);
                                        setEndDate(nextWeekSun);
                                        onRangeSelect(nextWeekFri, nextWeekSun);
                                        setIsOpen(false);
                                    }}
                                    className="flex-1 text-[11px] font-bold bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white py-1.5 px-2 rounded-lg border border-white/5 transition-all whitespace-nowrap cursor-pointer text-center"
                                >
                                    Next Weekend
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const today = startOfToday();
                                        const in3Days = addDays(today, 3);
                                        setStartDate(today);
                                        setEndDate(in3Days);
                                        onRangeSelect(today, in3Days);
                                        setIsOpen(false);
                                    }}
                                    className="flex-1 text-[11px] font-bold bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white py-1.5 px-2 rounded-lg border border-white/5 transition-all whitespace-nowrap cursor-pointer text-center"
                                >
                                    3 Days
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
