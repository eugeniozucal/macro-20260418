import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BarChart3,
  CheckCircle2,
  ChevronDown,
  CircleDashed,
  Clock3,
  FileSpreadsheet,
  FileText,
  FolderOpen,
  Mail,
  Menu,
  Paperclip,
  Plus,
  Presentation,
  RefreshCw,
  Search,
  SendHorizontal,
  SlidersHorizontal,
  Sparkles,
  SquarePen,
} from 'lucide-react';

const WORKSPACE_AGENT_DEMO_VERSION = 'Bionic Flow v4.4';

const SPEED_CONFIG = {
  userTyping: 7,
  geminiTyping: 4,
  emailArrival: 2,
  sheetsUpdate: 3,
  apiFetch: 4,
  docFilling: 8,
  transition: 1,
};

const FIRST_PROMPT =
  'Crea una automatización en Google Workspace para que, cada vez que reciba un correo con un pedido de aprobación de carpeta de crédito, extraiga los datos y los agregue a un Google Sheets.';

const SECOND_PROMPT =
  'Agrega a la automatización que cada fila del Sheet se utilice para completar el archivo “Template de Aprobación” en mi Google Drive, se exporte como PDF y se envíe como adjunto al correo que figura en esa misma fila del Sheet.';

const THIRD_PROMPT =
  'Añade una función que cree y actualice automáticamente una presentación en Google Slides con un reporte completo del estado de los trámites a medida que se agreguen operaciones.';

const SHEET_SCALE = 0.73;

type Role = 'user' | 'assistant';
type WorkspaceView = 'gmail' | 'drive' | 'docs' | 'gmail-compose' | 'slides';

type ChatMessage = {
  id: number;
  role: Role;
  text: string;
};

type CreditMail = {
  id: string;
  branch: string;
  receivedAt: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  razonSocial: string;
  cuit: string;
  monto: string;
  resumen: string[];
  resumenParagraph?: React.ReactNode;
  outcome: 'Aprobado' | 'Pendiente';
};

type SheetRow = {
  id: string;
  razonSocial: string;
  cuit: string;
  monto: string;
  responsable: string;
  email: string;
  estado: string;
  isNew?: boolean;
};

type DocPreviewState = {
  razonSocial: string;
  cuit: string;
  monto: string;
  responsable: string;
  pdfReady: boolean;
};

type MailDraftState = {
  to: string;
  subject: string;
  body: string;
  attachmentReady: boolean;
  sent: boolean;
};

const RISK_OPS_MAIL: CreditMail = {
  id: 'risk-ops-0',
  branch: 'Risk Ops',
  receivedAt: '09:18',
  senderName: 'Risk Ops',
  senderEmail: 'risk.ops@bank.com',
  subject: 'Scorecards sucursales interior',
  razonSocial: '',
  cuit: '',
  monto: '',
  resumen: ['Revisar nuevas normativas', 'Aplicar a partir del mes próximo'],
  outcome: 'Pendiente',
};

const CREDIT_MAILS: CreditMail[] = [
  {
    id: 'mail-1',
    branch: 'Sucursal Córdoba',
    receivedAt: '10:42',
    senderName: 'Juan Pérez',
    senderEmail: 'cordoba@bank.com',
    subject: 'TechCorp S.R.L. - Pedido de aprobación crediticia',
    razonSocial: 'TechCorp S.R.L.',
    cuit: '30-12345678-9',
    monto: '$120.000.000',
    resumen: [
      'CUIT: 30-12345678-9',
      'Facturación Anual: $120.000.000 ARS',
      'Destino: capital de trabajo',
      'Responsable de aprobación: Juan Pérez',
      'Plazo solicitado: 18 meses',
    ],
    outcome: 'Aprobado',
  },
  {
    id: 'mail-2',
    branch: 'Sucursal Rosario',
    receivedAt: '10:47',
    senderName: 'María López',
    senderEmail: 'rosario@bank.com',
    subject: 'Agropecuaria del Sur S.A. - Pedido de aprobación crediticia',
    razonSocial: 'Agropecuaria del Sur S.A.',
    cuit: '30-71234567-8',
    monto: '$450.000.000',
    resumen: [],
    resumenParagraph: (
      <>
        Les escribo para solicitar la aprobación crediticia de la empresa <strong>Agropecuaria del Sur S.A.</strong>, 
        cuyo CUIT es <strong>30-71234567-8</strong>. El monto solicitado asciende a <strong>$450.000.000</strong> 
        para ser destinado a la campaña 2026. La responsable de esta aprobación será <strong>María López</strong>. 
        Como garantía, se ofrece una prenda sobre maquinaria agrícola.
      </>
    ),
    outcome: 'Pendiente',
  },
  {
    id: 'mail-3',
    branch: 'Sucursal Mendoza',
    receivedAt: '10:54',
    senderName: 'Alejandro Gómez',
    senderEmail: 'mendoza@bank.com',
    subject: 'Trendia S.A. - Pedido de aprobación crediticia',
    razonSocial: 'Trendia S.A.',
    cuit: '30-99887766-1',
    monto: '$280.000.000',
    resumen: [
      'CUIT: 30-99887766-1',
      'Facturación Anual: $280.000.000 ARS',
      'Destino: expansión regional',
      'Responsable de aprobación: Alejandro Gómez',
      'Rating interno: B+',
    ],
    outcome: 'Aprobado',
  },
];

const OLD_GMAIL_ITEMS = [
  { id: 'old-1', from: 'Risk Ops', subject: 'Scorecards sucursales interior', date: '09:18' },
  { id: 'old-2', from: 'Tesorería', subject: 'Actualización tasa mayorista abril', date: '08:51' },
  { id: 'old-3', from: 'Legal', subject: 'Anexo condiciones PyME 2026', date: '08:14' },
  { id: 'old-4', from: 'Comercial', subject: 'Pipeline semanal segmento agro', date: 'Ayer' },
];

const speedToMs = (speed: number, slowMs: number, fastMs: number) => {
  const safe = Math.max(1, Math.min(10, speed));
  const ratio = (safe - 1) / 9;
  return Math.round(slowMs + (fastMs - slowMs) * ratio);
};

const GeminiAvatar = () => (
  <svg width="30" height="30" viewBox="0 0 64 64" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="gem-person-v44" x1="0" y1="0" x2="64" y2="64">
        <stop stopColor="#60A5FA" />
        <stop offset="0.55" stopColor="#A78BFA" />
        <stop offset="1" stopColor="#F59E0B" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="30" fill="#17181E" stroke="url(#gem-person-v44)" strokeWidth="2" />
    <circle cx="32" cy="24" r="9" fill="url(#gem-person-v44)" />
    <path d="M18 49C18 40.7157 24.7157 34 33 34C41.2843 34 48 40.7157 48 49V50H18V49Z" fill="url(#gem-person-v44)" />
  </svg>
);

const MacTrafficLights = () => (
  <div className="flex items-center gap-2">
    <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
    <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
    <div className="h-3 w-3 rounded-full bg-[#28c840]" />
  </div>
);

const initialDocState: DocPreviewState = {
  razonSocial: '',
  cuit: '',
  monto: '',
  responsable: '',
  pdfReady: false,
};

const initialMailDraft: MailDraftState = {
  to: '',
  subject: '',
  body: '',
  attachmentReady: false,
  sent: false,
};

