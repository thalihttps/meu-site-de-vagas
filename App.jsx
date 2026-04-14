import React, { useState, useEffect } from 'react';
import { 
  Search, Menu, X, User, Briefcase, Settings, 
  HelpCircle, LogOut, MapPin, Clock,
  ShieldCheck, Building2, ChevronRight, Save, 
  CheckCircle, Mail, Phone, Pencil,
  FileText, GraduationCap, Laptop, AlignLeft, Loader2,
  DollarSign
} from 'lucide-react';

// --- CONFIGURAÇÃO SUPABASE ---
// IMPORTANTE: Este link é o que encontraste na tua imagem!
const SUPABASE_URL = 'https://zyyiiqjnjigbhoakcned.supabase.co'; 
// COLA AQUI a tua chave "anon public" que está logo abaixo do link no site do Supabase
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5eWlpcWpuamlnYmhvYWtjbmVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMjAwNjEsImV4cCI6MjA5MTY5NjA2MX0.kvbOtrfXvXV3y29k3kZ07YDCmW4--gzVAc6l4MflpFA'; 

let supabase = null;

// --- BASE DE DADOS DE VAGAS (50 OPÇÕES) ---
const INITIAL_JOBS = [
  // SAÚDE
  { id: 11, title: 'Enfermeiro Júnior', company: 'Hospital Santa Luzia', salary: '4.200,00', location: 'Brasília, DF', type: 'Presencial', posted: 'Hoje' },
  { id: 12, title: 'Enfermeiro Pleno', company: 'Hospital Albert Sabin', salary: '6.500,00', location: 'Rio de Janeiro, RJ', type: 'Presencial', posted: '2 dias atrás' },
  { id: 13, title: 'Enfermeiro Sênior (UTI)', company: 'Clínica Vita', salary: '9.800,00', location: 'São Paulo, SP', type: 'Presencial', posted: '3 dias atrás' },
  { id: 14, title: 'Enfermeiro de Emergência', company: 'Pronto Socorro Central', salary: '5.200,00', location: 'Curitiba, PR', type: 'Presencial', posted: '1 semana atrás' },
  { id: 15, title: 'Coordenador de Enfermagem', company: 'Hospital do Coração', salary: '11.500,00', location: 'Porto Alegre, RS', type: 'Presencial', posted: 'Ontem' },
  { id: 16, title: 'Médico Residente', company: 'Hospital das Clínicas', salary: '4.106,00', location: 'São Paulo, SP', type: 'Presencial', posted: '2 dias atrás' },
  { id: 17, title: 'Médico Clínico Geral', company: 'Unimed Saúde', salary: '15.400,00', location: 'Belo Horizonte, MG', type: 'Híbrido', posted: '5 dias atrás' },
  { id: 18, title: 'Técnico em Radiologia', company: 'Centro de Imagem X', salary: '3.500,00', location: 'Salvador, BA', type: 'Presencial', posted: 'Ontem' },
  { id: 19, title: 'Técnico em Radiologia II', company: 'Hospital Regional', salary: '3.950,00', location: 'Vitória, ES', type: 'Presencial', posted: '4 dias atrás' },
  { id: 20, title: 'Especialista em Ressonância', company: 'Laboratório Diagnos', salary: '5.200,00', location: 'Joinville, SC', type: 'Presencial', posted: '3 dias atrás' },

  // ADMINISTRAÇÃO & MARKETING
  { id: 21, title: 'Analista de Marketing Digital', company: 'Agência Boom!', salary: '4.500,00', location: 'Remoto', type: 'Remoto', posted: 'Hoje' },
  { id: 22, title: 'Gerente de Marketing', company: 'Startup FlyTech', salary: '11.200,00', location: 'São Paulo, SP', type: 'Híbrido', posted: '2 dias atrás' },
  { id: 23, title: 'Social Media & Content', company: 'Moda Express', salary: '3.200,00', location: 'Remoto', type: 'Remoto', posted: '3 dias atrás' },
  { id: 30, title: 'Jovem Aprendiz Administrativo', company: 'Magazine Luiza', salary: '850,00', location: 'São Paulo, SP', type: 'Presencial', posted: 'Ontem' },
  { id: 31, title: 'Consultor de Vendas', company: 'VendaMais S.A.', salary: '3.000,00', location: 'Rio de Janeiro, RJ', type: 'Presencial', posted: 'Hoje' },
  { id: 32, title: 'Executivo de Contas Sênior', company: 'Global Solutions', salary: '7.500,00', location: 'São Paulo, SP', type: 'Híbrido', posted: '2 dias atrás' },
  { id: 33, title: 'Vendedor Interno', company: 'Solar Energy', salary: '2.800,00', location: 'Recife, PE', type: 'Presencial', posted: '3 dias atrás' },

  // TECNOLOGIA
  { id: 1, title: 'Engenheiro de Software', company: 'FF Seguros', salary: '8.784,87', location: 'São Paulo, SP', type: 'Remoto', posted: '2 dias atrás' },
  { id: 34, title: 'Estagiário de Infraestrutura', company: 'DataCenter Prime', salary: '1.500,00', location: 'São Paulo, SP', type: 'Presencial', posted: 'Hoje' },
  { id: 35, title: 'Estagiário de Redes', company: 'Connect Telecom', salary: '1.400,00', location: 'Rio de Janeiro, RJ', type: 'Presencial', posted: 'Ontem' },
  { id: 42, title: 'Analista de Suporte Júnior', company: 'Prime Solutions', salary: '2.800,00', location: 'Goiânia, GO', type: 'Presencial', posted: 'Ontem' },
  { id: 43, title: 'Analista de Suporte Júnior', company: 'TechHelp', salary: '3.100,00', location: 'Remoto', type: 'Remoto', posted: 'Hoje' },
  { id: 44, title: 'Analista de Suporte Pleno', company: 'FastIT', salary: '4.800,00', location: 'São Paulo, SP', type: 'Híbrido', posted: '2 dias atrás' },
  { id: 45, title: 'Analista de Suporte Pleno', company: 'Enterprise Services', salary: '5.200,00', location: 'Curitiba, PR', type: 'Presencial', posted: '3 dias atrás' },
  { id: 46, title: 'Analista de Suporte Sênior', company: 'Global Support', salary: '8.500,00', location: 'Rio de Janeiro, RJ', type: 'Híbrido', posted: '1 semana atrás' },
  { id: 47, title: 'Coordenador de Suporte Técnico', company: 'Big Data Corp', salary: '10.200,00', location: 'São Paulo, SP', type: 'Presencial', posted: 'Ontem' },
];

