# PTCC — Técnico em Marketing — Etec Extensão Ibiúna

Reconstrução completa da Plataforma PTCC em 11/09/2026.

## Arquitetura atual

- `index.html` — portal do aluno: cadastro da equipe, geração do Termo, envio do Termo assinado, consulta de protocolo, primeiro acesso, recuperação de senha, área do grupo e entregas.
- `professor.html` — painel administrativo: validação de Termos, grupos, entregas, devolutivas, aprovação e cronograma.
- Supabase — autenticação, banco PostgreSQL, RLS, Storage e Edge Function.
- Bucket ativo: `ptcc-v2`.
- Edge Function ativa: `aprovar-termo`.
- Tabelas ativas da reconstrução utilizam o prefixo `ptcc_v2_`.

## Fluxo

1. Aluno cadastra a equipe.
2. O sistema gera protocolo e PDF do Termo de Compromisso.
3. A equipe imprime e assina manualmente.
4. Representante ou vice envia o PDF assinado.
5. Professor confere e valida no painel.
6. O grupo é criado e os integrantes recebem convite ou recuperação de acesso por e-mail.
7. Cada integrante define a própria senha.
8. O grupo envia as etapas em PDF.
9. Professor aprova ou solicita ajustes.

## Segurança

- Área administrativa exige autenticação e perfil `professor`.
- Alunos só visualizam dados do próprio grupo.
- PDFs ficam em bucket privado.
- Funções administrativas verificam permissão no banco.
- Arquivos antigos e arquitetura anterior não são utilizados pela V2.

## Backup

O código anterior ao rebuild foi preservado na branch:

`backup-antes-rebuild-2026-09-11`
