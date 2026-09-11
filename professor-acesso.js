(function(){
  if(typeof sb==='undefined') return;

  async function executarAcessos(id, confirmarValidacao){
    if(confirmarValidacao && !confirm('Você conferiu o PDF assinado? Validar este Termo, criar o grupo e liberar os acessos por e-mail?')) return;
    try{
      const {data,error}=await sb.functions.invoke('aprovar-termo',{body:{solicitacao_id:id}});
      if(error) throw error;
      if(data?.error) throw new Error(data.error);
      if(typeof loadAll==='function') await loadAll();

      const convites=data?.convites_enviados?.length||0;
      const recuperacoes=data?.recuperacoes_enviadas?.length||0;
      const falhas=data?.falhas||[];
      let msg=`Grupo ${data?.codigo||''} processado com sucesso.\n\n`+
              `Convites de primeiro acesso enviados: ${convites}.\n`+
              `E-mails para definir/redefinir a senha enviados: ${recuperacoes}.`;
      if(falhas.length){
        msg+=`\n\nFalhas (${falhas.length}):\n`+falhas.map(x=>`${x.email}: ${x.erro}`).join('\n');
      }else{
        msg+='\n\nTodos os endereços foram processados pelo sistema.';
      }
      alert(msg);
    }catch(e){
      alert(e?.message||'Não foi possível liberar os acessos.');
    }
  }

  window.validar=async function(id){
    return executarAcessos(id,true);
  };

  window.reenviarAcessos=async function(id){
    if(!confirm('Reenviar o e-mail para definição/redefinição de senha aos integrantes deste grupo?')) return;
    return executarAcessos(id,false);
  };

  const renderOriginal=window.renderSolicitacoes;
  window.renderSolicitacoes=function(rows){
    if(typeof renderOriginal==='function') renderOriginal(rows);
    const body=document.getElementById('solBody');
    if(!body) return;
    [...body.querySelectorAll('tr')].forEach((tr,i)=>{
      const x=rows[i];
      if(!x || x.status!=='APROVADA') return;
      const td=tr.lastElementChild;
      if(!td) return;
      const actions=td.querySelector('.actions')||td;
      if(actions.querySelector('.resend-access')) return;
      const btn=document.createElement('button');
      btn.type='button';
      btn.className='btn info resend-access';
      btn.textContent='Reenviar acesso';
      btn.style.marginTop='6px';
      btn.onclick=()=>window.reenviarAcessos(x.id);
      actions.appendChild(btn);
    });
  };
})();
