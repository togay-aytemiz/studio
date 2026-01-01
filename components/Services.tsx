import React from 'react';
import { SERVICES } from '../constants';
import ScrollReveal from './ScrollReveal';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const Services: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section id="services" className="py-36 md:py-40 bg-slate-950 relative">
      <div className="container mx-auto px-6">
        <ScrollReveal>
          <div className="mb-20 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
               <Sparkles size={14} className="text-indigo-400" />
               <span className="text-xs font-bold tracking-widest text-indigo-400 uppercase">Expertise</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Comprehensive product <br/> development.
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed">
              We don't just write code. We provide a full-cycle product capability, from initial strategy to post-launch scaling.
            </p>
          </div>
        </ScrollReveal>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {SERVICES.map((service, index) => (
            <motion.div 
              key={service.id} 
              variants={itemVariants}
              className="h-full p-8 rounded-2xl bg-slate-900/20 border border-white/5 relative overflow-hidden flex flex-col"
            >
              {/* Subtle top gradient line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500/0 via-indigo-500/20 to-indigo-500/0 opacity-50"></div>
              
              <div className="w-14 h-14 bg-slate-950 border border-white/10 rounded-xl flex items-center justify-center mb-6 text-indigo-400 shadow-sm">
                <service.icon size={26} strokeWidth={1.5} />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{service.title}</h3>
              
              <p className="text-slate-400 leading-relaxed text-sm flex-grow">
                {service.description}
              </p>

              {/* Decorative corner */}
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-white/5 to-transparent opacity-30 rounded-tl-3xl pointer-events-none"></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Services;