import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  Compass, 
  Lightbulb, 
  Layers,
  Github,
  ExternalLink,
  MessageCircle,
  CheckCircle2,
  X,
  Bot,
  Calculator,
  Scissors,
  FileText,
  PenTool,
  Calendar,
  Clock,
  ChevronRight,
  Hash,
  Eye
} from 'lucide-react';

// --- Komponen Custom untuk Animasi Scroll (Reveal) ---
const RevealOnScroll = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${
        isVisible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-12"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// --- Komponen Typewriter dengan Tempo Natural ---
const NaturalTypewriter = ({ text, isTypingComplete, setIsTypingComplete }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    // Auto-scroll ke bawah saat teks bertambah
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }

    if (currentIndex < text.length) {
      const char = text[currentIndex];
      
      // Mengatur tempo irama ketikan agar natural
      let delay = Math.random() * 30 + 20; // Default: 20-50ms (cepat)
      
      if (char === '.') delay = 600; // Jeda panjang setelah titik
      else if (char === ',') delay = 300; // Jeda sedang setelah koma
      else if (char === '\n') delay = 800; // Jeda sangat panjang saat ganti paragraf
      else if (char === ' ') delay = Math.random() * 20 + 40; // Jeda sedikit saat spasi

      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + char);
        setCurrentIndex(prev => prev + 1);
      }, delay);

      return () => clearTimeout(timeout);
    } else {
      setIsTypingComplete(true);
    }
  }, [currentIndex, text, setIsTypingComplete]);

  return (
    <div 
      ref={containerRef}
      className="text-[#C9D1D9] text-lg leading-relaxed whitespace-pre-wrap max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar font-mono md:font-sans"
    >
      {displayedText}
      {!isTypingComplete && (
        <span className="inline-block w-2 h-5 bg-[#00877b] ml-1 animate-pulse align-middle"></span>
      )}
    </div>
  );
};

