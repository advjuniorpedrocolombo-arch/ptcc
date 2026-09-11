(function(){
const css=`<style id="ptccGroupCollapseCss">
#grupos .group-stages{display:none}
#grupos tr.ptcc-group-open .group-stages{display:flex}
#grupos tbody tr td:nth-child(1),#grupos tbody tr td:nth-child(2){cursor:pointer}
#grupos tbody tr td:nth-child(1):hover,#grupos tbody tr td:nth-child(2):hover{text-decoration:underline}
#grupos .group-collapse-hint{display:block;margin-top:3px;font-size:.64rem;color:var(--muted)}
</style>`;
if(!document.getElementById('ptccGroupCollapseCss'))document.head.insertAdjacentHTML('beforeend',css);
function aplicar(){
 const body=document.getElementById('grpBody'); if(!body)return;
 [...body.querySelectorAll('tr')].forEach(tr=>{
   if(tr.dataset.ptccCollapse==='1'||tr.cells.length<6)return;
   const stages=tr.querySelector('.group-stages'); if(!stages)return;
   tr.dataset.ptccCollapse='1'; tr.classList.remove('ptcc-group-open');
   const toggle=()=>tr.classList.toggle('ptcc-group-open');
   tr.cells[0].onclick=toggle; tr.cells[1].onclick=toggle;
   if(!tr.cells[1].querySelector('.group-collapse-hint')){
     const h=document.createElement('span'); h.className='group-collapse-hint'; h.textContent='Clique no código ou nome para mostrar/recolher as etapas'; tr.cells[1].appendChild(h);
   }
 });
}
const oldRG=window.renderGrupos;
if(typeof oldRG==='function')window.renderGrupos=function(rows){oldRG(rows);setTimeout(aplicar,80)};
const oldLA=window.loadAll;
if(typeof oldLA==='function')window.loadAll=async function(){const r=await oldLA.apply(this,arguments);setTimeout(aplicar,80);return r};
setTimeout(aplicar,900);
})();