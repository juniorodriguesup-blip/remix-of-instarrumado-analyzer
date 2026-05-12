import { useEffect, useState } from "react";
import { Instagram, X } from "lucide-react";

interface Notification {
  id: number;
  name: string;
  handle: string;
  action: string;
  time: string;
}

const names = [
  "Ana Silva", "Carlos Oliveira", "Mariana Santos", "Pedro Costa",
  "Julia Lima", "Lucas Pereira", "Fernanda Souza", "Rafael Almeida",
  "Beatriz Martins", "Gabriel Rodrigues", "Larissa Carvalho", "Thiago Nunes",
  "Amanda Barros", "Diego Rocha", "Isabela Teixeira", "Felipe Moreira",
];

const actions = [
  "acabou de fazer o diagnóstico gratuito",
  "desbloqueou o plano Premium",
  "está analisando o perfil agora",
  "acabou de receber o diagnóstico completo",
];

const generateRandomNotification = (id: number): Notification => ({
  id,
  name: names[Math.floor(Math.random() * names.length)],
  handle: `@${Math.random().toString(36).substring(2, 8)}`,
  action: actions[Math.floor(Math.random() * actions.length)],
  time: "agora mesmo",
});

const SocialProofNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [dismissed, setDismissed] = useState<Set<number>>(new Set());

  useEffect(() => {
    const addNotification = () => {
      const id = Date.now();
      const notif = generateRandomNotification(id);
      setNotifications((prev) => [...prev.slice(-4), notif]);

      setTimeout(() => {
        setDismissed((prev) => new Set(prev).add(id));
      }, 6000);
    };

    const initial = setTimeout(addNotification, 3000);
    const interval = setInterval(addNotification, 12000 + Math.random() * 18000);

    return () => {
      clearTimeout(initial);
      clearInterval(interval);
    };
  }, []);

  const handleDismiss = (id: number) => {
    setDismissed((prev) => new Set(prev).add(id));
  };

  const visibleNotifications = notifications.filter((n) => !dismissed.has(n.id));

  if (visibleNotifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[100] space-y-2 max-w-sm">
      {visibleNotifications.map((notif) => (
        <div
          key={notif.id}
          className="glass-card rounded-xl p-3.5 pr-10 animate-slide-in-left shadow-xl border border-instagram-pink/20 bg-background/95 backdrop-blur-xl"
        >
          <button
            onClick={() => handleDismiss(notif.id)}
            className="absolute top-2 right-2 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-instagram-purple to-instagram-pink flex items-center justify-center flex-shrink-0">
              <Instagram className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {notif.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {notif.action}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SocialProofNotifications;
