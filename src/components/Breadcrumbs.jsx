"use client";
import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

const Breadcrumbs = ({ items }) => {
    return (
        <nav className="flex items-center text-sm text-muted-foreground mb-8">
            <Link
                href="/"
                className="flex items-center gap-1 hover:text-foreground transition-colors font-bold"
                title="Back to Leaderboard"
            >
                nozerodays
            </Link>

            {items.map((item, index) => (
                <React.Fragment key={index}>
                    <ChevronRight size={14} className="mx-2 text-border" />
                    {item.href ? (
                        <Link
                            href={item.href}
                            className="hover:text-foreground transition-colors font-medium"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-foreground font-bold">{item.label}</span>
                    )}
                </React.Fragment>
            ))}
        </nav>
    );
};

export default Breadcrumbs;
