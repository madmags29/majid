'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
    label: string;
    href: string;
    active?: boolean;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
}

export default function Breadcrumbs({ items, className }: BreadcrumbsProps) {
    const baseUrl = 'https://weekendtravellers.com';
    
    // JSON-LD for BreadcrumbList
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.label,
            item: `${baseUrl}${item.href}`,
        })),
    };

    return (
        <nav 
            aria-label="Breadcrumb" 
            className={cn("flex items-center text-xs md:text-sm font-medium py-4 overflow-x-auto no-scrollbar whitespace-nowrap", className)}
        >
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            
            <ol className="flex items-center space-x-2 md:space-x-4">
                <li>
                    <Link 
                        href="/" 
                        className="text-slate-500 hover:text-blue-400 transition-colors flex items-center gap-1"
                    >
                        <Home className="w-3 h-3 md:w-4 md:h-4" />
                        <span className="sr-only">Home</span>
                    </Link>
                </li>
                
                {items.map((item, index) => (
                    <li key={item.href} className="flex items-center space-x-2 md:space-x-4">
                        <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-slate-700 shrink-0" />
                        {item.active ? (
                            <span className="text-blue-400 font-bold tracking-tight uppercase" aria-current="page">
                                {item.label}
                            </span>
                        ) : (
                            <Link
                                href={item.href}
                                className="text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-tight"
                            >
                                {item.label}
                            </Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
