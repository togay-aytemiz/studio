import React, { useState, useEffect } from 'react';
import { Product } from './ProductCard';
import { Share2, Download, ThumbsUp, ThumbsDown, ShoppingBag, Play, ArrowLeft, Sparkles, Loader2, CheckCircle2, X, Shirt, Wand2, RefreshCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';

export interface TryOnResult {
    id: string;
    productId: string;
    productName: { tr: string; en: string };
    productImage: string;
    productPrice: number;
    productCategory: { tr: string; en: string };
    userImage: string;
    resultImages: string[];
    timestamp: number;
    isCustom?: boolean;
}

interface TryOnResultsProps {
    result: TryOnResult;
    recommendations: Product[];
    onBack: () => void;
    onTryAnother: () => void;
    onTryProduct: (product: Product) => void;
    isLoading?: boolean;
}

export const TryOnResults: React.FC<TryOnResultsProps> = ({ result, recommendations, onBack, onTryAnother, onTryProduct, isLoading = false }) => {
    const { i18n } = useTranslation();
    const lang = i18n.language === 'en' ? 'en' : 'tr';
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    const LOADING_MESSAGES = [
        { en: "Analyzing body pose...", tr: "Vücut duruşu analiz ediliyor..." },
        { en: "Checking garment fit...", tr: "Kıyafet uyumu kontrol ediliyor..." },
        { en: "Mapping fabric dynamics...", tr: "Kumaş dinamikleri haritalanıyor..." },
        { en: "Generating realistic folds...", tr: "Gerçekçi kıvrımlar oluşturuluyor..." },
        { en: "Adjusting lighting and shadows...", tr: "Işık ve gölgeler ayarlanıyor..." },
        { en: "Compositing final image...", tr: "Final görüntü birleştiriliyor..." },
        { en: "Rendering high-res details...", tr: "Yüksek çözünürlüklü detaylar işleniyor..." },
    ];

    const [displayedMessageIndex, setDisplayedMessageIndex] = useState(0); // What's actually shown
    const [displayedIconIndex, setDisplayedIconIndex] = useState(0); // What's actually shown

    // Icons to cycle through
    const LOADING_ICONS = [Shirt, Wand2, Sparkles, RefreshCcw];
    const CurrentIcon = LOADING_ICONS[displayedIconIndex];

    // We'll use a local state to handle the fade-out of the loader itself
    const [showLoader, setShowLoader] = useState(isLoading);
    const [isFadingOut, setIsFadingOut] = useState(false);

    useEffect(() => {
        if (isLoading) {
            setShowLoader(true);
            setIsFadingOut(false);
            // Reset all animations and indexes
            setDisplayedMessageIndex(0);
            setDisplayedIconIndex(0);
        } else {
            // Start fade out
            setIsFadingOut(true);
            const timer = setTimeout(() => {
                setShowLoader(false);
                setIsFadingOut(false);
            }, 500); // 500ms fade out duration
            return () => clearTimeout(timer);
        }
    }, [isLoading]);

    useEffect(() => {
        if (!showLoader) return;

        // Message and Icon rotation
        const messageInterval = setInterval(() => {
            setDisplayedMessageIndex(prev => (prev + 1) % LOADING_MESSAGES.length);
            setDisplayedIconIndex(prev => (prev + 1) % LOADING_ICONS.length);
        }, 2500); // Change every 2.5 seconds

        return () => {
            clearInterval(messageInterval);
        };
    }, [showLoader]);

    const formatPrice = (price: number): string => {
        if (lang === 'en') {
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(price);
        }
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 0 }).format(price);
    };

    return (
        <div className="fixed inset-0 z-50 bg-[#F9FAFB] overflow-y-auto animate-in slide-in-from-bottom-4 duration-500 scrollbar-none">

            {/* Loading Overlay */}
            {showLoader && (
                <div
                    className={`fixed inset-0 z-[60] bg-[#F9FAFB] flex flex-col items-center justify-center p-4 transition-opacity duration-500 ${isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                >
                    <div className="max-w-md w-full text-center space-y-8 md:space-y-12">
                        {/* Animated Icon Container */}
                        <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto flex items-center justify-center">
                            <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                            <div
                                className="absolute inset-0 border-4 border-emerald-500/30 rounded-full border-t-emerald-600 animate-spin"
                                style={{ animationDuration: '3s' }}
                            ></div>
                            <div className="absolute inset-0 bg-emerald-50 rounded-full animate-ping opacity-20" style={{ animationDuration: '2s' }}></div>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={displayedIconIndex}
                                    className="relative z-10"
                                    initial={{ opacity: 0, scale: 0.85 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.85 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <CurrentIcon className="text-emerald-600" size={40} md-size={48} strokeWidth={1.5} />
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Text Container */}
                        <div className="flex items-center justify-center min-h-[4.5rem] md:min-h-[5.5rem] px-2">
                            <AnimatePresence mode="wait">
                                <motion.h2
                                    key={displayedMessageIndex}
                                    className="text-xl md:text-2xl font-bold text-gray-900 leading-snug text-center max-w-[20rem] md:max-w-[26rem]"
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {LOADING_MESSAGES[displayedMessageIndex][lang]}
                                </motion.h2>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            )}

            {/* Navbar Breadcrumb */}
            <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="group flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        {lang === 'en' ? 'Back to Shop' : 'Mağazaya Dön'}
                        <span className="text-gray-300">/</span>
                        <span className="text-gray-900">{lang === 'en' ? 'Try-On Results' : 'Deneme Sonuçları'}</span>
                    </button>
                    {/* Mobile back button removed as requested */}
                </div>
            </div>

            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2 tracking-tight">
                            {lang === 'en' ? 'It fits perfectly!' : 'Mükemmel uydu!'}
                        </h1>
                        <p className="text-gray-500 text-lg">
                            {lang === 'en' ? 'Here is how the' : ''} <strong className="text-gray-900">{result.productName[lang]}</strong> {lang === 'en' ? 'looks on you.' : 'üzerinizde böyle duruyor.'}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm active:scale-95">
                            <Share2 size={18} />
                            {lang === 'en' ? 'Share' : 'Paylaş'}
                        </button>
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg shadow-gray-200 active:scale-95">
                            <Download size={18} />
                            {lang === 'en' ? 'Save' : 'Kaydet'}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                    {/* Left Column: Result Image (Span 8) */}
                    <div className="lg:col-span-8 flex flex-col gap-6">

                        {/* Single Main Image with Lightbox Trigger */}
                        <div
                            className="aspect-[3/4] rounded-3xl overflow-hidden bg-gray-100 shadow-sm relative group cursor-zoom-in"
                            onClick={() => result.resultImages?.[0] && setIsLightboxOpen(true)}
                        >
                            {result.resultImages?.[0] ? (
                                <img
                                    src={result.resultImages[0]}
                                    alt="Try-On Result"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400">
                                    <Sparkles size={48} className="animate-pulse opacity-20" />
                                </div>
                            )}

                            {/* Overlay Hint */}
                            {result.resultImages?.[0] && (
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 duration-300">
                                    <span className="bg-white/90 backdrop-blur text-gray-900 px-4 py-2 rounded-full font-bold text-sm shadow-lg pointer-events-none transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                        {lang === 'en' ? 'View Full Screen' : 'Tam Ekran Görüntüle'}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Feedback Row */}
                        <div className="bg-white rounded-2xl p-5 border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="flex -space-x-3">
                                    <img className="inline-block h-12 w-12 rounded-full ring-2 ring-white object-cover bg-gray-100" src={result.productImage} alt="Product" />
                                    <div className="h-12 w-12 rounded-full ring-2 ring-white bg-gray-100 flex items-center justify-center overflow-hidden">
                                        <img className="w-full h-full object-cover" src={result.userImage} alt="User" />
                                    </div>
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">{lang === 'en' ? 'Generated Composition' : 'Oluşturulan Kompozisyon'}</p>
                                    <p className="text-xs text-gray-500 font-medium">{lang === 'en' ? 'Based on your uploaded photos' : 'Yüklediğiniz fotoğraflara dayalı'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 sm:border-l border-gray-100 sm:pl-6">
                                <span className="text-sm font-medium text-gray-400">{lang === 'en' ? 'Rate result:' : 'Sonucu oyla:'}</span>
                                <div className="flex gap-2">
                                    <button className="p-2 rounded-full hover:bg-emerald-50 text-gray-400 hover:text-emerald-600 transition-colors">
                                        <ThumbsUp size={22} />
                                    </button>
                                    <button className="p-2 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                                        <ThumbsDown size={22} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sidebar (Span 4) */}
                    <div className="lg:col-span-4 flex flex-col gap-6">

                        {/* Product Card */}
                        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">{lang === 'en' ? 'Product Details' : 'Ürün Detayları'}</h3>
                            <div className="flex gap-5 mb-8">
                                <div className="w-24 h-32 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                                    <img src={result.productImage} alt={result.productName.en} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex flex-col justify-between py-1">
                                    <div>
                                        <h2 className="font-bold text-gray-900 text-lg leading-tight mb-1">{result.productName[lang]}</h2>
                                        <p className="text-sm text-gray-500">{result.productCategory[lang]}</p>
                                    </div>
                                    {result.isCustom ? (
                                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                            {lang === 'en' ? 'Custom Upload' : 'Özel Yükleme'}
                                        </p>
                                    ) : (
                                        <p className="text-2xl font-bold text-emerald-600">{formatPrice(result.productPrice)}</p>
                                    )}
                                </div>
                            </div>
                            {!result.isCustom && (
                                <div className="space-y-3">
                                    <button className="w-full py-4 bg-[#0F172A] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg shadow-gray-200 active:scale-95">
                                        <ShoppingBag size={18} />
                                        {lang === 'en' ? 'Add to Cart' : 'Sepete Ekle'}
                                    </button>
                                    <button className="w-full py-4 bg-white border border-gray-200 text-gray-900 rounded-xl font-bold hover:bg-gray-50 transition-colors active:scale-95">
                                        {lang === 'en' ? 'View Product Page' : 'Ürün Sayfası'}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Recommendations */}
                        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex-1">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-gray-900 text-lg">{lang === 'en' ? 'Try These Next' : 'Bunları da Dene'}</h3>
                                <button onClick={onTryAnother} className="text-emerald-600 text-sm font-bold hover:underline">{lang === 'en' ? 'View all' : 'Tümünü gör'}</button>
                            </div>

                            <div className="space-y-6">
                                {recommendations.slice(0, 5).map(item => (
                                    <div key={item.id} className="flex items-center justify-between group cursor-pointer" onClick={() => onTryProduct(item)}>
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden border border-gray-100">
                                                <img src={item.images[0]} alt={item.name.en} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 text-sm mb-0.5 group-hover:text-emerald-600 transition-colors">{item.name[lang]}</p>
                                                <p className="text-xs text-gray-500 font-medium">{formatPrice(item.price)}</p>
                                            </div>
                                        </div>
                                        <button className="w-10 h-10 rounded-full border border-gray-100 bg-white flex items-center justify-center text-emerald-600 group-hover:bg-emerald-50 group-hover:border-emerald-100 transition-all">
                                            <Play size={14} className="fill-current ml-0.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>



            </div>

            {/* Lightbox Modal */}
            {isLightboxOpen && (
                <div
                    className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300"
                    onClick={() => setIsLightboxOpen(false)}
                >
                    <button
                        className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-50"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsLightboxOpen(false);
                        }}
                    >
                        <X size={24} />
                    </button>
                    <div
                        className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={result.resultImages[0]}
                            alt="Full Screen Result"
                            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
