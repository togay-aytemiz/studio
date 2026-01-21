import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, RefreshCcw, UploadCloud } from 'lucide-react';
import { Hero } from '../../components/tryon/Hero';
import Footer from '../../components/Footer';
import DemoHeader from '../../components/DemoHeader';
import { ProductCard, Product } from '../../components/tryon/ProductCard';
import { ProductQuickView } from '../../components/tryon/ProductQuickView';
import { TryOnModal } from '../../components/tryon/TryOnModal';
import { TryOnResults, TryOnResult } from '../../components/tryon/TryOnResults';
import { resizeImage } from '../../src/utils/imageUtils';

// Sample products
const sampleProducts: Product[] = [
    {
        id: '1',
        name: { tr: 'İpek Askılı Bluz Takımı', en: 'Silk Cami Set' },
        category: { tr: 'Takımlar', en: 'Sets' },
        price: 4500,
        images: [
            '/tryon/products/1a.webp',
            '/tryon/products/1b.webp',
            '/tryon/products/1c.webp',
        ],
        tags: [],
    },
    {
        id: '2',
        name: { tr: 'Saten Bluz', en: 'Satin Blouse' },
        category: { tr: 'Bluzlar', en: 'Blouses' },
        price: 1800,
        images: [
            '/tryon/products/2a.webp',
            '/tryon/products/2b.webp',
            '/tryon/products/2c.webp',
        ],
        tags: [],
    },
    {
        id: '3',
        name: { tr: 'Oversize Sweatshirt', en: 'Oversized Sweatshirt' },
        category: { tr: 'Sweatshirtler', en: 'Sweatshirts' },
        price: 2200,
        images: [
            '/tryon/products/3a.webp',
            '/tryon/products/3b.webp',
            '/tryon/products/3c.webp',
        ],
        tags: [],
    },
    {
        id: '4',
        name: { tr: 'Slim Fit Blazer Ceket', en: 'Slim Fit Blazer' },
        category: { tr: 'Ceketler', en: 'Jackets' },
        price: 3900,
        images: [
            '/tryon/products/4a.webp',
            '/tryon/products/4b.webp',
            '/tryon/products/4c.webp',
        ],
        tags: [],
    },
    {
        id: '5',
        name: { tr: 'Saten Maxi Elbise', en: 'Satin Maxi Dress' },
        category: { tr: 'Elbiseler', en: 'Dresses' },
        price: 4200,
        images: [
            '/tryon/products/5a.webp',
            '/tryon/products/5b.webp',
            '/tryon/products/5c.webp',
        ],
        tags: ['Sale'],
    },
    {
        id: '6',
        name: { tr: 'Spor Crop Top Takım', en: 'Athletic Crop Set' },
        category: { tr: 'Spor Giyim', en: 'Activewear' },
        price: 1600,
        images: [
            '/tryon/products/6a.webp',
            '/tryon/products/6b.webp',
            '/tryon/products/6c.webp',
        ],
        tags: [],
    },
    {
        id: '7',
        name: { tr: 'Deri Biker Ceket', en: 'Leather Biker Jacket' },
        category: { tr: 'Ceketler', en: 'Jackets' },
        price: 5900,
        images: [
            '/tryon/products/7a.webp',
            '/tryon/products/7b.webp',
            '/tryon/products/7c.webp',
        ],
        tags: [],
    },
];

