"use client";

import React, { useState } from 'react';
import { Box, Image as ImageIcon, Package } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import clsx from 'clsx';

export const InsumoImage = ({ src }) => {
    const [err, setErr] = useState(false);
    if(!src || err) return <Box className="w-5 h-5 text-muted-foreground/40"/>;
    return <img src={src} className="w-full h-full object-cover transition-transform hover:scale-110" onError={()=>setErr(true)} alt="Thumb" />;
};

export const InsumoImageDetail = ({ src, alt }) => {
    const [err, setErr] = useState(false);
    if(!src || err) return <ImageIcon className="w-16 h-16 text-muted-foreground/20"/>;
    return <img src={src} alt={alt} className="w-full h-full object-contain p-2 mix-blend-multiply" onError={()=>setErr(true)}/>;
};

export const StatusBadge = ({ status }) => {
    const s = String(status||'inativo').toLowerCase();
    const style = s==='ativo'?"bg-green-500/10 text-green-700 border-green-500/20":"bg-red-500/10 text-red-700 border-red-500/20";
    return <Badge variant="outline" className={clsx("capitalize shadow-none border font-medium px-2", style)}>{s}</Badge>;
};