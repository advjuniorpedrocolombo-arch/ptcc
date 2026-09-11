(function(){
const css=`<style id="profGruposUiCss">
#grupos table{min-width:1180px}.grp-toggle{cursor:pointer}.grp-toggle:hover{background:#f8fbfc}.grp-caret{display:inline-block;width:18px;font-weight:900;color:var(--navy);transition:transform .15s}.grp-row.open .grp-caret{transform:rotate(90deg)}.grp-summary{display:block;margin-top:4px;color:var(--muted);font-size:.67rem}.grp-stages-cell{min-width:330px}.grp-stages-wrap{display:none;gap:5px;flex-direction:column}.grp-row.open .grp-stages-wrap{display:flex}.grp-row:not(.open) .grp-stages-cell .grp-summary{display:block}.grp-row.open .grp-stages-cell .grp-summary{display:none}.grp-stage-line{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:5px 8px;border-radius:7px;background:#f5f8f9;font-size:.68rem}.grp-stage-line b{color:#294754}.grp-stage-status{font-weight:900;white-space:nowrap}.grp-stage-status.ok{color:#2d7757}.grp-stage-status.info{color:#275f78}.grp-stage-status.danger{color:#9b2c2c}.grp-stage-status.warn{color:#956500}.grp-actions{display:flex;gap:6px;flex-wrap:wrap}.grp-delete{background:#fff!important;color:#9b2c2c!important;border:1px solid #dca7a7!important}.grp-open-btn{background:#fff!important;color:var(--navy)!important;border:1px solid var(--line)!important}.grp-code{font-weight:900;color:var(--navy)}
</style>`;
if(!document.getElementById('profGruposUiCss'))document.head.insertAdjacentHTML('beforeend',css);
const escG=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function sclass(s){s=String(s||'').toUpperCase();if(/CONCLU|APROV/.test(s))return'ok';if(/ANÁLISE|ANALISE/.test(s))return'info';if(/CORRIG|ATRAS/.test(s))return'danger';return'warn'}
async function excluirGrupoRobusto(g){
 if(!confirm(`Excluir definitivamente o grupo ${g.codigo} — ${g.nome||'Grupo'}?\n\nSerão removidos entregas, devolutivas e arquivos vinculados.`))return;
 const cod=prompt('Digite o código do grupo para confirmar:');if(String(cod||'').trim().toUpperCase()!==String(g.codigo||'').toUpperCase())return;
 try{
   const [{data:arqs,error:aErr},{data:sols,error:sErr}]=await Promise.all([
     sb.from('arquivos').select('caminho_storage').eq('grupo_id',g.id),
     sb.from('solicitacoes_grupo').select('caminho_termo_original,caminho_termo_assinado,caminho_termo').eq('grupo_id',g.id)
   ]);if(aErr||sErr)throw(aErr||sErr);
   const paths=[...(arqs||[]).map(x=>x.caminho_storage),...(sols||[]).flatMap(x=>[x.caminho_termo_original,x.caminho_termo_assinado||x.caminho_termo])].filter(Boolean);
   for(let i=0;i<paths.length;i+=100){const {error}=await sb.storage.from('ptcc-arquivos').remove(paths.slice(i,i+100));if(error)throw error;}
   const {error}=await sb.rpc('professor_excluir_grupo',{p_grupo_id:g.id});if(error)throw error;
   alert('Grupo excluído com sucesso.');await loadAll();
 }catch(e){alert(e.message||'Não foi possível excluir o grupo.');}
}
async function renderDetalhesGrupos(){
 const body=document.getElementById('grpBody');if(!body)return;
 const table=body.closest('table'),head=table?.querySelector('thead tr');if(!table||!head)return;
 head.innerHTML='<th>Código</th><th>Grupo</th><th>Tema</th><th>Status</th><th>Progresso</th><th>Etapas e situação</th><th>Ações</th>';
 const [{data:ges,error:gErr},{data:eps,error:eErr}]=await Promise.all([
   sb.from('grupo_etapas').select('grupo_id,etapa_id,status,percentual'),
   sb.from('etapas').select('id,nome,ordem').order('ordem')
 ]);if(gErr||eErr){console.error(gErr||eErr);return;}
 const epMap=new Map((eps||[]).map(e=>[e.id,e])),byGroup={};(ges||[]).forEach(x=>(byGroup[x.grupo_id]||(byGroup[x.grupo_id]=[])).push(x));
 const groupMap=new Map((window.groups||[]).map(g=>[String(g.codigo||'').trim(),g]));
 [...body.querySelectorAll('tr')].forEach(tr=>{
   if(tr.cells.length<5)return;
   const codigo=(tr.cells[0].textContent||'').trim(),g=groupMap.get(codigo);if(!g)return;
   tr.classList.add('grp-row');tr.classList.remove('open');while(tr.cells.length>5)tr.deleteCell(5);
   const arr=(byGroup[g.id]||[]).sort((a,b)=>(epMap.get(a.etapa_id)?.ordem||0)-(epMap.get(b.etapa_id)?.ordem||0));
   const done=arr.filter(x=>/CONCLU|APROV/.test(String(x.status||''))).length;
   tr.cells[0].classList.add('grp-toggle');
   tr.cells[0].innerHTML=`<span class="grp-caret">▶</span><span class="grp-code">${escG(g.codigo||'—')}</span>`;
   tr.cells[1].classList.add('grp-toggle');tr.cells[1].innerHTML=`<b>${escG(g.nome||'Grupo')}</b><span class="grp-summary">Clique no código ou nome para mostrar/recolher etapas • ${done}/${arr.length} concluídas</span>`;
   const td=tr.insertCell();td.className='grp-stages-cell';td.innerHTML=`<div class="grp-stages-wrap">${arr.map(x=>{const ep=epMap.get(x.etapa_id);return `<div class="grp-stage-line"><b>${escG(ep?.nome||'Etapa')}</b><span class="grp-stage-status ${sclass(x.status)}">${escG(x.status||'—')}</span></div>`}).join('')||'<span class="sub">Sem etapas vinculadas.</span>'}</div><span class="grp-summary">${arr.length} etapas — recolhidas</span>`;
   const act=tr.insertCell();act.innerHTML='<div class="grp-actions"><button type="button" class="btn grp-open-btn">Ver etapas</button><button type="button" class="btn grp-delete">Excluir grupo</button></div>';
   const toggle=()=>{tr.classList.toggle('open');act.querySelector('.grp-open-btn').textContent=tr.classList.contains('open')?'Recolher etapas':'Ver etapas';};
   tr.cells[0].onclick=toggle;
   tr.cells[1].onclick=toggle;
   act.querySelector('.grp-open-btn').onclick=toggle;
   act.querySelector('.grp-delete').onclick=e=>{e.stopPropagation();excluirGrupoRobusto(g);};
 });
}
const oldRG=window.renderGrupos;if(typeof oldRG==='function'){window.renderGrupos=function(rows){oldRG(rows);setTimeout(()=>renderDetalhesGrupos().catch(console.error),0)}}
const oldLA=window.loadAll;if(typeof oldLA==='function'){window.loadAll=async function(){const r=await oldLA.apply(this,arguments);await renderDetalhesGrupos().catch(console.error);return r}}
setTimeout(()=>renderDetalhesGrupos().catch(console.error),700);
})();
