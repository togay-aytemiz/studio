import React, { useState } from 'react';
import Button from './Button';
import { Send, Loader2, Sparkles, Mail, Phone, CheckCircle2, ArrowRight, ArrowUpRight, BrainCircuit } from 'lucide-react';
import { generateProjectBrief } from '../services/geminiService';
import ScrollReveal from './ScrollReveal';
import { motion, AnimatePresence } from 'framer-motion';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAiAssist = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (formData.message.length < 10) {
      alert("Please enter a short description of your idea first.");
      return;
    }
    
    setIsGenerating(true);
    setAiResponse(null);
    try {
      const result = await generateProjectBrief(formData.message);
      setAiResponse(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thanks! We'll be in touch shortly.");
    setFormData({ name: '', email: '', message: '' });
    setAiResponse(null);
  };

  const scrollToValidator = () => {
      const element = document.querySelector('section:nth-of-type(2)'); // Assuming Validator is the 2nd section based on App.tsx order
      if(element) element.scrollIntoView({ behavior: 'smooth' });
  };

  // Helper for consistent input styling
  const inputClasses = "w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] focus:ring-1 focus:ring-indigo-500/20 transition-all duration-300";
  const labelClasses = "block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1";

  return (
    <section id="contact" className="py-32 bg-[#020617] relative overflow-hidden min-h-screen flex items-center justify-center">
      
      {/* Abstract Map Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none select-none">
        <svg className="w-full h-full" width="100%" height="100%">
           <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#4f46e5" />
           </pattern>
           <rect width="100%" height="100%" fill="url(#grid)" />
           
           {/* Connecting Lines */}
           <path d="M 100 100 L 300 300" stroke="#4f46e5" strokeWidth="0.5" strokeDasharray="5 5" opacity="0.5" />
           <path d="M 800 200 L 600 500" stroke="#4f46e5" strokeWidth="0.5" strokeDasharray="5 5" opacity="0.5" />
           <circle cx="800" cy="200" r="100" fill="url(#radial-glow)" opacity="0.1" />
           
           <defs>
             <radialGradient id="radial-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="transparent" />
             </radialGradient>
           </defs>
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <ScrollReveal width="100%">
            
            <div className="max-w-4xl mx-auto">
                {/* Header Area */}
                <div className="text-center mb-12">
                   <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                     Ready to ship?
                   </h2>
                   <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                     Tell us about your vision. We'll tell you how we can build it.
                   </p>
                </div>

                {/* The "Holographic" Form Card */}
                <div className="relative">
                   {/* Glow Effect behind card */}
                   <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur opacity-20 transition duration-1000 group-hover:opacity-100"></div>
                   
                   <div className="relative bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                      
                      <div className="grid grid-cols-1 md:grid-cols-12">
                          
                          {/* Form Section */}
                          <div className="col-span-1 md:col-span-8 p-8 md:p-12 border-r border-white/5">
                             
                             {/* AI Nudge */}
                             <div className="mb-8 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                   <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                                      <BrainCircuit size={18} />
                                   </div>
                                   <div>
                                      <p className="text-white text-sm font-medium">Not sure where to start?</p>
                                      <p className="text-slate-400 text-xs">Test your idea feasibility with our AI first.</p>
                                   </div>
                                </div>
                                <button onClick={scrollToValidator} className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                                   Test Validator <ArrowUpRight size={14} />
                                </button>
                             </div>

                             <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="group">
                                        <label className={labelClasses}>Name</label>
                                        <input 
                                          type="text" 
                                          name="name" 
                                          value={formData.name}
                                          onChange={handleChange}
                                          className={inputClasses}
                                          placeholder="Jane Doe"
                                          required
                                        />
                                    </div>
                                    <div className="group">
                                        <label className={labelClasses}>Work Email</label>
                                        <input 
                                          type="email" 
                                          name="email" 
                                          value={formData.email}
                                          onChange={handleChange}
                                          className={inputClasses}
                                          placeholder="jane@company.com"
                                          required
                                        />
                                    </div>
                                </div>

                                <div className="group">
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1">
                                            Project Details
                                        </label>
                                        <button
                                            type="button"
                                            onClick={handleAiAssist}
                                            disabled={isGenerating || !formData.message}
                                            className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 hover:text-indigo-300 flex items-center gap-1 disabled:opacity-50 transition-colors"
                                        >
                                            {isGenerating ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                                            AI Auto-Brief
                                        </button>
                                    </div>
                                    <textarea 
                                      name="message" 
                                      value={formData.message}
                                      onChange={handleChange}
                                      rows={4}
                                      className={`${inputClasses} resize-none`}
                                      placeholder="We are looking to build a mobile app that..."
                                      required
                                    ></textarea>
                                </div>

                                <AnimatePresence>
                                    {aiResponse && (
                                        <motion.div 
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="bg-indigo-950/20 border border-indigo-500/20 rounded-xl p-4 overflow-hidden"
                                        >
                                            <div className="flex items-center gap-2 mb-2 text-indigo-400">
                                                <Sparkles size={14} />
                                                <span className="text-xs font-bold uppercase">AI Suggestion</span>
                                            </div>
                                            <div className="text-slate-300 text-sm prose prose-invert max-w-none">
                                                 <div dangerouslySetInnerHTML={{ __html: aiResponse.replace(/\n/g, '<br />') }} />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="pt-2">
                                    <Button type="submit" size="lg" className="w-full md:w-auto group">
                                        Send Application
                                        <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                                    </Button>
                                </div>
                             </form>
                          </div>

                          {/* Info Sidebar (Right) */}
                          <div className="col-span-1 md:col-span-4 bg-slate-950/30 p-8 md:p-12 flex flex-col justify-between border-t md:border-t-0 md:border-l border-white/5">
                              <div>
                                  <h3 className="text-white font-bold text-lg mb-8">Direct Line</h3>
                                  <div className="space-y-8">
                                      <div className="flex items-start gap-4 group">
                                          <div className="p-2 bg-slate-800/50 rounded-lg text-slate-400 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-colors">
                                              <Mail size={18} />
                                          </div>
                                          <div>
                                              <p className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">New Business</p>
                                              <a href="mailto:hello@nexus.studio" className="text-white hover:text-indigo-400 transition-colors font-medium">hello@nexus.studio</a>
                                          </div>
                                      </div>
                                      <div className="flex items-start gap-4 group">
                                          <div className="p-2 bg-slate-800/50 rounded-lg text-slate-400 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-colors">
                                              <Phone size={18} />
                                          </div>
                                          <div>
                                              <p className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">Phone</p>
                                              <p className="text-white font-medium">+1 (555) 012-3456</p>
                                          </div>
                                      </div>
                                  </div>
                              </div>

                              <div className="mt-12 md:mt-0">
                                  <div className="p-5 rounded-2xl bg-slate-900 border border-white/5 shadow-xl">
                                      <div className="flex items-center gap-2 mb-2 text-indigo-400">
                                          <CheckCircle2 size={16} />
                                          <span className="text-xs font-bold uppercase tracking-wide">Response Time</span>
                                      </div>
                                      <p className="text-slate-400 text-sm leading-relaxed">
                                          We value your time. Expect a detailed reply within <span className="text-white font-medium">24 hours</span>.
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
    </section>
  );
};

export default Contact;