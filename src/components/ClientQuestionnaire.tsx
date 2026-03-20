import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, User, Mail, Briefcase, CheckCircle, Send, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Step = "name" | "email" | "service" | "done";

const services = [
  "Website Development",
  "Mobile App (Flutter)",
  "E-Commerce Store",
  "Dashboard / Admin Panel",
  "Bot Integration (Telegram/WhatsApp)",
  "Other",
];

const ClientQuestionnaire = () => {
  const [step, setStep] = useState<Step>("name");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState("");

  const handleNext = async (nextStep: Step) => {
    if (nextStep === "done") {
      // Save inquiry to database
      const { error } = await supabase.from("client_inquiries").insert({
        client_name: name.trim(),
        client_email: email.trim(),
        service_requested: service,
      });
      if (error) {
        toast.error("Something went wrong. Please try again.");
        return;
      }
      toast.success("Inquiry submitted successfully!");
    }
    setStep(nextStep);
  };

  const stepVariants = {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  };

  return (
    <section id="contact" className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="font-mono text-sm tracking-[0.3em] uppercase text-primary mb-3">Let's Work Together</p>
          <h2 className="text-3xl md:text-5xl font-bold">
            Start Your <span className="text-gradient-neon">Project</span>
          </h2>
        </motion.div>

        <div className="max-w-lg mx-auto">
          {/* Progress */}
          <div className="flex items-center justify-center gap-2 mb-10">
            {(["name", "email", "service", "done"] as Step[]).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    (["name", "email", "service", "done"].indexOf(step) >= i)
                      ? "bg-primary glow-neon scale-110"
                      : "bg-muted"
                  }`}
                />
                {i < 3 && <div className={`w-8 h-px transition-colors ${
                  (["name", "email", "service", "done"].indexOf(step) > i) ? "bg-primary" : "bg-muted"
                }`} />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === "name" && (
              <motion.div key="name" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
                <div className="text-center">
                  <User className="mx-auto mb-4 text-primary" size={32} />
                  <h3 className="text-xl font-semibold mb-2">What's your name?</h3>
                  <p className="text-muted-foreground text-sm">Let's get to know each other</p>
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-5 py-4 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                  onKeyDown={(e) => e.key === "Enter" && name.trim() && handleNext("email")}
                  autoFocus
                />
                <button
                  onClick={() => handleNext("email")}
                  disabled={!name.trim()}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg bg-primary text-primary-foreground font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-all glow-neon"
                >
                  Continue <ArrowRight size={18} />
                </button>
              </motion.div>
            )}

            {step === "email" && (
              <motion.div key="email" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
                <div className="text-center">
                  <Mail className="mx-auto mb-4 text-primary" size={32} />
                  <h3 className="text-xl font-semibold mb-2">Hey {name}! What's your email?</h3>
                  <p className="text-muted-foreground text-sm">So I can get back to you</p>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-5 py-4 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                  onKeyDown={(e) => e.key === "Enter" && email.includes("@") && handleNext("service")}
                  autoFocus
                />
                <button
                  onClick={() => handleNext("service")}
                  disabled={!email.includes("@")}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg bg-primary text-primary-foreground font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-all glow-neon"
                >
                  Continue <ArrowRight size={18} />
                </button>
              </motion.div>
            )}

            {step === "service" && (
              <motion.div key="service" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
                <div className="text-center">
                  <Briefcase className="mx-auto mb-4 text-primary" size={32} />
                  <h3 className="text-xl font-semibold mb-2">What service do you need?</h3>
                  <p className="text-muted-foreground text-sm">Choose the one that best fits your project</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {services.map((s) => (
                    <button
                      key={s}
                      onClick={() => setService(s)}
                      className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all text-left ${
                        service === s
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-secondary text-muted-foreground hover:border-primary/30"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => handleNext("done")}
                  disabled={!service}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg bg-primary text-primary-foreground font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-all glow-neon"
                >
                  See Contact Info <ArrowRight size={18} />
                </button>
              </motion.div>
            )}

            {step === "done" && (
              <motion.div key="done" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="space-y-8">
                <div className="text-center">
                  <CheckCircle className="mx-auto mb-4 text-primary" size={40} />
                  <h3 className="text-2xl font-bold mb-2">Thank you, {name}!</h3>
                  <p className="text-muted-foreground">
                    Here's how to reach me for your <span className="text-primary font-medium">{service}</span> project:
                  </p>
                </div>

                <div className="space-y-4">
                  <a
                    href={`mailto:noamanetaoufiq@gmail.com?subject=${encodeURIComponent(`Project Inquiry: ${service}`)}&body=${encodeURIComponent(`Hi Noamane,\n\nMy name is ${name} and I'm interested in ${service}.\n\nBest regards,\n${name}\n${email}`)}`}
                    className="flex items-center gap-4 p-4 rounded-lg border border-border bg-secondary hover:border-primary/30 transition-all group"
                  >
                    <Send size={20} className="text-primary" />
                    <div>
                      <p className="font-medium text-sm">Email Me</p>
                      <p className="text-muted-foreground text-xs">noamanetaoufiq@gmail.com</p>
                    </div>
                  </a>

                  <a
                    href="https://t.me/noamane_dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-lg border border-border bg-secondary hover:border-primary/30 transition-all group"
                  >
                    <MessageCircle size={20} className="text-neon-cyan" />
                    <div>
                      <p className="font-medium text-sm">Telegram</p>
                      <p className="text-muted-foreground text-xs">@noamane_dev</p>
                    </div>
                  </a>

                  <a
                    href="tel:+212617362196"
                    className="flex items-center gap-4 p-4 rounded-lg border border-border bg-secondary hover:border-primary/30 transition-all group"
                  >
                    <Mail size={20} className="text-neon-purple" />
                    <div>
                      <p className="font-medium text-sm">Phone / WhatsApp</p>
                      <p className="text-muted-foreground text-xs">+212 617 362 196</p>
                    </div>
                  </a>
                </div>

                <button
                  onClick={() => { setStep("name"); setName(""); setEmail(""); setService(""); }}
                  className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Start over
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default ClientQuestionnaire;