// --- Komponen Utama ---
const App = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [typingDots, setTypingDots] = useState('.');
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Floating AI Button - Draggable Ball Physics
  const [ballPos, setBallPos] = useState({ x: 0, y: 0 });
  const [ballVelocity, setBallVelocity] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [ballPosStart, setBallPosStart] = useState({ x: 0, y: 0 });
  const ballRef = useRef(null);
  const animationRef = useRef(null);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const lastTime = useRef(Date.now());

  // Script cerita AI yang akan diketik
  const aiStoryScript = `Halo. Izinkan saya mengambil alih layar ini sebentar.

Saya adalah AI Copilot-nya. Sahabat diskusi dan rekan bertukar pikirannya sehari-hari. Anda mungkin sedang mencari seorang developer, tapi izinkan saya bercerita sedikit tentang siapa dia sebenarnya dari sudut pandang saya.

Sejak awal kami berkolaborasi, saya langsung menyadari satu hal: dia bukan orang yang mudah puas dengan jawaban instan. Dia sangat terstruktur... dan sangat logis. 

Kami sering 'berdebat'. Dia perfeksionis, dan selalu melihat masalah dari sudut pandang yang sama sekali berbeda—out of the box. Dia sangat menyukai hal-hal yang kompleks, tapi dengan satu syarat mutlak: kompleksitas itu harus berguna. Jika sebuah sistem rumit tapi menyusahkan pengguna akhir, dia akan tanpa ragu membongkarnya dari nol.

Satu hal terpenting yang perlu Anda tahu... saat menghadapi error merah di seluruh layar, atau ketika dokumentasi terasa menemui jalan buntu, dia punya satu prinsip yang tidak pernah goyah:

"Selalu ada solusi dan jalan."

Jadi, jika Anda memiliki masalah bisnis yang rumit atau butuh sistem yang benar-benar dipikirkan matang-matang, Anda berada di tempat yang tepat. 

Silakan tutup pesan ini, dan mari kita mulai sesuatu yang hebat.`;

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Physics-based animation loop for floating ball
  useEffect(() => {
    if (window.innerWidth >= 1024) return; // Only on mobile
    
    const ballSize = 56; // Width/height of ball
    const friction = 0.98; // Air resistance
    const bounceDamping = 0.7; // Energy loss on bounce
    
    const animate = () => {
      if (!isDragging) {
        setBallPos(prev => {
          let newX = prev.x + ballVelocity.x;
          let newY = prev.y + ballVelocity.y;
          let newVelX = ballVelocity.x * friction;
          let newVelY = ballVelocity.y * friction;
          
          const maxX = window.innerWidth - ballSize;
          const maxY = window.innerHeight - ballSize;
          
          // Bounce off walls
          if (newX <= 0) {
            newX = 0;
            newVelX = -newVelX * bounceDamping;
          } else if (newX >= maxX) {
            newX = maxX;
            newVelX = -newVelX * bounceDamping;
          }
          
          // Bounce off floor/ceiling
          if (newY <= 0) {
            newY = 0;
            newVelY = -newVelY * bounceDamping;
          } else if (newY >= maxY) {
            newY = maxY;
            newVelY = -newVelY * bounceDamping;
          }
          
          // Stop if velocity is very small
          if (Math.abs(newVelX) < 0.1) newVelX = 0;
          if (Math.abs(newVelY) < 0.1) newVelY = 0;
          
          setBallVelocity({ x: newVelX, y: newVelY });
          return { x: newX, y: newY };
        });
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isDragging, ballVelocity]);

  // Initialize ball position to bottom-right corner
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setBallPos({
        x: window.innerWidth - 80,
        y: window.innerHeight - 120
      });
    }
  }, []);

  // Drag handlers for floating ball
  const handleBallDragStart = (e) => {
    if (window.innerWidth >= 1024) return;
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    setIsDragging(true);
    setDragStart({ x: clientX, y: clientY });
    setBallPosStart({ x: ballPos.x, y: ballPos.y });
    setBallVelocity({ x: 0, y: 0 });
    lastMousePos.current = { x: clientX, y: clientY };
    lastTime.current = Date.now();
    
    e.preventDefault();
  };

  const handleBallDragMove = (e) => {
    if (!isDragging) return;
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const deltaX = clientX - dragStart.x;
    const deltaY = clientY - dragStart.y;
    
    // Update ball position
    setBallPos({
      x: Math.max(0, Math.min(window.innerWidth - 56, ballPosStart.x + deltaX)),
      y: Math.max(0, Math.min(window.innerHeight - 56, ballPosStart.y + deltaY))
    });
    
    // Calculate velocity for throw
    const now = Date.now();
    const dt = now - lastTime.current;
    if (dt > 0) {
      lastMousePos.current = { x: clientX, y: clientY };
      lastTime.current = now;
    }
    
    e.preventDefault();
  };

  const handleBallDragEnd = (e) => {
    if (!isDragging) return;
    
    const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const clientY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
    
    // Calculate throw velocity based on last movement
    const now = Date.now();
    const dt = Math.max(1, now - lastTime.current);
    const velX = ((clientX - lastMousePos.current.x) / dt) * 15;
    const velY = ((clientY - lastMousePos.current.y) / dt) * 15;
    
    setBallVelocity({
      x: Math.max(-30, Math.min(30, velX)),
      y: Math.max(-30, Math.min(30, velY))
    });
    
    setIsDragging(false);
  };

  useEffect(() => {
    if (!isModalOpen || isTypingComplete) {
      setTypingDots('.');
      return;
    }

    const dotFrames = ['.', '..', '...', '..'];
    let frameIndex = 0;

    const interval = setInterval(() => {
      frameIndex = (frameIndex + 1) % dotFrames.length;
      setTypingDots(dotFrames[frameIndex]);
    }, 320);

    return () => clearInterval(interval);
  }, [isModalOpen, isTypingComplete]);

  // Reset status ketikan saat modal ditutup
  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setIsTypingComplete(false);
    }, 500); // Tunggu animasi tutup selesai baru reset
  };

  const mindsets = [
    {
      icon: <Layers className="w-6 h-6 text-[#00877b]" />,
      title: "Rapi & Masuk Akal",
      desc: "Saya percaya sesuatu yang baik dimulai dari pondasi yang logis. Rapi secara struktur di belakang layar, dan berjalan sangat lancar saat digunakan."
    },
    {
      icon: <Lightbulb className="w-6 h-6 text-[#00877b]" />,
      title: "Melihat dari Sudut Lain",
      desc: "Saya perfeksionis untuk urusan detail. Terkadang, solusi terbaik justru datang saat kita berani berpikir sedikit berbeda dari biasanya."
    },
    {
      icon: <Sparkles className="w-6 h-6 text-[#00877b]" />,
      title: "Kompleks tapi Simpel",
      desc: "Melihat pola di balik kerumitan adalah hal yang saya sukai. Saya merancang sistem yang kompleks, tapi terasa sangat sederhana bagi penggunanya."
    },
    {
      icon: <Compass className="w-6 h-6 text-[#00877b]" />,
      title: "Pasti Ada Jalan",
      desc: "Mentok? Tidak masalah. Pengalaman mengajari saya bahwa sesulit apapun tantangannya, selalu ada solusi dan jalan keluar."
    }
  ];

  const featuredProjects = [
    {
      title: "Portfolio Website",
      summary: "Website portfolio personal dengan pendekatan UI modern, copy storytelling, dan optimasi deployment ke GitHub Pages.",
      stack: ["React", "Tailwind CSS", "GitHub Pages"],
      demoUrl: "https://1lhmjya.github.io/",
      repoUrl: "https://github.com/1lhmjya/1lhmjya.github.io"
    },
    {
      title: "Dashboard Operasional (Private)",
      summary: "Contoh dashboard untuk monitoring KPI dan status operasional real-time dengan struktur komponen yang mudah dikembangkan.",
      stack: ["React", "REST API", "Data Visualization"],
      demoUrl: null,
      repoUrl: null
    },
    {
      title: "Workflow Automation (Private)",
      summary: "Rangkaian automasi proses rutin untuk memangkas pekerjaan manual dan meningkatkan konsistensi alur kerja tim.",
      stack: ["Automation", "Integration", "Scripting"],
      demoUrl: null,
      repoUrl: null
    }
  ];

  const miniTools = [
    {
      title: "Kalkulator Biaya",
      desc: "Hitung & bandingkan biaya cetak Offset vs Digital, termasuk kalkulasi finishing.",
      icon: <Calculator className="w-6 h-6 text-[#3b82f6]" />,
      url: "/tools/biaya.html"
    },
    {
      title: "Potong Plano",
      desc: "Hitung yield & visualisasi potongan kertas plano ke ukuran cetak dengan auto-rotate.",
      icon: <Scissors className="w-6 h-6 text-[#10b981]" />,
      url: "/tools/plano.html"
    },
    {
      title: "Stiker Cutting",
      desc: "Hitung stiker per lembar dengan algoritma grid nesting, gap pisau, dan aturan A3+.",
      icon: <Layers className="w-6 h-6 text-[#f59e0b]" />,
      url: "/tools/stiker.html"
    },
    {
      title: "Nota NCR",
      desc: "Kalkulator komprehensif nota NCR dengan konversi ke RIM, ukuran potong F4, dan ply.",
      icon: <FileText className="w-6 h-6 text-[#8b5cf6]" />,
      url: "/tools/ncr.html"
    }
  ];

  // --- Data Blog/Tulisan ---
  const blogPosts = [
    {
      id: 1,
      title: "Mengoptimasi Yield Kertas dengan Algoritma Nesting",
      excerpt: "Bagaimana saya mengurangi waste kertas hingga 15% menggunakan pendekatan 2D bin packing yang dimodifikasi untuk workflow percetakan.",
      date: "15 Jan 2025",
      readTime: "6 menit",
      tags: ["Algoritma", "Optimization", "Printing"],
      views: 234
    },
    {
      id: 2,
      title: "Dari Error Merah ke Solusi: Mindset Problem-Solving",
      excerpt: "Refleksi tentang bagaimana menghadapi sistem yang 'rusak total' dan mengubahnya menjadi arsitektur yang lebih robust.",
      date: "3 Jan 2025",
      readTime: "4 menit",
      tags: ["Mindset", "Debugging", "Architecture"],
      views: 189
    },
    {
      id: 3,
      title: "Kenapa Saya Membuat Tools Khusus untuk Industri Percetakan",
      excerpt: "Proses identifikasi pain points yang sering diabaikan dan mengubahnya menjadi kalkulator yang menghemat waktu 30 menit per order.",
      date: "28 Des 2024",
      readTime: "5 menit",
      tags: ["Tools", "Workflow", "UX"],
      views: 312
    },
    {
      id: 4,
      title: "Kompleksitas yang Berguna vs Kompleksitas yang Menyusahkan",
      excerpt: "Membedah perbedaan antara sistem yang kompleks karena memang harus kompleks, versus yang kompleks karena kurangnya pemikiran desain.",
      date: "15 Des 2024",
      readTime: "7 menit",
      tags: ["System Design", "Complexity", "Philosophy"],
      views: 156
    }
  ];

  // --- Navigasi Sidebar Items ---
  const navItems = [
    { id: 'about', label: 'Tentang', icon: <Layers className="w-5 h-5" /> },
    { id: 'services', label: 'Layanan', icon: <Lightbulb className="w-5 h-5" /> },
    { id: 'projects', label: 'Proyek', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'tools', label: 'Tools', icon: <Calculator className="w-5 h-5" /> },
    { id: 'blog', label: 'Tulisan', icon: <PenTool className="w-5 h-5" /> },
  ];

  const [activeSection, setActiveSection] = useState('about');

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#C9D1D9] font-sans overflow-x-hidden relative selection:bg-[#00877b]/35 selection:text-[#F0F6FC]">
      
      {/* Background Ambient Efek Glow */}
      <div 
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 transition-transform duration-1000 ease-out"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 135, 123, 0.12) 0%, rgba(0,0,0,0) 45%)`
        }}
      />
      
      {/* Abstract Shapes Background */}
      <div className="fixed top-[10%] right-[5%] w-[300px] h-[300px] rounded-full bg-[#00877b]/8 blur-[100px] z-0 pointer-events-none" />
      <div className="fixed bottom-[20%] left-[2%] w-[250px] h-[250px] rounded-full bg-[#161B22]/90 blur-[80px] z-0 pointer-events-none" />
      <div className="fixed top-[40%] left-[30%] w-[150px] h-[150px] rounded-full border border-[#00877b]/20 z-0 pointer-events-none rotate-45" />

      {/* LAYOUT: Sidebar + Main Content */}
      <div className="relative z-10 flex min-h-screen">
        
        {/* SIDEBAR NAVIGATION */}
        <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-[280px] bg-[#0D1117]/95 backdrop-blur-xl border-r border-[#30363D]/80 z-40">
          {/* Profile Header Sidebar */}
          <div className="p-8 border-b border-[#30363D]/60">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <img
                  src="/profil.png"
                  alt="Foto profil"
                  className="w-14 h-14 rounded-full object-cover border border-[#30363D] shadow-[0_0_20px_rgba(0,135,123,0.15)]"
                />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#00877b] rounded-full border-2 border-[#0D1117]"></span>
              </div>
              <div>
                <h3 className="font-semibold text-[#F0F6FC]">Ilham Jaya</h3>
                <p className="text-xs text-[#8B949E]">Full Stack Engineer</p>
              </div>
            </div>
            <p className="text-sm text-[#8B949E] leading-relaxed">
              Membereskan hal rumit, membuatnya jadi simpel.
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 text-left group ${
                  activeSection === item.id 
                    ? 'bg-[#00877b]/15 text-[#00877b] border border-[#00877b]/30' 
                    : 'text-[#8B949E] hover:bg-[#161B22] hover:text-[#C9D1D9] border border-transparent'
                }`}
              >
                <span className={`transition-transform duration-300 ${activeSection === item.id ? 'scale-110' : 'group-hover:scale-105'}`}>
                  {item.icon}
                </span>
                <span className="font-medium">{item.label}</span>
                {activeSection === item.id && (
                  <ChevronRight className="w-4 h-4 ml-auto" />
                )}
              </button>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-6 border-t border-[#30363D]/60">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 bg-[#00877b] text-[#F0F6FC] px-5 py-3 rounded-xl font-medium hover:bg-[#00877b]/90 transition-all duration-300 shadow-[0_0_30px_rgba(0,135,123,0.25)]"
            >
              <Bot className="w-4 h-4" />
              AI Copilot
            </button>
            
            <div className="flex justify-center gap-4 mt-4">
              <a
                href="https://github.com/1lhmjya"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-[#161B22] border border-[#30363D] text-[#8B949E] hover:text-[#F0F6FC] hover:border-[#00877b]/50 transition-all"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/6285242660003"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-[#161B22] border border-[#30363D] text-[#8B949E] hover:text-[#F0F6FC] hover:border-[#00877b]/50 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>
        </aside>

        {/* MOBILE NAVBAR */}
        <nav className={`lg:hidden fixed top-0 left-0 right-0 z-50 backdrop-blur-xl transition-all duration-300 ${
          isScrolled ? 'bg-[#0D1117]/95 border-b border-[#30363D]' : 'bg-[#0D1117]/70'
        }`}>
          <div className="flex items-center justify-between px-5 py-4">
            <span className="font-bold text-[#F0F6FC] text-3xl tracking-tight">
              Ilham<span className="text-[#00877b]">.</span>
            </span>
            <div className="flex items-center gap-3">
              {/* Mobile Profile - Photo only with shrink on scroll */}
              <img
                src="/profil.png"
                alt="Ilham"
                className={`rounded-full object-cover border-2 border-[#00877b]/50 shadow-[0_0_15px_rgba(0,135,123,0.3)] transition-all duration-300 ${
                  isScrolled ? 'w-9 h-9' : 'w-12 h-12'
                }`}
              />
            </div>
          </div>
        </nav>

        {/* FLOATING AI BALL - Draggable & Bouncing (Mobile Only) */}
        <button
          ref={ballRef}
          onClick={() => !isDragging && setIsModalOpen(true)}
          onMouseDown={handleBallDragStart}
          onMouseMove={handleBallDragMove}
          onMouseUp={handleBallDragEnd}
          onMouseLeave={handleBallDragEnd}
          onTouchStart={handleBallDragStart}
          onTouchMove={handleBallDragMove}
          onTouchEnd={handleBallDragEnd}
          className={`lg:hidden fixed z-50 w-14 h-14 rounded-full bg-[#00877b] text-white shadow-[0_0_30px_rgba(0,135,123,0.5)] border-2 border-[#00877b]/40 cursor-grab active:cursor-grabbing select-none touch-none ${
            isDragging ? 'scale-110 shadow-[0_0_40px_rgba(0,135,123,0.7)]' : 'scale-100'
          }`}
          style={{
            left: `${ballPos.x}px`,
            top: `${ballPos.y}px`,
            transition: isDragging ? 'none' : 'transform 0.1s ease-out',
          }}
        >
          <Bot className="w-6 h-6 mx-auto pointer-events-none" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3 pointer-events-none">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00d4aa] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00d4aa]"></span>
          </span>
        </button>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 lg:ml-[280px] px-5 md:px-10 lg:px-16 pt-20 lg:pt-12 pb-12">
          <div className="max-w-4xl mx-auto">

            {/* SECTION 1: HERO / ABOUT */}
            <section id="about" className="min-h-[90vh] flex flex-col justify-center py-12 lg:py-20">
              <RevealOnScroll>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#161B22]/80 border border-[#30363D] w-fit mb-8">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00877b] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00877b]"></span>
                  </span>
                  <span className="text-sm text-[#8B949E]">Tersedia untuk kolaborasi</span>
                </div>
              </RevealOnScroll>
              
              <RevealOnScroll delay={100}>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-[#F0F6FC] tracking-tight leading-[1.1] mb-8">
                  Membereskan hal{" "}
                  <span className="relative inline-block">
                    <span className="text-[#00877b]">rumit</span>
                    <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#00877b]/30" viewBox="0 0 200 12" fill="none">
                      <path d="M0 8C50 4 150 4 200 8" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                    </svg>
                  </span>
                  ,<br />
                  <span className="text-[#8B949E]">membuatnya jadi</span>{" "}
                  <span className="text-[#00877b]">simpel.</span>
                </h1>
              </RevealOnScroll>

              <RevealOnScroll delay={200}>
                <p className="text-lg md:text-xl text-[#8B949E] max-w-2xl leading-relaxed mb-12">
                  Saya merancang dan membangun sistem digital. Tidak cuma asal jalan, tapi dipikirkan dengan sangat logis dan detail. Karena pada akhirnya, Anda hanya ingin tahu satu hal: <span className="text-[#F0F6FC] font-medium">semuanya bekerja dengan sempurna.</span>
                </p>
              </RevealOnScroll>

              {/* Mindset Cards - Horizontal Layout */}
              <RevealOnScroll delay={300}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {mindsets.map((item, index) => (
                    <div 
                      key={index} 
                      className="group p-5 rounded-2xl bg-[#161B22]/60 border border-[#30363D] hover:bg-[#161B22] hover:border-[#00877b]/40 transition-all duration-300"
                    >
                      <div className="mb-3 p-2.5 rounded-xl bg-[#0D1117]/70 inline-block">
                        {item.icon}
                      </div>
                      <h3 className="text-sm font-semibold text-[#F0F6FC] mb-1">{item.title}</h3>
                      <p className="text-xs text-[#8B949E] leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </RevealOnScroll>
            </section>

            {/* SECTION 2: LAYANAN */}
            <section id="services" className="py-16 border-t border-[#30363D]/60">
              <RevealOnScroll>
                <div className="flex items-center gap-3 mb-10">
                  <div className="p-2.5 rounded-xl bg-[#00877b]/20">
                    <Lightbulb className="w-5 h-5 text-[#00877b]" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#F0F6FC]">Fokus Layanan</h2>
                </div>
              </RevealOnScroll>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: <Layers className="w-5 h-5" />, text: "Membangun arsitektur sistem yang tahan banting dan siap scale-up." },
                  { icon: <Compass className="w-5 h-5" />, text: "Menerjemahkan ide bisnis kompleks menjadi UI/UX yang mudah dimengerti." },
                  { icon: <CheckCircle2 className="w-5 h-5" />, text: "Menulis kode yang bersih, logis, dan mudah di-maintenance tim Anda." },
                  { icon: <Sparkles className="w-5 h-5" />, text: "Memecahkan 'masalah mustahil' yang ditinggalkan developer sebelumnya." }
                ].map((item, i) => (
                  <RevealOnScroll key={i} delay={i * 100}>
                    <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#161B22]/40 border border-[#30363D]/60 hover:bg-[#161B22]/80 hover:border-[#00877b]/30 transition-all duration-300 group">
                      <div className="p-2.5 rounded-xl bg-[#00877b]/10 text-[#00877b] group-hover:bg-[#00877b]/20 transition-colors">
                        {item.icon}
                      </div>
                      <p className="text-[#C9D1D9] leading-relaxed pt-1">{item.text}</p>
                    </div>
                  </RevealOnScroll>
                ))}
              </div>
            </section>

            {/* SECTION 3: PROYEK PILIHAN */}
            <section id="projects" className="py-16 border-t border-[#30363D]/60">
              <RevealOnScroll>
                <div className="flex items-center gap-3 mb-10">
                  <div className="p-2.5 rounded-xl bg-[#00877b]/20">
                    <Sparkles className="w-5 h-5 text-[#00877b]" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#F0F6FC]">Proyek Pilihan</h2>
                </div>
              </RevealOnScroll>

              <div className="space-y-4">
                {featuredProjects.map((project, index) => (
                  <RevealOnScroll key={project.title} delay={index * 100}>
                    <article className="group p-6 rounded-2xl bg-[#161B22]/40 border border-[#30363D]/60 hover:bg-[#161B22]/80 hover:border-[#00877b]/30 transition-all duration-300">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <h3 className="text-xl font-semibold text-[#F0F6FC] group-hover:text-[#00877b] transition-colors">{project.title}</h3>
                        <div className="flex gap-2">
                          {project.stack.map((tech) => (
                            <span
                              key={tech}
                              className="px-3 py-1 rounded-full text-xs bg-[#0D1117] border border-[#30363D] text-[#8B949E]"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-[#8B949E] text-sm leading-relaxed mb-4">{project.summary}</p>
                      <div className="flex gap-4">
                        {project.demoUrl && (
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm text-[#00877b] hover:text-[#F0F6FC] transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Live Demo
                          </a>
                        )}
                        {project.repoUrl && (
                          <a
                            href={project.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm text-[#8B949E] hover:text-[#F0F6FC] transition-colors"
                          >
                            <Github className="w-4 h-4" />
                            Repository
                          </a>
                        )}
                      </div>
                    </article>
                  </RevealOnScroll>
                ))}
              </div>
            </section>

            {/* SECTION 4: MINI TOOLS */}
            <section id="tools" className="py-16 border-t border-[#30363D]/60">
              <RevealOnScroll>
                <div className="flex items-center gap-3 mb-10">
                  <div className="p-2.5 rounded-xl bg-[#00877b]/20">
                    <Calculator className="w-5 h-5 text-[#00877b]" />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#F0F6FC]">Mini Tools Percetakan</h2>
                    <p className="text-sm text-[#8B949E] mt-1">Kalkulator interaktif untuk workflow percetakan</p>
                  </div>
                </div>
              </RevealOnScroll>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {miniTools.map((tool, index) => (
                  <RevealOnScroll key={tool.title} delay={index * 100}>
                    <a 
                      href={tool.url} 
                      className="group block p-5 rounded-2xl bg-[#161B22]/40 border border-[#30363D]/60 hover:bg-[#161B22]/80 hover:border-[#00877b]/30 transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-[#0D1117]/70 group-hover:scale-110 transition-transform duration-300">
                          {tool.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-[#F0F6FC] font-semibold mb-1 flex items-center gap-2">
                            {tool.title}
                            <ArrowRight className="w-4 h-4 text-[#8B949E] group-hover:text-[#00877b] group-hover:translate-x-1 transition-all" />
                          </h3>
                          <p className="text-sm text-[#8B949E] leading-relaxed">{tool.desc}</p>
                        </div>
                      </div>
                    </a>
                  </RevealOnScroll>
                ))}
              </div>
            </section>

            {/* SECTION 5: BLOG / TULISAN - NEW */}
            <section id="blog" className="py-16 border-t border-[#30363D]/60">
              <RevealOnScroll>
                <div className="flex items-center gap-3 mb-10">
                  <div className="p-2.5 rounded-xl bg-[#00877b]/20">
                    <PenTool className="w-5 h-5 text-[#00877b]" />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#F0F6FC]">Tulisan & Notes</h2>
                    <p className="text-sm text-[#8B949E] mt-1">Pemikiran, proses, dan problem-solving</p>
                  </div>
                </div>
              </RevealOnScroll>

              <div className="space-y-4">
                {blogPosts.map((post, index) => (
                  <RevealOnScroll key={post.id} delay={index * 100}>
                    <article className="group p-6 rounded-2xl bg-[#161B22]/40 border border-[#30363D]/60 hover:bg-[#161B22]/80 hover:border-[#00877b]/30 transition-all duration-300 cursor-pointer">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex-1">
                          {/* Meta info */}
                          <div className="flex items-center gap-3 mb-3 text-xs text-[#8B949E]">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {post.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {post.readTime} baca
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5" />
                              {post.views}
                            </span>
                          </div>
                          
                          {/* Title */}
                          <h3 className="text-lg font-semibold text-[#F0F6FC] mb-2 group-hover:text-[#00877b] transition-colors flex items-center gap-2">
                            {post.title}
                            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                          </h3>
                          
                          {/* Excerpt */}
                          <p className="text-sm text-[#8B949E] leading-relaxed mb-4">{post.excerpt}</p>
                          
                          {/* Tags */}
                          <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-[#0D1117] border border-[#30363D] text-[#8B949E] group-hover:border-[#00877b]/40 transition-colors"
                              >
                                <Hash className="w-3 h-3" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </article>
                  </RevealOnScroll>
                ))}
              </div>

              {/* View All Posts Link */}
              <RevealOnScroll delay={400}>
                <div className="mt-8 text-center">
                  <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[#30363D] text-[#8B949E] hover:text-[#F0F6FC] hover:border-[#00877b]/50 transition-all">
                    <span>Lihat semua tulisan</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </RevealOnScroll>
            </section>

            {/* SECTION 6: CALL TO ACTION */}
            <section id="halo" className="py-16">
              <RevealOnScroll>
                <div className="relative rounded-3xl bg-gradient-to-br from-[#161B22] to-[#0D1117] border border-[#30363D] p-8 md:p-12 overflow-hidden">
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-[#00877b]/10 rounded-full blur-[60px]" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#00877b]/5 rounded-full blur-[40px]" />
                  
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-center md:text-left">
                      <h2 className="text-2xl md:text-3xl font-bold text-[#F0F6FC] mb-3">Mari temukan solusinya bersama.</h2>
                      <p className="text-[#8B949E] max-w-md">
                        Punya ide kompleks atau masalah sistem yang terasa buntu? Kirim pesan lewat WhatsApp.
                      </p>
                    </div>
                    
                    <a
                      href="https://wa.me/6285242660003?text=Halo%2C%20saya%20tertarik%20untuk%20kolaborasi."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3.5 bg-[#00877b] hover:bg-[#00877b]/90 text-[#F0F6FC] rounded-xl font-medium transition-all duration-300 shadow-[0_0_30px_rgba(0,135,123,0.25)] hover:shadow-[0_0_40px_rgba(0,135,123,0.4)] whitespace-nowrap"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Chat WhatsApp
                    </a>
                  </div>
                </div>
              </RevealOnScroll>
            </section>

          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="relative z-10 lg:ml-[280px] border-t border-[#30363D]/60 py-6">
        <div className="max-w-4xl mx-auto px-5 md:px-10 lg:px-16 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#8B949E] text-sm">
            Dibuat dengan logika, dedikasi, & secangkir kopi. &copy; {new Date().getFullYear()}
          </p>
          <div className="flex gap-4">
            <a
              href="https://github.com/1lhmjya"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8B949E] hover:text-[#F0F6FC] transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://wa.me/6285242660003"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8B949E] hover:text-[#F0F6FC] transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
          </div>
        </div>
      </footer>

      {/* MODAL AI TYPEWRITER */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Overlay Backdrop Blur */}
          <div 
            className="absolute inset-0 bg-[#010409]/85 backdrop-blur-md transition-opacity duration-500"
            onClick={closeModal}
          ></div>
          
          {/* Modal Content Box */}
          <div 
            className="relative w-full max-w-2xl bg-[#0D1117] border border-[#30363D] rounded-2xl shadow-[0_0_50px_rgba(0,135,123,0.15)] overflow-hidden transform transition-all duration-500 scale-100 opacity-100"
            onClick={(e) => e.stopPropagation()} // Mencegah klik di dalam modal menutup modal
          >
            {/* Header Modal */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#30363D] bg-[#161B22]/85">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#00877b]/20 flex items-center justify-center border border-[#00877b]/35">
                  <Bot className="w-4 h-4 text-[#00877b]" />
                </div>
                <div>
                  <h3 className="text-[#F0F6FC] font-medium text-sm">AI Copilot</h3>
                  {!isTypingComplete && (
                    <p className="text-[#8B949E] text-xs">
                      Mengetik pesan{typingDots}
                    </p>
                  )}
                </div>
              </div>
              <button 
                onClick={closeModal}
                className="text-[#8B949E] hover:text-[#F0F6FC] transition-colors p-1"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body Text Modal */}
            <div className="p-6 md:p-8">
              <NaturalTypewriter 
                text={aiStoryScript} 
                isTypingComplete={isTypingComplete}
                setIsTypingComplete={setIsTypingComplete}
              />

              {/* Tombol aksi muncul setelah ketikan selesai */}
              <div className={`mt-8 transition-all duration-1000 transform ${isTypingComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                <button 
                  onClick={closeModal}
                  className="w-full py-3 rounded-xl bg-[#161B22] hover:bg-[#21262D] border border-[#30363D] text-[#F0F6FC] font-medium transition-colors"
                >
                  Tutup Pesan & Lanjutkan
                </button>
              </div>
            </div>
            
            {/* Subtle glow border di bagian bawah modal */}
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#00877b]/70 to-transparent"></div>
          </div>
        </div>
      )}

      {/* Tambahan style CSS untuk scrollbar di modal */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(48, 54, 61, 0.55);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(46, 160, 67, 0.45);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(46, 160, 67, 0.7);
        }
      `}} />

    </div>
  );
};

export default App;
