import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link, BarChart3, QrCode, Users, Shield, Zap, TrendingUp, Globe2, MousePointerClick, Check, X } from "lucide-react";

const LandingPage = () => {
  const [longurl, setLongUrl] = useState("");
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    content: "",
  });
  
  // Rotating text for hero section
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const rotatingWords = ["Professionals", "Marketers", "Teams", "Startups", "Agencies", "Enterprises"];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2000); // Change word every 2 seconds
    
    return () => clearInterval(interval);
  }, [rotatingWords.length]);

  const handleChange = (e) => {
    setLongUrl(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (longurl) {
      navigate(`/auth?createNew=${longurl}`);
    }
  };

  const features = [
    {
      icon: Link,
      title: "Smart URL Shortening",
      description: "Transform long, complex URLs into clean, memorable short links in seconds.",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Track clicks, locations, devices, and engagement in real-time with detailed insights.",
    },
    {
      icon: QrCode,
      title: "QR Code Generator",
      description: "Create customizable QR codes for your links, perfect for print and digital campaigns.",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Work together with workspace features, role-based permissions, and shared analytics.",
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Enterprise-grade security with privacy-focused tracking and data protection.",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Instant redirects with 99.9% uptime and global CDN infrastructure.",
    },
  ];

  const testimonials = [
    {
      quote: "KliqIN has been a game-changer for our community events. Tracking clicks, devices, and locations has allowed us to optimize our outreach and improve member engagement.",
      name: "Souradip Pal",
      designation: "Founder, DEV DOT COM Community",
      image: "./souro.png",
    },
    {
      quote: "Using KliqIN has made sharing and managing links so simple. The analytics are super helpful for understanding how our links are performing.",
      name: "Subhadip Saha",
      designation: "Game Developer",
      image: "./subh.png",
    },
    {
      quote: "KliqIN's intuitive design makes it perfect for students like us. Shortening and tracking links has never been this straightforward.",
      name: "Ayush Dhua",
      designation: "Ex. Goldman Sachs",
      image: "./ayush.png",
    },
    {
      quote: "The simplicity and smart features of KliqIN make it an essential tool for students. It's easy to use and incredibly effective.",
      name: "Subinoy Biswas",
      designation: "SIH Winner",
      image: "./subinoy.png",
    },
  ];

  const openModal = (title, content) => {
    setModalContent({ title, content });
    setModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setModalOpen(false);
    document.body.style.overflow = "auto";
  };

  const privacyPolicyContent = `
    <div><p>Our Privacy Policy was last updated on <strong>December 29, 2025</strong>.</p>
    <p>At <strong>KliqIN</strong>, one of our main priorities is the privacy of our visitors...</p>
    </div>
  `;

  const termsContent = `
    <div><p>Our Terms and Conditions were last updated on <strong>December 29, 2025</strong>.</p>
    <p>Please read these terms and conditions carefully before using Our Service...</p>
    </div>
  `;

  return (
    <div className="flex flex-col items-center" style={{ fontFamily: 'Oswald, sans-serif' }}>
      {/* Hero Section */}
      <section className="w-full max-w-7xl mx-auto px-4 py-20 md:py-32 text-center">
        <div className="mb-6">
          <span className="text-sm font-semibold tracking-widest uppercase flex items-center justify-center gap-2 flex-wrap">
            <span className="text-foreground">Built for</span>
            <span 
              key={currentWordIndex}
              className="bg-primary text-white px-4 py-1.5 rounded-lg shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-500 relative"
              style={{ 
                animation: 'fadeSlideIn 0.5s ease-out',
                display: 'inline-block',
                boxShadow: '0 0 20px rgba(58, 87, 71, 0.4)',
                transition: 'all 0.5s ease-out'
              }}
            >
              {rotatingWords[currentWordIndex]}
            </span>
          </span>
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight tracking-tight">
          SHORTEN. <span className="text-primary">TRACK.</span><br />
          DOMINATE.
        </h1>
        
        <p className="text-base md:text-lg text-muted-foreground mb-12 max-w-2xl mx-auto font-normal" style={{ fontFamily: 'Inter, sans-serif' }}>
          Transform long URLs into powerful marketing assets. Get <span className="font-semibold">real-time analytics</span>, create <span className="font-semibold">branded short links</span>, and collaborate with your team—all in one place.
        </p>

        {/* URL Input */}
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="url"
              placeholder="https://your-long-url.com/example"
              value={longurl}
              onChange={handleChange}
              className="flex-1 h-14 text-base px-6"
              required
            />
            <Button 
              type="submit" 
              size="lg" 
              className="h-14 px-8 text-base font-semibold"
            >
              Shorten Now
            </Button>
          </div>
        </form>

        <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-primary" />
            <span>Free Forever</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-primary" />
            <span>No Credit Card</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-primary" />
            <span>Instant Setup</span>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full bg-muted/50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">10K+</div>
              <div className="text-sm text-muted-foreground">Links Created</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">50K+</div>
              <div className="text-sm text-muted-foreground">Clicks Tracked</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">500+</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-7xl mx-auto px-4 py-20 md:py-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to help you track, analyze, and optimize your links.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-2 hover:border-primary transition-colors duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full bg-muted/50 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4">
              Trusted by Ambitious Teams
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of users who trust KliqIN for their link management needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-2">
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground mb-4 italic">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                      {testimonial.image ? (
                        <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                      ) : (
                        <Users className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{testimonial.name}</div>
                      <div className="text-xs text-muted-foreground">{testimonial.designation}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full max-w-7xl mx-auto px-4 py-20 md:py-32">
        <Card className="border-2 border-primary bg-primary/5">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4">
              READY TO KLIQ IT?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust KliqIN. Start shortening and tracking your links today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="h-14 px-8 text-base font-semibold"
                onClick={() => navigate('/auth')}
              >
                Start Free Trial
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="h-14 px-8 text-base font-semibold"
                onClick={() => navigate('/dashboard')}
              >
                View Dashboard
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              30-day satisfaction guarantee • No credit card required • Cancel anytime
            </p>
          </CardContent>
        </Card>
      </section>

      {/* FAQ Section */}
      <section className="w-full max-w-4xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            Frequently Asked Questions
          </h2>
        </div>

        <Accordion type="multiple" className="space-y-4">
          <AccordionItem value="item-1" className="border rounded-lg px-6">
            <AccordionTrigger className="text-left font-semibold">
              What is KliqIN?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              KliqIN is a powerful URL shortener with advanced analytics, QR code generation, and team collaboration features. Track clicks, locations, devices, and more in real-time.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="border rounded-lg px-6">
            <AccordionTrigger className="text-left font-semibold">
              How do I shorten a link?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Simply paste your long URL into the input box above, click "Shorten Now," and get a clean, shareable link instantly. You can also customize your links with custom slugs.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="border rounded-lg px-6">
            <AccordionTrigger className="text-left font-semibold">
              Can I track my links?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Yes! Each link includes a dashboard to monitor clicks, visitor locations, devices, browsers, and engagement metrics in real-time. You can also export analytics data.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="border rounded-lg px-6">
            <AccordionTrigger className="text-left font-semibold">
              Is KliqIN free to use?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Yes! KliqIN offers free link shortening and basic analytics. Premium features like team workspaces, custom domains, and advanced analytics are available on paid plans.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5" className="border rounded-lg px-6">
            <AccordionTrigger className="text-left font-semibold">
              Can I customize my short links?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Absolutely! You can create custom short links (branded slugs) that match your brand or campaign. Custom domains are also available on premium plans.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6" className="border rounded-lg px-6">
            <AccordionTrigger className="text-left font-semibold">
              Is my data safe with KliqIN?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Absolutely! We prioritize privacy and security. All data is encrypted, and we use privacy-focused tracking methods. We never sell your data to third parties.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* Footer */}
      <footer className="w-full border-t mt-20 bg-muted/30 relative overflow-hidden">
        {/* Large Background Text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span className="text-[12rem] md:text-[16rem] lg:text-[20rem] font-black text-muted-foreground/[0.03] whitespace-nowrap" style={{ fontFamily: 'Oswald, sans-serif' }}>
            KliqIN
          </span>
        </div>
        <div className="w-full px-8 md:px-12 lg:px-16 py-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
            {/* Brand Section */}
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Oswald, sans-serif' }}>
                <span className="text-foreground">Kliq</span>
                <span className="text-primary">IN</span>
              </h3>
              <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                Premium URL shortening for modern teams. Fast, reliable, and feature-rich. 
                Track every click with powerful analytics.
              </p>
              
              {/* Social Links */}
              <div className="flex items-center gap-4 mt-6">
                <a 
                  href="https://twitter.com/kliqin" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                  <span>Twitter</span>
                </a>
                <a 
                  href="https://linkedin.com/company/kliqin" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  <span>LinkedIn</span>
                </a>
                <a 
                  href="https://github.com/Rohit-Dnath/LOL-URL" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  <span>GitHub</span>
                </a>
              </div>
            </div>

            {/* Platform */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Platform</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="/auth" className="hover:text-primary transition-colors">Login</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Support</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="mailto:support@kliq.in" className="hover:text-primary transition-colors">Contact Us</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Legal</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <button 
                    onClick={() => openModal("Privacy Policy", privacyPolicyContent)} 
                    className="hover:text-primary transition-colors text-left"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => openModal("Terms of Service", termsContent)} 
                    className="hover:text-primary transition-colors text-left"
                  >
                    Terms
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
            <div>
              © 2025 KliqIN Inc.
            </div>
            <div className="flex items-center gap-2">
              <span>by <a href="https://rohitdebnath.me" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">Rohit Debnath</a></span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold">{modalContent.title}</h3>
                <button
                  onClick={closeModal}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: modalContent.content }}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
