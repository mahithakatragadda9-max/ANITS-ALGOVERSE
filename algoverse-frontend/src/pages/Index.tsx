import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ExploreSection from "@/components/ExploreSection";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const Index: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location.hash]);

const handleChatbotClick = () => {
  window.location.href = "http://algo-verse.streamlit.app/";
};

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <ExploreSection />
       

{/* Interview PYQs Section */}
<section className="py-24">
  <div className="container mx-auto px-4">
    <motion.div
      className="max-w-5xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-8 md:p-10 text-center">
        <div className="text-4xl mb-4">📚</div>

        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Interview PYQs
        </h2>

        <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
          Practice company-focused DSA interview questions organized
          topic-wise and pattern-wise, with direct LeetCode practice links.
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm">
            117 Questions
          </span>

          <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-sm">
            Company-wise
          </span>

          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm">
            Pattern-wise
          </span>

          <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-sm">
            LeetCode Links
          </span>
        </div>

        <Link
  to="/pyq"
  className="inline-block px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition"
>
  Explore Interview PYQs →
</Link>
      </div>
    </motion.div>
  </div>
</section>

        {/* Why Learn Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <motion.div
                className="text-center mb-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Learn With AlgoVerse?</h2>
                <p className="text-muted-foreground">
                  Master computer science fundamentals with our carefully designed learning paths
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-16">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-xl font-semibold mb-4">Why Data Structures Matter</h3>
                  <p className="text-muted-foreground mb-4">
                    Data structuress form the building blocks of software development, enabling you to:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-primary font-bold mr-2">•</span>
                      <span>Efficiently organize and store information in memory</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary font-bold mr-2">•</span>
                      <span>Process large amounts of data with optimal performance</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary font-bold mr-2">•</span>
                      <span>Create scalable applications that handle growing datasets</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary font-bold mr-2">•</span>
                      <span>Pass technical interviews at top tech companies</span>
                    </li>
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-xl font-semibold mb-4">Why Algorithms Are Essential</h3>
                  <p className="text-muted-foreground mb-4">
                    Algorithms are the heart of computational problem-solving, allowing you to:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-secondary font-bold mr-2">•</span>
                      <span>Solve complex problems systematically and efficiently</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-secondary font-bold mr-2">•</span>
                      <span>Optimize code for better performance and resource usage</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-secondary font-bold mr-2">•</span>
                      <span>Develop critical thinking and analytical reasoning skills</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-secondary font-bold mr-2">•</span>
                      <span>Understand the foundations of machine learning and AI</span>
                    </li>
                  </ul>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      {/* Floating Chatbot Icon */}
     <button
  onClick={handleChatbotClick}
  className="fixed bottom-6 right-6 md:bottom-8 md:right-8
             bg-gradient-to-br from-indigo-600 to-purple-600 text-white
             rounded-2xl w-16 h-16 md:w-18 md:h-18 flex items-center justify-center
             shadow-xl hover:shadow-2xl transition-all duration-300
             hover:scale-105 active:scale-95
             focus:outline-none focus:ring-4 focus:ring-indigo-400/50
             z-50 border-2 border-white/20"
  aria-label="Open Chatbot"
>
  {/* Modern Chat Bubble Icon with gradient */}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className="w-8 h-8 md:w-9 md:h-9"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
    />
  </svg>
  
  {/* Optional: Animated ping effect */}
  <span className="absolute flex h-full w-full">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-xl bg-indigo-400 opacity-20"></span>
  </span>
</button>
    </div>
  );
};

export default Index;