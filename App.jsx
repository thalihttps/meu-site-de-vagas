import React, { useState, useEffect } from 'react';
import { 
  Search, Menu, X, User, Briefcase, Settings, 
  HelpCircle, LogOut, MapPin, DollarSign, Clock,
  ShieldCheck, Building2, ChevronRight, Save, 
  CheckCircle, Mail, Phone, Pencil,
  FileText, GraduationCap, Laptop, AlignLeft, Loader2
} from 'lucide-react';

// --- CONFIGURAÇÃO SUPABASE ---
// IMPORTANTE: Substitua pelas suas chaves após criar o projeto no supabase.com
const SUPABASE_URL = 'https://SEU_PROJETO.supabase.co';
const SUPABASE_ANON_KEY = 'SUA_CHAVE_ANONIMA_AQUI';

// Variável global para o cliente Supabase
let supabase = null;

// --- BASE DE DADOS (50 VAGAS) ---
const INITIAL_JOBS = [
  // SAÚDE
  { id: 11, title: 'Enfermeiro Júnior', company: 'Hospital Santa Luzia', salary: '4.200,00', location: 'Brasília, DF', type: 'Presencial', posted: 'Hoje' },
  { id: 12, title: 'Enfermeiro Pleno', company: 'Hospital Albert Sabin', salary: '6.500,00', location: 'Rio de Janeiro, RJ', type: 'Presencial', posted: '2 dias atrás' },
  { id: 13, title: 'Enfermeiro Sênior (UTI)', company: 'Clínica Vita', salary: '9.800,00', location: 'São Paulo, SP', type: 'Presencial', posted: '3 dias atrás' },
  { id: 16, title: 'Médico Residente', company: 'Hospital das Clínicas', salary: '4.106,00', location: 'São Paulo, SP', type: 'Presencial', posted: '2 dias atrás' },
  { id: 17, title: 'Médico Clínico Geral', company: 'Unimed Saúde', salary: '15.400,00', location: 'Belo Horizonte, MG', type: 'Híbrido', posted: '5 dias atrás' },
  { id: 18, title: 'Técnico em Radiologia', company: 'Centro de Imagem X', salary: '3.500,00', location: 'Salvador, BA', type: 'Presencial', posted: 'Ontem' },
  
  // ADMINISTRAÇÃO & MARKETING
  { id: 21, title: 'Analista de Marketing Digital', company: 'Agência Boom!', salary: '4.500,00', location: 'Remoto', type: 'Remoto', posted: 'Hoje' },
  { id: 22, title: 'Gerente de Branding', company: 'Startup Inova', salary: '9.200,00', location: 'São Paulo, SP', type: 'Híbrido', posted: '2 dias atrás' },
  { id: 30, title: 'Jovem Aprendiz Administrativo', company: 'Magazine Luiza', salary: '850,00', location: 'São Paulo, SP', type: 'Presencial', posted: 'Ontem' },
  { id: 31, title: 'Consultor de Vendas', company: 'VendaMais S.A.', salary: '3.000,00', location: 'Rio de Janeiro, RJ', type: 'Presencial', posted: 'Hoje' },
  
  // TECNOLOGIA
  { id: 1, title: 'Engenheiro de Software', company: 'FF Seguros', salary: '8.784,87', location: 'São Paulo, SP', type: 'Remoto', posted: '2 dias atrás' },
  { id: 34, title: 'Estagiário de Infraestrutura', company: 'DataCenter Prime', salary: '1.500,00', location: 'São Paulo, SP', type: 'Presencial', posted: 'Hoje' },
  { id: 35, title: 'Estagiário de Redes', company: 'Connect Telecom', salary: '1.400,00', location: 'Rio de Janeiro, RJ', type: 'Presencial', posted: 'Ontem' },
  { id: 42, title: 'Analista de Suporte Júnior', company: 'Prime Solutions', salary: '2.800,00', location: 'Goiânia, GO', type: 'Presencial', posted: 'Ontem' },
  { id: 43, title: 'Analista de Suporte Pleno', company: 'Global IT', salary: '5.100,00', location: 'Curitiba, PR', type: 'Remoto', posted: 'Hoje' },
  { id: 44, title: 'Analista de Suporte Sênior', company: 'Big Data Corp', salary: '9.500,00', location: 'São Paulo, SP', type: 'Híbrido', posted: '3 dias atrás' },
];

