"use client";
import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, ArrowRight, Loader2, UploadCloud, Globe, FileText, Type, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';

// Removed local createClient to avoid multiple instances logic

const SponsorModal = ({ isOpen, onClose, paymentLink }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        target_url: '',
        image_url: ''
    });
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    // Lock body scroll
    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    // Close on Escape
    useEffect(() => {
        const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Limit file size to 2MB
        if (file.size > 2 * 1024 * 1024) {
            alert("File is too large. Please upload an image under 2MB.");
            return;
        }

        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${fileName}`;

            // Upload to Supabase Storage 'sponsor-logos' bucket
            const { error: uploadError } = await supabase.storage
                .from('sponsor-logos')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('sponsor-logos')
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, image_url: publicUrl }));
        } catch (error) {
            console.error('Error uploading image:', error);
            alert("Upload failed. Make sure the 'sponsor-logos' bucket exists and is public.");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data, error } = await supabase
                .from('sponsors')
                .insert([
                    {
                        title: formData.title,
                        description: formData.description,
                        target_url: formData.target_url,
                        image_url: formData.image_url,
                        status: 'pending_payment'
                    }
                ])
                .select();

            if (error) throw error;
            window.open(paymentLink, '_blank');
            onClose();
        } catch (error) {
            console.error('Error saving sponsor:', error);
            alert("Failed to save details. Please try again. " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const triggerFileInput = () => fileInputRef.current?.click();

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-background/60 backdrop-blur-md"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 15 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-sm bg-card/95 backdrop-blur-xl border border-white/20 dark:border-white/5 shadow-2xl rounded-[32px] overflow-hidden flex flex-col"
                    >
                        {/* Elegant Header */}
                        <div className="px-6 py-5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-500/10 to-purple-500/10 flex items-center justify-center text-primary ring-1 ring-inset ring-black/5 dark:ring-white/10">
                                    <Sparkles size={18} className="fill-blue-500/20 text-blue-500" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-bold text-foreground tracking-tight">Prime Spot</h2>
                                    <p className="text-[10px] text-muted-foreground font-medium">Get featured instantly</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-full bg-secondary/50 hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-all duration-200"
                            >
                                <X size={14} />
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="h-px w-full bg-gradient-to-r from-transparent via-border/60 to-transparent" />

                        {/* Content */}
                        <div className="p-6 pt-5">
                            <form onSubmit={handleSubmit} className="space-y-5">

                                {/* Image Upload - Enhanced Pill Design */}
                                <div
                                    onClick={triggerFileInput}
                                    className={`
                                        group relative w-full h-20 rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden flex items-center gap-4 px-4
                                        ${formData.image_url
                                            ? 'border-blue-500/30 bg-blue-500/5'
                                            : 'border-border/60 hover:border-primary/40 hover:bg-secondary/30 bg-secondary/10'
                                        }
                                    `}
                                >
                                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />

                                    <div className={`
                                        w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105
                                        ${formData.image_url ? 'bg-white shadow-sm' : 'bg-background ring-1 ring-black/5'}
                                    `}>
                                        {formData.image_url ? (
                                            <img src={formData.image_url} className="w-full h-full object-cover rounded-xl" />
                                        ) : uploading ? (
                                            <Loader2 size={20} className="animate-spin text-primary" />
                                        ) : (
                                            <UploadCloud size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="text-xs font-bold text-foreground truncate">
                                            {formData.image_url ? 'Logo Uploaded' : 'Upload Brand Logo'}
                                        </div>
                                        <div className="text-[10px] text-muted-foreground mt-0.5">
                                            {formData.image_url ? 'Click to replace' : 'SVG, PNG, or JPG (Square)'}
                                        </div>
                                    </div>

                                    {!formData.image_url && <div className="text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">Browse</div>}
                                </div>

                                {/* Form Fields - Cleaner & Lighter */}
                                <div className="space-y-3">
                                    <div className="relative group">
                                        <div className="absolute left-3.5 top-3 w-8 h-8 rounded-lg bg-background flex items-center justify-center text-muted-foreground group-focus-within:text-primary shadow-sm ring-1 ring-black/5 transition-all">
                                            <Type size={14} />
                                        </div>
                                        <input
                                            required
                                            className="w-full bg-secondary/10 hover:bg-secondary/20 focus:bg-transparent border border-transparent focus:border-primary/20 rounded-2xl pl-14 pr-4 py-4 text-sm outline-none transition-all placeholder:text-muted-foreground/40 font-medium text-foreground focus:shadow-[0_0_0_4px_rgba(59,130,246,0.05)]"
                                            placeholder="Product Name"
                                            value={formData.title}
                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        />
                                    </div>

                                    <div className="relative group">
                                        <div className="absolute left-3.5 top-3 w-8 h-8 rounded-lg bg-background flex items-center justify-center text-muted-foreground group-focus-within:text-primary shadow-sm ring-1 ring-black/5 transition-all">
                                            <Globe size={14} />
                                        </div>
                                        <input
                                            required
                                            type="url"
                                            className="w-full bg-secondary/10 hover:bg-secondary/20 focus:bg-transparent border border-transparent focus:border-primary/20 rounded-2xl pl-14 pr-4 py-4 text-sm outline-none transition-all placeholder:text-muted-foreground/40 font-medium text-foreground focus:shadow-[0_0_0_4px_rgba(59,130,246,0.05)]"
                                            placeholder="https://yourproduct.com"
                                            value={formData.target_url}
                                            onChange={e => setFormData({ ...formData, target_url: e.target.value })}
                                        />
                                    </div>

                                    <div className="relative group">
                                        <div className="absolute left-3.5 top-3 w-8 h-8 rounded-lg bg-background flex items-center justify-center text-muted-foreground group-focus-within:text-primary shadow-sm ring-1 ring-black/5 transition-all">
                                            <FileText size={14} />
                                        </div>
                                        <textarea
                                            required
                                            rows={2}
                                            className="w-full bg-secondary/10 hover:bg-secondary/20 focus:bg-transparent border border-transparent focus:border-primary/20 rounded-2xl pl-14 pr-4 py-4 text-sm outline-none transition-all placeholder:text-muted-foreground/40 font-medium text-foreground resize-none leading-relaxed focus:shadow-[0_0_0_4px_rgba(59,130,246,0.05)]"
                                            placeholder="Short description..."
                                            maxLength={80}
                                            value={formData.description}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        />
                                        <div className="absolute right-3 bottom-3 text-[9px] font-medium text-muted-foreground/60">{formData.description.length}/80</div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading || uploading || !formData.image_url || !formData.title || !formData.target_url || !formData.description}
                                    className="w-full py-4 bg-gradient-to-r from-foreground to-neutral-700 hover:to-neutral-800 text-background rounded-2xl font-bold text-base transition-all shadow-xl shadow-black/5 hover:shadow-2xl hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-2 group relative overflow-hidden disabled:opacity-70 disabled:grayscale disabled:cursor-not-allowed"
                                >
                                    {/* Shine Effect */}
                                    <div className="absolute inset-0 bg-white/20 translate-y-full rotate-45 group-hover:translate-y-[-200%] transition-transform duration-700 ease-in-out blur-md" />

                                    {loading ? <Loader2 size={18} className="animate-spin" /> : (
                                        <span className="flex items-center gap-2 z-10">
                                            Proceed to Pay $4
                                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    )}
                                </button>

                                <div className="flex justify-center">
                                    <div className="px-3 py-1 rounded-full bg-green-500/5 border border-green-500/10 flex items-center gap-1.5 text-[9px] text-green-600 font-bold uppercase tracking-wider">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                        Secure Payment via Dodo
                                    </div>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default SponsorModal;
