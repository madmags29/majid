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
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
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
            }
        }
    };

    const renderCalendar = () => {
        const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
        const startDateOfCalendar = new Date(monthStart);
        startDateOfCalendar.setDate(startDateOfCalendar.getDate() - startDateOfCalendar.getDay());

        const days = [];
        let day = new Date(startDateOfCalendar);

        while (day <= monthEnd || day.getDay() !== 0) {
            const currentDay = new Date(day);
            const isSelected = (startDate && isSameDay(currentDay, startDate)) || (endDate && isSameDay(currentDay, endDate));
            const isInRange = startDate && endDate && currentDay > startDate && currentDay < endDate;
            const isToday = isSameDay(currentDay, startOfToday());
            const isPast = isBefore(currentDay, startOfToday());
            const isDifferentMonth = currentDay.getMonth() !== currentMonth.getMonth();

            days.push(
                <button
                    key={day.toISOString()}
                    type="button"
                    disabled={isPast}
                    onClick={() => handleDateClick(currentDay)}
                    className={cn(
                        "h-10 w-10 text-xs rounded-lg transition-all flex items-center justify-center relative touch-manipulation",
                        isPast ? "text-slate-600 cursor-not-allowed" : "text-slate-200 hover:bg-blue-500/20 active:bg-blue-500/30",
                        isDifferentMonth && !isSelected && "opacity-30",
                        isSelected && "bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/40 z-10",
                        isInRange && "bg-blue-500/10 text-blue-400 rounded-none",
                        isToday && !isSelected && "border border-blue-500/50"
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
                    <div key={d} className="h-8 flex items-center justify-center text-[10px] font-bold text-slate-500 uppercase">
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
                className="flex items-center w-full px-4 py-3 glass-input rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none transition-all cursor-pointer group"
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
                            onRangeSelect(null, null);
                        }}
                        className="ml-2 p-1.5 hover:bg-white/10 rounded-full transition-colors cursor-pointer relative z-20"
                    >
                        <X className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                )}
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full left-0 mt-2 z-[9999] bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl w-[280px]"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <button
                                type="button"
                                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                                className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                                {format(currentMonth, 'MMMM yyyy')}
                            </span>
                            <button
                                type="button"
                                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                                className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        {renderCalendar()}

                        <div className="mt-4 pt-4 border-t border-white/5 flex gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    const nextFri = addDays(startOfToday(), (5 - startOfToday().getDay() + 7) % 7);
                                    handleDateClick(nextFri);
                                    handleDateClick(addDays(nextFri, 2));
                                }}
                                className="flex-1 text-[10px] font-bold bg-white/5 hover:bg-white/10 text-slate-300 py-2 rounded-lg border border-white/5 transition-colors"
                            >
                                This Weekend
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="flex-1 text-[10px] font-bold bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg shadow-lg shadow-blue-500/20 transition-colors"
                            >
                                Done
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
