(function(){
  if(typeof sb==='undefined') return;

  window.validar=async function(id){
    if(!confirm('Você conferiu o PDF assinado? Validar este Termo, criar o grupo e liberar o acesso dos integrantes?')) return;
    try{
      const {data,error}=await sb.functions.invoke('aprovar-termo',{body:{solicitacao_id:id}});
      if(error) throw error;
      if(data?.error) throw new Error(data.error);
      if(typeof loadAll==='function') await loadAll();
      const enviados=data?.convites_enviados?.length||0;
      const existentes=data?.contas_existentes?.length||0;
      const falhas=data?.falhas?.length||0;
      let msg=`Grupo ${data?.codigo||''} criado com sucesso.`;
      if(enviados) msg+=`\n\n${enviados} integrante(s) receberam por e-mail o link para definir a senha.`;
      if(existentes) msg+=`\n\n${existentes} e-mail(s) já possuíam conta. Esses alunos podem entrar normalmente ou usar “Esqueci minha senha”.`;
      if(falhas) msg+=`\n\nAtenção: ${falhas} convite(s) não puderam ser enviados. O grupo foi criado, mas será necessário reenviar o acesso depois.`;
      alert(msg);
    }catch(e){
      alert(e?.message||'Não foi possível validar o Termo.');
    }
  };
})();