const TryOnDemo: React.FC = () => {
    const { i18n } = useTranslation();
    const location = useLocation();
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [tryOnProduct, setTryOnProduct] = useState<Product | null>(null);
    const [tryOnResult, setTryOnResult] = useState<TryOnResult | null>(null);
    const [showResults, setShowResults] = useState(false);
    const [isResultLoading, setIsResultLoading] = useState(false);

    const [userPhotos, setUserPhotos] = useState<{
        faceFile: File | null;
        facePreview: string | null;
        bodyFile: File | null;
        bodyPreview: string | null;
    } | undefined>(undefined);
    const [customGarmentFile, setCustomGarmentFile] = useState<File | null>(null);
    const [customGarmentPreview, setCustomGarmentPreview] = useState<string | null>(null);
    const [isCustomDragActive, setIsCustomDragActive] = useState(false);
    const customGarmentInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Simple language detection based on path
        const isEn = location.pathname.startsWith('/en');
        if (isEn && i18n.language !== 'en') {
            i18n.changeLanguage('en');
        } else if (!isEn && i18n.language !== 'tr') {
            i18n.changeLanguage('tr');
        }
    }, [location.pathname, i18n]);

    useEffect(() => {
        return () => {
            if (customGarmentPreview) {
                URL.revokeObjectURL(customGarmentPreview);
            }
        };
    }, [customGarmentPreview]);

    const handleTryOn = (product: Product) => {
        setSelectedProduct(null); // Close quick view if open
        setTryOnProduct(product);
    };

    const handleCloseTryOn = () => {
        setTryOnProduct(null);
    };

    const setCustomGarmentFromFile = (file: File) => {
        if (customGarmentPreview) {
            URL.revokeObjectURL(customGarmentPreview);
        }

        const previewUrl = URL.createObjectURL(file);
        setCustomGarmentFile(file);
        setCustomGarmentPreview(previewUrl);
    };

    const handleCustomGarmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        setCustomGarmentFromFile(file);
        event.target.value = '';
    };

    const handleCustomGarmentUpload = () => {
        customGarmentInputRef.current?.click();
    };

    const resetCustomGarment = () => {
        if (customGarmentPreview) {
            URL.revokeObjectURL(customGarmentPreview);
        }
        setCustomGarmentFile(null);
        setCustomGarmentPreview(null);
        setIsCustomDragActive(false);
    };

    const handleCustomGarmentDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        if (event.dataTransfer?.types && !Array.from(event.dataTransfer.types).includes('Files')) {
            return;
        }
        setIsCustomDragActive(true);
    };

    const handleCustomGarmentDragLeave = () => {
        setIsCustomDragActive(false);
    };

    const handleCustomGarmentDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsCustomDragActive(false);
        const file = event.dataTransfer.files?.[0];
        if (file) {
            setCustomGarmentFromFile(file);
        }
    };

    const handleCustomTryOn = () => {
        if (!customGarmentPreview || !customGarmentFile) {
            return;
        }

        const customProduct: Product = {
            id: 'custom-upload',
            name: {
                en: 'Your Upload',
                tr: 'Kendi Yüklemen',
            },
            category: {
                en: 'Custom',
                tr: 'Özel',
            },
            price: 0,
            images: [customGarmentPreview, customGarmentPreview, customGarmentPreview],
            tags: [],
            isCustom: true,
            customImageFile: customGarmentFile,
        };

        setSelectedProduct(null);
        setTryOnProduct(customProduct);
    };

    const handleStartGeneration = async (data: any) => {
        // 1. Save User Photos for persistence
        if (data.rawFiles) {
            setUserPhotos(data.rawFiles);
        }

        // 1. Save User Photos for persistence
        if (data.rawFiles) {
            setUserPhotos(data.rawFiles);
        }

        // 2. Start Process (Loader is handled in TryOnModal)
        setIsResultLoading(true);
        setShowResults(true);

        // Create a temporary result to show immediate feedback (using user preview)
        const tempResult: TryOnResult = {
            id: 'temp-' + Date.now(),
            productId: data.product.id,
            productName: data.product.name,
            productImage: data.product.images[0],
            productPrice: data.product.price,
            productCategory: data.product.category,
            userImage: data.userImagePreview,
            resultImages: [], // Wait for actual result
            timestamp: Date.now(),
            isCustom: data.product.isCustom,
        };
        setTryOnResult(tempResult);
        setTryOnProduct(null); // Close modal

        try {
            // Optimizing images
            let optimizedGarment = data.garmentFile;
            let optimizedBody = data.bodyFile;
            let optimizedFace = data.faceFile;

            try {
                if (optimizedGarment) optimizedGarment = await resizeImage(optimizedGarment);
                if (optimizedBody) optimizedBody = await resizeImage(optimizedBody);
                if (optimizedFace) optimizedFace = await resizeImage(optimizedFace);
            } catch (optimizeError) {
                console.warn("Image optimization failed, falling back to original:", optimizeError);
            }

            const formData = new FormData();
            if (optimizedGarment) {
                formData.append('garment', optimizedGarment);
            } else if (data.garmentUrl) {
                formData.append('garment_url', data.garmentUrl);
            }
            if (optimizedBody) {
                formData.append('body', optimizedBody);
            }
            if (optimizedFace) {
                formData.append('face', optimizedFace);
            }

            const startResponse = await fetch('/.netlify/functions/tryon-start', {
                method: 'POST',
                body: formData,
            });

            const startText = await startResponse.text();
            let startData: any;
            try {
                startData = JSON.parse(startText);
            } catch (e) {
                // Not JSON
            }

            if (!startResponse.ok) {
                const errorMessage = startData?.message || startData?.error || `Server Error: ${startText.substring(0, 50)}`;
                throw new Error(errorMessage);
            }

            if (!startData?.jobId) {
                throw new Error('No job id returned from server');
            }

            const pollIntervalMs = 3500;
            const maxWaitMs = 2 * 60 * 1000;
            const pollStart = Date.now();

            const pollForResult = async () => {
                while (Date.now() - pollStart < maxWaitMs) {
                    const statusResponse = await fetch(`/.netlify/functions/tryon-status?jobId=${encodeURIComponent(startData.jobId)}`);
                    const statusText = await statusResponse.text();
                    let statusData: any;

                    try {
                        statusData = JSON.parse(statusText);
                    } catch (e) {
                        // Not JSON
                    }

                    if (!statusResponse.ok) {
                        const errorMessage = statusData?.message || statusData?.error || `Server Error: ${statusText.substring(0, 50)}`;
                        throw new Error(errorMessage);
                    }

                    if (statusData?.status === 'completed' && statusData?.result?.resultUrl) {
                        return statusData.result.resultUrl;
                    }

                    if (statusData?.status === 'done' && statusData.image) {
                        return statusData.image;
                    }

                    if (statusData?.status === 'failed' || statusData?.status === 'error') {
                        throw new Error(statusData.error || 'Generation failed.');
                    }

                    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
                }

                throw new Error('Generation timed out (server limit). Please try again.');
            };

            const image = await pollForResult();

            const finalResult: TryOnResult = {
                id: startData.jobId,
                productId: data.product.id,
                productName: data.product.name,
                productImage: data.product.images[0],
                productPrice: data.product.price,
                productCategory: data.product.category,
                userImage: data.userImagePreview,
                resultImages: [image],
                timestamp: Date.now(),
                isCustom: data.product.isCustom,
            };

            // Preload the image to ensure no "gray screen"
            try {
                await new Promise((resolve) => {
                    const img = new Image();
                    img.src = image;
                    img.onload = resolve;
                    img.onerror = resolve; // Proceed even if error, component will handle
                    // Force proceed after 5s max
                    setTimeout(resolve, 5000);
                });
            } catch (e) {
                // Ignore preload errors
            }

            setTryOnResult(finalResult);
            // Add requested delay for smoothness
            setTimeout(() => {
                setIsResultLoading(false);
            }, 2000);

            return;

        } catch (error: any) {
            console.error("Generation Error:", error);
            const defaultMessage = i18n.language === 'en'
                ? 'Generation failed. Please try again.'
                : 'Oluşturma başarısız oldu. Lütfen tekrar deneyin.';
            const rawMessage = typeof error?.message === 'string' && error.message.trim().length > 0
                ? error.message.trim()
                : defaultMessage;
            const isContentBlocked = /content blocked/i.test(rawMessage);
            const userMessage = isContentBlocked
                ? (i18n.language === 'en'
                    ? 'The image could not be processed due to safety guidelines. Please upload a different photo.'
                    : 'Görüntü güvenlik kuralları nedeniyle işlenemedi. Lütfen farklı bir fotoğraf yükleyin.')
                : rawMessage;
            alert(i18n.language === 'en' ? `Error: ${userMessage}` : `Hata: ${userMessage}`);
            setIsResultLoading(false); // Make sure to turn off loading on error
            // Optionally keep results open if it was a partial success or allow retry
            // setShowResults(false); 
        } finally {
            // setIsResultLoading(false); // MOVED: Handled explicitly in success/error blocks to allow for image preloading
        }
    };


    const handleBackFromResults = () => {
        setShowResults(false);
        setTryOnResult(null);
        resetCustomGarment();
    };

    const handleTryAnother = () => {
        setShowResults(false);
        setTryOnProduct(null);
        resetCustomGarment();
        // User goes back to catalog, inputs are preserved in state if needed, but for now we reset result
    };

    const handleTryProductFromResults = (product: Product) => {
        // setShowResults(false);
        setTryOnProduct(product);
        // implicit: TryOnModal will pick up 'userPhotos' and start at step 2
    };

    const handleQuickView = (product: Product) => {
        setSelectedProduct(product);
    };

    const handleCloseQuickView = () => {
        setSelectedProduct(null);
    };

    // Randomize recommendations
    const getRecommendations = (currentProductId: string) => {
        return sampleProducts
            .filter(p => p.id !== currentProductId)
            .sort(() => 0.5 - Math.random()) // Simple shuffle
            .slice(0, 5);
    };

    const customCardCopy = {
        title: { en: 'Upload Your Own', tr: 'Kendi Ürününü Yükle' },
        description: {
            en: ['Got a specific item?', 'Upload it to try on virtually.'],
            tr: ['Özel bir parçan mı var?', 'Yükleyip sanal olarak dene.'],
        },
        upload: { en: 'Upload Garment', tr: 'Kıyafet Yükle' },
        reupload: { en: 'Re-upload', tr: 'Yeniden Yükle' },
        continue: { en: 'Continue', tr: 'Devam Et' },
    };
    const customPlaceholderImage = '/tryon/products/garment.webp';

    return (
        <div className="min-h-screen bg-white text-slate-900">
            <DemoHeader title="Virtual Try-On" />

            <main>
                <Hero />

                {/* Collection / Products Grid */}
                <section id="products-grid" className="py-20 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto">
                    <div className="text-center pb-12">
                        <h2 className="text-3xl font-bold text-slate-900">
                            {i18n.language === 'en' ? 'Our Collection' : 'Koleksiyonumuz'}
                        </h2>
                        <p className="mt-4 text-slate-600">
                            {i18n.language === 'en' ? 'Try on any outfit instantly' : 'Herhangi bir kıyafeti anında deneyin'}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <article
                            className={`group relative flex flex-col bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full ${isCustomDragActive ? 'border-emerald-400 ring-2 ring-emerald-200' : 'border-emerald-200/70'}`}
                            onDragOver={handleCustomGarmentDragOver}
                            onDragLeave={handleCustomGarmentDragLeave}
                            onDrop={handleCustomGarmentDrop}
                        >
                            <div
                                className={`relative w-full aspect-[4/5] bg-white overflow-hidden cursor-pointer ${isCustomDragActive ? 'ring-2 ring-inset ring-emerald-300' : ''}`}
                                onClick={handleCustomGarmentUpload}
                            >
                                <img
                                    src={customGarmentPreview || customPlaceholderImage}
                                    alt={customCardCopy.title[i18n.language === 'en' ? 'en' : 'tr']}
                                    className={`block w-full h-full object-cover transition-transform duration-500 transform-gpu ${customGarmentPreview ? 'group-hover:scale-105' : 'opacity-70'}`}
                                />
                                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-white via-white/70 to-transparent" />

                                {customGarmentPreview && (
                                    <span className="absolute top-3 left-3 z-10 bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-sm">
                                        {i18n.language === 'en' ? 'Custom' : 'Özel'}
                                    </span>
                                )}
                            </div>

                            <div className="relative p-4 flex flex-col gap-4 flex-1">
                                <div className="pointer-events-none absolute -top-6 left-0 right-0 h-6 bg-gradient-to-b from-white/0 to-white" />
                                <div className="flex flex-col items-center text-center gap-2">
                                    <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                                        <UploadCloud size={22} className="text-emerald-600" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">
                                        {customCardCopy.title[i18n.language === 'en' ? 'en' : 'tr']}
                                    </h3>
                                    <p className="text-sm text-gray-500 max-w-[18rem]">
                                        <span className="block">
                                            {customCardCopy.description[i18n.language === 'en' ? 'en' : 'tr'][0]}
                                        </span>
                                        <span className="block">
                                            {customCardCopy.description[i18n.language === 'en' ? 'en' : 'tr'][1]}
                                        </span>
                                    </p>
                                </div>

                                <div className="mt-auto flex flex-col gap-2">
                                    {!customGarmentPreview ? (
                                        <button
                                            onClick={handleCustomGarmentUpload}
                                            className="w-full flex items-center justify-center gap-2 h-10 bg-emerald-600 text-white font-bold text-sm rounded-lg transition-all hover:bg-emerald-700 active:scale-95"
                                        >
                                            <UploadCloud size={16} />
                                            {customCardCopy.upload[i18n.language === 'en' ? 'en' : 'tr']}
                                        </button>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                onClick={handleCustomGarmentUpload}
                                                className="w-full flex items-center justify-center gap-2 h-10 bg-white border border-gray-200 text-gray-700 font-bold text-sm rounded-lg transition-all hover:bg-gray-50 active:scale-95"
                                            >
                                                <RefreshCcw size={16} />
                                                {customCardCopy.reupload[i18n.language === 'en' ? 'en' : 'tr']}
                                            </button>
                                            <button
                                                onClick={handleCustomTryOn}
                                                className="w-full flex items-center justify-center gap-2 h-10 bg-gray-900 text-white font-bold text-sm rounded-lg transition-all hover:bg-black active:scale-95"
                                            >
                                                {customCardCopy.continue[i18n.language === 'en' ? 'en' : 'tr']}
                                                <ArrowRight size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <input
                                ref={customGarmentInputRef}
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                className="hidden"
                                onChange={handleCustomGarmentChange}
                            />
                        </article>
                        {sampleProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onTryOn={handleTryOn}
                                onQuickView={handleQuickView}
                            />
                        ))}
                    </div>
                </section>
            </main>

            {/* Custom CTA Section - Dark Green Theme */}
            {/* Custom CTA Section - Dark Green Theme */}
            <section className="pb-12 border-t border-transparent">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 shadow-2xl">
                        {/* Decorative Elements */}
                        <div className="absolute inset-0 opacity-30 pointer-events-none">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-400 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                        </div>

                        <div className="relative px-6 py-10 md:px-12 md:py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                            <div className="md:max-w-2xl">
                                <p className="font-['Sora'] text-xs md:text-sm font-bold uppercase tracking-[0.3em] text-emerald-200 mb-2 leading-[0.4]">
                                    AGENS
                                </p>
                                <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-2 md:whitespace-nowrap">
                                    {i18n.language === 'en'
                                        ? 'We can build this for your brand too'
                                        : 'Markanız için de bunun gibi bir şey yapabiliriz'}
                                </h2>
                                <p className="text-emerald-100/80 text-sm md:text-base">
                                    {i18n.language === 'en'
                                        ? 'Custom product-focused software development for your brand.'
                                        : 'Markanıza özel, ürün odaklı yazılım hizmeti için bize ulaşın.'}
                                </p>
                            </div>
                            <a
                                href="/#contact"
                                className="inline-flex items-center justify-center shrink-0 bg-white text-emerald-900 px-6 py-3 rounded-full font-bold text-sm md:text-base hover:bg-emerald-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                            >
                                {i18n.language === 'en' ? 'Schedule a Call' : 'Görüşme Planla'}
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />

            {/* Quick View Modal */}
            {selectedProduct && (
                <ProductQuickView
                    product={selectedProduct}
                    onClose={handleCloseQuickView}
                    onTryOn={handleTryOn}
                />
            )}

            {/* Try On Results */}
            {showResults && tryOnResult && (
                <TryOnResults
                    result={tryOnResult}
                    recommendations={getRecommendations(tryOnResult.productId)}
                    onBack={handleBackFromResults}
                    onTryAnother={handleTryAnother}
                    onTryProduct={handleTryProductFromResults}
                    isLoading={isResultLoading}
                />
            )}

            {/* Try On Modal */}
            {tryOnProduct && (
                <TryOnModal
                    product={tryOnProduct}
                    onClose={handleCloseTryOn}
                    onStartGeneration={handleStartGeneration}
                    initialPhotos={userPhotos}
                />
            )}
        </div>
    );
};

export default TryOnDemo;
