import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Hero } from '../../components/tryon/Hero';
import Footer from '../../components/Footer';
import DemoHeader from '../../components/DemoHeader';
import { ProductCard, Product } from '../../components/tryon/ProductCard';
import { ProductQuickView } from '../../components/tryon/ProductQuickView';
import { TryOnModal } from '../../components/tryon/TryOnModal';

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

    const handleTryOnGenerate = (faceImage: string, bodyImage: string, product: Product) => {
        console.log('Generated try-on for:', product.name);
        console.log('Face image base64 length:', faceImage.length);
        console.log('Body image base64 length:', bodyImage.length);
        // Future: Send to LLM API
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
            <section className="px-4 sm:px-6 lg:px-8 pb-12">
                <div className="max-w-[1440px] mx-auto">
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900">
                        {/* Decorative Elements */}
                        <div className="absolute inset-0 opacity-30">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-400 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                        </div>

                        <div className="relative px-6 py-12 md:px-12 md:py-16 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                            <div className="md:max-w-2xl">
                                <p className="font-['Sora'] text-xs md:text-sm font-bold uppercase tracking-[0.3em] text-emerald-200 mb-3 leading-[0.4]">
                                    AGENS
                                </p>
                                <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-3 md:whitespace-nowrap">
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
                    onGenerate={handleTryOnGenerate}
                />
            )}
        </div>
    );
};

export default TryOnDemo;

