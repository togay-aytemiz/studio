import React, { useState, useEffect, useRef } from 'react';
import { Product } from './ProductCard';
import { X, Upload, CheckCircle2, Loader2, Sparkles, AlertCircle, ArrowRight, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface TryOnModalProps {
    product: Product;
    onClose: () => void;
    onGenerate: (faceImage: string, bodyImage: string, product: Product) => void;
}

type PhotoType = 'FACE' | 'BODY';

// Local guide images
const GUIDE_FACE_URL = "/tryon/products/face.webp";
const GUIDE_BODY_URL = "/tryon/products/body.webp";

export const TryOnModal: React.FC<TryOnModalProps> = ({ product, onClose, onGenerate }) => {
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
    const t = {
        title: { en: 'Select Your Photos', tr: 'Fotoğraflarınızı Seçin' },
        confirmTitle: { en: 'Confirm & Generate', tr: 'Onayla & Oluştur' },
        step1Face: { en: 'Step 1: Face Photo', tr: 'Adım 1: Yüz Fotoğrafı' },
        step2Body: { en: 'Step 2: Body Photo', tr: 'Adım 2: Vücut Fotoğrafı' },
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
        confirm: { en: 'Confirm', tr: 'Onayla' },
        nextStep: { en: 'Next Step', tr: 'Sonraki Adım' },
        yourInputs: { en: 'Your Inputs', tr: 'Fotoğraflarınız' },
        targetProduct: { en: 'Target Product', tr: 'Hedef Ürün' },
        generateTryOn: { en: 'Generate Try-On', tr: 'Deneme Oluştur' },
        generating: { en: 'Generating Result...', tr: 'Sonuç Oluşturuluyor...' },
        faceTooltip: { en: 'Should be a clear front-facing portrait.', tr: 'Net ve önden çekilmiş bir portre olmalı.' },
        bodyTooltip: { en: 'Should be a full-body standing shot.', tr: 'Tam boy dik duran bir fotoğraf olmalı.' },
        face: { en: 'Face', tr: 'Yüz' },
        body: { en: 'Body', tr: 'Vücut' },
    };

    // Focus trap and ESC key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        modalRef.current?.focus();
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    // Clean up object URLs
    useEffect(() => {
        return () => {
            if (facePreview) URL.revokeObjectURL(facePreview);
            if (bodyPreview) URL.revokeObjectURL(bodyPreview);
        };
    }, [facePreview, bodyPreview]);

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

        // Convert to base64 for future LLM integration
        const toBase64 = (file: File): Promise<string> => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
            });
        };

        try {
            const faceBase64 = faceFile ? await toBase64(faceFile) : '';
            const bodyBase64 = bodyFile ? await toBase64(bodyFile) : '';

            // Simulate API call (replace with actual LLM call later)
            setTimeout(() => {
                onGenerate(faceBase64, bodyBase64, product);
                setIsGenerating(false);
                onClose();
            }, 2500);
        } catch (error) {
            console.error('Error converting to base64:', error);
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
                <div className="flex items-center justify-between p-6 md:p-8 border-b border-gray-100 bg-white z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {step === 1 ? t.title[lang] : t.confirmTitle[lang]}
                        </h2>
                        <p className="text-gray-500 mt-1 text-sm md:text-base">
                            {step === 1
                                ? (mobileUploadStep === 'FACE' ? t.step1Face[lang] : t.step2Body[lang])
                                : `${t.readyToTryOn[lang]}: ${productName}`}
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
                <div className="flex-1 overflow-y-auto bg-white p-6 md:p-8">

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
                        // Step 2: Preview & Confirm
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center h-full">
                            {/* Inputs */}
                            <div className="lg:col-span-1 space-y-4">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">{t.yourInputs[lang]}</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="rounded-xl overflow-hidden bg-gray-100 aspect-[3/4] relative">
                                        <img src={facePreview!} alt="Face" className="w-full h-full object-cover" />
                                        <span className="absolute bottom-2 left-2 text-[10px] font-bold bg-black/50 text-white px-2 py-1 rounded backdrop-blur-md">{t.face[lang]}</span>
                                    </div>
                                    <div className="rounded-xl overflow-hidden bg-gray-100 aspect-[3/4] relative">
                                        <img src={bodyPreview!} alt="Body" className="w-full h-full object-cover" />
                                        <span className="absolute bottom-2 left-2 text-[10px] font-bold bg-black/50 text-white px-2 py-1 rounded backdrop-blur-md">{t.body[lang]}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Arrow */}
                            <div className="flex justify-center text-gray-300">
                                <ArrowRight size={48} className="hidden lg:block" />
                                <ArrowRight size={32} className="lg:hidden rotate-90 my-4" />
                            </div>

                            {/* Target Product */}
                            <div className="lg:col-span-1 space-y-4">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">{t.targetProduct[lang]}</h3>
                                <div className="rounded-xl overflow-hidden bg-gray-100 aspect-[3/4] relative shadow-lg">
                                    <img src={product.images[0]} alt={productName} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                                        <p className="text-white font-bold text-lg">{productName}</p>
                                        <p className="text-gray-300 text-sm">{productCategory}</p>
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
                                        {t.generating[lang]}
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

export default TryOnModal;
