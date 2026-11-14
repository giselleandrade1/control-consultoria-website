import {
  Briefcase,
  CalendarHeart,
  ClipboardList,
  GraduationCap,
  HeartHandshake,
  LineChart,
  UserSearch,
  Users,
  type LucideIcon,
} from "lucide-react";

export const SERVICE_ICONS: Record<string, LucideIcon> = {
  "consultoria-empresarial": Briefcase,
  "recrutamento-selecao": UserSearch,
  "gestao-estrategica": LineChart,
  "consultoria-humanizada": HeartHandshake,
  "departamento-pessoal": Users,
  "treinamento-desenvolvimento": GraduationCap,
  "apoio-administrativo": ClipboardList,
  "eventos-corporativos": CalendarHeart,
};

export const serviceIcon = (id: string): LucideIcon => SERVICE_ICONS[id] ?? Briefcase;
