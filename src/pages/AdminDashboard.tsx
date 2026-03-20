import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, Inbox, Trash2, User, Mail, Briefcase, Clock } from "lucide-react";

interface Inquiry {
  id: string;
  client_name: string;
  client_email: string;
  service_requested: string;
  created_at: string;
}

const AdminDashboard = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    fetchInquiries();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/admin");
      return;
    }
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin");

    if (!roles || roles.length === 0) {
      await supabase.auth.signOut();
      navigate("/admin");
    }
  };

  const fetchInquiries = async () => {
    const { data, error } = await supabase
      .from("client_inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setInquiries(data);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("client_inquiries").delete().eq("id", id);
    setInquiries((prev) => prev.filter((i) => i.id !== id));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin");
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">
              <span className="text-gradient-neon">Admin</span> Dashboard
            </h1>
            <p className="text-muted-foreground text-xs mt-1">Client inquiries management</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="p-5 rounded-xl border border-border bg-card">
            <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Total Inquiries</p>
            <p className="text-3xl font-bold text-gradient-neon">{inquiries.length}</p>
          </div>
          <div className="p-5 rounded-xl border border-border bg-card">
            <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">This Week</p>
            <p className="text-3xl font-bold">
              {inquiries.filter((i) => {
                const d = new Date(i.created_at);
                const now = new Date();
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                return d >= weekAgo;
              }).length}
            </p>
          </div>
          <div className="p-5 rounded-xl border border-border bg-card">
            <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Top Service</p>
            <p className="text-lg font-bold truncate">
              {inquiries.length > 0
                ? Object.entries(
                    inquiries.reduce((acc, i) => {
                      acc[i.service_requested] = (acc[i.service_requested] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  ).sort((a, b) => b[1] - a[1])[0]?.[0] || "—"
                : "—"}
            </p>
          </div>
        </div>

        {/* Inquiries List */}
        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Loading...</div>
        ) : inquiries.length === 0 ? (
          <div className="text-center py-20">
            <Inbox size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No inquiries yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {inquiries.map((inquiry, i) => (
              <motion.div
                key={inquiry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-5 rounded-xl border border-border bg-card hover:border-primary/20 transition-all group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-primary" />
                      <span className="font-semibold">{inquiry.client_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-muted-foreground" />
                      <a href={`mailto:${inquiry.client_email}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        {inquiry.client_email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase size={14} className="text-muted-foreground" />
                      <span className="text-sm px-3 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                        {inquiry.service_requested}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{formatDate(inquiry.created_at)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(inquiry.id)}
                    className="self-start text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
