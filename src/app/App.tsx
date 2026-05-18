import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Smartphone, 
  BellRing, 
  Wind, 
  Activity,
  AlertTriangle,
  CheckCircle2,
  Zap,
  User as UserIcon,
  Flame,
  Award,
  Sparkles,
  Gauge,
  Cpu,
  Wifi,
  Star,
  Users,
  TrendingUp,
  Clock,
  Shield,
  Check,
  ArrowRight,
  Menu,
  X
} from 'lucide-react';
import PreOrderPage from './PreOrderPage';
import logoImage from '../assets/icon.png';
import heroDeviceImage from '../assets/gas.png';
import AuthModal from './components/AuthModal';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PaymentProvider } from './context/PaymentContext';

// Updated imagery
const IMG_HERO_DEVICE = heroDeviceImage;
const IMG_STOVE = "https://images.unsplash.com/photo-1607324772107-8ad6740ca195?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";
const IMG_APP_SCREEN = "https://images.unsplash.com/photo-1616348436168-de43ad0db179?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";
const IMG_SAFE_KITCHEN = "https://images.unsplash.com/photo-1556911220-bff31c812dba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";
const IMG_TESTIMONIAL1 = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400";
const IMG_TESTIMONIAL2 = "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400";
const IMG_TESTIMONIAL3 = "https://images.unsplash.com/photo-1560250097-0b93528c311a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400";

