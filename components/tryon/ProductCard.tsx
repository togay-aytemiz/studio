import React from 'react';
import { ScanFace, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface Product {
    id: string;
    name: { tr: string; en: string };
    category: { tr: string; en: string };
    price: number;
    images: [string, string, string]; // Exactly 3 images
    tags?: string[];
}

interface ProductCardProps {
    product: Product;
    onTryOn?: (product: Product) => void;
    onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onTryOn, onQuickView }) => {
    const { i18n, t } = useTranslation();
    const lang = i18n.language === 'en' ? 'en' : 'tr';

    const formatPrice = (price: number): string => {
        if (lang === 'en') {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
            }).format(price);
        }
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const productName = product.name[lang];
    const productCategory = product.category[lang];

    return (
        <article className="group relative flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full">

            {/* Image Grid Container */}
            <div
                className="w-full grid grid-cols-2 gap-px bg-gray-100 relative cursor-pointer"
                onClick={() => onQuickView?.(product)}
            >
                {/* Favorite Button (Absolute over the grid) */}
                <div className="absolute top-3 right-3 z-20">
                    <button
                        className="w-8 h-8 rounded-full bg-white/80 backdrop-blur flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors shadow-sm"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Heart size={18} />
                    </button>
                </div>

                {/* Sale Tag */}
                {product.tags?.includes('Sale') && (
                    <span className="absolute top-3 left-3 z-20 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-sm">
                        {lang === 'en' ? 'Sale' : 'İndirim'}
                    </span>
                )}

                {/* 1. Main Image (Top, Full Width, Square) */}
                <div className="col-span-2 aspect-square overflow-hidden relative">
                    <img
                        src={product.images[0]}
                        alt={`${productName} 1`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </div>

                {/* 2. Second Image (Bottom Left, Square) */}
                <div className="aspect-square overflow-hidden relative">
                    <img
                        src={product.images[1]}
                        alt={`${productName} 2`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 delay-75"
                    />
                </div>

                {/* 3. Third Image (Bottom Right, Square) */}
                <div className="aspect-square overflow-hidden relative">
                    <img
                        src={product.images[2]}
                        alt={`${productName} 3`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 delay-100"
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors z-10" />
                </div>

                {/* Quick Preview Badge Centered on the Grid on Hover */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <span className="bg-white/90 backdrop-blur text-gray-900 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform">
                        {lang === 'en' ? 'Quick Preview' : 'Hızlı Önizleme'}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col gap-3 flex-1 border-t border-gray-100">

                {/* Header Info */}
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">{productCategory}</p>
                        <h3
                            className="font-bold text-gray-900 leading-tight cursor-pointer hover:text-emerald-600 transition-colors"
                            onClick={() => onQuickView?.(product)}
                        >
                            {productName}
                        </h3>
                    </div>
                    <span className="font-bold text-gray-900">{formatPrice(product.price)}</span>
                </div>

                {/* Bottom Action Area */}
                <div className="mt-auto pt-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onTryOn?.(product);
                        }}
                        className="w-full flex items-center justify-center gap-2 h-10 bg-gray-100 hover:bg-emerald-600 hover:text-white text-gray-900 font-bold text-sm rounded-lg transition-all active:scale-95 group/btn"
                    >
                        <ScanFace size={18} />
                        {lang === 'en' ? 'Try On' : 'Dene'}
                    </button>
                </div>
            </div>
        </article>
    );
};

export default ProductCard;