export default function App() {
  const [libLoaded, setLibLoaded] = useState(false);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('auth'); 
  const [currentTab, setCurrentTab] = useState('vagas');
  const [userData, setUserData] = useState(null);

  // Carrega a biblioteca do Supabase via CDN para funcionar no ambiente Web sem instalação
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    script.async = true;
    script.onload = () => {
      const { createClient } = window.supabase;
      supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      setLibLoaded(true);
      checkSession();
    };
    document.body.appendChild(script);
  }, []);

  const checkSession = async () => {
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    setSession(currentSession);
    if (currentSession) await fetchUserData(currentSession.user.id);
    
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchUserData(session.user.id);
      else setView('auth');
    });
    setLoading(false);
  };

  const fetchUserData = async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (data) {
      setUserData(data);
      setView('main');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserData(null);
    setView('auth');
  };

  if (!libLoaded || loading) return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-blue-600">
      <Loader2 className="animate-spin mb-4" size={48} />
      <p className="text-gray-500 font-medium italic">A carregar o teu portal FindJobs...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f3f2f1] font-sans text-gray-900">
      {view === 'auth' ? (
        <AuthScreen />
      ) : (
        <MainLayout 
          userData={userData} 
          currentTab={currentTab} 
          setCurrentTab={setCurrentTab}
          onLogout={handleLogout}
          refreshData={() => fetchUserData(session.user.id)}
        />
      )}
    </div>
  );
}

