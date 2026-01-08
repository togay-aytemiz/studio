import React, { useState, useEffect, useRef } from 'react';
import { Product } from './ProductCard';
import { X, Upload, CheckCircle2, Loader2, Sparkles, AlertCircle, ArrowRight, Info, Shirt, User, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { TryOnResult } from './TryOnResults';

interface TryOnModalProps {
    product: Product;
    onClose: () => void;
    onStartGeneration: (data: any) => void;
}

type PhotoType = 'FACE' | 'BODY';

// Local guide images
const GUIDE_FACE_URL = "/tryon/products/face.webp";
const GUIDE_BODY_URL = "/tryon/products/body.webp";

export const TryOnModal: React.FC<TryOnModalProps> = ({ product, onClose, onStartGeneration }) => {
    const { i18n } = useTranslation();
    const lang = i18n.language === 'en' ? 'en' : 'tr';

    const [step, setStep] = useState<1 | 2>(1);

    // Mobile Upload Step State: 'FACE' -> 'BODY'
    const [mobileUploadStep, setMobileUploadStep] = useState<'FACE' | 'BODY'>('FACE');

    // State for Face Photo
    const [faceFile, setFaceFile] = useState<File | null>(null);
    const [facePreview, setFacePreview] = useState<string | null>(null);

    // State for Body Photo
    const [bodyFile, setBodyFile] = useState<File | null>(null);
    const [bodyPreview, setBodyPreview] = useState<string | null>(null);

    const [isGenerating, setIsGenerating] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    // Hidden inputs refs
    const faceInputRef = useRef<HTMLInputElement>(null);
    const bodyInputRef = useRef<HTMLInputElement>(null);

    // Translations
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

    const LOADING_MESSAGES = [
        { en: "Analyzing body pose...", tr: "Vücut duruşu analiz ediliyor..." },
        { en: "Mapping fabric dynamics...", tr: "Kumaş dinamikleri haritalanıyor..." },
        { en: "Adjusting lighting and shadows...", tr: "Işık ve gölgeler ayarlanıyor..." },
        { en: "Rendering final high-res details...", tr: "Son yüksek çözünürlüklü detaylar işleniyor..." },
        { en: "Final polish...", tr: "Son dokunuşlar..." },
    ];

    useEffect(() => {
        if (isGenerating) {
            const interval = setInterval(() => {
                setCurrentMessageIndex(prev => (prev + 1) % LOADING_MESSAGES.length);
            }, 3000);
            return () => clearInterval(interval);
        } else {
            setCurrentMessageIndex(0);
        }
    }, [isGenerating]);
    const t = {
        title: { en: 'Select Your Photos', tr: 'Fotoğraflarınızı Seçin' },
        titleShort: { en: 'Upload Photos', tr: 'Fotoğraf Yükle' },
        confirmTitle: { en: 'Review & Create', tr: 'İncele & Oluştur' },
        step1Face: { en: 'Step 1: Face Photo', tr: 'Adım 1: Yüz Fotoğrafı' },
        step2Body: { en: 'Step 2: Body Photo', tr: 'Adım 2: Vücut Fotoğrafı' },
        desktopSubtitle: { en: 'Upload face and body photos', tr: 'Yüz ve vücut fotoğrafı yükleyin' },
        reviewSubtitle: { en: 'Review your photos before generating.', tr: 'Oluşturmadan önce fotoğraflarınızı inceleyin.' },
        readyToTryOn: { en: 'Ready to try on', tr: 'Denemeye hazır' },
        uploaded: { en: 'uploaded', tr: 'yüklendi' },
        facePhoto: { en: 'Face Photo', tr: 'Yüz Fotoğrafı' },
        bodyPhoto: { en: 'Body Photo', tr: 'Vücut Fotoğrafı' },
        required: { en: 'Required', tr: 'Gerekli' },
        ready: { en: 'Ready', tr: 'Hazır' },
        uploadFaceShot: { en: 'Upload Face Shot', tr: 'Yüz Fotoğrafı Yükle' },
        uploadBodyShot: { en: 'Upload Body Shot', tr: 'Vücut Fotoğrafı Yükle' },
        faceAdded: { en: 'Face Photo Added', tr: 'Yüz Fotoğrafı Eklendi' },
        bodyAdded: { en: 'Body Photo Added', tr: 'Vücut Fotoğrafı Eklendi' },
        faceHint: { en: 'Clear, front-facing portrait.', tr: 'Net, önden çekilmiş portre.' },
        bodyHint: { en: 'Full-body, standing straight.', tr: 'Tam boy, dik duruş.' },
        tapToChange: { en: 'Tap below to change if needed.', tr: 'Değiştirmek için aşağıya dokun.' },
        selectPhoto: { en: 'Select Photo', tr: 'Fotoğraf Seç' },
        changePhoto: { en: 'Change Photo', tr: 'Fotoğraf Değiştir' },
        backToShop: { en: 'Back to Shop', tr: 'Mağazaya Dön' },
        back: { en: 'Back', tr: 'Geri' },
        nextBody: { en: 'Next: Body', tr: 'Sonraki: Vücut' },
        confirm: { en: 'Review', tr: 'İncele' },
        nextStep: { en: 'Next Step', tr: 'Sonraki Adım' },
        yourInputs: { en: 'Your Inputs', tr: 'Fotoğraflarınız' },
        targetProduct: { en: 'Target Product', tr: 'Hedef Ürün' },
        generateTryOn: { en: 'Create My Look', tr: 'Görünümümü Oluştur' },
        generating: { en: 'Creating...', tr: 'Oluşturuluyor...' },
        faceTooltip: { en: 'Should be a clear front-facing portrait.', tr: 'Net ve önden çekilmiş bir portre olmalı.' },
        bodyTooltip: { en: 'Should be a full-body standing shot.', tr: 'Tam boy dik duran bir fotoğraf olmalı.' },
        face: { en: 'Face', tr: 'Yüz' },
        body: { en: 'Body', tr: 'Vücut' },
        selectedProduct: { en: 'Selected Product', tr: 'Seçilen Ürün' },
        yourReferencePhotos: { en: 'Your Reference Photos', tr: 'Referans Fotoğraflarınız' },
        edit: { en: 'Edit', tr: 'Düzenle' },
        readyToGenerate: { en: 'Ready to Generate', tr: 'Oluşturmaya Hazır' },
        aiProcessInfo: { en: 'Our AI will combine your photos with the selected item. This process usually takes about 10-15 seconds.', tr: 'Yapay zekamız fotoğraflarınızı seçtiğiniz ürünle birleştirecek. Bu işlem genellikle 10-15 saniye sürer.' },
    };

    // Focus trap and ESC key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        modalRef.current?.focus();
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Lock body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    // Note: Object URLs are cleaned up when modal closes and component unmounts

    const handleFileSelect = (file: File, type: PhotoType) => {
        if (file && file.type.startsWith('image/')) {
            if (file.size > 10 * 1024 * 1024) {
                alert(lang === 'en' ? "File too large. Max 10MB." : "Dosya çok büyük. Maksimum 10MB.");
                return;
            }
            const preview = URL.createObjectURL(file);
            if (type === 'FACE') {
                setFaceFile(file);
                setFacePreview(preview);
            } else {
                setBodyFile(file);
                setBodyPreview(preview);
            }
        }
    };

    const onDrop = (e: React.DragEvent, type: PhotoType) => {
        e.preventDefault();
        if (e.dataTransfer.files?.[0]) {
            handleFileSelect(e.dataTransfer.files[0], type);
        }
    };

    const handleGenerate = async () => {
        if (!facePreview || !bodyPreview) return;
        setIsGenerating(true);

        // Helper to compress and resize image to reduce payload size
        const compressImage = (file: File | Blob, maxWidth: number = 800, quality: number = 0.7): Promise<string> => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                const url = URL.createObjectURL(file);

                img.onload = () => {
                    URL.revokeObjectURL(url);

                    // Calculate new dimensions
                    let width = img.width;
                    let height = img.height;

                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }

                    // Create canvas and draw resized image
                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        reject(new Error('Failed to get canvas context'));
                        return;
                    }

                    ctx.drawImage(img, 0, 0, width, height);

                    // Convert to base64 with compression
                    const base64 = canvas.toDataURL('image/jpeg', quality);
                    resolve(base64);
                };

                img.onerror = () => {
                    URL.revokeObjectURL(url);
                    reject(new Error('Failed to load image'));
                };

                img.src = url;
            });
        };

        // Helper to convert File to compressed Base64
        const fileToBase64 = async (file: File): Promise<string> => {
            return compressImage(file, 800, 0.7);
        };

        // Helper to convert URL to compressed Base64 (for product images)
        const urlToBase64 = async (url: string): Promise<string> => {
            try {
                const response = await fetch(url);
                const blob = await response.blob();
                return compressImage(blob, 600, 0.6); // Smaller for product images since there can be multiple
            } catch (error) {
                console.error("Error converting URL to base64:", error);
                throw new Error("Failed to process product image.");
            }
        };

        try {
            // 1. Prepare Inputs
            const faceBase64 = faceFile ? await fileToBase64(faceFile) : '';
            const bodyBase64 = bodyFile ? await fileToBase64(bodyFile) : '';

            // Convert all product images to base64
            const garmentImagesBase64 = await Promise.all(
                product.images.map(imgUrl => urlToBase64(imgUrl))
            );

            // 3. Create Result Object NOT DONE HERE ANYMORE
            // Instead, we pass the data to the parent to handle the generation and loading state

            const generationData = {
                garmentImages: garmentImagesBase64,
                bodyImage: bodyBase64,
                faceImage: faceBase64,
                description: `${product.name.en} - ${product.category.en}`,
                product: product,
                userImagePreview: bodyPreview // Pass this for immediate preview
            };

            onStartGeneration(generationData);
            onClose();

        } catch (error: any) {
            console.error('Try-On Preparation Error:', error);
            alert(lang === 'en' ? `Error: ${error.message}` : `Hata: ${error.message}`);
        } finally {
            setIsGenerating(false);
        }
    };

    const uploadedCount = (facePreview ? 1 : 0) + (bodyPreview ? 1 : 0);
    const isReady = facePreview && bodyPreview;

    const productName = product.name[lang];
    const productCategory = product.category[lang];

    // Navigation Handlers
    const handleBack = () => {
        if (step === 2) {
            setStep(1);
        } else if (step === 1 && mobileUploadStep === 'BODY') {
            setMobileUploadStep('FACE');
        } else {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all" role="dialog" aria-modal="true" onClick={onClose}>
            <div
                ref={modalRef}
                className="bg-white rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col h-[90vh] md:h-auto md:max-h-[90vh]"
                tabIndex={-1}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 md:p-8 border-b border-gray-100 bg-white z-10">
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                            {step === 1
                                ? <><span className="md:hidden">{t.titleShort[lang]}</span><span className="hidden md:inline">{t.title[lang]}</span></>
                                : t.confirmTitle[lang]
                            }
                        </h2>
                        <p className="text-gray-500 mt-1 text-sm">
                            {step === 1
                                ? <><span className="md:hidden">{mobileUploadStep === 'FACE' ? t.step1Face[lang] : t.step2Body[lang]}</span><span className="hidden md:inline">{t.desktopSubtitle[lang]}</span></>
                                : t.reviewSubtitle[lang]}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        {step === 1 && (
                            <div className="hidden sm:flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold">
                                <Upload size={16} />
                                {uploadedCount}/2 {t.uploaded[lang]}
                            </div>
                        )}
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-black transition-colors">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Body Content */}
                <div className="flex-1 overflow-y-auto scrollbar-none bg-white p-6 md:p-8">

                    {step === 1 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">

                            {/* 1. Face Photo */}
                            <div className={`flex-col gap-4 ${mobileUploadStep === 'FACE' ? 'flex' : 'hidden md:flex'}`}>
                                <div className="flex justify-between items-center">
                                    <h3 className="font-bold text-lg text-gray-900">
                                        1. {t.facePhoto[lang]}
                                    </h3>
                                    {facePreview ? (
                                        <div className="flex items-center gap-1 text-emerald-600 text-sm font-bold">
                                            <CheckCircle2 size={16} className="fill-emerald-600 text-white" />
                                            {t.ready[lang]}
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1 text-blue-500 text-sm font-bold">
                                            <AlertCircle size={16} className="fill-blue-500 text-white" />
                                            {t.required[lang]}
                                        </div>
                                    )}
                                </div>

                                <div
                                    className={`flex-1 min-h-[400px] h-[400px] rounded-[2rem] relative overflow-hidden transition-all group border-2 ${facePreview ? 'border-gray-200' : 'border-dashed border-gray-200 hover:border-blue-400 cursor-pointer'
                                        }`}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => onDrop(e, 'FACE')}
                                    onClick={() => faceInputRef.current?.click()}
                                >
                                    <input
                                        type="file"
                                        ref={faceInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0], 'FACE')}
                                    />

                                    {/* Image Layer */}
                                    <div className="absolute inset-0 z-0 bg-gray-50">
                                        <img
                                            src={facePreview || GUIDE_FACE_URL}
                                            alt="Face Guide"
                                            className={`w-full h-full object-cover object-center transition-opacity duration-300 ${facePreview ? 'opacity-100' : 'opacity-60 mix-blend-multiply'}`}
                                        />
                                    </div>

                                    {/* Gradient Layer */}
                                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white via-white/90 to-transparent z-10 pointer-events-none" />

                                    {/* Content Layer */}
                                    <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col items-center justify-end p-6 text-center">
                                        <h4 className="font-bold text-gray-900 text-lg mb-1">
                                            {facePreview ? t.faceAdded[lang] : t.uploadFaceShot[lang]}
                                        </h4>
                                        <p className="text-gray-500 text-xs mb-4 max-w-[240px] leading-relaxed">
                                            {facePreview ? t.tapToChange[lang] : t.faceHint[lang]}
                                        </p>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                faceInputRef.current?.click();
                                            }}
                                            className="bg-gray-900 text-white shadow-lg shadow-gray-200 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-black transition-transform active:scale-95 min-w-[140px]"
                                        >
                                            {facePreview ? t.changePhoto[lang] : t.selectPhoto[lang]}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* 2. Body Photo */}
                            <div className={`flex-col gap-4 ${mobileUploadStep === 'BODY' ? 'flex' : 'hidden md:flex'}`}>
                                <div className="flex justify-between items-center">
                                    <h3 className="font-bold text-lg text-gray-900">
                                        2. {t.bodyPhoto[lang]}
                                    </h3>
                                    {bodyPreview ? (
                                        <div className="flex items-center gap-1 text-emerald-600 text-sm font-bold">
                                            <CheckCircle2 size={16} className="fill-emerald-600 text-white" />
                                            {t.ready[lang]}
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1 text-blue-500 text-sm font-bold">
                                            <AlertCircle size={16} className="fill-blue-500 text-white" />
                                            {t.required[lang]}
                                        </div>
                                    )}
                                </div>

                                <div
                                    className={`flex-1 min-h-[400px] h-[400px] rounded-[2rem] relative overflow-hidden transition-all group border-2 ${bodyPreview ? 'border-gray-200' : 'border-dashed border-gray-200 hover:border-blue-400 cursor-pointer'
                                        }`}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => onDrop(e, 'BODY')}
                                    onClick={() => bodyInputRef.current?.click()}
                                >
                                    <input
                                        type="file"
                                        ref={bodyInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0], 'BODY')}
                                    />

                                    {/* Image Layer */}
                                    <div className="absolute inset-0 z-0 bg-gray-50">
                                        <img
                                            src={bodyPreview || GUIDE_BODY_URL}
                                            alt="Body Guide"
                                            className={`w-full h-full object-cover transition-opacity duration-300 ${bodyPreview ? 'opacity-100' : 'opacity-60 mix-blend-multiply'}`}
                                        />
                                    </div>

                                    {/* Gradient Layer */}
                                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white via-white/90 to-transparent z-10 pointer-events-none" />

                                    {/* Content Layer */}
                                    <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col items-center justify-end p-6 text-center">
                                        <h4 className="font-bold text-gray-900 text-lg mb-1">
                                            {bodyPreview ? t.bodyAdded[lang] : t.uploadBodyShot[lang]}
                                        </h4>
                                        <p className="text-gray-500 text-xs mb-4 max-w-[240px] leading-relaxed">
                                            {bodyPreview ? t.tapToChange[lang] : t.bodyHint[lang]}
                                        </p>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                bodyInputRef.current?.click();
                                            }}
                                            className="bg-gray-900 text-white shadow-lg shadow-gray-200 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-black transition-transform active:scale-95 min-w-[140px]"
                                        >
                                            {bodyPreview ? t.changePhoto[lang] : t.selectPhoto[lang]}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // Step 2: Review & Create Try-On
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 h-full items-start">

                            {/* LEFT: Selected Product */}
                            <div className="flex flex-col gap-4 h-full">
                                <h3 className="flex items-center gap-2 text-lg font-bold text-emerald-900 shrink-0">
                                    <Shirt size={20} className="text-emerald-600" />
                                    {t.selectedProduct[lang]}
                                </h3>

                                {/* Product Image */}
                                <div className="flex-1 rounded-3xl overflow-hidden bg-gray-100 relative border border-gray-200 shadow-sm min-h-[300px] lg:min-h-0">
                                    <img
                                        src={product.images[0]}
                                        alt={productName}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="flex items-baseline justify-between px-1 shrink-0">
                                    <h2 className="text-xl lg:text-2xl font-bold text-gray-900">{productName}</h2>
                                    <p className="text-lg lg:text-xl font-bold text-gray-900">
                                        {lang === 'en'
                                            ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(product.price)
                                            : new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 0 }).format(product.price)
                                        }
                                    </p>
                                </div>
                            </div>

                            {/* RIGHT: Photos & Info */}
                            <div className="flex flex-col gap-6 h-full">

                                {/* Photos Header */}
                                <div className="flex items-center justify-between shrink-0">
                                    <h3 className="flex items-center gap-2 text-lg font-bold text-emerald-900">
                                        <User size={20} className="text-blue-600" />
                                        {t.yourReferencePhotos[lang]}
                                    </h3>
                                    <button
                                        onClick={() => setStep(1)}
                                        className="text-blue-600 font-bold text-sm hover:underline"
                                    >
                                        {t.edit[lang]}
                                    </button>
                                </div>

                                {/* Photos Grid */}
                                <div className="grid grid-cols-2 gap-4 shrink-0">
                                    {/* Face */}
                                    <div className="aspect-square rounded-2xl bg-gray-900 relative overflow-hidden shadow-md group">
                                        <img src={facePreview!} alt="Face" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />

                                        {/* Checkmark */}
                                        <div className="absolute top-3 right-3 bg-white rounded-full p-0.5 shadow-lg">
                                            <CheckCircle2 size={20} className="fill-emerald-500 text-white" />
                                        </div>

                                        {/* Badge */}
                                        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-widest">
                                            {t.face[lang]}
                                        </div>
                                    </div>

                                    {/* Body */}
                                    <div className="aspect-square rounded-2xl bg-gray-900 relative overflow-hidden shadow-md group">
                                        <img src={bodyPreview!} alt="Body" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />

                                        {/* Checkmark */}
                                        <div className="absolute top-3 right-3 bg-white rounded-full p-0.5 shadow-lg">
                                            <CheckCircle2 size={20} className="fill-emerald-500 text-white" />
                                        </div>

                                        {/* Badge */}
                                        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-widest">
                                            {t.body[lang]}
                                        </div>
                                    </div>
                                </div>

                                {/* Info Box - Pushed to bottom */}
                                <div className="mt-auto bg-blue-50 rounded-2xl p-6 flex items-start gap-4 border border-blue-100 shrink-0">
                                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600 shrink-0">
                                        <Sparkles size={20} className="fill-current" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-base lg:text-lg">{t.readyToGenerate[lang]}</h4>
                                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                                            {t.aiProcessInfo[lang]}
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}

                </div>

                {/* Footer */}
                <div className="p-4 md:p-8 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
                    <button
                        onClick={handleBack}
                        className="font-semibold text-sm text-gray-500 hover:text-gray-900 transition-colors"
                        disabled={isGenerating}
                    >
                        {step === 1 && mobileUploadStep === 'FACE' ? t.backToShop[lang] : t.back[lang]}
                    </button>

                    <div className="flex items-center gap-4">

                        {step === 1 ? (
                            <>
                                {/* MOBILE BUTTONS */}
                                <div className="md:hidden">
                                    {mobileUploadStep === 'FACE' ? (
                                        <button
                                            onClick={() => setMobileUploadStep('BODY')}
                                            disabled={!facePreview}
                                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${facePreview
                                                ? 'bg-gray-900 text-white shadow-md'
                                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                }`}
                                        >
                                            {t.nextBody[lang]}
                                            <ArrowRight size={18} />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => setStep(2)}
                                            disabled={!bodyPreview}
                                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${bodyPreview
                                                ? 'bg-gray-900 text-white shadow-md'
                                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                }`}
                                        >
                                            {t.confirm[lang]}
                                            <ArrowRight size={18} />
                                        </button>
                                    )}
                                </div>

                                {/* DESKTOP BUTTON */}
                                <button
                                    onClick={() => setStep(2)}
                                    disabled={!isReady}
                                    className={`hidden md:flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base transition-all ${isReady
                                        ? 'bg-gray-900 text-white hover:bg-black shadow-lg hover:shadow-xl hover:-translate-y-0.5'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    {t.nextStep[lang]}
                                    <ArrowRight size={18} />
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={handleGenerate}
                                disabled={isGenerating}
                                className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-base hover:bg-emerald-700 transition-all disabled:opacity-75 disabled:cursor-wait shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:-translate-y-0.5 min-w-[200px] justify-center"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        <span className="min-w-[200px] text-left">
                                            {LOADING_MESSAGES[currentMessageIndex][lang]}
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={20} />
                                        {t.generateTryOn[lang]}
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Assuming handleGenerate is defined elsewhere in the component's scope,
// for example, as a useCallback or a regular function within the TryOnModal component.
// The change is applied to the setTimeout call within that function.
// For demonstration, let's assume it looks something like this:
/*
const handleGenerate = useCallback(() => {
    setIsGenerating(true);
    // Simulate API call - Short delay to transition to result page
    setTimeout(() => {
        // Create a result that mimics the requested output
        // Ideally, a real API would return 3 distinct generated images.
        // For this POC, we use the product's own images to simulate the "High Quality Result".
        // If the product doesn't have 3 images, we fallback to the uploaded one.

        const resultImages = product.images.length >= 3
            ? product.images.slice(0, 3)
            : [product.images[0], product.images[0], product.images[0]];

        const result: TryOnResult = {
            id: crypto.randomUUID(),
            productId: product.id,
            productName: product.name,
            productImage: product.images[0],
            productPrice: product.price,
            productCategory: product.category,
            userImage: bodyPreview,
            resultImages: resultImages, // Now sending 3 images
            timestamp: Date.now(),
        };

        onGenerate(result);
        setIsGenerating(false);
        onClose();
    }, 100); // Changed from 2500 to 100
}, [product, bodyPreview, onGenerate, onClose]);
*/

export default TryOnModal;
