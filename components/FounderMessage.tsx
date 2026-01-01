import React from 'react';
import { Quote, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import ScrollReveal from './ScrollReveal';

const FounderMessage: React.FC = () => {
  return (
    <section className="py-36 md:py-40 bg-[#020617] relative overflow-hidden border-t border-white/5">
      
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 mix-blend-soft-light pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
      
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" 
           style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <ScrollReveal width="100%">
          <div className="max-w-6xl mx-auto">
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
              
              {/* Image Section (Left) - Editorial Style */}
              <motion.div 
                className="col-span-1 md:col-span-5 relative"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl shadow-indigo-500/10 border border-white/10 group">
                   <div className="absolute inset-0 bg-indigo-500/20 mix-blend-overlay z-10 group-hover:bg-transparent transition-all duration-700"></div>
                   <img 
                     src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                     alt="Alex Voser" 
                     className="w-full aspect-[4/5] object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105"
                   />
                </div>
                
                {/* Decorative Elements around image */}
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-slate-950 border border-white/10 rounded-full flex items-center justify-center z-20 shadow-xl">
                    <Sparkles className="text-indigo-400" size={32} />
                </div>
                <div className="absolute -top-4 -left-4 w-full h-full border border-indigo-500/30 rounded-2xl -z-10"></div>
              </motion.div>

              {/* Text Section (Right) */}
              <div className="col-span-1 md:col-span-7 relative">
                
                {/* Large Background Quote Mark */}
                <div className="absolute -top-16 -left-8 text-indigo-500/10 -z-10 select-none">
                   <Quote size={180} fill="currentColor" />
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-px w-12 bg-indigo-500"></div>
                    <span className="text-indigo-400 font-medium uppercase tracking-widest text-xs">A Note from the Founder</span>
                  </div>

                  <h3 className="text-3xl md:text-5xl font-serif text-white mb-8 leading-tight">
                    "Software agencies often forget one thing: <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-indigo-300">
                      Code is just a means to an end.
                    </span>"
                  </h3>

                  <div className="space-y-6 text-slate-400 text-lg leading-relaxed font-light">
                    <p>
                      I started Nexus because I was tired of seeing founders get great code but failed products. The disconnect between engineering and product strategy is where most startups die.
                    </p>
                    <p>
                      We don't just take your specs and disappear. We act as your technical co-founder, challenging assumptions and obsessing over the user experience until your vision isn't just live—it's thriving.
                    </p>
                  </div>

                  <div className="mt-10 flex items-center gap-4">
                    <div>
                      <h4 className="text-white font-bold text-xl font-serif">Alex Voser</h4>
                      <p className="text-indigo-500/80 text-sm font-medium">Founder & CEO</p>
                    </div>
                    
                    {/* Visual signature representation */}
                    <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent ml-4"></div>
                  </div>
                </motion.div>
              </div>

            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default FounderMessage;