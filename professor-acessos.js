(function(){
  async function executarAcessos(id, confirmarValidacao){
    if(confirmarValidacao && !confirm('Você conferiu o PDF assinado? Validar este Termo, criar o grupo e liberar os acessos por e-mail?')) return;
    try{
      const {data,error}=await sb.functions.invoke('aprovar-termo',{body:{solicitacao_id:id}});
      if(error) throw error;
      if(data?.error) throw new Error(data.error);
      await loadAll();
      const convites=(data?.convites_enviados||[]).length;
      const recuperacoes=(data?.recuperacoes_enviadas||[]).length;
      const falhas=data?.falhas||[];
      let msg=`Grupo ${data?.codigo||''} processado com sucesso.\n\n`+
              `Convites de primeiro acesso enviados: ${convites}.\n`+
              `E-mails de definição/redefinição de senha enviados: ${recuperacoes}.`;
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
    if(!confirm('Reenviar o e-mail de definição/redefinição de senha para os integrantes deste grupo?')) return;
    return executarAcessos(id,false);
  };

  window.renderSolicitacoes=function(rows){
    $('solBody').innerHTML=rows.map(x=>{
      const orig=x.caminho_termo_original;
      const ass=x.caminho_termo_assinado||x.caminho_termo;
      const canValidate=x.status==='AGUARDANDO VALIDAÇÃO'&&!!ass;
      const grupoCodigo=groups.find(g=>g.id===x.grupo_id)?.codigo||'APROVADA';
      const acao=x.status!=='APROVADA'
        ? `<button class="btn ok" ${canValidate?'':'disabled'} onclick="validar('${x.id}')">Validar e liberar acessos</button><button class="btn warn" onclick="regularizar('${x.id}','${esc(x.protocolo)}')">Regularização</button>`
        : `<b>${esc(grupoCodigo)}</b><br><button class="btn info" style="margin-top:6px" onclick="reenviarAcessos('${x.id}')">Reenviar acesso</button>`;
      return `<tr><td><b>${esc(x.protocolo)}</b><br><small>${new Date(x.created_at).toLocaleString('pt-BR')}</small></td><td><b>${esc(x.nome_grupo)}</b><br>${esc(x.tema||'—')}</td><td>${esc(x.representante)}<br>${esc(x.vice_representante)}</td><td><span class="chip ${chip(x.status)}">${esc(x.status)}</span>${x.observacao_professor?'<br><small>'+esc(x.observacao_professor)+'</small>':''}</td><td><div class="actions">${orig?`<button class="btn info" onclick="abrirTermo('${esc(orig)}')">Ver original</button>`:'<small>Original legado indisponível</small>'}${ass?`<button class="btn alt" onclick="abrirTermo('${esc(ass)}')">Ver assinado</button>`:'<small>Assinado não enviado</small>'}</div></td><td><div class="actions">${acao}</div></td></tr>`;
    }).join('')||'<tr><td colspan="6" class="empty">Nenhuma solicitação.</td></tr>';
  };
})();