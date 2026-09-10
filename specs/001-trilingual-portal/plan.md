# Plano de implementação: Portal de documentação trilíngue

**Branch**: `001-trilingual-portal` | **Date**: 2026-09-10 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-trilingual-portal/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command; its definition describes the execution workflow.

## Summary

O portal publica uma edição web estática e acessível do repositório completo em inglês, espanhol e português do Brasil. A implementação usa o site Astro existente para gerar um catálogo a partir de snapshots Git das branches `main`, `espanol` e `portugues-br`, preserva cada blob para download, renderiza documentos e código com segurança, indexa a documentação com Pagefind e bloqueia a publicação quando cobertura, proveniência, links ou visibilidade do Pages não forem verificáveis.

## Technical Context

**Language/Version**: JavaScript/TypeScript, Node.js 24.20.0+, TypeScript 5.9, Astro 7, React 19

**Primary Dependencies**: Astro, React, `@astrojs/react`, Pagefind, Markdown Remark, `rehype-raw`, `rehype-sanitize`, Playwright

**Storage**: Arquivos estáticos gerados em `site/dist`; catálogo em `site/.generated`; blobs originais em `site/public/content-raw`; preferências somente no armazenamento local do navegador

**Testing**: Node test runner, `astro check`, build Astro/Pagefind, auditoria `audit-built-site.mjs` e Playwright desktop/mobile

**Target Platform**: GitHub Pages com deploy por GitHub Actions; desenvolvimento local em Windows e CI Ubuntu

**Project Type**: Site de documentação estático com pipeline de publicação

**Performance Goals**: páginas navegáveis sem runtime de servidor; busca pré-indexada; validação desktop e mobile sem bloquear a leitura por animações

**Constraints**: saída estática; exatamente três edições; cobertura de todos os paths; bytes de download idênticos aos blobs Git; sem fallback silencioso de tradução; sem execução de código; publicação HTTPS e fail-closed para acesso privado

**Scale/Scope**: todo arquivo versionado nas três branches, dezenas de páginas por edição, quatro superfícies editoriais principais e rotas para documentos, fontes, imagens e binários

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

O arquivo `.specify/memory/constitution.md` ainda contém apenas o template, sem princípios ratificados ou gates executáveis. As regras globais do repositório são aplicadas como restrições operacionais:

- **PASS:** reutilizar a aplicação existente em `site/`, sem backend, banco ou dependência nova.
- **PASS:** manter testes de ingestão antes da publicação e referências `REQ-PORTAL-*` nos testes.
- **PASS:** usar fail-closed para paths, conteúdo, bytes, links e visibilidade do Pages.
- **PASS:** manter rastreabilidade aos dez requisitos em `spec.md`.
- **Nota:** preencher a constituição é uma tarefa de governança separada; não há princípio formal ratificado adicional para bloquear este plano.

## Project Structure

### Documentação desta feature

```text
specs/001-trilingual-portal/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Gerado posteriormente por /speckit.tasks
```

### Código-fonte (raiz do repositório)

```text
site/
├── src/
│   ├── components/       # biblioteca, busca, idioma, preferências e visualizações
│   ├── layouts/          # shell acessível e navegação persistente
│   ├── lib/              # catálogo, modelo e mensagens de idioma
│   ├── pages/            # home e rotas de documentos/arquivos por locale
│   └── styles/            # tokens e comportamento responsivo
├── scripts/
│   ├── lib/               # ingestão Git, Markdown, links e relatórios
│   ├── build-content.mjs  # snapshots, cobertura e catálogo
│   ├── build.mjs          # check, build, Pagefind e auditoria
│   ├── pages-guard.mjs    # acesso e visibilidade do Pages
│   └── audit-built-site.mjs
├── tests/                 # testes de ingestão e browser
├── public/content-raw/    # blobs de download gerados, não versionados
└── .generated/            # catálogo e relatórios gerados, não versionados

.github/workflows/pages.yml # pipeline de publicação e deploy verificado
```

**Structure Decision**: manter o portal como um único projeto estático em `site/`, com lógica de preparação isolada em `site/scripts/`, renderização em `site/src/` e validação em `site/tests/`. Não criar `backend/`, `frontend/` ou banco de dados para esta feature: o repositório já contém a superfície web e a publicação é somente leitura.

## Riscos e decisões de implementação

- A compilação depende de histórico completo e das três refs remotas; o workflow falha se qualquer ref não estiver disponível.
- O conjunto de paths deve ser comparado antes do build para impedir uma edição parcial ou fallback silencioso.
- Links relativos e fragments precisam ser resolvidos contra o path de origem; links que escapem do repositório são bloqueados.
- O conteúdo Markdown deve passar por renderização sanitizada; fontes e binários devem manter sua representação original.
- O guard de Pages precisa executar antes do artefato e novamente durante o deploy para reduzir a janela de configuração insegura.
- O catálogo registra commits e blobs, permitindo auditoria posterior sem depender do estado atual das branches.
- A validação atual de Markdown falha em `site/tests/markdown.test.mjs` porque o `README.md` não apresenta a tabela que reúne as três branches de idioma. A implementação deve restaurar a tabela antes de considerar o portal pronto para publicação.

## Complexity Tracking

Não há violações da constituição ratificada. A constituição local ainda é um template; nenhuma complexidade adicional foi introduzida.