// --- TELA DE AUTENTICAÇÃO ---
function AuthScreen() {
  const [mode, setMode] = useState('signup');
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');

    // Validação de telefone (entre 10 e 11 números)
    const phoneDigits = form.phone.replace(/\D/g, '');
    if (mode === 'signup' && (phoneDigits.length < 10 || phoneDigits.length > 11)) {
      setError('Telefone inválido! Deve conter entre 10 e 11 dígitos.');
      return;
    }

    setLoading(true);
    if (mode === 'signup') {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });

      if (signUpError) setError(signUpError.message);
      else if (data.user) {
        await supabase.from('profiles').insert([{
          id: data.user.id,
          name: form.name,
          email: form.email,
          phone: phoneDigits,
          applied_jobs: []
        }]);
      }
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });
      if (signInError) setError("E-mail ou palavra-passe incorretos.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto pt-16 px-4 animate-in fade-in duration-500">
      <div className="flex justify-center mb-8">
        <div className="flex items-center gap-2 text-blue-700 text-3xl font-bold">
          <Briefcase size={36} /> <span>FindJobs</span>
        </div>
      </div>
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-xl font-bold mb-6 text-center">{mode === 'signup' ? 'Regista o teu Perfil' : 'Bem-vindo de volta'}</h2>
        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{error}</div>}
        <form onSubmit={handleAuth} className="space-y-4">
          {mode === 'signup' && <input required placeholder="Nome Completo" className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition-all" onChange={e => setForm({...form, name: e.target.value})} />}
          <input required type="email" placeholder="E-mail" className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition-all" onChange={e => setForm({...form, email: e.target.value})} />
          {mode === 'signup' && <input required placeholder="Telefone (ex: 912345678)" className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition-all" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />}
          <input required type="password" placeholder="Palavra-passe" className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition-all" onChange={e => setForm({...form, password: e.target.value})} />
          <button disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all shadow-md active:scale-95">
            {loading ? <Loader2 className="animate-spin mx-auto" size={24}/> : (mode === 'signup' ? 'Criar Conta' : 'Entrar')}
          </button>
        </form>
        <button onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')} className="w-full mt-4 text-sm text-blue-600 font-bold hover:underline">
          {mode === 'signup' ? 'Já tens conta? Faz Login' : 'Novo aqui? Regista-te'}
        </button>
      </div>
    </div>
  );
}

// --- LAYOUT PRINCIPAL ---
function MainLayout({ userData, currentTab, setCurrentTab, onLogout, refreshData }) {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [search, setSearch] = useState('');

  const renderContent = () => {
    switch(currentTab) {
      case 'vagas': return <JobBoard search={search} userData={userData} refresh={refreshData} />;
      case 'perfil': return <ProfilePage userData={userData} refresh={refreshData} />;
      case 'suas-vagas': return <AppliedJobsPage userData={userData} />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <header className="bg-white border-b h-16 flex items-center justify-between px-6 shrink-0 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><Menu/></button>
          <button onClick={() => setCurrentTab('vagas')} className="flex items-center gap-2 text-xl font-bold text-blue-700 hover:opacity-80 transition-opacity outline-none">
            <Briefcase/> <span>FindJobs</span>
          </button>
        </div>
        <div className="flex-1 max-w-xl mx-8 relative hidden md:block">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          <input 
            placeholder="Pesquisa por cargo, hospital ou empresa..." 
            className="w-full bg-gray-100 rounded-lg py-2 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold">{userData?.name || "Candidato"}</p>
            <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider">Online</p>
          </div>
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold border-2 border-white shadow-sm shrink-0">{userData?.name?.[0]?.toUpperCase()}</div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {isMenuOpen && (
          <aside className="w-64 bg-white border-r flex flex-col shrink-0 animate-in slide-in-from-left duration-200 shadow-sm">
            <nav className="p-4 flex-1 space-y-1">
              <NavBtn active={currentTab==='vagas'} onClick={()=>setCurrentTab('vagas')} icon={<Search size={20}/>} label="Explorar Vagas" />
              <NavBtn active={currentTab==='perfil'} onClick={()=>setCurrentTab('perfil')} icon={<User size={20}/>} label="Meu Perfil" />
              <NavBtn active={currentTab==='suas-vagas'} onClick={()=>setCurrentTab('suas-vagas')} icon={<CheckCircle size={20}/>} label="Candidaturas" />
            </nav>
            <div className="p-4 border-t"><button onClick={onLogout} className="w-full flex items-center gap-3 p-3 text-red-600 font-bold hover:bg-red-50 rounded-lg transition-colors"><LogOut size={20} /> Sair</button></div>
          </aside>
        )}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#f3f2f1]">{renderContent()}</main>
      </div>
    </div>
  );
}

