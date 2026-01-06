import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Hero } from '../../components/tryon/Hero';
import Footer from '../../components/Footer';
import FooterCta from '../../components/FooterCta';
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

            <FooterCta
                title="Markaniz icin de bunun gibi bir sey yapabiliriz."
                description="Markaniza ozel, urun odakli yazilim hizmeti icin bize ulasin."
                buttonLabel="Görüşme Planla"
            />
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

