import React from 'react';
import { ExternalLink } from 'lucide-react';

const SponsorCard = ({ title, description, icon: Icon, imageUrl, colorClass, badge, url, onClick }) => {
    const CardContent = (
        <div className="p-4 rounded-2xl border border-border/60 bg-card/40 hover:bg-card group transition-all relative overflow-hidden shadow-sm hover:shadow-md flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden ${colorClass}`}>
                {imageUrl ? (
                    <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
                ) : (
                    Icon && <Icon className="w-6 h-6" />
                )}
            </div>

            <div className="flex-1 space-y-0.5 py-1">
                <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                        {title}
                    </h3>
                    {badge && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-bold uppercase tracking-tighter border border-primary/20">
                            {badge}
                        </span>
                    )}
                </div>
                <p className="text-xs text-muted-foreground leading-snug pr-4">
                    {description}
                </p>
            </div>

            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ExternalLink size={14} className="text-muted-foreground" />
            </div>
        </div>
    );

    if (url) {
        return (
            <a href={url} target="_blank" rel="noopener noreferrer" className="block cursor-pointer">
                {CardContent}
            </a>
        );
    }

    if (onClick) {
        return (
            <div onClick={onClick} className="block cursor-pointer">
                {CardContent}
            </div>
        );
    }

    return CardContent;
};

export default SponsorCard;
