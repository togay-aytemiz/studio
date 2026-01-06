import React, { useEffect, useRef, useState } from 'react';
import { Product } from './ProductCard';
import { X, Sparkles, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ProductQuickViewProps {
    product: Product;
    onClose: () => void;
    onTryOn: (product: Product) => void;
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];
const COLORS = [
    { name: { tr: 'Siyah', en: 'Black' }, value: '#1a1a1a' },
    { name: { tr: 'Bej', en: 'Beige' }, value: '#d4b896' },
    { name: { tr: 'Bordo', en: 'Burgundy' }, value: '#722f37' },
];

export const ProductQuickView: React.FC<ProductQuickViewProps> = ({ product, onClose, onTryOn }) => {
    const { i18n } = useTranslation();
    const lang = i18n.language === 'en' ? 'en' : 'tr';
    const modalRef = useRef<HTMLDivElement>(null);
    const [activeImage, setActiveImage] = useState(product.images[0]);
    const [selectedSize, setSelectedSize] = useState('M');
    const [selectedColor, setSelectedColor] = useState(COLORS[0]);
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
        }, 250);
    };

    const productName = product.name[lang];
    const productCategory = product.category[lang];

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

    // Generic descriptions based on language
    const genericDescription = lang === 'en'
        ? 'Premium quality fabric with elegant design. Perfect for any occasion with comfortable fit and timeless style.'
        : 'Zarif tasarımlı premium kalite kumaş. Rahat kesim ve zamansız tarzıyla her ortama uygun.';

    const freeShippingText = lang === 'en' ? 'Free shipping & returns' : 'Ücretsiz kargo ve iade';
    const tryOnText = lang === 'en' ? 'Try On Virtual Mirror' : 'Sanal Aynada Dene';
    const addToCartText = lang === 'en' ? 'Add to Cart' : 'Sepete Ekle';
    const colorLabel = lang === 'en' ? 'Color' : 'Renk';
    const sizeLabel = lang === 'en' ? 'Size' : 'Beden';

    // Reset active image when product changes
    useEffect(() => {
        setActiveImage(product.images[0]);
    }, [product]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className={`fixed inset-0 z-50 md:flex md:items-center md:justify-center md:p-4 md:bg-black/60 md:backdrop-blur-sm transition-opacity ${isClosing ? 'opacity-0' : 'opacity-100'}`} onClick={handleClose}>
            <div
                ref={modalRef}
                className={`bg-white h-full w-full md:rounded-3xl md:w-full md:max-w-5xl md:overflow-hidden md:shadow-2xl md:grid md:grid-cols-2 md:max-h-[90vh] md:h-auto overflow-y-auto scrollbar-none md:animate-none ${isClosing ? 'animate-[slideDown_0.25s_ease-in_forwards]' : 'animate-[slideUp_0.3s_ease-out]'}`}
                onClick={e => e.stopPropagation()}
            >
                {/* Mobile Header - Only on mobile */}
                <div className="md:hidden sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
                    <button onClick={handleClose} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
                        <X size={24} className="text-gray-600" />
                    </button>
                    <div className="text-center flex-1">
                        <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider">{productCategory}</p>
                        <h2 className="text-sm font-bold text-gray-900 truncate">{productName}</h2>
                    </div>
                    <div className="w-10" /> {/* Spacer for centering */}
                </div>

                {/* Left: Image Gallery */}
                <div className="bg-gray-50 p-4 md:p-6 flex flex-col gap-3 md:gap-4">
                    {/* Main Large Image */}
                    <div className="aspect-square md:aspect-[4/5] w-full rounded-xl md:rounded-2xl overflow-hidden shadow-sm relative group">
                        <img
                            src={activeImage}
                            alt={productName}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>

                    {/* Thumbnails */}
                    <div className="grid grid-cols-3 gap-2 md:gap-3">
                        {product.images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveImage(img)}
                                className={`aspect-square rounded-lg md:rounded-xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-emerald-600 ring-2 ring-emerald-100' : 'border-transparent opacity-70 hover:opacity-100'
                                    }`}
                            >
                                <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right: Info */}
                <div className="p-4 md:p-10 flex flex-col pb-28 md:pb-10">
                    {/* Desktop Header - Hidden on mobile */}
                    <div className="hidden md:flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm text-emerald-600 font-bold uppercase tracking-wider mb-2">{productCategory}</p>
                            <h2 className="text-3xl font-black text-gray-900 leading-tight">{productName}</h2>
                        </div>
                        <button onClick={handleClose} className="p-2 -mr-2 -mt-2 rounded-full hover:bg-gray-100 transition-colors">
                            <X size={24} className="text-gray-400 hover:text-black" />
                        </button>
                    </div>

                    {/* Price */}
                    <div className="mb-4 md:mb-6 flex items-baseline gap-3">
                        <span className="text-2xl md:text-3xl font-medium text-gray-900">{formatPrice(product.price)}</span>
                        {product.tags?.includes('Sale') && (
                            <span className="text-base md:text-lg text-gray-400 line-through">{formatPrice(product.price * 1.2)}</span>
                        )}
                    </div>

                    {/* Short Description - Hidden on mobile */}
                    <p className="hidden md:block text-gray-600 leading-relaxed mb-8 text-lg font-light">
                        {genericDescription}
                    </p>

                    <hr className="hidden md:block border-gray-100 mb-8" />

                    {/* Selectors - Compact on mobile */}
                    <div className="space-y-4 md:space-y-6 mb-4 md:mb-8">
                        {/* Color */}
                        <div className="flex items-center gap-3 md:block">
                            <span className="text-sm font-bold text-gray-900 md:block md:mb-3 whitespace-nowrap">
                                {colorLabel}: <span className="text-gray-500 font-normal">{selectedColor.name[lang]}</span>
                            </span>
                            <div className="flex gap-2 md:gap-3">
                                {COLORS.map((color) => (
                                    <button
                                        key={color.value}
                                        onClick={() => setSelectedColor(color)}
                                        className={`w-8 h-8 md:w-10 md:h-10 rounded-full shadow-sm transition-all ${selectedColor.value === color.value
                                            ? 'ring-2 ring-offset-2 ring-gray-400'
                                            : 'hover:scale-110'
                                            }`}
                                        style={{ backgroundColor: color.value }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Size */}
                        <div>
                            <span className="text-sm font-bold text-gray-900 block mb-2 md:mb-3">
                                {sizeLabel}: <span className="text-gray-500 font-normal">{selectedSize}</span>
                            </span>
                            <div className="flex flex-wrap gap-2 md:gap-3">
                                {SIZES.map(size => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl border flex items-center justify-center text-sm md:text-base font-medium transition-all ${selectedSize === size
                                            ? 'bg-black text-white border-black shadow-md'
                                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:block mt-auto pt-6">
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => onTryOn(product)}
                                className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 hover:-translate-y-0.5 active:translate-y-0"
                            >
                                <Sparkles size={20} />
                                {tryOnText}
                            </button>

                            <button className="w-full px-6 py-4 rounded-xl border border-gray-200 font-bold text-gray-900 hover:bg-gray-50 transition-colors cursor-not-allowed opacity-60">
                                {addToCartText} - {formatPrice(product.price)}
                            </button>
                        </div>

                        <div className="mt-6 flex items-center justify-center gap-2 text-gray-400 text-sm">
                            <CheckCircle2 size={14} className="text-emerald-500" />
                            <span>{freeShippingText}</span>
                        </div>
                    </div>
                </div>

                {/* Mobile Sticky Footer */}
                <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-lg z-30">
                    <button
                        onClick={() => onTryOn(product)}
                        className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-3.5 rounded-xl font-bold text-base hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 active:scale-[0.98]"
                    >
                        <Sparkles size={18} />
                        {tryOnText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductQuickView;