// --- PÁGINAS ---
function JobBoard({ search, userData, refresh }) {
  const [confirming, setConfirming] = useState(null);
  const [applying, setApplying] = useState(false);
  const [success, setSuccess] = useState(false);

  const filtered = INITIAL_JOBS.filter(j => j.title.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase()));

  const handleApply = async () => {
    setApplying(true);
    const newJobs = [...(userData.applied_jobs || []), confirming.id];
    await supabase.from('profiles').update({ applied_jobs: newJobs }).eq('id', userData.id);
    setConfirming(null);
    setApplying(false);
    setSuccess(true);
    refresh();
    setTimeout(() => setSuccess(false), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">Vagas Disponíveis <span className="text-sm font-normal text-gray-400">({filtered.length})</span></h2>
      <div className="grid gap-4">
        {filtered.map(job => (
          <div key={job.id} className="bg-white p-6 rounded-xl border border-gray-200 flex justify-between items-center group hover:border-blue-500 transition-all shadow-sm">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded uppercase">Destaque</span>
                <span className="text-[10px] text-gray-400">• {job.posted}</span>
              </div>
              <h3 className="text-xl font-bold text-blue-800 group-hover:underline">{job.title}</h3>
              <p className="text-gray-600 font-semibold flex items-center gap-1.5 mt-1"><Building2 size={16}/> {job.company}</p>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500 font-medium">
                <span className="flex items-center gap-1 text-green-600"><DollarSign size={16}/> R$ {job.salary}</span>
                <span className="flex items-center gap-1"><MapPin size={16}/> {job.location}</span>
                <span className="flex items-center gap-1"><Clock size={16}/> {job.type}</span>
              </div>
            </div>
            <div className="ml-4 shrink-0">
              {userData?.applied_jobs?.includes(job.id) ? (
                <span className="text-green-600 font-bold bg-green-50 px-5 py-2 rounded-lg border border-green-200 flex items-center gap-2"><CheckCircle size={18}/> Inscrito</span>
              ) : (
                <button onClick={() => setConfirming(job)} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95">Candidatar</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL DE CONFIRMAÇÃO */}
      {confirming && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-bold text-center mb-4">Confirmar Envio?</h3>
            <p className="text-gray-500 text-center mb-6 leading-relaxed">Desejas submeter o teu currículo para a vaga de <b>{confirming.title}</b> em <b>{confirming.company}</b>?</p>
            <div className="flex gap-4">
              <button onClick={() => setConfirming(null)} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-all">Cancelar</button>
              <button onClick={handleApply} disabled={applying} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 flex items-center justify-center gap-2 active:scale-95">
                {applying ? <Loader2 className="animate-spin" size={20}/> : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NOTIFICAÇÃO DE SUCESSO */}
      {success && (
        <div className="fixed top-20 right-10 bg-green-600 text-white p-6 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-right z-[110]">
          <CheckCircle size={32}/> 
          <div>
            <b className="text-lg">Candidatura Enviada!</b>
            <p className="text-sm opacity-90">A tua candidatura foi processada com sucesso.</p>
          </div>
        </div>
      )}
    </div>
  );
}

function ProfilePage({ userData, refresh }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ 
    name: userData?.name || '', 
    phone: userData?.phone || '', 
    summary: userData?.summary || '' 
  });

  const handleUpdate = async () => {
    setSaving(true);
    await supabase.from('profiles').update({ 
      name: form.name, 
      phone: form.phone.replace(/\D/g, ''), 
      summary: form.summary 
    }).eq('id', userData.id);
    setEditing(false);
    setSaving(false);
    refresh();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-10">
      <section className="bg-white rounded-2xl shadow-sm border p-8 animate-in slide-in-from-bottom duration-500">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold flex items-center gap-3 text-gray-800"><User className="text-blue-600" size={28}/> O Meu Perfil</h2>
          <button onClick={() => editing ? handleUpdate() : setEditing(true)} className={`p-3 rounded-full transition-all ${editing ? 'bg-green-600 text-white shadow-md' : 'bg-gray-50 text-gray-400 hover:text-blue-600'}`}>
            {editing ? (saving ? <Loader2 className="animate-spin" size={20}/> : <Save size={20}/>) : <Pencil size={20}/>}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ProfileInput label="Nome Completo" value={form.name} editing={editing} onChange={v => setForm({...form, name: v})} icon={<User size={16}/>} />
          <ProfileInput label="Endereço de E-mail" value={userData?.email} disabled icon={<Mail size={16}/>} />
          <ProfileInput label="Telemóvel" value={form.phone} editing={editing} onChange={v => setForm({...form, phone: v})} icon={<Phone size={16}/>} />
          <div className="opacity-50 grayscale"><label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Palavra-passe</label><div className="p-3 bg-gray-50 border rounded-xl text-sm tracking-widest font-mono">••••••••••••</div></div>
        </div>
      </section>

      <section className="bg-white rounded-2xl shadow-sm border p-8 space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-3 text-gray-800"><FileText className="text-blue-600" size={28}/> Resumo Curricular</h2>
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-2"><AlignLeft size={16}/> Experiência e Habilidades</label>
          {editing ? (
            <textarea className="w-full p-4 border rounded-xl bg-blue-50 outline-none min-h-[150px] focus:ring-2 focus:ring-blue-400 transition-all leading-relaxed" value={form.summary} onChange={e => setForm({...form, summary: e.target.value})} placeholder="Escreve aqui sobre as tuas experiências e o que procuras..." />
          ) : (
            <p className="bg-gray-50 p-6 rounded-xl text-gray-700 italic leading-relaxed shadow-inner">{form.summary || "Clica no ícone do lápis acima para editares o teu resumo profissional."}</p>
          )}
        </div>
      </section>
    </div>
  );
}

function AppliedJobsPage({ userData }) {
  const myJobs = INITIAL_JOBS.filter(j => userData?.applied_jobs?.includes(j.id));
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold flex items-center gap-3"><CheckCircle className="text-green-500" size={28}/> Minhas Inscrições ({myJobs.length})</h2>
      <div className="grid gap-4">
        {myJobs.length === 0 ? (
          <div className="bg-white p-20 rounded-2xl border-2 border-dashed border-gray-200 text-center flex flex-col items-center">
            <Briefcase className="text-gray-300 mb-4" size={56} />
            <p className="text-gray-500 font-medium text-lg">Ainda não te candidataste a nenhuma vaga.</p>
            <p className="text-gray-400 text-sm mt-1">Explora as vagas disponíveis e começa a tua jornada!</p>
          </div>
        ) : (
          myJobs.map(job => (
            <div key={job.id} className="bg-white p-6 rounded-xl border flex justify-between items-center shadow-sm hover:border-blue-200 transition-colors">
              <div className="flex items-center gap-5">
                <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl"><Building2 size={24}/></div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{job.title}</h3>
                  <p className="text-sm text-gray-500 font-medium">{job.company} • {job.location}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full uppercase tracking-wider border border-orange-100">Em Análise</span>
                <p className="text-[10px] text-gray-400 mt-2 font-medium italic">Empresa visualizou o teu perfil</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// --- COMPONENTES AUXILIARES ---
function NavBtn({ active, onClick, icon, label }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition-all ${active ? 'bg-blue-600 text-white shadow-lg scale-105' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}>
      {icon} <span>{label}</span>
    </button>
  );
}

function ProfileInput({ label, value, editing, onChange, disabled, icon }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1.5 mb-1.5">{icon} {label}</label>
      {editing && !disabled ? (
        <input className="w-full p-3.5 border rounded-xl bg-blue-50 outline-none focus:ring-2 focus:ring-blue-400 transition-all font-semibold" value={value} onChange={e => onChange(e.target.value)} />
      ) : (
        <p className="p-3.5 bg-gray-50 border border-transparent rounded-xl font-semibold text-gray-800 shadow-inner">{value}</p>
      )}
    </div>
  );
}
