import { Github, Linkedin, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border py-10">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-muted-foreground text-sm flex items-center gap-1">
          Built with <Heart size={14} className="text-primary" /> by Noamane Taoufiq
        </p>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/noamanetaoufiq-web"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github size={20} />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Linkedin size={20} />
          </a>
          <a
            href="https://t.me/noamane_dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="font-mono text-xs">TG</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
