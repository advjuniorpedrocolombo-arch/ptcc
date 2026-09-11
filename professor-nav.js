(function(){
  const css=`<style id="profNavCss">
  .prof-nav-link{display:inline-flex;align-items:center;gap:6px;border-radius:9px;padding:9px 12px;font-weight:800;text-decoration:none;background:#e1aa14;color:#17313d;border:1px solid #e1aa14;white-space:nowrap}.prof-nav-link.secondary{background:#fff;color:#07364a;border-color:#dce5e9}.prof-nav-wrap{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.cronograma-callout{margin:14px 0;padding:12px 14px;border:1px solid #dce5e9;border-radius:12px;background:#f8fbfc;display:flex;justify-content:space-between;gap:12px;align-items:center}.cronograma-callout b{color:#07364a}.cronograma-callout small{display:block;color:#6c7d86;margin-top:3px}.cronograma-callout a{margin:0}@media(max-width:700px){.prof-nav-wrap{width:100%;justify-content:flex-end}.cronograma-callout{align-items:stretch;flex-direction:column}}
  </style>`;
  if(!document.getElementById('profNavCss'))document.head.insertAdjacentHTML('beforeend',css);

  function inject(){
    const topin=document.querySelector('.topin');
    if(topin&&!document.getElementById('profTopNav')){
      const logout=document.getElementById('logout');
      const wrap=document.createElement('div');wrap.id='profTopNav';wrap.className='prof-nav-wrap';
      wrap.innerHTML='<a class="prof-nav-link" href="./professor-cronograma.html">Cronograma e etapas</a>';
      if(logout){logout.parentNode.insertBefore(wrap,logout);wrap.appendChild(logout)} else topin.appendChild(wrap);
    }
    const app=document.getElementById('app');
    if(app&&!document.getElementById('cronogramaCallout')){
      const panel=app.querySelector('.panel');
      if(panel){
        const box=document.createElement('div');box.id='cronogramaCallout';box.className='cronograma-callout';
        box.innerHTML='<div><b>Planejamento do semestre</b><small>Defina início e fim do semestre, gere uma sugestão automática das etapas e ajuste as datas individualmente.</small></div><a class="prof-nav-link" href="./professor-cronograma.html">Abrir cronograma</a>';
        panel.insertBefore(box,panel.firstChild);
      }
    }
  }
  inject();
  const oldShow=window.showApp;
  if(typeof oldShow==='function')window.showApp=async function(){const r=await oldShow.apply(this,arguments);inject();return r};
  setTimeout(inject,500);
})();