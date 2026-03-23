import React from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Smartphone, 
  BellRing, 
  Wind, 
  Activity,
  AlertTriangle,
  CheckCircle2,
  Zap
} from 'lucide-react';
import logoImage from 'figma:asset/6baf355c7d6d1ff0d2431c00f9712e2fae909409.png';

const IMG_STOVE = "https://images.unsplash.com/photo-1607324772107-8ad6740ca195?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";
const IMG_SMART_DEVICE = "https://images.unsplash.com/photo-1740034906098-99353c8c6f5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";
const IMG_APP = "https://images.unsplash.com/photo-1758522484779-b852d5582d52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";
const IMG_SAFE = "https://images.unsplash.com/photo-1593853761096-d0423b545cf9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";

const Navbar = () => (
  <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-4 md:px-12 md:py-6 bg-black/50 backdrop-blur-md border-b border-white/10 text-white">
    <div className="flex items-center gap-2">
      <img src={logoImage} alt="Ignis Secura" className="h-10 object-contain" />
    </div>
    <div className="hidden md:flex gap-8 text-sm font-medium text-white/70">
      <a href="#problem" className="hover:text-white transition-colors">The Risk</a>
      <a href="#features" className="hover:text-white transition-colors">Features</a>
      <a href="#safety" className="hover:text-white transition-colors">Safety</a>
    </div>
    <button className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-2 rounded-full font-medium transition-all shadow-[0_0_15px_rgba(234,88,12,0.4)]">
      Pre-order
    </button>
  </nav>
);

