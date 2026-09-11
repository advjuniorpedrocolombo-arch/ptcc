import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root=process.cwd();
const ignoredDirs=new Set(['.git','node_modules','scripts','.github']);
const files=[];
function walk(dir){
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    if(entry.isDirectory()&&ignoredDirs.has(entry.name))continue;
    const full=path.join(dir,entry.name);
    if(entry.isDirectory())walk(full); else files.push(full);
  }
}
walk(root);

const errors=[];
const warnings=[];
const rel=f=>path.relative(root,f).replaceAll('\\','/');

for(const file of files){
  const name=rel(file);
  if(name.endsWith('.js')){
    const src=fs.readFileSync(file,'utf8');
    if(/\bsb_secret_|SUPABASE_SERVICE_ROLE_KEY|service_role\s*[:=]/i.test(src))errors.push(`${name}: possível chave secreta exposta no frontend.`);
    try{new vm.Script(src,{filename:name})}catch(e){errors.push(`${name}: erro de sintaxe JS: ${e.message}`)}
  }

  if(name.endsWith('.html')){
    const html=fs.readFileSync(file,'utf8');
    if(/\bsb_secret_|SUPABASE_SERVICE_ROLE_KEY|service_role\s*[:=]/i.test(html))errors.push(`${name}: possível chave secreta exposta no HTML.`);

    const ids=[...html.matchAll(/\sid=["']([^"']+)["']/g)].map(m=>m[1]);
    const dup=[...new Set(ids.filter((id,i)=>ids.indexOf(id)!==i))];
    if(dup.length)errors.push(`${name}: IDs HTML duplicados: ${dup.join(', ')}`);

    const localRefs=[...html.matchAll(/(?:src|href)=["'](\.\.?\/[^"'?#]+)[^"']*["']/g)].map(m=>m[1]);
    for(const ref of localRefs){
      const target=path.resolve(path.dirname(file),ref);
      if(!fs.existsSync(target))errors.push(`${name}: referência local inexistente: ${ref}`);
    }

    const scriptRe=/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;
    let m,idx=0;
    while((m=scriptRe.exec(html))){
      idx++;
      const src=m[1];
      if(!src.trim())continue;
      try{new vm.Script(src,{filename:`${name}#inline-${idx}`})}catch(e){errors.push(`${name} (script inline ${idx}): ${e.message}`)}
    }
  }
}

console.log(`Arquivos de frontend verificados: ${files.length}`);
for(const w of warnings)console.warn('AVISO:',w);
if(errors.length){
  for(const e of errors)console.error('ERRO:',e);
  console.error(`Validação falhou com ${errors.length} erro(s).`);
  process.exit(1);
}
console.log('Validação estática concluída sem erros.');
