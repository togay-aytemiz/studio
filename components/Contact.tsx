import React, { useState } from 'react';
import Button from './Button';
import { Send, Mail, Phone, CheckCircle2, ArrowRight, ArrowUpRight, BrainCircuit, Loader2 } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation, Trans } from 'react-i18next';

import { useNavigate } from 'react-router-dom';
import { isOpenAIConfigured } from '../services/openaiService';

const Contact: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const { t } = useTranslation();
  const isAIEnabled = isOpenAIConfigured();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!formData.email && !formData.phone) || !formData.name || !formData.message) return;

    setStatus('sending');
    const emailTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';

    try {
      await import('../services/emailService').then(mod =>
        mod.sendEmail({
          type: 'contact',
          name: formData.name,
          email: formData.email || 'Telefon ile iletişim',
          phone: formData.phone,
          message: formData.message,
          emailTheme
        })
      );

      setStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error('Email error:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const handleValidateClick = () => {
    navigate('/validate');
  };

  // Helper for consistent input styling
  const inputClasses = "w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:border-indigo-500/70 focus:bg-white/15 focus:ring-1 focus:ring-indigo-500/30 transition-all duration-300";
  const labelClasses = "block text-[11px] font-bold uppercase tracking-widest text-white/70 mb-2 ml-1";

  return (
    <section id="contact" className="scroll-mt-28 py-12 md:py-24 bg-[#020617] relative overflow-hidden flex flex-col items-center justify-start">

      {/* Background Image - Mobile */}
      <div
        className="absolute inset-0 md:hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/contactbg-mobile.webp)' }}
      />
      {/* Background Image - Desktop */}
      <div
        className="absolute inset-0 hidden md:block bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/contactbg-desktop.webp)' }}
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50" />
      {/* Top gradient fade for smooth transition */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-transparent to-transparent" />
      {/* Bottom gradient fade for smooth transition */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent" />

      <div className="container mx-auto px-6 relative z-10">
        <ScrollReveal width="100%">

          <div className="max-w-4xl mx-auto">
            {/* Header Area */}
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight font-serif">
                {t('contact.title')}
              </h2>
              <p className="text-base md:text-xl text-slate-400 max-w-2xl mx-auto">
                {t('contact.subtitle')}
              </p>
            </div>

            {/* The "Holographic" Form Card */}
            <div className="relative">
              {/* Glow Effect behind card */}
              <div className="absolute -inset-1 bg-gradient-to-r from-slate-500 to-slate-600 rounded-3xl blur opacity-10 transition duration-1000 group-hover:opacity-20"></div>

              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">

                <div className="grid grid-cols-1 md:grid-cols-12">

                  {/* Form Section */}
                  <div className="col-span-1 md:col-span-8 p-8 md:p-12 border-r border-white/5">

                    {/* AI Nudge */}
                    {isAIEnabled && (
                      <div className="mb-8 p-4 rounded-xl bg-white/5 border border-indigo-500/30 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 md:gap-0">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 bg-indigo-500/30 rounded-lg text-indigo-300 shrink-0 border border-indigo-500/20">
                            <BrainCircuit size={18} />
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">{t('contact.ai.title')}</p>
                            <p className="text-white/60 text-xs">{t('contact.ai.subtitle')}</p>
                          </div>
                        </div>
                        <button onClick={handleValidateClick} className="px-4 py-2 bg-white text-slate-900 text-xs font-medium rounded-full hover:bg-white/90 transition-all shadow-lg flex items-center justify-center gap-2">
                          {t('contact.ai.button')} <ArrowUpRight size={14} />
                        </button>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="group">
                            <label className={labelClasses}>{t('contact.form.name')}</label>
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              className={inputClasses}
                              placeholder={t('contact.form.namePlaceholder')}
                              required
                            />
                          </div>
                          <div className="group">
                            <label className={labelClasses}>Telefon</label>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              className={inputClasses}
                              placeholder="0555 555 55 55"
                            />
                          </div>
                        </div>

                        <div className="group">
                          <label className={labelClasses}>{t('contact.form.email')}</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={inputClasses}
                            placeholder={t('contact.form.emailPlaceholder')}
                          />
                        </div>
                      </div>

                      <div className="group">
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-[11px] font-bold uppercase tracking-widest text-white/70 ml-1">
                            {t('contact.form.project')}
                          </label>
                        </div>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows={4}
                          className={`${inputClasses} resize-none`}
                          placeholder={t('contact.form.projectPlaceholder')}
                          required
                        ></textarea>
                      </div>



                      <div className="pt-2 flex justify-end md:justify-start">
                        <Button
                          type="submit"
                          size="md"
                          className="group !px-5 !py-2.5 !text-sm md:!px-6 md:!py-3 md:!text-base"
                          disabled={!formData.name.trim() || (!formData.email.trim() && !formData.phone.trim()) || !formData.message.trim() || status === 'sending'}
                        >
                          {t('contact.form.submit')}
                          <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                        </Button>
                      </div>
                    </form>
                  </div>

                  {/* Info Sidebar (Right) */}
                  <div className="col-span-1 md:col-span-4 bg-slate-950/30 p-8 md:p-12 flex flex-col justify-between border-t md:border-t-0 md:border-l border-white/5">
                    <div>
                      <h3 className="text-white font-bold text-lg mb-8">{t('contact.sidebar.directLine')}</h3>
                      <div className="space-y-8">
                        <div className="flex items-start gap-4 group">
                          <div className="p-2 bg-slate-800/50 rounded-lg text-slate-400 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-colors">
                            <Phone size={18} />
                          </div>
                          <div>
                            <p className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">{t('contact.sidebar.phone')}</p>
                            <p className="text-white font-medium">+90 (507) 469 9692</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-12 md:mt-0">
                      <div className="p-5 rounded-2xl bg-slate-900 border border-white/5 shadow-xl">
                        <div className="flex items-center gap-2 mb-2 text-indigo-400">
                          <CheckCircle2 size={16} />
                          <span className="text-xs font-bold uppercase tracking-wide">{t('contact.sidebar.responseTime')}</span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">
                          <Trans i18nKey="contact.sidebar.responseDesc" components={{ span: <span className="text-white font-medium" /> }} />
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </ScrollReveal>
      </div>
    </section >
  );
};

export default Contact;
