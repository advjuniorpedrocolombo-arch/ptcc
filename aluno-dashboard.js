(function(){
const css=`<style id="ptccDashCss">
#cronogramaPTCC{margin:16px 0}.cronograma-head{display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:10px}.cronograma-list{display:grid;gap:10px}.cron-item{border:1px solid var(--line);border-radius:14px;background:#fff;overflow:hidden}.cron-main{display:grid;grid-template-columns:48px 1.6fr .8fr .8fr .7fr auto;gap:10px;align-items:center;padding:13px;cursor:pointer}.cron-num{width:40px;height:40px;border-radius:11px;background:var(--navy);color:#ffd35a;display:grid;place-items:center;font-weight:900}.cron-title{font-weight:900;color:var(--navy)}.cron-small{font-size:.72rem;color:var(--muted)}.cron-detail{display:none;border-top:1px solid var(--line);padding:14px;background:#f9fbfc}.cron-item.open .cron-detail{display:block}.cron-detail p{margin:0 0 10px}.cron-feedback{border-left:4px solid var(--gold);background:#fff8e8;padding:10px 12px;border-radius:8px;margin-top:10px}.cron-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}.status-badge{display:inline-block;padding:5px 8px;border-radius:999px;font-size:.68rem;font-weight:900;background:#eef3f5}.status-badge.ok{background:#e7f4ed;color:#2d7757}.status-badge.warn{background:#fff1c6;color:#8b6100}.status-badge.info{background:#e8f1f5;color:#275f78}.status-badge.danger{background:#fff0ef;color:#9b2c2c}.stage-upload.ptcc-hidden{display:none}@media(max-width:820px){.cron-main{grid-template-columns:44px 1fr}.cron-main>*:nth-child(n+3){grid-column:2}}</style>`;
if(!document.getElementById('ptccDashCss'))document.head.insertAdjacentHTML('beforeend',css);
const fmt=d=>d?new Date(d+'T12:00:00').toLocaleDateString('pt-BR'):'—';
const today=()=>new Date().toISOString().slice(0,10);
function badgeClass(s){s=String(s||'').toUpperCase();if(/CONCLU/.test(s))return'ok';if(/CORRIG|ATRAS/.test(s))return'danger';if(/ANÁLISE|ANALISE/.test(s))return'info';if(/DISPON|AGEND|NÃO|NAO/.test(s))return'warn';return''}
function available(ep){if(!ep.ativa)return false;if(ep.modo_liberacao==='PROFESSOR')return !!ep.liberada_manual;return !ep.data_inicio||today()>=ep.data_inicio}
function derivedStatus(ep,ge){let s=ge?.status||'NÃO INICIADA';if(/CONCLU/.test(s))return'CONCLUÍDA';if(/CORRIG/.test(s))return'CORRIGIR';if(/ANÁLISE|ANALISE|ENVIADA/.test(s))return'EM ANÁLISE';if(!available(ep))return'AGENDADA';if(ep.data_limite&&today()>ep.data_limite)return'ATRASADA';return'DISPONÍVEL'}
async function renderCronograma(){
 if(typeof CURRENT_GROUP==='undefined'||!CURRENT_GROUP)return;
 const [{data:eps},{data:ges},{data:fbs}]=await Promise.all([
   sb.from('etapas').select('*').eq('ativa',true).order('ordem'),
   sb.from('grupo_etapas').select('*').eq('grupo_id',CURRENT_GROUP.id),
   sb.from('feedbacks').select('*').eq('grupo_id',CURRENT_GROUP.id).order('created_at',{ascending:false})
 ]);
 const card=document.getElementById('dashboardCard');if(!card||!eps)return;
 let wrap=document.getElementById('cronogramaPTCC');if(!wrap){wrap=document.createElement('div');wrap.id='cronogramaPTCC';const table=card.querySelector('.table-wrap');card.insertBefore(wrap,table)}
 const map=new Map((ges||[]).map(x=>[x.etapa_id,x]));
 const latestFb={};(fbs||[]).forEach(x=>{if(!latestFb[x.etapa_id])latestFb[x.etapa_id]=x});
 wrap.innerHTML=`<div class="cronograma-head"><div><h3 style="margin:0">Cronograma do PTCC</h3><div class="cron-small">Clique em uma etapa para ver orientações, prazo e devolutiva.</div></div></div><div class="cronograma-list">${eps.map((ep,i)=>{const ge=map.get(ep.id),st=derivedStatus(ep,ge),fb=latestFb[ep.id],can=available(ep)&&!/CONCLU|ANÁLISE|ANALISE/.test(st);return `<div class="cron-item" data-id="${ep.id}"><div class="cron-main" title="${esc(ep.orientacao||ep.descricao||'')}"><div class="cron-num">${String(i+1).padStart(2,'0')}</div><div><div class="cron-title">${esc(ep.nome)}</div><div class="cron-small">${esc(ep.descricao||'')}</div></div><div><div class="cron-small">Liberação</div><b>${fmt(ep.data_inicio)}</b></div><div><div class="cron-small">Prazo</div><b>${fmt(ep.data_limite)}</b></div><div><span class="status-badge ${badgeClass(st)}">${esc(st)}</span></div><div>${can&&ep.aceita_arquivo?`<button type="button" class="small-btn send-stage" data-stage="${ep.id}">${/CORRIG/.test(st)?'Reenviar PDF':'Enviar PDF'}</button>`:''}</div></div><div class="cron-detail"><p><b>Como realizar esta etapa</b><br>${esc(ep.orientacao||ep.descricao||'Orientação ainda não cadastrada.')}</p><p class="cron-small">Liberação: ${ep.modo_liberacao==='PROFESSOR'?'mediante liberação do professor':'automática pela data'} • Início: ${fmt(ep.data_inicio)} • Prazo: ${fmt(ep.data_limite)}</p>${fb?`<div class="cron-feedback"><b>Última devolutiva do professor</b><br>${esc(fb.feedback)}<div class="cron-small">${new Date(fb.created_at).toLocaleString('pt-BR')}</div></div>`:''}<div class="cron-actions">${can&&ep.aceita_arquivo?`<button type="button" class="btn send-stage" data-stage="${ep.id}">${/CORRIG/.test(st)?'Enviar versão corrigida em PDF':'Enviar arquivo em PDF'}</button>`:''}</div></div></div>`}).join('')}</div>`;
 wrap.querySelectorAll('.cron-main').forEach(x=>x.onclick=e=>{if(e.target.closest('button'))return;x.parentElement.classList.toggle('open')});
 wrap.querySelectorAll('.send-stage').forEach(b=>b.onclick=e=>{e.stopPropagation();$('stageSelect').value=b.dataset.stage;const up=card.querySelector('.stage-upload');up?.classList.remove('ptcc-hidden');up?.scrollIntoView({behavior:'smooth',block:'center'});});
 const up=card.querySelector('.stage-upload');if(up)up.classList.add('ptcc-hidden');
 const file=$('stagePdf');if(file){file.setAttribute('accept','application/pdf,.pdf');file.onchange=()=>{const f=file.files[0];if(f&&f.type!=='application/pdf'){alert('Somente arquivos em PDF são permitidos.');file.value='';}}}
}
const old=window.loadDashboard;
if(old){window.loadDashboard=async function(){const r=await old.apply(this,arguments);await renderCronograma();return r}}
setTimeout(()=>{if(typeof CURRENT_GROUP!=='undefined'&&CURRENT_GROUP)renderCronograma().catch(console.error)},800);
window.renderCronogramaPTCC=renderCronograma;
})();