const HeroSection = () => {
  return (
    <section className="relative h-screen bg-black flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,88,12,0.15)_0%,rgba(0,0,0,1)_60%)]" />
      
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative w-64 h-64 md:w-96 md:h-96 mb-10 rounded-full overflow-hidden border border-white/10 shadow-[0_0_60px_rgba(234,88,12,0.2)]"
        >
          <motion.img 
            src={IMG_SMART_DEVICE} 
            alt="Smart Regulator"
            className="w-full h-full object-cover"
            animate={{ rotate: 360 }}
            transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-0 bg-orange-500/10 mix-blend-overlay rounded-full" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <h2 className="text-orange-500 font-medium tracking-widest text-sm uppercase mb-4">Smart Gas Safety</h2>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight mb-6">
            Introducing <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">Ignis Secura</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
            The next generation of kitchen safety. Advanced monitoring, instant alerts, and total peace of mind for every home.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

const ProblemSection = () => {
  return (
    <section id="problem" className="relative h-[90vh] bg-black overflow-hidden flex items-center">
      <motion.div 
        className="absolute inset-0 w-full h-full"
        animate={{ 
          scale: [1, 1.15, 1],
          x: ['0%', '-2%', '0%']
        }}
        transition={{ 
          duration: 30, 
          repeat: Infinity,
          ease: "linear" 
        }}
      >
        <img 
          src={IMG_STOVE} 
          alt="Gas Stove Leak" 
          className="w-full h-full object-cover opacity-40"
        />
      </motion.div>
      
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
          >
            <div className="flex items-center gap-3 text-red-500 mb-6 bg-red-500/10 w-fit px-4 py-2 rounded-full border border-red-500/20">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-semibold tracking-wider uppercase text-sm">The Hidden Threat</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              An unseen danger <br/> in your safe haven.
            </h2>
            <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
              LPG gas leaks happen slowly, filling the space with an invisible, silent risk. A single flickering flame in a compromised environment can turn tension into disaster in seconds.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-red-400 bg-red-500/10 border border-red-500/20 p-5 rounded-2xl backdrop-blur-sm">
              <Wind className="w-8 h-8 animate-pulse shrink-0" />
              <p className="font-medium text-sm md:text-base">Vapor spread detected. Environment volatile. Immediate action required.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const FeatureSection = () => {
  return (
    <section id="features" className="relative py-32 bg-zinc-950 overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-600/5 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Smart Defense, Real-Time Alerts</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Advanced sensors monitor your kitchen 24/7. The moment an anomaly is detected, your smart device acts instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative order-2 lg:order-1"
          >
            <div className="absolute inset-0 bg-orange-500/20 blur-[80px] rounded-full" />
            <div className="relative rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
              <img src={IMG_APP} alt="Smartphone on counter" className="w-full h-auto aspect-[4/5] md:aspect-auto object-cover" />
              
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute top-6 left-6 right-6 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:w-80 bg-black/80 backdrop-blur-xl border border-red-500/50 rounded-2xl p-4 shadow-[0_0_30px_rgba(239,68,68,0.3)]"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-red-500/20 p-3 rounded-full shrink-0">
                    <BellRing className="text-red-500 w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-red-500 font-bold text-lg">Gas Leak Detected!</h4>
                    <p className="text-gray-300 text-sm">Critical: High concentration</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex items-center gap-5"
              >
                <div className="bg-orange-500/20 p-3 rounded-full">
                  <Activity className="text-orange-500 w-6 h-6" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm font-medium">Cylinder Level</p>
                  <p className="text-white text-2xl font-bold">42%</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <div className="grid gap-6 md:gap-8 order-1 lg:order-2">
            {[
              { icon: Zap, title: "Instant Detection", desc: "Highly sensitive sensors detect LPG traces before they become a hazard, analyzing air quality continuously." },
              { icon: Smartphone, title: "Mobile Notifications", desc: "Get critical alerts directly to your phone. Whether you're in the living room or at work, you're always informed." },
              { icon: ShieldCheck, title: "Auto-Shutoff Protocol", desc: "The smart regulator automatically cuts off gas flow the exact moment a leak is confirmed, preventing disaster." }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-6 p-6 sm:p-8 rounded-[2rem] bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-colors"
              >
                <div className="bg-orange-500/10 p-4 rounded-2xl h-fit shrink-0">
                  <feature.icon className="w-8 h-8 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed text-lg">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const SafetySection = () => {
  return (
    <section id="safety" className="relative h-screen bg-stone-100 flex items-center overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <img 
          src={IMG_SAFE} 
          alt="Clean bright kitchen" 
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-50/95 via-stone-50/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-50/90 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="max-w-2xl"
        >
          <div className="flex items-center gap-3 text-emerald-700 mb-8 bg-emerald-100/80 backdrop-blur-md w-fit px-5 py-2.5 rounded-full border border-emerald-200 shadow-sm">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-semibold tracking-wide text-sm uppercase">Safe – No Leak Detected</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-stone-800 mb-6 leading-tight">
            Peace of mind <br/> in every meal.
          </h2>
          <p className="text-xl md:text-2xl text-stone-600 mb-10 leading-relaxed">
            A stable flame, a bright room, and zero worries. Ignis Secura works silently in the background, ensuring your kitchen remains the heart of your home—safe, warm, and secure.
          </p>
          
          <div className="bg-white/80 backdrop-blur-xl border border-white p-6 md:p-8 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.05)] flex items-center gap-6 max-w-md">
            <div className="bg-emerald-100 p-4 rounded-full text-emerald-600 shrink-0">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-stone-800 font-bold text-lg md:text-xl">System Active & Secure</h4>
              <p className="text-stone-500 font-medium mt-1">Status: All Clear • Checked just now</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const FooterSection = () => {
  return (
    <section className="relative py-32 bg-black overflow-hidden flex flex-col items-center justify-center text-center">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[800px] h-[600px] md:h-[800px] bg-orange-600/10 blur-[100px] rounded-full pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
        className="relative z-10 w-48 h-48 md:w-56 md:h-56 mb-12 rounded-full overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(234,88,12,0.2)]"
      >
        <motion.img 
          src={IMG_SMART_DEVICE} 
          alt="Product glow"
          className="w-full h-full object-cover"
          animate={{ rotate: -360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute inset-0 bg-orange-500/10 mix-blend-overlay rounded-full" />
      </motion.div>

      <div className="relative z-10 space-y-6 max-w-3xl px-6">
        <h2 className="text-5xl md:text-6xl font-bold text-white tracking-tight">
          Ignis Secura <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 font-light text-3xl md:text-4xl block mt-6">Protecting Every Flame</span>
        </h2>
        <p className="text-xl md:text-2xl text-gray-500 tracking-wide font-light">Smart Safety for Every Home</p>
        
        <div className="pt-10">
          <button className="bg-white text-black hover:bg-gray-200 hover:scale-105 active:scale-95 px-10 py-4 rounded-full font-bold text-lg transition-all shadow-[0_0_40px_rgba(255,255,255,0.15)]">
            Pre-order Now
          </button>
        </div>
      </div>

      <div className="relative z-10 mt-32 border-t border-white/10 w-full max-w-6xl flex flex-col md:flex-row justify-between items-center gap-6 pt-8 px-8 text-gray-500 text-sm">
        <div className="flex items-center gap-2">
          <img src={logoImage} alt="Ignis Secura Logo" className="h-6 object-contain grayscale opacity-50" />
          <p>&copy; 2026 Ignis Secura. All rights reserved.</p>
        </div>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
        </div>
      </div>
    </section>
  );
};

export default function App() {
  return (
    <div className="font-sans bg-black text-white antialiased selection:bg-orange-500/30">
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <FeatureSection />
      <SafetySection />
      <FooterSection />
    </div>
  );
}