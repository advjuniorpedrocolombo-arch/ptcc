(function(){
  const $=id=>document.getElementById(id);
  const loginCard=$('loginCard');
  const loginPane=$('loginPane');
  if(!loginCard||!loginPane||typeof sb==='undefined') return;

  const tabs=document.querySelector('.auth-tabs');
  if(tabs) tabs.remove();
  $('signupPane')?.remove();

  const loginForm=$('loginForm');
  if(loginForm){
    loginForm.insertAdjacentHTML('afterend',`
      <div id="authAccessTools" style="margin-top:12px">
        <button class="small-btn" id="forgotToggle" type="button" style="width:100%">Esqueci minha senha</button>
        <div id="forgotPane" class="hidden" style="margin-top:14px;border-top:1px solid var(--line);padding-top:14px">
          <h3 style="margin-top:0">Recuperar senha</h3>
          <p class="sub">Informe o mesmo e-mail cadastrado no Termo de Compromisso.</p>
          <form id="forgotAccessForm">
            <label>E-mail<input id="forgotAccessEmail" type="email" required></label>
            <button class="btn secondary" type="submit">Enviar link de recuperação</button>
            <div id="forgotAccessResult" class="result"></div>
          </form>
        </div>
        <div id="setPasswordPane" class="hidden" style="margin-top:14px;border-top:1px solid var(--line);padding-top:14px">
          <h3 style="margin-top:0">Definir minha senha</h3>
          <p class="sub" id="setPasswordInfo">Crie uma senha pessoal com pelo menos 8 caracteres.</p>
          <form id="setPasswordForm">
            <label>Nova senha<input id="newAccessPassword" type="password" minlength="8" required autocomplete="new-password"></label>
            <label>Confirmar nova senha<input id="confirmAccessPassword" type="password" minlength="8" required autocomplete="new-password"></label>
            <button class="btn" type="submit">Salvar minha senha</button>
            <div id="setPasswordResult" class="result"></div>
          </form>
        </div>
      </div>`);
  }

  const placeholder=document.querySelector('#dashboardPlaceholder .notice');
  if(placeholder) placeholder.innerHTML='<strong>Importante</strong><br>O acesso é criado automaticamente depois que o professor valida o Termo. Cada integrante usa o próprio e-mail e define a própria senha.';

  const forgotToggle=$('forgotToggle');
  forgotToggle?.addEventListener('click',()=>{
    $('forgotPane')?.classList.toggle('hidden');
    $('setPasswordPane')?.classList.add('hidden');
  });

  $('forgotAccessForm')?.addEventListener('submit',async e=>{
    e.preventDefault();
    const out=$('forgotAccessResult');
    try{
      const email=$('forgotAccessEmail').value.trim().toLowerCase();
      const redirectTo=location.origin+location.pathname+'?recuperar=1#grupo';
      const {error}=await sb.auth.resetPasswordForEmail(email,{redirectTo});
      if(error) throw error;
      show(out,true,'Se o e-mail estiver cadastrado, você receberá um link para criar uma nova senha.');
    }catch(err){
      show(out,false,esc(err.message||'Não foi possível solicitar a recuperação.'));
    }
  });

  function isPasswordLink(){
    const q=new URLSearchParams(location.search);
    const h=new URLSearchParams((location.hash||'').replace(/^#/,''));
    const t=(q.get('type')||h.get('type')||'').toLowerCase();
    return q.get('primeiro-acesso')==='1'||q.get('recuperar')==='1'||t==='invite'||t==='recovery';
  }

  function showPasswordPane(email,firstAccess){
    loginCard.classList.remove('hidden');
    $('dashboardCard')?.classList.add('hidden');
    $('dashboardPlaceholder')?.classList.remove('hidden');
    loginPane.classList.add('hidden');
    $('forgotPane')?.classList.add('hidden');
    $('setPasswordPane')?.classList.remove('hidden');
    const info=$('setPasswordInfo');
    if(info) info.textContent=(firstAccess?'Seu acesso foi liberado pelo professor. ':'')+'Defina agora sua senha pessoal'+(email?' para '+email:'')+'.';
    location.hash='grupo';
  }

  $('setPasswordForm')?.addEventListener('submit',async e=>{
    e.preventDefault();
    const out=$('setPasswordResult');
    try{
      const p=$('newAccessPassword').value;
      const c=$('confirmAccessPassword').value;
      if(p.length<8) throw new Error('A senha deve ter pelo menos 8 caracteres.');
      if(p!==c) throw new Error('As duas senhas não conferem.');
      const {error}=await sb.auth.updateUser({password:p});
      if(error) throw error;
      show(out,true,'Senha definida com sucesso. Abrindo o seu grupo...');
      history.replaceState({},document.title,location.origin+location.pathname+'#grupo');
      if(typeof loadDashboard==='function') await loadDashboard();
    }catch(err){
      show(out,false,esc(err.message||'Não foi possível definir a senha.'));
    }
  });

  sb.auth.onAuthStateChange((event,session)=>{
    if(event==='PASSWORD_RECOVERY') showPasswordPane(session?.user?.email||'',false);
    else if(event==='SIGNED_IN'&&isPasswordLink()) showPasswordPane(session?.user?.email||'',true);
  });

  sb.auth.getSession().then(({data})=>{
    if(data?.session&&isPasswordLink()) showPasswordPane(data.session.user?.email||'',new URLSearchParams(location.search).get('primeiro-acesso')==='1');
  });
})();
