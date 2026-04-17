import { 
  Users, 
  Clock, 
  Settings,
  Search,
  LineChart,
  BookOpen
} from 'lucide-react';
import { MacroChallenge, DiscoveryPhase } from './types';

export const MACRO_CHALLENGES: MacroChallenge[] = [
  {
    id: "challenge-1",
    title: "El Gap de Adopción",
    description: "Usuarios non-tech no están utilizando el potencial de Google Workspace AI. La herramienta avanza, pero la adopción se estanca.",
    icon: Users
  },
  {
    id: "challenge-2",
    title: "Fricción Operativa",
    description: "Tiempo valioso perdido en reportes manuales, triaje de correos y tareas repetitivas que podrían ser automatizadas.",
    icon: Clock
  },
  {
    id: "challenge-3",
    title: "Soluciones Genéricas",
    description: "El peligro de la IA 'off-the-shelf'. Sin flujos de trabajo a medida, la IA genérica no resuelve los problemas específicos del banco.",
    icon: Settings
  }
];

export const DISCOVERY_PROCESS: DiscoveryPhase[] = [
  {
    week: "Semana 1",
    title: "Entrevistas AI",
    description: "Agentes conversacionales entrevistan a los equipos para descubrir fricciones reales en su día a día.",
    deliverable: "Mapa de Fricciones"
  },
  {
    week: "Semana 2",
    title: "Análisis de Patrones",
    description: "Procesamiento de las entrevistas para identificar los casos de uso de mayor impacto y menor esfuerzo.",
    deliverable: "Matriz de Casos de Uso"
  },
  {
    week: "Semana 3",
    title: "Playbook a Medida",
    description: "Diseño de un programa de formación y flujos de trabajo específicos para Banco Macro.",
    deliverable: "Custom AI Playbook"
  }
];