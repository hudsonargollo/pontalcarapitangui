import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

// Suppress schema-related toasts
const originalToastError = toast.error;
toast.error = (message: string, ...args: any[]) => {
  if (typeof message === 'string' && message.includes('schema')) {
    return;
  }
  return originalToastError(message, ...args);
};

const authSchema = z.object({
  email: z.string().trim().email({ message: "Email inválido" }).max(255),
  password: z.string().min(6, { message: "Senha deve ter no mínimo 6 caracteres" }).max(100),
});

const greetings = [
  "Bem-vindo",
  "Bem-vindo",
  "Bem-vindo",
  "Bem-vindo",
  "Bem-vindo",
  "Bem-vindo",
  "Bem-vindo",
  "Bem-vindo",
  "Bem-vindo",
  "Bem-vindo"
];

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Login | MiMenu - Cardápio Digital & SaaS";
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const redirectToRolePage = async (session: any) => {
    try {
      const role = session.user?.user_metadata?.role;
      
      if (role === 'waiter') {
        navigate("/waiter-dashboard", { replace: true });
      } else if (role === 'kitchen') {
        navigate("/kitchen", { replace: true });
      } else if (role === 'cashier') {
        navigate("/cashier", { replace: true });
      } else if (role === 'admin') {
        navigate("/admin", { replace: true });
      } else {
        navigate("/admin", { replace: true });
      }
    } catch (error) {
      navigate("/admin", { replace: true });
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const role = session.user?.user_metadata?.role;
        if (role === 'waiter') {
          navigate("/waiter-dashboard", { replace: true });
        } else if (role === 'admin') {
          navigate("/admin", { replace: true });
        } else if (role === 'kitchen') {
          navigate("/kitchen", { replace: true });
        } else if (role === 'cashier') {
          navigate("/cashier", { replace: true });
        }
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        const role = session.user?.user_metadata?.role;
        if (role === 'waiter') {
          navigate("/waiter-dashboard", { replace: true });
        } else if (role === 'admin') {
          navigate("/admin", { replace: true });
        } else if (role === 'kitchen') {
          navigate("/kitchen", { replace: true });
        } else if (role === 'cashier') {
          navigate("/cashier", { replace: true });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = authSchema.safeParse({ email, password });
    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: validation.data.email,
        password: validation.data.password,
      });

      console.log('🔵 Login attempt:', { email: validation.data.email, error });

      if (error) {
        console.error('🔴 Login error:', error);
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Email ou senha incorretos");
        } else {
          toast.error(error.message);
        }
        return;
      }

      console.log('✅ Login successful');
      toast.success("Login realizado com sucesso!");
      const session = (await supabase.auth.getSession()).data.session;
      if (session) {
        console.log('✅ Session obtained:', session.user.email);
        redirectToRolePage(session);
      }
    } catch (error: any) {
      console.error('🔴 Auth exception:', error);
      toast.error("Erro ao processar autenticação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#1A2B2A] to-[#0F1A19] p-4 relative overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#BC6C25]/10 to-transparent blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#BC6C25]/5 to-transparent blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Card with rounded top, sharp bottom */}
        <div className="bg-white rounded-t-3xl shadow-2xl overflow-hidden">
          {/* Dark Hero Section */}
          <div className="bg-gradient-to-b from-[#1A2B2A] to-[#2A3B3A] text-center space-y-6 p-8 sm:p-10">
            <div className="flex justify-center">
              <img 
                src="/logo-pontal.webp" 
                alt="PONTAL Carapitangui" 
                className="h-20 w-auto drop-shadow-lg"
              />
            </div>
            <div className="space-y-3">
              <p className="text-[#D4A574] tracking-[0.2em] text-xs uppercase font-display font-bold">
                PONTAL CARAPITANGUI
              </p>
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-white">
                Bem-Vindo
              </h1>
              <p className="text-sm text-gray-300">Acesse seu painel de controle</p>
            </div>
          </div>
          
          {/* White Form Section */}
          <div className="p-8 sm:p-10 bg-white">
            <form onSubmit={handleAuth} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-[#1A2B2A]">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  maxLength={255}
                  className="h-11 text-sm px-4 border border-gray-300 focus:border-[#BC6C25] focus:ring-1 focus:ring-[#BC6C25] rounded-xl transition-all bg-white text-[#1A2B2A] placeholder:text-gray-400"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-[#1A2B2A]">
                  Senha
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    maxLength={100}
                    className="h-11 text-sm px-4 pr-12 border border-gray-300 focus:border-[#BC6C25] focus:ring-1 focus:ring-[#BC6C25] rounded-xl transition-all bg-white text-[#1A2B2A] placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#BC6C25] transition-colors"
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-11 text-sm font-bold bg-[#BC6C25] hover:bg-[#A85A1F] text-white uppercase tracking-wider rounded-xl border-0 mt-8 transition-colors shadow-md" 
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Autenticando...</span>
                  </span>
                ) : (
                  "Acessar Painel"
                )}
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center leading-relaxed">
                Acesso restrito, monitorado e auditável.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