export default function App() {
  const [libLoaded, setLibLoaded] = useState(false);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('auth'); 
  const [currentTab, setCurrentTab] = useState('vagas');
  const [userData, setUserData] = useState(null);

  // Carrega a biblioteca do Supabase via CDN para funcionar no ambiente Web
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    script.async = true;
    script.onload = () => {
      // Inicializa o cliente após carregar o script
      const { createClient } = window.supabase;
      supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      setLibLoaded(true);
      
      // Inicia verificação de sessão
      checkSession();
    };
    document.body.appendChild(script);
  }, []);

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setSession(session);
    if (session) await fetchUserData(session.user.id);
    
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchUserData(session.user.id);
      else setView('auth');
    });
    setLoading(false);
  };

  const fetchUserData = async (userId) => {
    const { data, error } = await supabase
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
      <p className="text-gray-500 font-medium">Carregando sistema de vagas...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f3f2f1] font-sans text-gray-900">
      {view === 'auth' ? (
        <AuthScreen onComplete={() => setView('main')} />
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
          phone: form.phone.replace(/\D/g, ''),
          applied_jobs: []
        }]);
      }
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });
      if (signInError) setError("E-mail ou senha inválidos.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto pt-16 px-4">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2 text-blue-700 text-2xl font-bold">
          <Briefcase size={32} /> <span>FindJobs</span>
        </div>
      </div>
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-xl font-bold mb-6 text-center">{mode === 'signup' ? 'Cadastre-se' : 'Acesse sua conta'}</h2>
        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}
        <form onSubmit={handleAuth} className="space-y-4">
          {mode === 'signup' && <input required placeholder="Nome Completo" className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" onChange={e => setForm({...form, name: e.target.value})} />}
          <input required type="email" placeholder="E-mail" className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" onChange={e => setForm({...form, email: e.target.value})} />
          {mode === 'signup' && <input required placeholder="Telefone (11999999999)" className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" onChange={e => setForm({...form, phone: e.target.value})} />}
          <input required type="password" placeholder="Senha" className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500" onChange={e => setForm({...form, password: e.target.value})} />
          <button disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all shadow-md">
            {loading ? 'Processando...' : (mode === 'signup' ? 'Criar Conta' : 'Entrar')}
          </button>
        </form>
        <div className="mt-6 text-center text-sm">
          <button onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')} className="text-blue-600 font-bold hover:underline">
            {mode === 'signup' ? 'Já tenho login' : 'Quero me cadastrar'}
          </button>
        </div>
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
      default: return <PlaceholderPage title="Em breve" icon={<Settings/>} desc="Configurações em desenvolvimento." />;
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <header className="bg-white border-b h-16 flex items-center justify-between px-6 shrink-0 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><Menu/></button>
          <button onClick={() => setCurrentTab('vagas')} className="flex items-center gap-2 text-xl font-bold text-blue-700 hover:opacity-80 transition-opacity outline-none">
            <Briefcase/> <span>FindJobs</span>
          </button>
        </div>
        <div className="flex-1 max-w-xl mx-8 relative hidden md:block">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          <input 
            placeholder="Pesquise por cargo ou hospital..." 
            className="w-full bg-gray-100 rounded-lg py-2 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold">{userData?.name || "Usuário"}</p>
            <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider">Online</p>
          </div>
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold border-2 border-white shadow-sm shrink-0">{userData?.name?.[0] || "U"}</div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {isMenuOpen && (
          <aside className="w-64 bg-white border-r flex flex-col shrink-0 animate-in slide-in-from-left duration-200">
            <nav className="p-4 flex-1 space-y-1">
              <NavBtn active={currentTab==='vagas'} onClick={()=>setCurrentTab('vagas')} icon={<Search size={20}/>} label="Explorar Vagas" />
              <NavBtn active={currentTab==='perfil'} onClick={()=>setCurrentTab('perfil')} icon={<User size={20}/>} label="Seu Perfil" />
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
      <h2 className="text-2xl font-bold mb-6">Vagas Recomendadas</h2>
      <div className="grid gap-4">
        {filtered.map(job => (
          <div key={job.id} className="bg-white p-6 rounded-xl border border-gray-200 flex justify-between items-center group hover:border-blue-500 transition-all shadow-sm">
            <div>
              <h3 className="text-xl font-bold text-blue-800">{job.title}</h3>
              <p className="text-gray-600 font-semibold">{job.company}</p>
              <div className="mt-4 flex gap-4 text-sm text-gray-500 font-medium">
                <span className="flex items-center gap-1 text-green-600"><DollarSign size={16}/> {job.salary}</span>
                <span className="flex items-center gap-1"><MapPin size={16}/> {job.location}</span>
              </div>
            </div>
            {userData?.applied_jobs?.includes(job.id) ? (
              <span className="text-green-600 font-bold bg-green-50 px-5 py-2 rounded-lg border border-green-200">Inscrito</span>
            ) : (
              <button onClick={() => setConfirming(job)} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95">Candidatar</button>
            )}
          </div>
        ))}
      </div>

      {confirming && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95">
            <h3 className="text-xl font-bold text-center mb-4">Confirmar Envio?</h3>
            <p className="text-gray-500 text-center mb-6">Deseja enviar seu currículo para a vaga de <b>{confirming.title}</b>?</p>
            <div className="flex gap-4">
              <button onClick={() => setConfirming(null)} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-all">Cancelar</button>
              <button onClick={handleApply} disabled={applying} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 flex items-center justify-center gap-2">
                {applying ? <Loader2 className="animate-spin" size={18}/> : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="fixed top-20 right-10 bg-green-600 text-white p-6 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-right z-[110]">
          <CheckCircle size={32}/> <div><b>Candidatura Enviada!</b><p className="text-sm">Acompanhe na aba de inscrições.</p></div>
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
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-3"><User className="text-blue-600"/> Perfil do Candidato</h2>
        <button onClick={() => editing ? handleUpdate() : setEditing(true)} className={`p-3 rounded-full transition-all ${editing ? 'bg-green-600 text-white' : 'bg-gray-50 text-gray-400 hover:text-blue-600'}`}>
          {editing ? (saving ? <Loader2 className="animate-spin" size={20}/> : <Save size={20}/>) : <Pencil size={20}/>}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ProfileInput label="Nome Completo" value={form.name} editing={editing} onChange={v => setForm({...form, name: v})} />
        <ProfileInput label="E-mail" value={userData?.email} disabled />
        <ProfileInput label="Telefone" value={form.phone} editing={editing} onChange={v => setForm({...form, phone: v})} />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2"><AlignLeft size={16}/> Resumo Profissional</label>
        {editing ? <textarea className="w-full p-4 border rounded-xl bg-blue-50 outline-none min-h-[120px] focus:ring-2 focus:ring-blue-400" value={form.summary} onChange={e => setForm({...form, summary: e.target.value})} /> : <p className="bg-gray-50 p-4 rounded-xl text-gray-700 italic">{form.summary || "Adicione seu resumo profissional clicando no lápis."}</p>}
      </div>
    </div>
  );
}

function AppliedJobsPage({ userData }) {
  const myJobs = INITIAL_JOBS.filter(j => userData?.applied_jobs?.includes(j.id));
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-3"><CheckCircle className="text-green-500"/> Minhas Candidaturas ({myJobs.length})</h2>
      <div className="grid gap-4">
        {myJobs.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border-2 border-dashed border-gray-200 text-center">
            <Briefcase className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500 font-medium">Você ainda não se candidatou a nenhuma vaga.</p>
          </div>
        ) : (
          myJobs.map(job => (
            <div key={job.id} className="bg-white p-6 rounded-xl border flex justify-between items-center shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Building2 size={24}/></div>
                <div><h3 className="font-bold text-gray-800">{job.title}</h3><p className="text-sm text-gray-500">{job.company}</p></div>
              </div>
              <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1.5 rounded uppercase tracking-wide">Em Triagem</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// --- UTILITÁRIOS ---
function NavBtn({ active, onClick, icon, label }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 p-3.5 rounded-xl font-bold transition-all ${active ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}>
      {icon} <span>{label}</span>
    </button>
  );
}

function ProfileInput({ label, value, editing, onChange, disabled }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-bold text-gray-400 uppercase block mb-1">{label}</label>
      {editing && !disabled ? <input className="w-full p-3 border rounded-xl bg-blue-50 outline-none focus:ring-2 focus:ring-blue-400" value={value} onChange={e => onChange(e.target.value)} /> : <p className="p-3 bg-gray-50 border border-transparent rounded-xl font-semibold text-gray-700">{value}</p>}
    </div>
  );
}

function PlaceholderPage({ title, icon, desc }) {
  return <div className="flex flex-col items-center justify-center h-[60vh] text-center bg-white rounded-3xl border shadow-sm p-8"><div className="text-blue-100 mb-4">{icon}</div><h2 className="text-xl font-bold mb-2 text-gray-800">{title}</h2><p className="text-gray-500 max-w-xs">{desc}</p></div>;
}
