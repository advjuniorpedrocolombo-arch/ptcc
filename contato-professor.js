(function(){
  const NOME='Prof. Junior Pedro Colombo';
  const FONE='(15) 99745-1709';
  const WA='5515997451709';
  const css=document.createElement('style');
  css.textContent=`.prof-contact-top{display:flex;align-items:center;gap:8px;flex-wrap:wrap;color:#d9e9ef;font-size:.72rem;margin-top:3px}.prof-contact-top b{color:#fff}.prof-contact-top a{display:inline-flex;align-items:center;gap:4px;color:#ffd965;font-weight:800;padding:2px 6px;border:1px solid rgba(255,217,101,.28);border-radius:999px}.prof-contact-top a:hover{background:rgba(255,217,101,.1)}.prof-footer-contact{font-size:.76rem;color:#cfe0e7;margin-top:4px}.prof-footer-contact a{color:#ffd965;font-weight:800}@media(max-width:650px){.prof-contact-top{font-size:.68rem}.prof-contact-top a{padding:2px 5px}}`;
  document.head.appendChild(css);

  const brand=document.querySelector('.header .brand');
  if(brand && !brand.querySelector('.prof-contact-top')){
    const d=document.createElement('div');
    d.className='prof-contact-top';
    d.innerHTML=`<span><b>${NOME}</b></span><span>•</span><a href="https://wa.me/${WA}" target="_blank" rel="noopener" aria-label="WhatsApp do professor">WhatsApp ${FONE}</a>`;
    brand.appendChild(d);
  }

  const footer=document.querySelector('footer .footer');
  if(footer && !footer.querySelector('.prof-footer-contact')){
    const blocks=footer.querySelectorAll('span');
    const target=blocks[blocks.length-1]||footer;
    const d=document.createElement('div');
    d.className='prof-footer-contact';
    d.innerHTML=`WhatsApp: <a href="https://wa.me/${WA}" target="_blank" rel="noopener">${FONE}</a>`;
    target.appendChild(d);
  }
})();
