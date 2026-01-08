import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Hero } from '../../components/tryon/Hero';
import Footer from '../../components/Footer';
import DemoHeader from '../../components/DemoHeader';
import { ProductCard, Product } from '../../components/tryon/ProductCard';
import { ProductQuickView } from '../../components/tryon/ProductQuickView';
import { TryOnModal } from '../../components/tryon/TryOnModal';
import { TryOnResults, TryOnResult } from '../../components/tryon/TryOnResults';

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
    {
        id: '8',
        name: { tr: 'Bol Paça Kumaş Pantolon', en: 'Wide Leg Tailored Trousers' },
        category: { tr: 'Pantolonlar', en: 'Trousers' },
        price: 2400,
        images: [
            '/tryon/products/8a.webp',
            '/tryon/products/8b.webp',
            '/tryon/products/8c.webp',
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

    useEffect(() => {
        // Simple language detection based on path
        const isEn = location.pathname.startsWith('/en');
        if (isEn && i18n.language !== 'en') {
            i18n.changeLanguage('en');
        } else if (!isEn && i18n.language !== 'tr') {
            i18n.changeLanguage('tr');
        }
    }, [location.pathname, i18n]);

    const handleTryOn = (product: Product) => {
        setSelectedProduct(null); // Close quick view if open
        setTryOnProduct(product);
    };

    const handleCloseTryOn = () => {
        setTryOnProduct(null);
    };

    const handleStartGeneration = async (data: any) => {
        // 1. Set Loading State & Show Results immediately
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
            resultImages: [data.userImagePreview], // usage as placeholder
            timestamp: Date.now(),
        };
        setTryOnResult(tempResult);
        setTryOnProduct(null); // Close modal

        try {
            // 2. Perform API Call
            const response = await fetch('/.netlify/functions/generate-tryon', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    garmentImages: data.garmentImages,
                    bodyImage: data.bodyImage,
                    faceImage: data.faceImage,
                    description: data.description,
                }),
            });

            // Handle non-JSON responses (like Timeout or 502 Bad Gateway)
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                const text = await response.text();
                // Check for common timeout keywords or just return the text
                const errorMessage = text.includes("Task timed out")
                    ? "Generation timed out (server limit). Please try again."
                    : `Server Error: ${text.substring(0, 50)}`;
                throw new Error(errorMessage);
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate image');
            }

            const responseData = await response.json();
            const generatedImage = responseData.image;

            if (!generatedImage) {
                throw new Error('No image returned from server');
            }

            // 3. Update Result with Real Image
            setTryOnResult(prev => prev ? {
                ...prev,
                resultImages: [generatedImage],
                timestamp: Date.now()
            } : null);

        } catch (error: any) {
            console.error("Generation Error:", error);
            alert(`Error: ${error.message}`);
            // Optionally close results on critical error or let user retry
            setShowResults(false);
        } finally {
            setIsResultLoading(false);
        }
    };

    const handleBackFromResults = () => {
        setShowResults(false);
        setTryOnResult(null);
    };

    const handleTryAnother = () => {
        setShowResults(false);
        setTryOnProduct(null);
        // User goes back to catalog, inputs are preserved in state if needed, but for now we reset result
    };

    const handleQuickView = (product: Product) => {
        setSelectedProduct(product);
    };

    const handleCloseQuickView = () => {
        setSelectedProduct(null);
    };

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

            {/* Try On Modal */}
            {tryOnProduct && (
                <TryOnModal
                    product={tryOnProduct}
                    onClose={handleCloseTryOn}
                    onStartGeneration={handleStartGeneration}
                />
            )}

            {/* Try On Results */}
            {showResults && tryOnResult && (
                <TryOnResults
                    result={tryOnResult}
                    recommendations={sampleProducts.filter(p => p.id !== tryOnResult.productId).slice(0, 3)}
                    onBack={handleBackFromResults}
                    onTryAnother={handleTryAnother}
                    isLoading={isResultLoading}
                />
            )}
        </div>
    );
};

export default TryOnDemo;

