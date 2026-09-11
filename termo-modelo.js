(function(){
  function buildTermPdfOficial(d, protocolo){
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit:'mm', format:'a4' });
    const W = 210, H = 297, L = 18, R = 18, CW = W-L-R;
    let y = 16;

    const integrantes = [
      { nome:d.rep, funcao:'Representante', email:d.emailRep },
      { nome:d.vice, funcao:'Vice-representante', email:d.emailVice },
      ...(d.integrantes||[]).map(x=>({nome:x.nome,funcao:'Integrante',email:x.email||''}))
    ];
    const nomes = integrantes.map(x=>x.nome).filter(Boolean);
    const listaNomes = nomes.length<=1 ? (nomes[0]||'') : nomes.slice(0,-1).join(', ')+' e '+nomes[nomes.length-1];

    const clauses = [
      ['CLÁUSULA 1ª – DO OBJETO', `O presente Termo de Compromisso tem por objeto estabelecer as responsabilidades dos integrantes da equipe ${d.nomeGrupo} para o desenvolvimento do Trabalho de Conclusão de Curso (TCC), no componente Projeto de Trabalho de Conclusão de Curso – PTCC, do Curso Técnico em Marketing da Etec de Mairinque – Extensão Ibiúna.`],
      ['CLÁUSULA 2ª – DA COMPOSIÇÃO DA EQUIPE', `Integram a equipe os alunos ${listaNomes}, todos devidamente matriculados no 2º módulo do Curso Técnico em Marketing da Etec de Mairinque – Extensão Ibiúna/SP, os quais declaram estar cientes de sua participação e responsabilidade conjunta pelo desenvolvimento das atividades propostas.`],
      ['CLÁUSULA 3ª – DA REPRESENTAÇÃO DA EQUIPE', `Fica designado(a) como representante da equipe ${d.rep} e como vice-representante ${d.vice}, escolhidos por Consenso entre todos os integrantes.`],
      ['CLÁUSULA 4ª – DAS ATRIBUIÇÕES DO REPRESENTANTE E DO VICE', 'Compete ao representante e ao vice-representante manter a comunicação oficial da equipe com o professor, organizar as informações, acompanhar os prazos e garantir que os demais integrantes tenham ciência das orientações, atividades e decisões relacionadas ao TCC.'],
      ['CLÁUSULA 5ª – DA PARTICIPAÇÃO NAS REUNIÕES', 'O representante e o vice-representante não poderão faltar às reuniões previamente convocadas sem comunicação ao professor. Na ausência do representante, o vice deverá comparecer. Caso ambos não possam comparecer, a equipe deverá avisar previamente e indicar outro integrante que esteja plenamente informado sobre o andamento do trabalho.'],
      ['CLÁUSULA 6ª – DA AUSÊNCIA COLETIVA', 'A ausência coletiva da equipe, sem aviso prévio e sem justificativa aceita pelo professor, poderá resultar em redução da menção final da equipe, sem prejuízo das demais medidas pedagógicas cabíveis.'],
      ['CLÁUSULA 7ª – DA PARTICIPAÇÃO INDIVIDUAL', 'Todos os integrantes comprometem-se a participar ativamente das pesquisas, discussões, produções escritas, apresentações, correções e demais etapas do TCC, cumprindo as tarefas distribuídas pela equipe dentro dos prazos estabelecidos.'],
      ['CLÁUSULA 8ª – DOS PRAZOS E ENTREGAS', 'A equipe compromete-se a cumprir os cronogramas, prazos e critérios definidos pelo professor, realizando as entregas parciais e finais de forma organizada, completa e compatível com as orientações acadêmicas recebidas.'],
      ['CLÁUSULA 9ª – DA COMUNICAÇÃO OFICIAL', 'A equipe utilizará o canal Whatsapp como canal interno de comunicação, devendo seus integrantes acompanhar as mensagens, orientações e definições relacionadas ao trabalho. As comunicações do professor realizadas em sala de aula ou pelos canais institucionais deverão ser consideradas de ciência de todos os integrantes.'],
      ['CLÁUSULA 10ª – DA ÉTICA E AUTORIA', 'Os integrantes comprometem-se a realizar o trabalho com ética, respeito e responsabilidade, vedada a prática de plágio, cópia indevida, falsificação de informações ou apresentação de trabalho produzido integralmente por terceiros. As fontes utilizadas deverão ser indicadas conforme as normas da ABNT e orientações do professor.'],
      ['CLÁUSULA 11ª – DA RESPONSABILIDADE COLETIVA E INDIVIDUAL', 'Embora o trabalho seja desenvolvido em equipe, cada integrante será responsável por sua participação efetiva. A ausência de colaboração, o descumprimento reiterado de tarefas ou condutas que prejudiquem o grupo poderão ser considerados individualmente na avaliação, mediante apuração pelo professor.'],
      ['CLÁUSULA 12ª – DA CIÊNCIA E ACEITAÇÃO', 'Os alunos declaram que as informações relativas à composição da equipe, à eleição do representante e do vice foram prestadas de boa-fé e discutidas entre todos os integrantes, comprometendo-se a cumprir integralmente as disposições deste Termo.'],
      ['CLÁUSULA 13ª – DA ALTERAÇÃO DA COMPOSIÇÃO DA EQUIPE', 'A troca, inclusão ou saída de integrantes da equipe somente poderá ocorrer mediante pedido formal, devidamente justificado, apresentado ao professor para apreciação e autorização expressa. Nenhum aluno poderá ser transferido, incluído ou excluído unilateralmente pelos demais integrantes.'],
      ['CLÁUSULA 14ª – DA DISTRIBUIÇÃO E DO REGISTRO DAS TAREFAS', 'A equipe deverá definir e registrar, no canal oficial de comunicação do grupo, as tarefas atribuídas a cada integrante, os respectivos prazos e as responsabilidades assumidas. Esse registro deverá ser claro e acessível a todos, servindo como acompanhamento do desenvolvimento individual e coletivo do TCC.'],
      ['CLÁUSULA 15ª – DA COMUNICAÇÃO DE DIFICULDADES INTERNAS', 'Caso um integrante deixe de cumprir suas tarefas, não participe das atividades ou prejudique o andamento do trabalho, a equipe deverá inicialmente buscar a solução interna, comunicando-lhe formalmente, pelo canal oficial do grupo, quais atividades deverá realizar e qual prazo deverá observar.'],
      ['CLÁUSULA 16ª – DO PROCEDIMENTO DE RECUPERAÇÃO', 'Antes de qualquer pedido de intervenção do professor, a equipe deverá oportunizar ao integrante a regularização de sua participação, realizando ao menos três tentativas documentadas de comunicação e solicitação de cumprimento das tarefas, em datas distintas e com prazo razoável para resposta ou execução.'],
      ['CLÁUSULA 17ª – DA DOCUMENTAÇÃO E DA ATA DA EQUIPE', 'Persistindo o descumprimento após as tentativas de recuperação, a equipe deverá elaborar ata ou relatório interno contendo: as tarefas atribuídas ao integrante; os prazos concedidos; as tentativas realizadas; as respostas apresentadas, se houver; e os impactos causados ao trabalho. O documento deverá ser assinado pelos integrantes da equipe, inclusive pelo aluno envolvido, quando presente e concordar em assinar. A eventual recusa de assinatura deverá ser registrada no próprio documento.'],
      ['CLÁUSULA 18ª – DA REUNIÃO COM PROFESSOR E COORDENAÇÃO', 'Após a apresentação da documentação, poderá ser realizada reunião com o professor, o integrante envolvido, os demais membros da equipe e, quando necessário, a Coordenação do Curso. A reunião deverá ser registrada em ata escolar, com indicação das orientações, compromissos de recuperação e assinaturas dos presentes.'],
      ['CLÁUSULA 19ª – DA AVALIAÇÃO INDIVIDUAL', 'A existência de trabalho em grupo não elimina a avaliação individual. Caso fique comprovado que determinado integrante não realizou as atividades que lhe foram atribuídas, não participou adequadamente ou descumpriu reiteradamente os compromissos assumidos, o professor poderá atribuir menção individual inferior à dos demais integrantes, observados os registros e o processo pedagógico adotado.'],
      ['CLÁUSULA 20ª – DA DECISÃO PEDAGÓGICA FINAL', 'Não havendo regularização após as medidas de recuperação e orientação, caberá ao professor avaliar a situação concreta e definir a medida pedagógica mais adequada, inclusive quanto à menção individual do aluno, à redistribuição de tarefas, à continuidade na equipe ou a outras providências compatíveis com as normas da escola.']
    ];

    function pageNo(){
      doc.setFont('helvetica','normal');
      doc.setFontSize(7.5);
      doc.text(`Página ${doc.getNumberOfPages()}`, W-R, 8, {align:'right'});
    }
    function newPage(){ doc.addPage(); y=16; pageNo(); }
    function ensure(h){ if(y+h>H-18) newPage(); }

    function drawJustifiedLine(text,xPos,yPos,width){
      const words=String(text||'').trim().split(/\s+/).filter(Boolean);
      if(words.length<=1){ doc.text(words[0]||'',xPos,yPos); return; }
      const totalWords=words.reduce((s,w)=>s+doc.getTextWidth(w),0);
      const gap=(width-totalWords)/(words.length-1);
      let x=xPos;
      words.forEach((w,i)=>{
        doc.text(w,x,yPos);
        x+=doc.getTextWidth(w)+(i<words.length-1?gap:0);
      });
    }

    function paragraph(text, opts={}){
      const size=opts.size||9.3, leading=opts.leading||4.25;
      doc.setFont('helvetica',opts.bold?'bold':'normal');
      doc.setFontSize(size);
      const lines=doc.splitTextToSize(text,CW);
      ensure(lines.length*leading+2);
      lines.forEach((line,i)=>{
        if(i<lines.length-1 && String(line).trim().split(/\s+/).length>1) drawJustifiedLine(line,L,y,CW);
        else doc.text(line,L,y);
        y+=leading;
      });
      y+=(opts.after??2.5);
    }

    function clause(title, body){
      doc.setFontSize(9.25);
      const leading=4.15;
      doc.setFont('helvetica','bold');
      const titleText=title+' – ';
      const titleW=doc.getTextWidth(titleText);
      doc.setFont('helvetica','normal');
      const firstAvail=CW-titleW;
      const words=String(body||'').split(/\s+/);
      let first='',cut=0;
      if(firstAvail>25){
        for(let i=0;i<words.length;i++){
          const t=(first?first+' ':'')+words[i];
          if(doc.getTextWidth(t)<=firstAvail){first=t;cut=i+1;}else break;
        }
      }
      const restText=words.slice(cut).join(' ');
      const restLines=restText?doc.splitTextToSize(restText,CW):[];
      ensure((1+restLines.length)*leading+2);

      doc.setFont('helvetica','bold');
      doc.text(titleText,L,y);
      if(first){
        doc.setFont('helvetica','normal');
        if(cut<words.length && first.trim().split(/\s+/).length>1) drawJustifiedLine(first,L+titleW,y,firstAvail);
        else doc.text(first,L+titleW,y);
      }
      y+=leading;

      doc.setFont('helvetica','normal');
      restLines.forEach((line,i)=>{
        if(i<restLines.length-1 && String(line).trim().split(/\s+/).length>1) drawJustifiedLine(line,L,y,CW);
        else doc.text(line,L,y);
        y+=leading;
      });
      y+=2.1;
    }

    pageNo();
    doc.setFont('helvetica','bold');
    doc.setFontSize(13.5);
    doc.text('TERMO DE COMPROMISSO DA EQUIPE DE TCC',W/2,y,{align:'center'}); y+=9;
    doc.setFontSize(10.2);
    doc.text(`Equipe: ${d.nomeGrupo}    Área(s) de conhecimento: ${d.tema}`,W/2,y,{align:'center',maxWidth:CW}); y+=8;

    const x0=L, widths=[72,42,60], rowH=9;
    const headers=['INTEGRANTE','FUNÇÃO NA\nEQUIPE','E-MAIL'];
    doc.setLineWidth(.25); doc.setFontSize(8.8); doc.setFont('helvetica','bold');
    let x=x0;
    headers.forEach((h,i)=>{doc.rect(x,y,widths[i],12);const ls=h.split('\n');doc.text(ls,x+widths[i]/2,y+4.8,{align:'center'});if(ls.length>1)doc.text(ls[1],x+widths[i]/2,y+8.4,{align:'center'});x+=widths[i];});
    y+=12; doc.setFont('helvetica','normal'); doc.setFontSize(8.5);
    integrantes.forEach(m=>{ensure(rowH+2);x=x0;const vals=[m.nome,m.funcao,m.email||''];vals.forEach((v,i)=>{doc.rect(x,y,widths[i],rowH);const lines=doc.splitTextToSize(String(v||''),widths[i]-3);doc.text(lines.slice(0,2),x+1.5,y+5.5,{lineHeightFactor:1.05});x+=widths[i];});y+=rowH;});
    y+=7;
    doc.setFont('helvetica','bold');doc.setFontSize(10.2);doc.text('DECLARAÇÃO E COMPROMISSOS',W/2,y,{align:'center'});y+=6;
    paragraph(`Nós, integrantes identificados acima, declaramos que constituímos a equipe ${d.nomeGrupo} para o desenvolvimento do Projeto de Trabalho de Conclusão de Curso, comprometendo-nos a atuar de forma responsável, colaborativa e ética durante todas as etapas do projeto.`,{after:3});
    clauses.forEach(c=>clause(c[0],c[1]));

    ensure(26);
    paragraph(`Eleição da representação. A equipe informa que a escolha de ${d.rep} como representante e de ${d.vice} como vice-representante ocorreu por Consenso entre todos os integrantes, conforme discussão e escolha registradas pelo grupo.`,{bold:true,after:3});
    paragraph('Declaração de boa-fé. Os integrantes confirmam que os dados informados são verdadeiros, que a composição e a eleição foram discutidas pela equipe e que assumem os compromissos descritos neste termo.',{bold:true,after:6});
    ensure(16);
    doc.setFont('helvetica','normal');doc.setFontSize(9.5);doc.text('Ibiúna, ______ de ______________________________ de 2026.',L,y);y+=14;

    const assinaturas=integrantes.map(x=>({nome:x.nome,funcao:x.funcao}));
    assinaturas.push({nome:'Dr. Junior Pedro Colombo',funcao:'Professor(a) responsável pelo PTCC'});
    assinaturas.forEach(a=>{
      ensure(20);
      doc.line(L,y,W-R,y);y+=5;
      doc.setFont('helvetica','normal');doc.setFontSize(9.2);doc.text(a.nome,L,y);y+=4.5;
      doc.setFontSize(8.4);doc.text(a.funcao,L,y);y+=10;
    });

    const pages=doc.getNumberOfPages();
    for(let p=1;p<=pages;p++){
      doc.setPage(p);doc.setFont('helvetica','normal');doc.setFontSize(6.8);
      doc.text(`Protocolo: ${protocolo}`,L,H-7);
      doc.text(`Página ${p} de ${pages}`,W-R,H-7,{align:'right'});
    }
    return doc;
  }
  window.buildTermPdf = buildTermPdfOficial;
})();
