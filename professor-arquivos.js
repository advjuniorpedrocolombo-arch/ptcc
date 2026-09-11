(function(){
  const css=`<style id="profArquivosCss">
  .file-btn{background:#275f78!important;color:#fff!important;border:0!important}
  .file-meta{display:block;margin-top:4px;color:var(--muted);font-size:.66rem;max-width:210px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  </style>`;
  if(!document.getElementById('profArquivosCss')) document.head.insertAdjacentHTML('beforeend',css);

  async function abrirArquivoEntrega(path){
    if(!path) return alert('Arquivo não localizado.');
    const {data,error}=await sb.storage.from('ptcc-arquivos').createSignedUrl(path,300);
    if(error||!data?.signedUrl) return alert(error?.message||'Não foi possível abrir o PDF.');
    window.open(data.signedUrl,'_blank','noopener');
  }
  window.abrirArquivoEntrega=abrirArquivoEntrega;

  async function aplicarBotoesArquivos(){
    const tbody=document.getElementById('entBody');
    if(!tbody) return;
    const {data:arquivos,error}=await sb.from('arquivos').select('entrega_id,nome_original,caminho_storage,tamanho_bytes,created_at');
    if(error){ console.error('Erro ao carregar arquivos das entregas:',error); return; }
    const mapa=new Map();
    (arquivos||[]).forEach(a=>{ if(a.entrega_id&&!mapa.has(a.entrega_id)) mapa.set(a.entrega_id,a); });

    const {data:entregas,error:errE}=await sb.from('entregas').select('id,protocolo').order('enviada_em',{ascending:false});
    if(errE){ console.error('Erro ao relacionar entregas:',errE); return; }
    const porProtocolo=new Map((entregas||[]).map(e=>[e.protocolo,e.id]));

    [...tbody.querySelectorAll('tr')].forEach(tr=>{
      const protocolo=(tr.cells?.[0]?.textContent||'').trim();
      const entregaId=porProtocolo.get(protocolo);
      const arq=mapa.get(entregaId);
      if(!arq||!tr.cells?.[5]||tr.querySelector('.open-file-btn')) return;
      const actions=tr.cells[5].querySelector('.actions')||tr.cells[5];
      const btn=document.createElement('button');
      btn.type='button';
      btn.className='btn file-btn open-file-btn';
      btn.textContent='Abrir PDF';
      btn.onclick=()=>abrirArquivoEntrega(arq.caminho_storage);
      actions.insertBefore(btn,actions.firstChild);
      const meta=document.createElement('span');
      meta.className='file-meta';
      meta.title=arq.nome_original||'';
      meta.textContent=arq.nome_original||'PDF enviado pelo grupo';
      tr.cells[2].appendChild(meta);
    });
  }

  const oldRender=renderEntregas;
  renderEntregas=function(rows){
    oldRender(rows);
    setTimeout(()=>aplicarBotoesArquivos().catch(console.error),0);
  };

  const oldLoad=loadAll;
  loadAll=async function(){
    const r=await oldLoad.apply(this,arguments);
    await aplicarBotoesArquivos().catch(console.error);
    return r;
  };

  setTimeout(()=>aplicarBotoesArquivos().catch(console.error),700);
})();
