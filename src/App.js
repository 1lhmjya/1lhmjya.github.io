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
  Bot
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
        <span className="inline-block w-2 h-5 bg-[#2EA043] ml-1 animate-pulse align-middle"></span>
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
      icon: <Layers className="w-6 h-6 text-[#2EA043]" />,
      title: "Rapi & Masuk Akal",
      desc: "Saya percaya sesuatu yang baik dimulai dari pondasi yang logis. Rapi secara struktur di belakang layar, dan berjalan sangat lancar saat digunakan."
    },
    {
      icon: <Lightbulb className="w-6 h-6 text-[#2EA043]" />,
      title: "Melihat dari Sudut Lain",
      desc: "Saya perfeksionis untuk urusan detail. Terkadang, solusi terbaik justru datang saat kita berani berpikir sedikit berbeda dari biasanya."
    },
    {
      icon: <Sparkles className="w-6 h-6 text-[#2EA043]" />,
      title: "Kompleks tapi Simpel",
      desc: "Melihat pola di balik kerumitan adalah hal yang saya sukai. Saya merancang sistem yang kompleks, tapi terasa sangat sederhana bagi penggunanya."
    },
    {
      icon: <Compass className="w-6 h-6 text-[#2EA043]" />,
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

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#C9D1D9] font-sans overflow-x-hidden relative selection:bg-[#2EA043]/35 selection:text-[#F0F6FC]">
      
      {/* Background Ambient Efek Glow */}
      <div 
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 transition-transform duration-1000 ease-out"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(46, 160, 67, 0.14) 0%, rgba(0,0,0,0) 40%)`
        }}
      />
      
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#161B22]/75 blur-[120px] z-0 mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#2EA043]/15 blur-[120px] z-0 mix-blend-screen" />

      {/* Navbar Simple */}
      <nav
        className={`fixed top-0 w-full z-40 px-6 md:px-12 backdrop-blur-xl transition-all duration-300 ${
          isScrolled
            ? 'py-3.5 bg-[#0D1117]/95 border-b border-[#30363D] shadow-[0_8px_30px_rgba(1,4,9,0.45)]'
            : 'py-4 bg-[#0D1117]/55 border-b border-[#30363D]/60'
        }`}
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <span className="font-semibold text-[#F0F6FC] tracking-wide text-lg">
            Profile<span className="text-[#2EA043]">.</span>
          </span>
          <span className="font-semibold text-[#F0F6FC] tracking-wide text-lg">
            Ilham <span className="text-[#2EA043]">Jaya</span>
          </span>
        </div>
      </nav>

      <main className="relative z-10 px-6 md:px-12 pt-24 md:pt-28">
        <div className="max-w-5xl mx-auto">

          {/* SECTION 1: HERO */}
          <section className="min-h-[90vh] flex flex-col justify-center pt-8">
            <RevealOnScroll>
              <div className="mb-8 flex items-center gap-4">
                <img
                  src="/profil.png"
                  alt="Foto profil Ilham Jaya"
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border border-[#30363D] shadow-[0_0_30px_rgba(46,160,67,0.15)]"
                />
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#161B22]/70 border border-[#30363D] backdrop-blur-sm text-sm text-[#8B949E]">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2EA043] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2EA043]"></span>
                  </span>
                  Tersedia untuk kolaborasi
                </div>
              </div>
            </RevealOnScroll>
            
            <RevealOnScroll delay={100}>
              <h1 className="text-5xl md:text-7xl font-bold text-[#F0F6FC] tracking-tight leading-[1.1] mb-8">
                Membereskan hal rumit, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2EA043] to-[#3FB950]">
                  membuatnya jadi simpel.
                </span>
              </h1>
            </RevealOnScroll>

            <RevealOnScroll delay={200}>
              <p className="text-lg md:text-xl text-[#8B949E] max-w-2xl leading-relaxed mb-12">
                Saya merancang dan membangun sistem digital. Tidak cuma asal jalan, tapi dipikirkan dengan sangat logis dan detail. Karena pada akhirnya, Anda hanya ingin tahu satu hal: <span className="text-[#F0F6FC] font-medium">semuanya bekerja dengan sempurna.</span>
              </p>
            </RevealOnScroll>

            <RevealOnScroll delay={300}>
              <div className="flex flex-wrap items-center gap-6">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="group flex items-center gap-3 bg-[#2EA043] text-[#F0F6FC] px-7 py-4 rounded-full font-medium hover:bg-[#3FB950] transition-all duration-300 shadow-[0_0_40px_rgba(46,160,67,0.22)] hover:shadow-[0_0_50px_rgba(46,160,67,0.35)] transform hover:-translate-y-1"
                >
                  <Bot className="w-5 h-5" />
                  Kenali saya lebih jauh
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </RevealOnScroll>
          </section>

          {/* SECTION 2: MINDSET */}
          <section className="py-24">
            <RevealOnScroll>
              <h2 className="text-3xl md:text-4xl font-bold text-[#F0F6FC] mb-12">Cara Kerja.</h2>
            </RevealOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mindsets.map((item, index) => (
                <RevealOnScroll key={index} delay={index * 150}>
                  <div className="group relative p-8 rounded-3xl bg-[#161B22]/80 border border-[#30363D] hover:bg-[#21262D] transition-all duration-500 overflow-hidden h-full">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#2EA043]/15 rounded-full blur-[50px] group-hover:bg-[#2EA043]/25 transition-all duration-500" />
                    
                    <div className="relative z-10">
                      <div className="mb-6 p-4 rounded-2xl bg-[#0D1117]/70 inline-block shadow-inner shadow-[#30363D] group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
                        {item.icon}
                      </div>
                      <h3 className="text-xl font-semibold text-[#F0F6FC] mb-3">{item.title}</h3>
                      <p className="text-[#8B949E] leading-relaxed text-sm md:text-base">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </section>

          {/* SECTION 3: APA YANG BISA DILAKUKAN */}
          <section className="py-24 border-t border-[#30363D]">
            <RevealOnScroll>
              <h2 className="text-3xl md:text-4xl font-bold text-[#F0F6FC] mb-16 text-center">Fokus Layanan</h2>
            </RevealOnScroll>

            <div className="space-y-4 max-w-4xl mx-auto">
              {[
                "Membangun arsitektur sistem yang tahan banting dan siap scale-up.",
                "Menerjemahkan ide bisnis yang kompleks menjadi UI/UX yang mudah dimengerti.",
                "Menulis kode yang bersih, logis, dan mudah di-maintenance oleh tim Anda nanti.",
                "Memecahkan 'masalah mustahil' yang mungkin ditinggalkan developer sebelumnya."
              ].map((text, i) => (
                <RevealOnScroll key={i} delay={i * 100}>
                  <div className="flex items-center gap-4 p-6 rounded-2xl hover:bg-[#161B22]/80 transition-colors duration-300">
                    <CheckCircle2 className="w-6 h-6 text-[#2EA043] flex-shrink-0" />
                    <p className="text-[#C9D1D9] text-lg">{text}</p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </section>

          {/* SECTION 4: PROYEK PILIHAN */}
          <section id="projects" className="py-24 border-t border-[#30363D]">
            <RevealOnScroll>
              <h2 className="text-3xl md:text-4xl font-bold text-[#F0F6FC] mb-5 text-center">Proyek Pilihan</h2>
            </RevealOnScroll>
            <RevealOnScroll delay={80}>
              <p className="text-[#8B949E] text-center max-w-2xl mx-auto mb-14">
                Beberapa contoh yang merepresentasikan pendekatan kerja saya: cepat dipahami, rapi, dan fokus ke dampak.
              </p>
            </RevealOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredProjects.map((project, index) => (
                <RevealOnScroll key={project.title} delay={index * 120}>
                  <article className="h-full rounded-3xl bg-[#161B22]/80 border border-[#30363D] p-7 hover:bg-[#21262D] transition-all duration-300">
                    <h3 className="text-[#F0F6FC] text-xl font-semibold mb-3">{project.title}</h3>
                    <p className="text-[#8B949E] text-sm leading-relaxed mb-5">{project.summary}</p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.stack.map((item) => (
                        <span
                          key={item}
                          className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-[#0D1117] border border-[#30363D] text-[#C9D1D9]"
                        >
                          {item}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {project.demoUrl ? (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-[#2EA043] hover:text-[#3FB950] transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Live Demo
                        </a>
                      ) : (
                        <span className="text-sm text-[#8B949E]">Live Demo: Private</span>
                      )}

                      {project.repoUrl ? (
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-[#C9D1D9] hover:text-[#F0F6FC] transition-colors"
                        >
                          <Github className="w-4 h-4" />
                          Repository
                        </a>
                      ) : (
                        <span className="text-sm text-[#8B949E]">Repository: Private</span>
                      )}
                    </div>
                  </article>
                </RevealOnScroll>
              ))}
            </div>
          </section>

          {/* SECTION 5: CALL TO ACTION (HALO) */}
          <section id="halo" className="py-32 mb-10">
            <RevealOnScroll>
              <div className="relative rounded-[2.5rem] bg-gradient-to-br from-[#161B22] to-[#0D1117] border border-[#30363D] p-10 md:p-20 text-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                
                <div className="relative z-10">
                  <h2 className="text-4xl md:text-5xl font-bold text-[#F0F6FC] mb-6">Mari temukan solusinya bersama.</h2>
                  <p className="text-xl text-[#8B949E] max-w-2xl mx-auto mb-10">
                    Punya ide kompleks atau masalah sistem yang terasa buntu? Kirim pesan lewat WhatsApp, kita ngobrol santai.
                  </p>
                  
                  <a
                    href="https://wa.me/6285242660003?text=Halo%2C%20saya%20tertarik%20untuk%20kolaborasi."
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Hubungi via WhatsApp"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#2EA043] hover:bg-[#3FB950] text-[#F0F6FC] rounded-full font-medium transition-all duration-300 shadow-[0_0_30px_rgba(46,160,67,0.3)] hover:shadow-[0_0_40px_rgba(46,160,67,0.45)] transform hover:-translate-y-1"
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

      {/* Footer Minimalis */}
      <footer className="relative z-10 border-t border-[#30363D] pt-8 pb-4 md:pb-6">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#8B949E] text-sm text-center md:text-left">
            Dibuat dengan logika, dedikasi, & secangkir kopi. &copy; {new Date().getFullYear()}
          </p>
          <div className="flex gap-6">
            <a
              href="https://github.com/1lhmjya"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className="text-[#8B949E] hover:text-[#F0F6FC] transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://wa.me/6285242660003?text=Halo%2C%20saya%20lihat%20portfolio%20Anda."
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp chat"
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
            className="relative w-full max-w-2xl bg-[#0D1117] border border-[#30363D] rounded-2xl shadow-[0_0_50px_rgba(46,160,67,0.15)] overflow-hidden transform transition-all duration-500 scale-100 opacity-100"
            onClick={(e) => e.stopPropagation()} // Mencegah klik di dalam modal menutup modal
          >
            {/* Header Modal */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#30363D] bg-[#161B22]/85">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#2EA043]/20 flex items-center justify-center border border-[#2EA043]/35">
                  <Bot className="w-4 h-4 text-[#2EA043]" />
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
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#2EA043]/70 to-transparent"></div>
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