interface NavbarProps {
  onPreOrderClick: () => void;
  onAuthClick: () => void;
  onDashboardClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onPreOrderClick, onAuthClick, onDashboardClick }) => {
  const { isAuthenticated, user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const backgroundColor = useTransform(scrollY, [0, 100], ['rgba(0,0,0,0)', 'rgba(0,0,0,0.95)']);
  const backdropBlur = useTransform(scrollY, [0, 100], ['blur(0px)', 'blur(16px)']);

  // Smooth scroll handler
  const handleScrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <motion.nav 
      style={{ backgroundColor, backdropFilter: backdropBlur }}
      className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-4 md:px-12 md:py-5 border-b border-white/5 text-white transition-all"
    >
      <div className="flex items-center gap-2 cursor-pointer" onClick={handleScrollTo('hero')}>
        <img src={logoImage} alt="Ignis Secura" className="h-10 md:h-12 object-contain drop-shadow-lg" />
        <span className="font-bold text-xl bg-gradient-to-r from-white to-orange-300 bg-clip-text text-transparent hidden sm:inline-block">Ignis Secura</span>
      </div>
      
      {/* Desktop Navigation */}
      <div className="hidden md:flex gap-10 text-sm font-medium text-white/70">
        <a href="#hero" onClick={handleScrollTo('hero')} className="hover:text-white transition-colors">Home</a>
        <a href="#problem" onClick={handleScrollTo('problem')} className="hover:text-white transition-colors">The Risk</a>
        <a href="#features" onClick={handleScrollTo('features')} className="hover:text-white transition-colors">Features</a>
        <a href="#how-it-works" onClick={handleScrollTo('how-it-works')} className="hover:text-white transition-colors">How It Works</a>
        <a href="#testimonials" onClick={handleScrollTo('testimonials')} className="hover:text-white transition-colors">Testimonials</a>
        <a href="#safety" onClick={handleScrollTo('safety')} className="hover:text-white transition-colors">Safety</a>
      </div>

      <div className="flex items-center gap-3">
        {isAuthenticated ? (
          <>
            <button
              onClick={onDashboardClick}
              className="hidden md:flex items-center gap-2 bg-white/10 hover:bg-white/20 px-5 py-2 rounded-full transition-all"
            >
              <UserIcon className="w-4 h-4" />
              <span className="text-sm">{user?.name}</span>
            </button>
            <button 
              onClick={onPreOrderClick}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white px-6 py-2 rounded-full font-medium transition-all shadow-[0_0_20px_rgba(234,88,12,0.4)]"
            >
              Pre-order
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onAuthClick}
              className="hidden md:block bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full font-medium transition-all"
            >
              Sign In
            </button>
            <button 
              onClick={onPreOrderClick}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white px-6 py-2 rounded-full font-medium transition-all shadow-[0_0_20px_rgba(234,88,12,0.4)]"
            >
              Pre-order
            </button>
          </>
        )}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-white">
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-black/95 backdrop-blur-xl border-b border-white/10 py-6 px-6 flex flex-col gap-4 md:hidden"
          >
            <a href="#hero" onClick={handleScrollTo('hero')} className="text-white/80 hover:text-white py-2">Home</a>
            <a href="#problem" onClick={handleScrollTo('problem')} className="text-white/80 hover:text-white py-2">The Risk</a>
            <a href="#features" onClick={handleScrollTo('features')} className="text-white/80 hover:text-white py-2">Features</a>
            <a href="#how-it-works" onClick={handleScrollTo('how-it-works')} className="text-white/80 hover:text-white py-2">How It Works</a>
            <a href="#testimonials" onClick={handleScrollTo('testimonials')} className="text-white/80 hover:text-white py-2">Testimonials</a>
            <a href="#safety" onClick={handleScrollTo('safety')} className="text-white/80 hover:text-white py-2">Safety</a>
            {!isAuthenticated && (
              <button onClick={() => { onAuthClick(); setIsMenuOpen(false); }} className="bg-white/10 text-white px-6 py-2 rounded-full font-medium w-full">
                Sign In
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

// Floating particles component
const FloatingParticles = () => {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 10,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute bg-orange-500/30 rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            top: '-10%',
          }}
          animate={{
            y: ['0vh', '120vh'],
            x: [`${Math.random() * 20 - 10}px`, `${Math.random() * 20 - 10}px`],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
};

const HeroSection = ({ onPreOrderClick }: { onPreOrderClick: () => void }) => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section id="hero" className="relative min-h-screen bg-black flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(234,88,12,0.2)_0%,_rgba(0,0,0,1)_70%)]" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/grain.svg')] opacity-20" />
      <FloatingParticles />
      
      <motion.div style={{ y, opacity }} className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-32 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span className="text-sm text-orange-300 font-medium">Next-Gen Kitchen Safety</span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight leading-[1.1] mb-6">
              Smart Protection
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 block">For Every Flame</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-lg mb-8 leading-relaxed">
              Ignis Secura combines AI-driven gas detection with instant alerts and auto shut-off. 
              Keep your family safe 24/7 with the world's most intelligent gas regulator.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={onPreOrderClick}
                className="group bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-[0_0_30px_rgba(234,88,12,0.5)] flex items-center justify-center gap-2"
              >
                Pre-order Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <a href="#features" className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all text-center backdrop-blur-sm">
                Explore Features
              </a>
            </div>
            <div className="flex items-center gap-8 mt-10">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-500" />
                <span className="text-white/80 text-sm">Certified Safe</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-500" />
                <span className="text-white/80 text-sm">10k+ Pre-orders</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                <span className="text-white/80 text-sm">98% Accuracy</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: 30 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.4, type: "spring" }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden border border-white/20 shadow-2xl shadow-orange-500/20">
              <img src={IMG_HERO_DEVICE} alt="Ignis Secura Smart Device" className="w-full h-auto object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <motion.div 
                animate={{ scale: [1, 1.05, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-red-500/20 blur-2xl rounded-3xl -z-10"
              />
            </div>
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -bottom-6 -left-6 bg-black/80 backdrop-blur-xl rounded-2xl p-4 border border-white/10 shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="bg-green-500/20 p-2 rounded-full">
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">System Active</p>
                  <p className="text-green-400 text-xs">All sensors normal</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

const ProblemSection = () => {
  return (
    <section id="problem" className="relative py-28 md:py-40 bg-black overflow-hidden">
      <motion.div 
        className="absolute inset-0"
        initial={{ scale: 1 }}
        whileInView={{ scale: 1.05 }}
        transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
      >
        <img src={IMG_STOVE} alt="Gas hazard" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-transparent" />
      </motion.div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <div className="flex items-center gap-3 text-red-500 mb-6 bg-red-500/10 w-fit px-5 py-2.5 rounded-full border border-red-500/20">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-semibold tracking-wider uppercase text-sm">The Silent Threat</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Every year, <span className="text-red-500">thousands</span> of preventable<br />accidents happen at home.
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
            LPG leaks are invisible, odorless in early stages, and can escalate within minutes. 
            Traditional regulators offer no protection against leaks, leaving your family vulnerable.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 text-white bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <Wind className="w-6 h-6 text-red-400" />
              <span className="font-medium">Undetectable vapors</span>
            </div>
            <div className="flex items-center gap-3">
              <Flame className="w-6 h-6 text-red-400" />
              <span className="font-medium">Ignition risk</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-red-400" />
              <span className="font-medium">Seconds to danger</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const FeatureSection = () => {
  const features = [
    { icon: Zap, title: "Instant Detection", desc: "High-sensitivity LPG sensor detects leaks at 0.1% concentration within 2 seconds.", color: "orange" },
    { icon: Smartphone, title: "Real-time Alerts", desc: "Push notifications to your phone, even when you're away from home.", color: "blue" },
    { icon: ShieldCheck, title: "Auto Shut-off", desc: "Smart regulator cuts gas flow immediately upon leak confirmation.", color: "green" },
    { icon: Gauge, title: "Usage Analytics", desc: "Track gas consumption and receive refill reminders.", color: "purple" },
    { icon: Cpu, title: "AI Learning", desc: "Adapts to your usage patterns for smarter leak detection.", color: "pink" },
    { icon: Wifi, title: "Cloud Connected", desc: "24/7 monitoring with emergency response integration.", color: "indigo" },
  ];

  return (
    <section id="features" className="relative py-28 bg-gradient-to-b from-black to-zinc-950 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-orange-600/10 blur-[150px] rounded-full" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Intelligent Safety, <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">Uncompromising Protection</span></h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Cutting-edge technology that works silently in the background, protecting what matters most.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="group relative bg-white/[0.03] border border-white/5 rounded-2xl p-8 hover:bg-white/[0.06] transition-all hover:border-orange-500/30"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-orange-500/0 group-hover:from-orange-500/5 group-hover:to-red-500/5 rounded-2xl transition-all" />
              <div className="relative">
                <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 p-3 rounded-xl w-fit mb-5">
                  <feature.icon className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorksSection = () => {
  const steps = [
    { title: "Install", desc: "Replace your old regulator with Ignis Secura in minutes. No tools required.", icon: CheckCircle2 },
    { title: "Connect", desc: "Pair with the mobile app via Bluetooth or WiFi for full control.", icon: Wifi },
    { title: "Monitor", desc: "Real-time dashboard shows gas levels, usage, and system status.", icon: Activity },
    { title: "Protect", desc: "Instant alerts and auto shut-off keep your home safe 24/7.", icon: ShieldCheck },
  ];

  return (
    <section id="how-it-works" className="relative py-28 bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">Works</span></h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Simple setup, powerful protection.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="text-center"
            >
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full blur-xl" />
                <div className="relative bg-gradient-to-br from-orange-600 to-red-600 rounded-full w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                  {idx + 1}
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-gray-400">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TestimonialsSection = () => {
  const testimonials = [
    { name: "Michael Chen", role: "Homeowner", image: IMG_TESTIMONIAL1, text: "The auto shut-off activated during a small leak while we were asleep. It gave us absolute peace of mind.", rating: 5 },
    { name: "Sarah Johnson", role: "Mother of 3", image: IMG_TESTIMONIAL2, text: "Knowing that my phone alerts me instantly if something goes wrong in the kitchen is a game-changer.", rating: 5 },
    { name: "David Okonkwo", role: "Property Manager", image: IMG_TESTIMONIAL3, text: "I've installed Ignis Secura in all my rental properties. It's the best safety investment I've made.", rating: 5 },
  ];

  return (
    <section id="testimonials" className="relative py-28 bg-zinc-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-orange-500/10 rounded-full px-4 py-2 mb-4">
            <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
            <span className="text-orange-300 text-sm">Trusted by families</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">Customers</span> Say</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white/[0.03] border border-white/5 rounded-2xl p-6"
            >
              <div className="flex items-center gap-4 mb-4">
                <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <h4 className="text-white font-semibold">{t.name}</h4>
                  <p className="text-gray-400 text-sm">{t.role}</p>
                </div>
              </div>
              <div className="flex gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-orange-500 text-orange-500" />
                ))}
              </div>
              <p className="text-gray-300 leading-relaxed">"{t.text}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const SafetySection = () => {
  return (
    <section id="safety" className="relative min-h-[80vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={IMG_SAFE_KITCHEN} alt="Safe modern kitchen" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-50/95 via-stone-50/70 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-20">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="max-w-xl"
        >
          <div className="flex items-center gap-3 text-emerald-700 mb-8 bg-emerald-100/90 backdrop-blur-md w-fit px-5 py-2.5 rounded-full border border-emerald-200 shadow-sm">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-semibold tracking-wide text-sm uppercase">Protected Environment</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-stone-800 mb-6 leading-tight">
            Peace of mind<br />in every meal.
          </h2>
          <p className="text-xl md:text-2xl text-stone-600 mb-10 leading-relaxed">
            A stable flame, a bright room, and zero worries. Ignis Secura works silently in the background, 
            ensuring your kitchen remains the heart of your home—safe, warm, and secure.
          </p>
          
          <div className="bg-white/80 backdrop-blur-xl border border-white p-6 rounded-3xl shadow-xl flex items-center gap-6 max-w-md">
            <div className="bg-emerald-100 p-4 rounded-full text-emerald-600 shrink-0">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-stone-800 font-bold text-xl">System Active & Secure</h4>
              <p className="text-stone-500 font-medium mt-1">Status: All Clear • 24/7 Monitoring</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const CTASection = ({ onPreOrderClick }: { onPreOrderClick: () => void }) => {
  return (
    <section className="relative py-28 bg-gradient-to-r from-orange-600 to-red-600 overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/grain.svg')] opacity-10" />
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Ready to Protect Your Home?</h2>
          <p className="text-xl text-orange-100 mb-10 max-w-2xl mx-auto">
            Join thousands of families who've made the switch to intelligent gas safety. Limited early-bird units available.
          </p>
          <button 
            onClick={onPreOrderClick}
            className="bg-white text-orange-600 hover:bg-gray-100 px-10 py-4 rounded-full font-bold text-lg transition-all shadow-xl hover:scale-105"
          >
            Claim Your Pre-order Now
          </button>
          <p className="text-orange-100 text-sm mt-6">Free shipping • 30-day money-back guarantee</p>
        </motion.div>
      </div>
    </section>
  );
};

const FooterSection = () => {
  return (
    <footer className="relative py-16 bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img src={logoImage} alt="Ignis Secura" className="h-10 object-contain" />
              <span className="font-bold text-xl bg-gradient-to-r from-white to-orange-300 bg-clip-text text-transparent">Ignis Secura</span>
            </div>
            <p className="text-gray-400 max-w-md">
              Revolutionizing kitchen safety with AI-powered gas detection and smart auto shut-off technology.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#features" className="hover:text-white transition">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition">How it works</a></li>
              <li><a href="#safety" className="hover:text-white transition">Safety</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition">About</a></li>
              <li><a href="#" className="hover:text-white transition">Contact</a></li>
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
          <p>&copy; 2026 Ignis Secura. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition">Terms</a>
            <a href="#" className="hover:text-white transition">Privacy</a>
            <a href="#" className="hover:text-white transition">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

function AppContent() {
  const [showPreOrder, setShowPreOrder] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const { isAuthenticated } = useAuth();

  // Secret admin access
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        setShowAdmin(true);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handlePreOrder = () => setShowPreOrder(true);

  return (
    <>
      <div className="font-sans bg-black text-white antialiased selection:bg-orange-500/30 overflow-x-hidden">
        <Navbar 
          onPreOrderClick={handlePreOrder}
          onAuthClick={() => setShowAuth(true)}
          onDashboardClick={() => setShowDashboard(true)}
        />
        <HeroSection onPreOrderClick={handlePreOrder} />
        <ProblemSection />
        <FeatureSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <SafetySection />
        <CTASection onPreOrderClick={handlePreOrder} />
        <FooterSection />
      </div>
      
      <AnimatePresence>
        {showPreOrder && <PreOrderPage onClose={() => setShowPreOrder(false)} onAuthClick={() => setShowAuth(true)} />}
        {showAuth && <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />}
        {showDashboard && isAuthenticated && <UserDashboard onClose={() => setShowDashboard(false)} />}
        {showAdmin && <AdminDashboard onClose={() => setShowAdmin(false)} />}
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <PaymentProvider>
        <AppContent />
      </PaymentProvider>
    </AuthProvider>
  );
}