export const WorkspaceAgentDemo: React.FC = () => {
  const [step, setStep] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streamingMessage, setStreamingMessage] = useState<{ role: Role; text: string } | null>(null);
  const [assistantThinking, setAssistantThinking] = useState(false);
  const [composerText, setComposerText] = useState('');

  const [workspaceView, setWorkspaceView] = useState<WorkspaceView>('gmail');
  const [visibleIncomingCount, setVisibleIncomingCount] = useState(0);
  const [selectedMailId, setSelectedMailId] = useState<string | null>(null);
  const [processedMailIds, setProcessedMailIds] = useState<string[]>([]);

  const [liveRows, setLiveRows] = useState<SheetRow[]>([]);
  const [docPreview, setDocPreview] = useState<DocPreviewState>(initialDocState);
  const [mailDraft, setMailDraft] = useState<MailDraftState>(initialMailDraft);
  const [mailToast, setMailToast] = useState('');
  const [slidesStage, setSlidesStage] = useState(0);
  const [driveFileSelected, setDriveFileSelected] = useState(false);

  const [isExpanded, setIsExpanded] = useState(false);
  const [visiblePanels, setVisiblePanels] = useState(0);

  const [loopLabel, setLoopLabel] = useState('Sistema en reposo');
  const [liveStatus, setLiveStatus] = useState('Esperando inicio de simulación');

  const timeoutIdsRef = useRef<number[]>([]);
  const cancelledRef = useRef(false);
  const messageIdRef = useRef(1);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const demoFrameRef = useRef<HTMLDivElement | null>(null);

  const selectedMail = CREDIT_MAILS.find((mail) => mail.id === selectedMailId) || RISK_OPS_MAIL;

  const durations = useMemo(() => {
    return {
      userChar: speedToMs(SPEED_CONFIG.userTyping, 70, 14),
      geminiChar: speedToMs(SPEED_CONFIG.geminiTyping, 48, 10),
      outgoingChar: Math.max(4, Math.round(speedToMs(SPEED_CONFIG.geminiTyping, 48, 10) / 2)),
      emailPause: speedToMs(SPEED_CONFIG.emailArrival, 1350, 500),
      sheetPause: speedToMs(SPEED_CONFIG.sheetsUpdate, 780, 220),
      docChar: speedToMs(SPEED_CONFIG.docFilling, 54, 13),
      transitionPause: speedToMs(SPEED_CONFIG.transition, 900, 240),
      thinkPause: speedToMs(SPEED_CONFIG.transition, 760, 240),
      sendPause: speedToMs(SPEED_CONFIG.transition, 420, 140),
    };
  }, []);

  const metrics = useMemo(() => {
    const data = slidesStage >= 4 ? liveRows : liveRows.slice(0, 2);
    const approved = data.filter((row) => row.estado === 'Aprobado').length;
    const pending = data.filter((row) => row.estado === 'Pendiente').length;
    const total = Math.max(1, data.length);

    return {
      approved,
      pending,
      total: data.length,
      approvalRate: Math.round((approved / total) * 100),
      data,
    };
  }, [liveRows, slidesStage]);

  const clearTimers = () => {
    timeoutIdsRef.current.forEach((id) => window.clearTimeout(id));
    timeoutIdsRef.current = [];
  };

  const wait = (ms: number) =>
    new Promise<void>((resolve) => {
      const id = window.setTimeout(resolve, ms);
      timeoutIdsRef.current.push(id);
    });

  const nextMessageId = () => {
    const id = messageIdRef.current;
    messageIdRef.current += 1;
    return id;
  };

  const scrollDemoIntoPlace = () => {
    if (!demoFrameRef.current) return;
    demoFrameRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  };

  const hardReset = () => {
    cancelledRef.current = true;
    clearTimers();
    setStep(0);
    setIsSimulating(false);
    setMessages([]);
    setStreamingMessage(null);
    setAssistantThinking(false);
    setComposerText('');
    setWorkspaceView('gmail');
    setVisibleIncomingCount(0);
    setSelectedMailId(null);
    setProcessedMailIds([]);
    setLiveRows([]);
    setDocPreview(initialDocState);
    setMailDraft(initialMailDraft);
    setMailToast('');
    setSlidesStage(0);
    setDriveFileSelected(false);
    setLoopLabel('Sistema en reposo');
    setLiveStatus('Esperando inicio de simulación');
    messageIdRef.current = 1;
  };

  const handleInitialStart = async () => {
    setIsExpanded(true);
    await wait(500);
    
    demoFrameRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    await wait(800);
    
    setVisiblePanels(1);
    await wait(400);
    
    setVisiblePanels(2);
    await wait(400);
    
    setVisiblePanels(3);
    await wait(600);
    
    startSimulation();
  };

  const startSimulation = () => {
    scrollDemoIntoPlace();

    if (isSimulating) return;

    hardReset();

    const id = window.setTimeout(() => {
      cancelledRef.current = false;
      setIsSimulating(true);
      setStep(1);
    }, 520);

    timeoutIdsRef.current.push(id);
  };

  const pushMessage = (role: Role, text: string) => {
    setMessages((prev) => [...prev, { id: nextMessageId(), role, text }]);
  };

  const typeIntoComposer = async (text: string, charMs: number) => {
    setComposerText('');
    for (let i = 1; i <= text.length; i += 1) {
      if (cancelledRef.current) return false;
      setComposerText(text.slice(0, i));
      await wait(charMs);
    }
    return true;
  };

  const sendComposerToChat = async (text: string) => {
    if (cancelledRef.current) return false;
    await wait(durations.sendPause);
    pushMessage('user', text);
    setComposerText('');
    return true;
  };

  const streamAssistantMessage = async (text: string) => {
    if (cancelledRef.current) return false;

    setAssistantThinking(true);
    await wait(durations.thinkPause);
    if (cancelledRef.current) return false;
    setAssistantThinking(false);

    setStreamingMessage({ role: 'assistant', text: '' });

    for (let i = 1; i <= text.length; i += 1) {
      if (cancelledRef.current) return false;
      setStreamingMessage({ role: 'assistant', text: text.slice(0, i) });
      await wait(durations.geminiChar);
    }

    setStreamingMessage(null);
    pushMessage('assistant', text);
    return true;
  };

  const upsertLiveRow = (mail: CreditMail, patch: Partial<SheetRow>) => {
    setLiveRows((prev) => {
      const index = prev.findIndex((row) => row.id === mail.id);

      if (index === -1) {
        return [
          ...prev,
          {
            id: mail.id,
            razonSocial: '',
            cuit: '',
            monto: '',
            responsable: '',
            email: '',
            estado: 'Detectado',
            ...patch,
          },
        ];
      }

      const clone = [...prev];
      clone[index] = { ...clone[index], ...patch };
      return clone;
    });
  };

  const animateRowFill = async (mail: CreditMail, speedMult: number = 1) => {
    upsertLiveRow(mail, { estado: 'Analizando correo' });
    await wait(2000);

    upsertLiveRow(mail, { estado: 'Extrayendo', razonSocial: mail.razonSocial });
    await wait(durations.sheetPause / speedMult);

    upsertLiveRow(mail, { cuit: mail.cuit });
    await wait(durations.sheetPause / speedMult);

    upsertLiveRow(mail, { monto: mail.monto });
    await wait(durations.sheetPause / speedMult);

    upsertLiveRow(mail, { responsable: mail.senderName });
    await wait(durations.sheetPause / speedMult);

    upsertLiveRow(mail, { email: mail.senderEmail, estado: 'Capturado' });
    await wait(Math.round((durations.sheetPause * 0.7) / speedMult));

    setProcessedMailIds((prev) => (prev.includes(mail.id) ? prev : [...prev, mail.id]));
  };

  const animateDocBuild = async (mail: CreditMail, speedMult: number = 1) => {
    const fields: Array<keyof Omit<DocPreviewState, 'pdfReady'>> = ['razonSocial', 'cuit', 'monto', 'responsable'];
    const source = {
      razonSocial: mail.razonSocial,
      cuit: mail.cuit,
      monto: mail.monto,
      responsable: mail.senderName,
    };

    for (const field of fields) {
      const value = source[field];

      for (let i = 1; i <= value.length; i += 1) {
        if (cancelledRef.current) return;
        setDocPreview((prev) => ({ ...prev, [field]: value.slice(0, i) }));
        await wait(durations.docChar / speedMult);
      }

      await wait(Math.round((durations.docChar * 2.2) / speedMult));
    }
  };

  const animateMailCompose = async (mail: CreditMail, speedMult: number = 1) => {
    setWorkspaceView('gmail-compose');
    setMailToast('');
    setMailDraft({
      to: mail.senderEmail,
      subject: '',
      body: '',
      attachmentReady: false,
      sent: false,
    });

    setLoopLabel('PDF → Gmail');
    setLiveStatus(`Armando correo automático para ${mail.senderEmail}`);

    const subject = `PDF aprobación crediticia - ${mail.razonSocial}`;
    const body = [
      `Hola ${mail.senderName},`,
      '',
      `Te envío adjunto el PDF generado automáticamente para la carpeta de crédito de ${mail.razonSocial}.`,
      `Monto solicitado: ${mail.monto}.`,
      '',
      'Queda a disposición para revisión y seguimiento.',
    ].join('\n');

    for (let i = 1; i <= subject.length; i += 1) {
      if (cancelledRef.current) return;
      setMailDraft((prev) => ({ ...prev, subject: subject.slice(0, i) }));
      await wait(durations.outgoingChar / speedMult);
    }

    await wait(Math.round((durations.transitionPause * 0.55) / speedMult));
    setMailDraft((prev) => ({ ...prev, attachmentReady: true }));

    for (let i = 1; i <= body.length; i += 1) {
      if (cancelledRef.current) return;
      setMailDraft((prev) => ({ ...prev, body: body.slice(0, i) }));
      await wait(durations.outgoingChar / speedMult);
    }

    await wait(Math.round((durations.transitionPause * 0.7) / speedMult));
    setMailDraft((prev) => ({ ...prev, sent: true }));
    setMailToast(`Correo enviado a ${mail.senderEmail}`);
    await wait(Math.round((durations.transitionPause * 0.9) / speedMult));
  };

  useEffect(() => {
    const node = chatScrollRef.current;
    if (!node) return;

    node.scrollTo({
      top: node.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, streamingMessage, composerText, assistantThinking]);

  useEffect(() => {
    if (!isSimulating) return;
    cancelledRef.current = false;

    const run = async () => {
      setStep(1);
      setLoopLabel('Gemini');
      setLiveStatus('Redactando pedido inicial');

      const typed1 = await typeIntoComposer(FIRST_PROMPT, durations.userChar);
      if (!typed1 || cancelledRef.current) return;

      setStep(2);
      const sent1 = await sendComposerToChat(FIRST_PROMPT);
      if (!sent1 || cancelledRef.current) return;

      setStep(3);
      const a1 = await streamAssistantMessage(
        'Entendido, crearé un código para implementar la automatización con Apps Script.'
      );
      if (!a1 || cancelledRef.current) return;

      await wait(2000);
      if (cancelledRef.current) return;

      setWorkspaceView('gmail');

      for (let i = 0; i < 2; i += 1) {
        const mail = CREDIT_MAILS[i];
        const speedMult = i === 1 ? 3 : 1;

        setStep(4 + i);
        setVisibleIncomingCount(i + 1);
        setLoopLabel('Gmail split view');
        setLiveStatus(`Leyendo correo ${i + 1} de 2 y pasando datos a Sheets`);

        await wait(2000);
        if (cancelledRef.current) return;

        setSelectedMailId(mail.id);

        await wait(2000);
        if (cancelledRef.current) return;

        await animateRowFill(mail, speedMult);
        if (cancelledRef.current) return;

        await wait(1000 / speedMult);
        if (cancelledRef.current) return;
      }

      setStep(7);
      setLoopLabel('Gemini');
      setLiveStatus('Redactando segundo pedido');

      const typed2 = await typeIntoComposer(SECOND_PROMPT, Math.max(10, durations.userChar - 4));
      if (!typed2 || cancelledRef.current) return;

      setStep(8);
      const sent2 = await sendComposerToChat(SECOND_PROMPT);
      if (!sent2 || cancelledRef.current) return;

      setStep(9);
      const a3 = await streamAssistantMessage(
        'Claro, crearé una automatización para cada nuevo dato'
      );
      if (!a3 || cancelledRef.current) return;

      await wait(2000);
      if (cancelledRef.current) return;

      setWorkspaceView('drive');
      setLoopLabel('Google Drive');
      setLiveStatus('Buscando el template de aprobación crediticia');
      setDriveFileSelected(false);
      await wait(2000);
      if (cancelledRef.current) return;
      setDriveFileSelected(true);
      await wait(2000);
      if (cancelledRef.current) return;

      for (let i = 0; i < 2; i += 1) {
        const mail = CREDIT_MAILS[i];
        const speedMult = i === 1 ? 3 : 1;
        setSelectedMailId(mail.id);

        setWorkspaceView('docs');
        setLoopLabel('Google Docs');
        setLiveStatus('Completando template');
        setDocPreview(initialDocState);
        await wait(2000 / speedMult);
        if (cancelledRef.current) return;

        upsertLiveRow(mail, { estado: 'Leyendo datos' });
        await wait(2000 / speedMult);
        if (cancelledRef.current) return;

        await animateDocBuild(mail, speedMult);
        if (cancelledRef.current) return;

        upsertLiveRow(mail, { estado: 'Generando PDF' });
        await wait(speedMult === 1 ? 2000 : 1000);
        if (cancelledRef.current) return;
        
        setDocPreview((prev) => ({ ...prev, pdfReady: true }));
        await wait(1000 / speedMult);
        if (cancelledRef.current) return;

        setWorkspaceView('gmail-compose');
        setLoopLabel('Gmail');
        setLiveStatus('Enviando correo');
        upsertLiveRow(mail, { estado: 'Enviando correo' });
        await animateMailCompose(mail, speedMult);
        if (cancelledRef.current) return;

        upsertLiveRow(mail, { estado: mail.outcome });
        await wait(1000 / speedMult);
        if (cancelledRef.current) return;
      }

      setStep(11);
      setLoopLabel('Gemini');
      setLiveStatus('Redactando tercer pedido');

      const typed3 = await typeIntoComposer(THIRD_PROMPT, Math.max(10, durations.userChar - 6));
      if (!typed3 || cancelledRef.current) return;

      setStep(12);
      const sent3 = await sendComposerToChat(THIRD_PROMPT);
      if (!sent3 || cancelledRef.current) return;

      setStep(13);
      const a5 = await streamAssistantMessage(
        'Perfecto, generamos una presentación que se acutalice automáticamente.'
      );
      if (!a5 || cancelledRef.current) return;

      await wait(2000);
      if (cancelledRef.current) return;

      setWorkspaceView('slides');
      setLoopLabel('Google Slides');
      setLiveStatus('Construyendo slide 1');
      setSlidesStage(1);
      await wait(Math.round(durations.transitionPause * 1.45));
      if (cancelledRef.current) return;

      setStep(14);
      setLiveStatus('Construyendo slide 2');
      setSlidesStage(2);
      await wait(Math.round(durations.transitionPause * 1.45));
      if (cancelledRef.current) return;

      setStep(15);
      setLiveStatus('Deck listo para exportar');
      setSlidesStage(3);
      await wait(3000);
      if (cancelledRef.current) return;

      const newMail = CREDIT_MAILS[2];
      upsertLiveRow(newMail, {
        razonSocial: newMail.razonSocial,
        cuit: newMail.cuit,
        monto: newMail.monto,
        responsable: newMail.senderName,
        email: newMail.senderEmail,
        estado: newMail.outcome,
        isNew: true
      });
      setLiveStatus('Actualización en Sheet detectada');
      
      await wait(2000);
      if (cancelledRef.current) return;

      setLiveStatus('Actualizando slides en vivo');
      setSlidesStage(4);
      
      await wait(3000);
      if (cancelledRef.current) return;

      setStep(16);
      setIsSimulating(false);
      setLoopLabel('Automatización completada');
      setLiveStatus('Flujo end-to-end finalizado');
    };

    run();

    return () => {
      cancelledRef.current = true;
      clearTimers();
    };
  }, [isSimulating, durations]);

  const blankRows = Array.from({ length: Math.max(0, 3 - liveRows.length) }, (_, index) => ({
    id: `blank-${index}`,
  }));

  const inboxItems = CREDIT_MAILS.slice(0, visibleIncomingCount).reverse();

  const statePillClass = (estado: string) => {
    if (estado === 'Aprobado') return 'bg-emerald-100 text-emerald-700';
    if (estado === 'Pendiente') return 'bg-amber-100 text-amber-700';
    if (estado === 'Enviando correo') return 'bg-blue-100 text-blue-700';
    if (estado === 'Generando PDF') return 'bg-violet-100 text-violet-700';
    if (estado === 'Leyendo datos') return 'bg-blue-100 text-blue-700';
    if (estado === 'Analizando correo') return 'bg-blue-100 text-blue-700';
    if (estado === 'Capturado') return 'bg-slate-100 text-slate-700';
    return 'bg-slate-100 text-slate-600';
  };

  return (
    <section className="bg-slate-50 min-h-[100dvh] flex flex-col items-center justify-center px-4 py-10 lg:px-8 lg:py-14 w-full">
      <div className="mx-auto max-w-[1700px] w-full">
        <div className="mx-auto max-w-[1040px] text-center">
          <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 shadow-sm">
            Gemini + Apps Script + Google Workspace
          </div>

          <h2 className="mt-6 text-4xl font-display font-bold tracking-tight text-slate-900 md:text-5xl">
            Ahora todos pueden automatizar
          </h2>

          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: "-50px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.015 } },
              hidden: {}
            }}
            className="mx-auto mt-6 max-w-[950px] text-lg leading-8 text-slate-600"
          >
            {"Entrenamos a cada participante basándonos en sus procesos particulares para que, con una simple conversación con Gemini, cada uno pueda generar automatizaciones para sus tareas repetitivas y así dedicar más tiempo a actividades de mayor valor para la compañía.".split(" ").map((word, index) => (
              <motion.span 
                key={index} 
                variants={{
                  hidden: { opacity: 0, y: 5 },
                  visible: { opacity: 1, y: 0 }
                }}
                className="inline-block mr-1.5"
              >
                {word}
              </motion.span>
            ))}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false }}
            className="w-16 h-px bg-slate-300 mx-auto my-8"
          />

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="font-mono text-xs uppercase font-bold tracking-[0.2em] text-[#0040FF]"
          >
            PRESIONA EL BOTÓN AZUL PARA VER EL EJEMPLO.
          </motion.p>

          <div className="mt-8 flex justify-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.985 }}
              onClick={isExpanded ? startSimulation : handleInitialStart}
              className="inline-flex items-center gap-2 rounded-full bg-[#0040FF] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(0,64,255,0.28)]"
            >
              <Sparkles size={16} />
              {isSimulating ? 'Ver simulación en curso' : 'Iniciar Automatización'}
            </motion.button>
          </div>
        </div>

        <motion.div 
          ref={demoFrameRef} 
          className="mt-10 scroll-mt-4 overflow-hidden"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="relative rounded-[32px] border border-slate-200 bg-[#f6f7fb] p-3 shadow-none lg:p-4 overflow-hidden">
            <div className="h-[900px] overflow-hidden">
              <div className="grid h-full min-h-0 gap-4 lg:grid-cols-[400px_1fr]">
                {/* Left: Gemini */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: visiblePanels >= 1 ? 1 : 0, y: visiblePanels >= 1 ? 0 : 20 }}
                  transition={{ duration: 0.5 }}
                  className="min-h-0 overflow-hidden rounded-[28px] border border-[#16171c] bg-[#0b0c10] shadow-none"
                >
                  <div className="flex h-full min-h-0 flex-col">
                    <div className="border-b border-white/8 px-4 py-3">
                      <div className="flex items-center justify-between">
                        <button className="flex h-9 w-9 items-center justify-center rounded-full text-slate-300 hover:bg-white/5">
                          <Menu size={16} />
                        </button>

                        <div className="flex items-center gap-2 text-slate-200">
                          <div className="scale-75 origin-center">
                            <GeminiAvatar />
                          </div>
                          <span className="text-sm font-semibold">
                            Gemini
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <button className="flex h-9 w-9 items-center justify-center rounded-full text-slate-300 hover:bg-white/5">
                            <SquarePen size={16} />
                          </button>
                          <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-slate-400">
                              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                              <circle cx="12" cy="7" r="4" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div ref={chatScrollRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
                      <div className="space-y-6">
                        {step === 0 && (
                          <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                            <div className="mb-4 rounded-full bg-white/6 p-4">
                              <GeminiAvatar />
                            </div>

                            <h3 className="text-xl font-semibold text-white">Gemini Workspace</h3>

                            <p className="mt-3 max-w-[230px] text-sm leading-7 text-slate-400">
                              {WORKSPACE_AGENT_DEMO_VERSION}
                            </p>

                            <p className="mt-5 max-w-[220px] text-xs leading-6 text-slate-500">
                              Presiona el botón superior para iniciar y posicionar la demo automáticamente.
                            </p>
                          </div>
                        )}

                        {messages.map((message) => (
                          <div key={message.id}>
                            {message.role === 'user' ? (
                              <div className="ml-auto max-w-[88%]">
                                <div className="mb-2 flex items-center justify-end gap-2 text-slate-300">
                                  <span className="text-xs font-semibold">Usuario</span>
                                  <div className="h-4 w-4 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 text-slate-400">
                                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                      <circle cx="12" cy="7" r="4" />
                                    </svg>
                                  </div>
                                </div>
                                <div className="rounded-[24px] rounded-tr-md bg-[#2a2d31] px-4 py-4 text-[12px] leading-7 text-white">
                                  {message.text}
                                </div>
                              </div>
                            ) : (
                              <div className="max-w-[94%]">
                                <div className="mb-2 flex items-center gap-2 text-slate-300">
                                  <Sparkles size={13} className="text-[#60a5fa]" />
                                  <span className="text-xs font-semibold">Gemini</span>
                                </div>
                                <div className="text-[12px] leading-7 text-slate-100">{message.text}</div>
                              </div>
                            )}
                          </div>
                        ))}

                        {assistantThinking && (
                          <div className="max-w-[94%]">
                            <div className="mb-2 flex items-center gap-2 text-slate-300">
                              <Sparkles size={13} className="text-[#60a5fa]" />
                              <span className="text-xs font-semibold">Gemini</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.2s]" />
                              <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.1s]" />
                              <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
                            </div>
                          </div>
                        )}

                        {streamingMessage && (
                          <div className="max-w-[94%]">
                            <div className="mb-2 flex items-center gap-2 text-slate-300">
                              <Sparkles size={13} className="text-[#60a5fa]" />
                              <span className="text-xs font-semibold">Gemini</span>
                            </div>
                            <div className="text-[12px] leading-7 text-slate-100">
                              {streamingMessage.text}
                              <span className="ml-1 inline-block h-4 w-[2px] animate-pulse bg-slate-400 align-middle" />
                            </div>
                          </div>
                        )}

                        {/* Removed status card as requested */}
                      </div>
                    </div>

                    <div className="border-t border-white/8 px-4 py-4">
                      <div className="rounded-[22px] border border-white/8 bg-[#171922] px-4 py-4">
                        <div className="min-h-[42px] text-[12px] leading-6 text-white">
                          {composerText ? (
                            <span>
                              {composerText}
                              {(step === 1 || step === 8 || step === 12) && (
                                <span className="ml-1 inline-block h-4 w-[2px] animate-pulse bg-slate-400 align-middle" />
                              )}
                            </span>
                          ) : (
                            <span className="text-slate-500">Enter a prompt for Gemini</span>
                          )}
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-3 text-slate-400">
                            <button className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/6">
                              <Plus size={15} />
                            </button>
                            <button className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/6">
                              <SlidersHorizontal size={14} />
                            </button>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="rounded-full px-2 py-1 text-[11px] text-slate-300">Pro</span>
                            <button
                              className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${
                                composerText ? 'bg-white text-slate-900' : 'bg-white/8 text-slate-500'
                              }`}
                            >
                              <SendHorizontal size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Right side */}
                <div className="grid h-full min-h-0 gap-4 lg:grid-rows-[0.31fr_0.69fr]">
                  {/* Sheets */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: visiblePanels >= 3 ? 1 : 0, y: visiblePanels >= 3 ? 0 : 20 }}
                    transition={{ duration: 0.5 }}
                    className="min-h-0 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-none"
                  >
                    <div className="flex h-full min-h-0 flex-col">
                      <div className="border-b border-slate-200 bg-[#edf2fb] px-4 py-1.5">
                        <div className="flex items-center gap-4">
                          <MacTrafficLights />
                          <div className="flex min-w-0 flex-1 items-center justify-center">
                            <div className="flex w-[74%] items-center gap-3 rounded-[12px] bg-white/90 px-3 py-1.5 text-[10px] text-slate-500 shadow-sm">
                              <FileSpreadsheet size={14} className="text-[#0f9d58]" />
                              <span className="truncate">
                                docs.google.com/spreadsheets/d/credit-committee-automation
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border-b border-slate-200 bg-[#f8fafc]">
                        <div className="flex items-center justify-between px-4 py-2">
                          <div className="flex items-center gap-3">
                            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#dff1e5]">
                              <FileSpreadsheet size={12} className="text-[#0f9d58]" />
                            </div>
                            <div>
                              <p className="text-[11px] font-medium text-slate-500">Google Sheets - Comité_Crédito_Operaciones_2026</p>
                      
                            </div>
                          </div>

                          <div className="hidden items-center gap-4 text-[11px] text-slate-500 md:flex">
                            <span>File</span>
                            <span>Edit</span>
                            <span>View</span>
                            <span>Insert</span>
                            <span>Format</span>
                            <span>Tools</span>
                            <span>Extensions</span>
                          </div>
                        </div>

                        
                      </div>

                      <div className="min-h-0 flex-1 overflow-hidden bg-white">
                        <div className="h-full overflow-auto">
                          <div
                            className="origin-top-left"
                            style={{
                              transform: `scale(${SHEET_SCALE})`,
                              width: `${100 / SHEET_SCALE}%`,
                              minHeight: `${100 / SHEET_SCALE}%`,
                            }}
                          >
                            <table className="w-full border-collapse text-left text-[14px] text-slate-700">
                              <thead className="sticky top-0 z-10 bg-slate-50">
                                <tr className="border-b border-slate-200">
                                  <th className="border-r border-slate-200 px-4 py-4 font-semibold text-slate-500">
                                    Razón Social
                                  </th>
                                  <th className="border-r border-slate-200 px-4 py-4 font-semibold text-slate-500">
                                    CUIT
                                  </th>
                                  <th className="border-r border-slate-200 px-4 py-4 font-semibold text-slate-500">
                                    Monto
                                  </th>
                                  <th className="border-r border-slate-200 px-4 py-4 font-semibold text-slate-500">
                                    Responsable
                                  </th>
                                  <th className="border-r border-slate-200 px-4 py-4 font-semibold text-slate-500">
                                    Email responsable
                                  </th>
                                  <th className="px-4 py-4 font-semibold text-slate-500">Estado</th>
                                </tr>
                              </thead>

                              <tbody>
                                {liveRows.map((row) => (
                                  <motion.tr
                                    key={row.id}
                                    layout
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ 
                                      opacity: 1, 
                                      y: 0,
                                      backgroundColor: row.isNew ? 'rgba(255, 64, 80, 0.1)' : (row.estado === 'Extrayendo' ? '#ecfdf5' : row.estado === 'Leyendo datos' ? '#eff6ff' : '#ffffff'),
                                    }}
                                    className="border-b border-slate-100"
                                  >
                                    <td className="border-r border-slate-100 px-4 py-3 font-medium text-slate-900 relative">
                                      <AnimatePresence>
                                        {(row.estado === 'Extrayendo' || row.estado === 'Leyendo datos' || row.isNew) && (
                                          <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0 }}
                                            className={`absolute left-0 top-0 bottom-0 w-1 ${row.isNew ? 'bg-[#FF4050]' : (row.estado === 'Extrayendo' ? 'bg-emerald-500' : 'bg-blue-500')}`}
                                          />
                                        )}
                                      </AnimatePresence>
                                      {row.razonSocial || '—'}
                                    </td>
                                    <td className="border-r border-slate-100 px-4 py-3">{row.cuit || '—'}</td>
                                    <td className="border-r border-slate-100 px-4 py-3">{row.monto || '—'}</td>
                                    <td className="border-r border-slate-100 px-4 py-3">
                                      {row.responsable || '—'}
                                    </td>
                                    <td className="border-r border-slate-100 px-4 py-3">{row.email || '—'}</td>
                                    <td className="px-4 py-3">
                                      <span
                                        className={`inline-flex rounded-full px-3 py-1 text-[10px] font-semibold ${statePillClass(
                                          row.estado
                                        )}`}
                                      >
                                        {row.estado}
                                      </span>
                                    </td>
                                  </motion.tr>
                                ))}

                                {blankRows.map((row) => (
                                  <tr key={row.id} className="border-b border-slate-100">
                                    <td className="border-r border-slate-100 px-4 py-3 text-slate-300">—</td>
                                    <td className="border-r border-slate-100 px-4 py-3 text-slate-300">—</td>
                                    <td className="border-r border-slate-100 px-4 py-3 text-slate-300">—</td>
                                    <td className="border-r border-slate-100 px-4 py-3 text-slate-300">—</td>
                                    <td className="border-r border-slate-100 px-4 py-3 text-slate-300">—</td>
                                    <td className="px-4 py-3 text-slate-300">—</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-slate-200 bg-gradient-to-r from-white to-slate-50 px-4 py-2">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-white">
                              <CircleDashed size={13} className={isSimulating ? 'animate-spin' : ''} />
                            </div>
                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                                Loop automático - 
                              {loopLabel}</p>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            {['inbox', 'sheets', 'docs/pdf', 'email', 'slides'].map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-medium text-slate-600"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Workspace Viewer */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: visiblePanels >= 2 ? 1 : 0, y: visiblePanels >= 2 ? 0 : 20 }}
                    transition={{ duration: 0.5 }}
                    className="min-h-0 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-none"
                  >
                    <div className="flex h-full min-h-0 flex-col">
                      <div className="border-b border-slate-200 bg-[#edf2fb] px-4 py-1.5">
                        <div className="flex items-center gap-4">
                          <MacTrafficLights />
                          <div className="flex min-w-0 flex-1 items-center justify-center">
                            <div className="flex w-[74%] items-center gap-3 rounded-[12px] bg-white/90 px-3 py-1.5 text-[10px] text-slate-500 shadow-sm">
                              {workspaceView === 'gmail' || workspaceView === 'gmail-compose' ? (
                                <Mail size={14} className="text-red-500" />
                              ) : workspaceView === 'drive' ? (
                                <FolderOpen size={14} className="text-[#0f9d58]" />
                              ) : workspaceView === 'docs' ? (
                                <FileText size={14} className="text-[#1a73e8]" />
                              ) : (
                                <Presentation size={14} className="text-[#f59e0b]" />
                              )}

                              <span className="truncate">
                                {workspaceView === 'gmail' || workspaceView === 'gmail-compose'
                                  ? 'mail.google.com/mail/u/0/#inbox'
                                  : workspaceView === 'drive'
                                  ? 'drive.google.com/drive/my-drive'
                                  : workspaceView === 'docs'
                                  ? 'docs.google.com/document/d/template-aprobacion'
                                  : 'slides.google.com/presentation/d/credit-summary-deck'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="min-h-0 flex-1 overflow-hidden bg-[#f7f8fb]">
                        <AnimatePresence mode="wait">
                          {/* Gmail split view */}
                          {workspaceView === 'gmail' && (
                            <motion.div
                              key="gmail-split"
                              initial={{ opacity: 0, x: 14 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -14 }}
                              className="flex h-full min-h-0 flex-col bg-white"
                            >
                              <div className="border-b border-slate-200 bg-white px-4 py-3">
                                <div className="flex items-center justify-between gap-4">
                                  <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-3">
                                      <Mail size={20} className="text-red-500" />
                                      <span className="text-lg font-semibold text-slate-700">Gmail</span>
                                    </div>

                                    <div className="hidden items-center gap-3 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-500 md:flex md:min-w-[300px]">
                                      <Search size={16} />
                                      <span>Search mail</span>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-4 text-slate-500">
                                    <span className="hidden rounded-full bg-slate-100 px-3 py-2 text-xs md:inline-flex">
                                      Active
                                    </span>
                                    <div className="h-9 w-9 rounded-full bg-slate-100" />
                                  </div>
                                </div>
                              </div>

                              <div className="grid min-h-0 flex-1 grid-cols-[minmax(330px,0.92fr)_1.08fr] overflow-hidden">
                                {/* Inbox list */}
                                <div className="min-h-0 overflow-y-auto border-r border-slate-200 bg-white">
                                  <div className="sticky top-0 z-10 border-b border-slate-200 bg-white px-4 py-3">
                                    <div className="flex items-center justify-between text-xs text-slate-500">
                                      <span>Inbox</span>
                                      <span>1–100 of 1,395</span>
                                    </div>
                                  </div>

                                  <div className="divide-y divide-slate-200">
                                    {inboxItems.map((item) => {
                                      const isSelected = item.id === selectedMailId;
                                      const isRead = processedMailIds.includes(item.id) && !isSelected;
                                      const rowBg = isSelected ? 'bg-[#dbeafe]' : isRead ? 'bg-[#f8fafc]' : 'bg-white';
                                      const rowWeight = isSelected || !isRead ? 'font-semibold' : 'font-medium';

                                      return (
                                        <motion.div
                                          key={item.id}
                                          initial={{ opacity: 0, y: -8 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          className={`grid grid-cols-[30px_125px_1fr_56px] items-center gap-3 px-4 py-3 ${rowBg}`}
                                        >
                                          <div className="flex items-center justify-center">
                                            <div
                                              className={`h-2.5 w-2.5 rounded-full ${
                                                isRead ? 'bg-slate-300' : 'bg-[#2563eb]'
                                              }`}
                                            />
                                          </div>

                                          <div className={`truncate text-[11px] text-slate-800 ${rowWeight}`}>
                                            {item.branch}
                                          </div>

                                          <div className="truncate text-[11px] text-slate-700">
                                            <span className={rowWeight}>{item.subject}</span>
                                            {isSelected && (
                                              <span className="ml-1 text-slate-500">— procesando…</span>
                                            )}
                                          </div>

                                          <div className="text-right text-[10px] text-slate-500">
                                            {item.receivedAt}
                                          </div>
                                        </motion.div>
                                      );
                                    })}

                                    {OLD_GMAIL_ITEMS.map((item) => (
                                      <div
                                        key={item.id}
                                        className="grid grid-cols-[30px_125px_1fr_56px] items-center gap-3 bg-[#f8fafc] px-4 py-3"
                                      >
                                        <div className="flex items-center justify-center">
                                          <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                                        </div>
                                        <div className="truncate text-[11px] font-medium text-slate-700">
                                          {item.from}
                                        </div>
                                        <div className="truncate text-[11px] text-slate-600">{item.subject}</div>
                                        <div className="text-right text-[10px] text-slate-500">{item.date}</div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Detail panel */}
                                <div className="min-h-0 overflow-y-auto bg-white p-4 relative">
                                  <AnimatePresence>
                                    {['Analizando correo', 'Extrayendo'].includes(liveRows.find((r) => r.id === selectedMail.id)?.estado || '') && (
                                      <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.1 }}
                                        className="absolute inset-0 bg-emerald-500/10 backdrop-blur-[1px] border-2 border-emerald-400 flex items-center justify-center z-10"
                                      >
                                        <motion.div 
                                          initial={{ y: 10 }}
                                          animate={{ y: 0 }}
                                          className="bg-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-emerald-600 font-medium text-sm"
                                        >
                                          <Search size={16} className="animate-pulse" />
                                          Extrayendo datos
                                        </motion.div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                  <div className="mb-4 flex items-start justify-between gap-6">
                                    <div>
                                      <div className="mb-3 flex items-center gap-2">
                                        <h3 className="text-[17px] font-semibold text-slate-800">
                                          {selectedMail.subject}
                                        </h3>
                                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">
                                          Inbox
                                        </span>
                                      </div>

                                      <div className="flex items-center gap-3 text-[12px] text-slate-600">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                          {selectedMail.branch.charAt(0)}
                                        </div>
                                        <div>
                                          <p className="font-semibold text-slate-800">{selectedMail.branch}</p>
                                          <p>{selectedMail.senderEmail}</p>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="text-right text-[11px] text-slate-400">
                                      {selectedMail.receivedAt}
                                    </div>
                                  </div>

                                  <div className="space-y-4 text-[12px] leading-7 text-slate-700">
                                    <p>Estimado equipo,</p>
                                    <p>
                                      Adjunto la información solicitada para la evaluación de nuestra carpeta de
                                      crédito.
                                    </p>

                                    <div className="rounded-[22px] border border-slate-200 bg-[#f8fafc] p-4">
                                      <p className="mb-3 text-[12px] font-bold text-slate-900">
                                        Resumen Financiero 2026:
                                      </p>
                                      {selectedMail.resumenParagraph ? (
                                        <p className="text-[11px] text-slate-700 leading-relaxed">
                                          {selectedMail.resumenParagraph}
                                        </p>
                                      ) : (
                                        <ul className="space-y-1 font-mono text-[11px] text-slate-700">
                                          {selectedMail.resumen.map((line) => (
                                            <li key={line}>• {line}</li>
                                          ))}
                                        </ul>
                                      )}
                                    </div>

                                    <p>Quedo a disposición por cualquier consulta adicional.</p>
                                    <p>
                                      Saludos cordiales,
                                      <br />
                                      {selectedMail.senderName}
                                      <br />
                                      Responsable de aprobación
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}

                          {/* Drive */}
                          {workspaceView === 'drive' && (
                            <motion.div
                              key="drive"
                              initial={{ opacity: 0, x: 14 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -14 }}
                              className="flex h-full min-h-0 flex-col bg-white"
                            >
                              <div className="border-b border-slate-200 bg-white px-4 py-3">
                                <div className="flex items-center justify-between gap-4">
                                  <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-3">
                                      <FolderOpen size={20} className="text-[#0f9d58]" />
                                      <span className="text-lg font-semibold text-slate-700">Drive</span>
                                    </div>
                                    <div className="hidden items-center gap-3 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-500 md:flex md:min-w-[300px]">
                                      <Search size={16} />
                                      <span>Search in Drive</span>
                                    </div>
                                  </div>
                                  <div className="h-9 w-9 rounded-full bg-slate-100" />
                                </div>
                              </div>

                              <div className="min-h-0 flex-1 overflow-y-auto p-4">
                                <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                                  Suggested folders
                                </p>

                                <div className="grid grid-cols-4 gap-3">
                                  {['Plantillas Crédito', 'Clientes PyME', 'Riesgo', 'Reportes'].map(
                                    (folder, idx) => (
                                      <motion.div
                                        key={folder}
                                        className={`rounded-[18px] border p-4 ${
                                          idx === 0
                                            ? 'border-slate-200 bg-slate-50'
                                            : 'border-slate-200 bg-slate-50'
                                        }`}
                                      >
                                        <FolderOpen
                                          size={18}
                                          className={idx === 0 ? 'text-[#0f9d58]' : 'text-slate-500'}
                                        />
                                        <p className="mt-3 text-[12px] font-semibold text-slate-900">{folder}</p>
                                        <p className="mt-1 text-[11px] text-slate-500">in My Drive</p>
                                      </motion.div>
                                    )
                                  )}
                                </div>

                                <div className="mt-6 rounded-[18px] border border-slate-200 bg-white p-4">
                                  <div className="mb-3 flex items-center justify-between">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                                      Suggested files
                                    </p>
                                    {driveFileSelected && <span className="text-[11px] text-blue-600">opening…</span>}
                                  </div>

                                  <div className="space-y-2">
                                    {[
                                      'Template_Aprobacion_Crediticia.gdoc',
                                      'Checklist_Comercial_2026.docx',
                                      'Manual_Workflow_Credito.pdf',
                                    ].map((file, idx) => (
                                      <div
                                        key={file}
                                        className={`flex items-center justify-between rounded-2xl px-4 py-3 transition-colors ${
                                          idx === 0 && driveFileSelected ? 'bg-blue-50 ring-1 ring-blue-200' : 'bg-slate-50'
                                        }`}
                                      >
                                        <div className="flex items-center gap-3">
                                          <FileText
                                            size={16}
                                            className={idx === 0 ? 'text-[#1a73e8]' : 'text-slate-500'}
                                          />
                                          <span className="text-[12px] font-medium text-slate-800">{file}</span>
                                        </div>
                                        <span className="text-[11px] text-slate-500">9 Apr</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}

                          {/* Docs */}
                          {workspaceView === 'docs' && (
                            <motion.div
                              key={`docs-${selectedMailId}`}
                              initial={{ opacity: 0, x: 14 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -14 }}
                              className="flex h-full min-h-0 flex-col bg-[#f5f6fa]"
                            >
                              <div className="border-b border-slate-200 bg-white px-4 py-3">
                                <div className="flex items-center justify-between gap-4">
                                  <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-3">
                                      <FileText size={20} className="text-[#1a73e8]" />
                                      <span className="text-[14px] font-semibold text-slate-700">
                                        Template de aprobación
                                      </span>
                                    </div>

                                    <div className="hidden items-center gap-4 text-xs text-slate-500 lg:flex">
                                      <span>File</span>
                                      <span>Edit</span>
                                      <span>View</span>
                                      <span>Insert</span>
                                      <span>Format</span>
                                      <span>Tools</span>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-3">
                                    <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[11px] text-slate-500">
                                      Editing
                                    </span>
                                    <div className="h-8 w-8 rounded-full bg-slate-100" />
                                  </div>
                                </div>
                              </div>

                              <div className="flex min-h-0 flex-1 overflow-hidden p-4">
                                <div className="min-h-0 flex-1 overflow-y-auto relative">
                                  <div className="mx-auto max-w-[720px] rounded-[22px] border border-slate-200 bg-white p-6 shadow-sm relative overflow-hidden">
                                    <AnimatePresence>
                                      {liveRows.find((r) => r.id === selectedMail.id)?.estado === 'Generando PDF' && (
                                        <motion.div
                                          initial={{ opacity: 0, scale: 0.9 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          exit={{ opacity: 0, scale: 1.1 }}
                                          className="absolute inset-0 bg-red-500/10 backdrop-blur-[1px] border-2 border-red-400 flex items-center justify-center z-10"
                                        >
                                          <motion.div 
                                            initial={{ y: 10 }}
                                            animate={{ y: 0 }}
                                            className="bg-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-red-600 font-medium text-sm"
                                          >
                                            <FileText size={16} className="animate-pulse" />
                                            Generando PDF
                                          </motion.div>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                    <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                                      TEMPLATE DE APROBACIÓN CREDITICIA
                                    </p>

                                    <div className="space-y-5 text-[12px] leading-8 text-slate-700">
                                      <p>
                                        Por medio del presente se deja constancia de la solicitud correspondiente a{' '}
                                        <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[#1a73e8]">
                                          {docPreview.razonSocial || '{{RAZON_SOCIAL}}'}
                                        </span>
                                        .
                                      </p>

                                      <p>
                                        CUIT{' '}
                                        <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[#1a73e8]">
                                          {docPreview.cuit || '{{CUIT}}'}
                                        </span>
                                        .
                                      </p>

                                      <p>
                                        Monto solicitado{' '}
                                        <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[#1a73e8]">
                                          {docPreview.monto || '{{MONTO}}'}
                                        </span>
                                        .
                                      </p>

                                      <p>
                                        Responsable de aprobación{' '}
                                        <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[#1a73e8]">
                                          {docPreview.responsable || '{{RESPONSABLE}}'}
                                        </span>
                                        .
                                      </p>

                                      <p>
                                        Una vez verificado el circuito documental, este archivo será exportado
                                        automáticamente en PDF.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}

                          {/* Gmail compose */}
                          {workspaceView === 'gmail-compose' && (
                            <motion.div
                              key={`gmail-compose-${selectedMailId}`}
                              initial={{ opacity: 0, x: 14 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -14 }}
                              className="flex h-full min-h-0 flex-col bg-white"
                            >
                              <div className="border-b border-slate-200 bg-white px-4 py-3">
                                <div className="flex items-center justify-between gap-4">
                                  <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-3">
                                      <Mail size={20} className="text-red-500" />
                                      <span className="text-lg font-semibold text-slate-700">Gmail</span>
                                    </div>

                                    <div className="hidden items-center gap-3 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-500 md:flex md:min-w-[300px]">
                                      <Search size={16} />
                                      <span>Search mail</span>
                                    </div>
                                  </div>

                                  <div className="h-9 w-9 rounded-full bg-slate-100" />
                                </div>
                              </div>

                              <div className="min-h-0 flex-1 overflow-y-auto bg-[#f8fafc] p-4">
                                <div className="mx-auto max-w-[720px] rounded-[24px] border border-slate-200 bg-white shadow-[0_14px_36px_rgba(15,23,42,0.08)]">
                                  <div className="border-b border-slate-200 px-4 py-3">
                                    <div className="flex items-center justify-between">
                                      <p className="text-sm font-semibold text-slate-800">New Message</p>
                                      <span className="text-slate-400">⋮</span>
                                    </div>
                                  </div>

                                  <div className="space-y-3 px-4 py-4">
                                    <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                                      <span className="w-14 text-[11px] text-slate-500">To</span>
                                      <span className="text-[12px] text-slate-800">{mailDraft.to || '—'}</span>
                                    </div>

                                    <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                                      <span className="w-14 text-[11px] text-slate-500">Subject</span>
                                      <span className="text-[12px] text-slate-800">
                                        {mailDraft.subject}
                                        {!mailDraft.sent && (
                                          <span className="ml-1 inline-block h-4 w-[2px] animate-pulse bg-slate-300 align-middle" />
                                        )}
                                      </span>
                                    </div>

                                    <div className="min-h-[140px] whitespace-pre-wrap text-[12px] leading-6 text-slate-700">
                                      {mailDraft.body}
                                      {mailDraft.body && !mailDraft.sent && (
                                        <span className="ml-1 inline-block h-4 w-[2px] animate-pulse bg-slate-300 align-middle" />
                                      )}
                                    </div>

                                    {mailDraft.attachmentReady && (
                                      <motion.div
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-[#f8fafc] px-3 py-2 text-[11px] text-slate-700 font-medium w-fit"
                                      >
                                        <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center text-white">
                                          <FileText size={12} />
                                        </div>
                                        Aprobacion_{selectedMail.razonSocial.replace(/\s+/g, '_')}.pdf
                                      </motion.div>
                                    )}

                                    <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-6">
                                      <div className="flex items-center gap-3">
                                        <button
                                          className={`inline-flex items-center gap-2 rounded-full px-6 py-2 text-[13px] font-semibold ${
                                            mailDraft.sent
                                              ? 'bg-emerald-600 text-white'
                                              : 'bg-[#0040FF] text-white'
                                          }`}
                                        >
                                          {mailDraft.sent ? 'Sent' : 'Send'}
                                          <ChevronDown size={14} className="ml-1" />
                                        </button>
                                        <div className="flex items-center gap-2 text-slate-500 ml-2">
                                          <span className="font-serif text-lg px-2">A</span>
                                          <Paperclip size={16} className="mx-1" />
                                          <span className="mx-1">🔗</span>
                                          <span className="mx-1">😊</span>
                                          <span className="mx-1">🖼️</span>
                                        </div>
                                      </div>

                                      <div className="text-slate-400">🗑️</div>
                                    </div>
                                  </div>
                                </div>

                                <AnimatePresence>
                                  {mailToast && (
                                    <motion.div
                                      initial={{ opacity: 0, scale: 0.9 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0.9 }}
                                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[300px] rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 shadow-lg z-50"
                                    >
                                      <div className="flex items-start gap-2">
                                        <CheckCircle2 size={16} className="mt-0.5 text-emerald-600" />
                                        <div>
                                          <p className="text-[11px] font-semibold text-emerald-800">
                                            Envío automático completado
                                          </p>
                                          <p className="mt-1 text-[10px] text-emerald-700">{mailToast}</p>
                                        </div>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </motion.div>
                          )}

                          {/* Slides */}
                          {workspaceView === 'slides' && (
                            <motion.div
                              key="slides"
                              initial={{ opacity: 0, x: 14 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -14 }}
                              className="flex h-full min-h-0 flex-col bg-[#f5f6fa]"
                            >
                              <div className="border-b border-slate-200 bg-white px-4 py-3">
                                <div className="flex items-center justify-between gap-4">
                                  <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-3">
                                      <Presentation size={20} className="text-[#f59e0b]" />
                                      <span className="text-[14px] font-semibold text-slate-700">
                                        Resumen_Credito_Q2
                                      </span>
                                    </div>

                                    <div className="hidden items-center gap-4 text-xs text-slate-500 lg:flex">
                                      <span>File</span>
                                      <span>Edit</span>
                                      <span>View</span>
                                      <span>Insert</span>
                                      <span>Slide</span>
                                      <span>Arrange</span>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-3">
                                    <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[11px] text-slate-500">
                                      Share
                                    </span>
                                    <div className="h-8 w-8 rounded-full bg-slate-100" />
                                  </div>
                                </div>
                              </div>

                              <div className="grid min-h-0 flex-1 grid-cols-[76px_1fr] gap-4 overflow-hidden p-4">
                                <div className="min-h-0 space-y-3 overflow-y-auto">
                                  {[1, 2].map((slideNo) => (
                                    <motion.div
                                      key={slideNo}
                                      animate={{
                                        boxShadow:
                                          slidesStage >= slideNo
                                            ? '0px 0px 0px 2px rgba(96,165,250,0.35)'
                                            : '0px 0px 0px 1px rgba(226,232,240,1)',
                                      }}
                                      className="rounded-[16px] border border-slate-200 bg-white p-2 shadow-sm"
                                    >
                                      <p className="mb-2 text-[9px] font-semibold text-slate-500">S{slideNo}</p>
                                      <div className="h-11 rounded-lg bg-slate-100" />
                                    </motion.div>
                                  ))}
                                </div>

                                <div className="min-h-0 overflow-y-auto">
                                  <div className="grid gap-4 lg:grid-cols-2">
                                    {/* Slide 1 */}
                                    <motion.div
                                      initial={{ opacity: 0.45 }}
                                      animate={{ opacity: slidesStage >= 1 ? 1 : 0.45 }}
                                      className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm"
                                    >
                                      <div className="mb-4 flex items-center justify-between">
                                        <div>
                                          <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                                            Slide 1
                                          </p>
                                          <h3 className="mt-2 text-[15px] font-bold text-slate-900">
                                            Tasa de aprobados y pendientes
                                          </h3>
                                        </div>
                                        <div className="rounded-full bg-slate-100 px-3 py-1 text-[10px] text-slate-600">
                                          Actualizado con Sheets
                                        </div>
                                      </div>

                                      <div className="grid gap-4 lg:grid-cols-[140px_1fr]">
                                        <div className="flex items-center justify-center rounded-[18px] bg-[#f8fafc] p-4">
                                          <div className="relative flex h-24 w-24 items-center justify-center">
                                            <svg className="h-24 w-24 -rotate-90" viewBox="0 0 120 120">
                                              <circle
                                                cx="60"
                                                cy="60"
                                                r="44"
                                                stroke="#E2E8F0"
                                                strokeWidth="14"
                                                fill="none"
                                              />
                                              <motion.circle
                                                cx="60"
                                                cy="60"
                                                r="44"
                                                stroke="#0040FF"
                                                strokeWidth="14"
                                                fill="none"
                                                strokeLinecap="round"
                                                strokeDasharray={276}
                                                initial={{ strokeDashoffset: 276 }}
                                                animate={{
                                                  strokeDashoffset:
                                                    slidesStage >= 1
                                                      ? 276 - (276 * metrics.approvalRate) / 100
                                                      : 276,
                                                }}
                                                transition={{ duration: 1.1 }}
                                              />
                                            </svg>
                                            <div className="absolute text-center">
                                              <p className="text-[20px] font-bold text-slate-900">
                                                {metrics.approvalRate}%
                                              </p>
                                              <p className="mt-0.5 text-[10px] text-slate-500">aprobado</p>
                                            </div>
                                          </div>
                                        </div>

                                        <div className="grid gap-3">
                                          <div className="grid gap-3 md:grid-cols-3">
                                            {[
                                              {
                                                label: 'Aprobados',
                                                value: metrics.approved,
                                                ring: 'ring-blue-100 bg-blue-50',
                                              },
                                              {
                                                label: 'Pendientes',
                                                value: metrics.pending,
                                                ring: 'ring-blue-100 bg-blue-50',
                                              },
                                              {
                                                label: 'Operaciones',
                                                value: metrics.total,
                                                ring: 'ring-sky-100 bg-sky-50',
                                              },
                                            ].map((kpi) => (
                                              <div
                                                key={kpi.label}
                                                className={`rounded-[18px] p-3 ring-1 ${kpi.ring}`}
                                              >
                                                <p className="text-[10px] font-semibold text-slate-500">
                                                  {kpi.label}
                                                </p>
                                                <p className="mt-2 text-[22px] font-bold text-slate-900">
                                                  {kpi.value}
                                                </p>
                                              </div>
                                            ))}
                                          </div>

                                          <div className="rounded-[18px] border border-slate-200 bg-white p-3">
                                            <div className="mb-3 flex items-center gap-2">
                                              <Clock3 size={13} className="text-slate-500" />
                                              <p className="text-[10px] font-semibold text-slate-700">
                                                Distribución del pipeline
                                              </p>
                                            </div>

                                            <div className="space-y-3">
                                              {[
                                                {
                                                  label: 'Aprobado',
                                                  value: metrics.approved,
                                                  color: 'bg-[#0040FF]',
                                                },
                                                {
                                                  label: 'Pendiente',
                                                  value: metrics.pending,
                                                  color: 'bg-[#0040FF]/40',
                                                },
                                              ].map((item) => (
                                                <div key={item.label}>
                                                  <div className="mb-1 flex items-center justify-between text-[10px] text-slate-600">
                                                    <span>{item.label}</span>
                                                    <span>{item.value}</span>
                                                  </div>
                                                  <div className="h-3 rounded-full bg-slate-100">
                                                    <motion.div
                                                      initial={{ width: 0 }}
                                                      animate={{
                                                        width:
                                                          slidesStage >= 1
                                                            ? `${
                                                                (item.value / Math.max(1, metrics.total || 1)) * 100
                                                              }%`
                                                            : 0,
                                                      }}
                                                      transition={{ duration: 1 }}
                                                      className={`h-full rounded-full ${item.color}`}
                                                    />
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </motion.div>

                                    {/* Slide 2 */}
                                    <motion.div
                                      initial={{ opacity: 0.45 }}
                                      animate={{ opacity: slidesStage >= 2 ? 1 : 0.45 }}
                                      className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm"
                                    >
                                      <div className="mb-4 flex items-center justify-between">
                                        <div>
                                          <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                                            Slide 2
                                          </p>
                                          <h3 className="mt-2 text-[15px] font-bold text-slate-900">
                                            Monto por operación y estado
                                          </h3>
                                        </div>
                                        <div className="rounded-full bg-slate-100 px-3 py-1 text-[10px] text-slate-600">
                                          Export ready
                                        </div>
                                      </div>

                                      <div className="grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
                                        <div className="rounded-[18px] border border-slate-200 bg-white p-3">
                                          <div className="mb-3 flex items-center gap-2">
                                            <BarChart3 size={13} className="text-slate-500" />
                                            <p className="text-[10px] font-semibold text-slate-700">
                                              Montos por cliente
                                            </p>
                                          </div>

                                          <div className="space-y-3">
                                            {metrics.data.map((row, index) => {
                                              const raw = Number(row.monto.replace(/[^\d]/g, '')) || 0;
                                              const max =
                                                Math.max(
                                                  ...metrics.data.map(
                                                    (r) => Number(r.monto.replace(/[^\d]/g, '')) || 0
                                                  ),
                                                  1
                                                ) || 1;

                                              return (
                                                <div key={row.id}>
                                                  <div className="mb-1 flex items-center justify-between text-[10px] text-slate-600">
                                                    <span>{row.razonSocial}</span>
                                                    <span>{row.monto}</span>
                                                  </div>
                                                  <div className="h-3 rounded-full bg-slate-100">
                                                    <motion.div
                                                      initial={{ width: 0 }}
                                                      animate={{
                                                        width: slidesStage >= 2 ? `${(raw / max) * 100}%` : 0,
                                                      }}
                                                      transition={{ duration: 1, delay: index * 0.08 }}
                                                      className={`h-full rounded-full ${
                                                        row.estado === 'Pendiente'
                                                          ? 'bg-[#0040FF]/40'
                                                          : 'bg-[#0040FF]'
                                                      }`}
                                                    />
                                                  </div>
                                                </div>
                                              );
                                            })}
                                          </div>
                                        </div>

                                        <div className="rounded-[18px] bg-gradient-to-br from-slate-900 via-[#101726] to-slate-900 p-4 text-white">
                                          <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-300">
                                            Snapshot
                                          </p>
                                          <h4 className="mt-3 text-[15px] font-bold">Comité de Crédito</h4>

                                          <div className="mt-4 space-y-3">
                                            {[
                                              {
                                                label: 'Aprobados',
                                                value: metrics.approved,
                                                tone: 'bg-[#0040FF]/20 text-blue-300',
                                              },
                                              {
                                                label: 'Pendientes',
                                                value: metrics.pending,
                                                tone: 'bg-[#0040FF]/40 text-blue-200',
                                              },
                                              {
                                                label: 'Rate',
                                                value: `${metrics.approvalRate}%`,
                                                tone: 'bg-sky-400/20 text-sky-300',
                                              },
                                            ].map((item, idx) => (
                                              <motion.div
                                                key={item.label}
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{
                                                  opacity: slidesStage >= 2 ? 1 : 0,
                                                  y: slidesStage >= 2 ? 0 : 8,
                                                }}
                                                transition={{ delay: idx * 0.1 }}
                                                className="flex items-center justify-between rounded-2xl bg-white/6 px-3 py-3"
                                              >
                                                <span className="text-[11px] text-slate-200">{item.label}</span>
                                                <span
                                                  className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${item.tone}`}
                                                >
                                                  {item.value}
                                                </span>
                                              </motion.div>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    </motion.div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="border-t border-slate-200 bg-gradient-to-r from-white to-slate-50 px-4 py-2">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-white">
                              <Clock3 size={13} />
                            </div>
                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                                Proceso activo - 
                              {liveStatus}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-[10px] font-medium text-slate-500">
                            <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                              fixed viewport
                            </span>
                            <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                              scroll anchor
                            </span>
                            <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                              v4.4
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {step === 16 && !isSimulating && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute bottom-0 left-0 right-0 z-50 flex h-[7%] min-h-[80px] items-center justify-center border-t border-white/40 bg-white/40 backdrop-blur-md rounded-b-2xl"
                >
                  <motion.button
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startSimulation}
                    className="inline-flex items-center gap-3 rounded-full bg-[#0040FF] px-8 py-4 text-[15px] font-semibold text-white shadow-xl shadow-blue-900/20"
                  >
                    <RefreshCw size={18} />
                    Reiniciar Simulación
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
};