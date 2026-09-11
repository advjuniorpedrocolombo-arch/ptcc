import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root=process.cwd();
const ignored=new Set(['.git','node_modules']);
const files=[];
function walk(dir){
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    if(ignored.has(entry.name))continue;
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
  if(/\.(js|mjs)$/.test(name)){
    const src=fs.readFileSync(file,'utf8');
    if(/\bsb_secret_|service_role\b/i.test(src))errors.push(`${name}: possível chave secreta exposta no frontend.`);
    if(name.endsWith('.js') && /^\s*(import|export)\s/m.test(src)){
      warnings.push(`${name}: contém import/export e não foi compilado como script clássico.`);
    }else{
      try{new vm.Script(src,{filename:name})}catch(e){errors.push(`${name}: erro de sintaxe JS: ${e.message}`)}
    }
  }

  if(name.endsWith('.html')){
    const html=fs.readFileSync(file,'utf8');
    if(/\bsb_secret_|service_role\b/i.test(html))errors.push(`${name}: possível chave secreta exposta no HTML.`);

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

const bannedStatus='AGUARDANDO ASSINATURA';
for(const file of files.filter(f=>/\.(html|js|mjs)$/.test(f))){
  const src=fs.readFileSync(file,'utf8');
  if(src.includes(bannedStatus))warnings.push(`${rel(file)}: usa status legado "${bannedStatus}"; prefira "AGUARDANDO ENVIO DO TERMO ASSINADO".`);
}

console.log(`Arquivos verificados: ${files.length}`);
for(const w of warnings)console.warn('AVISO:',w);
if(errors.length){
  for(const e of errors)console.error('ERRO:',e);
  console.error(`Validação falhou com ${errors.length} erro(s).`);
  process.exit(1);
}
console.log('Validação estática concluída sem erros.');
