import { motion } from "framer-motion";
import { ExternalLink, ShoppingCart, Bot, BarChart3 } from "lucide-react";

const projects = [
  {
    title: "Electro Care",
    description: "A full-featured electronics e-commerce platform with product catalog, cart system, and seamless checkout experience.",
    tags: ["E-Commerce", "React", "Tailwind CSS"],
    icon: ShoppingCart,
    link: "https://electrocare-store.vercel.app/",
    color: "primary" as const,
  },
  {
    title: "The Eternal Palace",
    description: "A private PWA with Telegram bot & chatbot integration — an immersive digital experience with real-time messaging.",
    tags: ["PWA", "Telegram Bot", "Chatbot"],
    icon: Bot,
    link: "https://noamanetaoufiq-web.github.io/for-ilhamati/",
    color: "purple" as const,
  },
  {
    title: "Trading Dashboard",
    description: "Real-time crypto & forex analysis tool with live charts, market signals, and portfolio tracking capabilities.",
    tags: ["Real-Time", "Crypto", "Forex"],
    icon: BarChart3,
    color: "cyan" as const,
  },
];

const colorMap = {
  primary: "border-primary/20 hover:border-primary/50 hover:shadow-[0_0_30px_hsl(160_100%_50%/0.1)]",
  purple: "border-neon-purple/20 hover:border-neon-purple/50 hover:shadow-[0_0_30px_hsl(280_100%_65%/0.1)]",
  cyan: "border-neon-cyan/20 hover:border-neon-cyan/50 hover:shadow-[0_0_30px_hsl(180_100%_50%/0.1)]",
};

const tagColorMap = {
  primary: "bg-primary/10 text-primary",
  purple: "bg-neon-purple/10 text-neon-purple",
  cyan: "bg-neon-cyan/10 text-neon-cyan",
};

const Projects = () => {
  return (
    <section id="projects" className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="font-mono text-sm tracking-[0.3em] uppercase text-primary mb-3">Portfolio</p>
          <h2 className="text-3xl md:text-5xl font-bold">
            Featured <span className="text-gradient-neon">Projects</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <div
                className={`group relative h-full rounded-xl border bg-card p-6 transition-all duration-500 ${colorMap[project.color]}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <project.icon size={28} className="text-muted-foreground group-hover:text-primary transition-colors" />
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ExternalLink size={18} />
                    </a>
                  )}
                </div>

                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">{project.description}</p>

                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.tags.map((tag) => (
                    <span key={tag} className={`text-xs font-mono px-3 py-1 rounded-full ${tagColorMap[project.color]}`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-muted-foreground text-sm mt-10"
        >
          These are sample projects — my real work is crafted specifically for each client.
        </motion.p>
      </div>
    </section>
  );
};

export default Projects;
