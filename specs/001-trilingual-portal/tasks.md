---

description: "Tarefas de implementação do portal de documentação trilíngue"
---

# Tarefas: Portal de documentação trilíngue

**Input**: Artefatos de design em `specs/001-trilingual-portal/`

**Pré-requisitos**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [contracts/catalog-schema.md](contracts/catalog-schema.md) e [quickstart.md](quickstart.md)

**Testes**: A especificação não solicita TDD nem novas suítes. As tarefas de validação executam os testes de regressão existentes e mantêm os comentários `REQ-PORTAL-*` já presentes.

**Organização**: As tarefas estão agrupadas por incrementos independentes de valor ao usuário. Cada descrição identifica os arquivos que serão alterados ou verificados.

## Fase 1: Preparação

**Objetivo**: Deixar o ambiente reproduzível e confirmar os contratos de entrada do portal.

- [X] T001 Instalar as dependências bloqueadas e confirmar Node.js 24+ usando `site/package.json` e `site/package-lock.json`
- [X] T002 Conferir a configuração de saída estática, base path e integração React em `site/astro.config.mjs`
- [X] T003 Conferir o contrato de publicação e os comandos de validação em `specs/001-trilingual-portal/quickstart.md` e `site/package.json`

---

## Fase 2: Fundacional

**Objetivo**: Construir as garantias de ingestão, modelo e renderização segura que bloqueiam todos os incrementos de interface.

- [X] T004 Definir os tipos `Catalog`, `Edition`, `Entry` e `Heading` conforme o contrato em `site/src/lib/model.ts`
- [X] T005 Implementar a validação fail-closed do catálogo e a seleção obrigatória de edição em `site/src/lib/catalog.ts`
- [X] T006 [P] Validar árvores Git, paths, blobs, links relativos e visibilidade do Pages em `site/scripts/lib/content.mjs`
- [X] T007 [P] Implementar leitura de snapshots Git imutáveis e preservação de bytes em `site/scripts/lib/git.mjs`
- [X] T008 [P] Sanitizar Markdown, links e HTML não confiável em `site/scripts/lib/markdown.mjs` e `site/scripts/lib/html.mjs`
- [X] T009 Gerar `site/.generated/catalog.json` e blobs originais a partir das três refs em `site/scripts/build-content.mjs`
- [X] T010 Registrar prontidão, cobertura, refs ausentes e bloqueadores de tradução em `site/scripts/lib/content-readiness.mjs` e `site/scripts/content-status.mjs`

**Marco**: o catálogo só pode ser consumido quando houver exatamente as edições `en`, `es` e `pt-br`, cada uma cobrindo todos os paths lógicos.

---

## Fase 3: História do Usuário 1 - Consultar o repositório completo em três idiomas (P1)

**Objetivo**: Como participante, quero abrir a edição em inglês, espanhol ou português e encontrar qualquer arquivo versionado para consultar ou baixar seu conteúdo original.

**Requisitos**: REQ-PORTAL-001, REQ-PORTAL-002, REQ-PORTAL-008 e REQ-PORTAL-010.

**Critério independente**: após `npm run prepare:content`, cada edição possui todos os paths, documentos e fontes são visualizáveis quando seguros, binários podem ser baixados e cada download conserva o blob Git original.

- [X] T011 [US1] Criar a página inicial que redireciona para uma edição válida em `site/src/pages/index.astro`
- [X] T012 [US1] Criar a home localizada que apresenta o catálogo completo da edição ativa em `site/src/pages/[locale]/index.astro`
- [X] T013 [US1] Implementar a biblioteca com a listagem completa de entradas da edição ativa em `site/src/pages/[locale]/library.astro` e `site/src/components/Collection.tsx`
- [X] T014 [US1] Implementar rotas estáticas para documentos, fontes, imagens e binários a partir de `Catalog.entries` em `site/src/pages/[locale]/[...route].astro`
- [X] T015 [US1] Restaurar a tabela de seleção das três edições, com links para `main`, `espanol` e `portugues-br`, em `README.md`
- [X] T016 [US1] Verificar cobertura, preservação de blobs, idiomas obrigatórios e a tabela de idiomas executando `site/tests/content.test.mjs`, `site/tests/content-readiness.test.mjs` e `site/tests/markdown.test.mjs`

---

## Fase 4: História do Usuário 2 - Continuar a leitura no mesmo documento em outro idioma (P1)

**Objetivo**: Como leitora ou leitor, quero trocar de idioma sem perder o documento, seus links internos nem a referência ao commit de origem.

**Requisitos**: REQ-PORTAL-003 e REQ-PORTAL-004.

**Critério independente**: de uma rota de documento, cada seletor de idioma abre o mesmo `Entry.path` na edição escolhida; links relativos e fragments resolvem no portal e há um link explícito para o commit de origem no GitHub.

- [X] T017 [US2] Definir mensagens, labels e metadados localizados em `site/src/lib/i18n.ts`
- [X] T018 [US2] Implementar URLs de troca de edição pelo mesmo path lógico em `site/src/lib/catalog.ts`
- [X] T019 [US2] Resolver âncoras e equivalências de headings entre traduções em `site/scripts/lib/anchors.mjs`
- [X] T020 [US2] Renderizar links internos, fragments e a proveniência de commit na rota de conteúdo em `site/src/pages/[locale]/[...route].astro`
- [X] T021 [US2] Auditar rotas, fragments, links locais e hashes de download em `site/scripts/audit-built-site.mjs`
- [X] T022 [US2] Verificar navegação entre idiomas e links de proveniência executando `site/tests/anchors.test.mjs`, `site/tests/browser/catalog.spec.ts` e `site/tests/browser/portal.spec.ts`

---

## Fase 5: História do Usuário 3 - Encontrar conteúdo no idioma ativo (P2)

**Objetivo**: Como participante, quero buscar e filtrar a documentação no idioma selecionado com feedback acessível sobre o resultado.

**Requisitos**: REQ-PORTAL-005.

**Critério independente**: busca e filtros mostram apenas entradas da edição ativa e anunciam estados de carregamento, resultado vazio e erro sem ocultar o catálogo.

- [X] T023 [P] [US3] Implementar a indexação Pagefind após a compilação estática em `site/scripts/build.mjs`
- [X] T024 [US3] Implementar busca, filtros por categoria e estados acessíveis em `site/src/components/Collection.tsx`
- [X] T025 [US3] Integrar a abertura da biblioteca e seus controles no cabeçalho em `site/src/components/HeaderTools.tsx` e `site/src/layouts/PortalLayout.astro`
- [X] T026 [US3] Verificar busca, filtros e anúncios acessíveis: carregamento, resultados e vazio devem ser educados; erro deve ser imediato, executando `site/tests/browser/portal.spec.ts` e `site/tests/markdown.test.mjs`

---

## Fase 6: História do Usuário 4 - Ler confortavelmente em qualquer dispositivo (P2)

**Objetivo**: Como pessoa usuária de desktop ou celular, quero controles acessíveis de idioma, tema, movimento e progresso sem que preferências locais mudem o conteúdo versionado.

**Requisitos**: REQ-PORTAL-006 e REQ-PORTAL-007.

**Critério independente**: no viewport mobile não há rolagem horizontal; todos os controles são acessíveis por teclado; tema, progresso e movimento reduzido persistem somente no navegador e o catálogo permanece inalterado.

- [X] T027 [P] [US4] Implementar tema, progresso de leitura e preferência por movimento reduzido em `site/src/components/ReadingControls.tsx`
- [X] T028 [US4] Integrar controles de leitura, idiomas e atalhos de teclado no shell em `site/src/layouts/PortalLayout.astro` e `site/src/components/HeaderTools.tsx`
- [X] T029 [US4] Aplicar tokens, layout responsivo e regras `prefers-reduced-motion` em `site/src/styles/tokens.css` e `site/src/styles/portal.css`
- [X] T030 [US4] Verificar teclado, preferências e ausência de overflow horizontal nos viewports de `375px`, `768px` e `1440px` em `site/tests/browser/portal.spec.ts` e `site/tests/browser-preview.test.mjs`

---

## Fase 7: História do Usuário 5 - Publicar sem expor conteúdo privado (P1)

**Objetivo**: Como pessoa responsável pela publicação, quero que a esteira bloqueie automaticamente uma configuração insegura do GitHub Pages antes de expor o material do instrutor.

**Requisitos**: REQ-PORTAL-009 e REQ-PORTAL-010.

**Critério independente**: para repositório privado, a esteira falha antes do upload caso a visibilidade do Pages seja pública ou desconhecida; em configuração válida, registra commits, cobertura e auditoria do build.

- [X] T031 [US5] Implementar a consulta de acesso e o bloqueio fail-closed para GitHub Pages em `site/scripts/pages-guard.mjs`
- [X] T032 [US5] Executar o guard antes do build e imediatamente antes do deploy em `.github/workflows/pages.yml`
- [X] T033 [US5] Registrar relatório de publicação com inventário, links, fragments, cobertura e problemas em `site/scripts/audit-built-site.mjs`
- [X] T034 [US5] Verificar os cenários de visibilidade e relatório reproduzível executando `site/tests/content.test.mjs`, `site/tests/content-readiness.test.mjs` e `site/scripts/pages-guard.mjs`

---

## Fase 8: Polimento e validação transversal

**Objetivo**: Confirmar que o artefato está pronto para publicação e que a documentação operacional continua precisa.

- [X] T035 Atualizar os resultados e pré-requisitos de validação em `specs/001-trilingual-portal/quickstart.md`
- [X] T036 Executar checagem de tipos e build completo com `site/package.json`, gerando `site/dist` e `site/.generated/site-audit.json`
- [X] T037 Executar a suíte Node e os testes Playwright desktop/mobile em `site/tests/` e `site/tests/browser/`
- [X] T038 Revisar a rastreabilidade dos dez requisitos em `specs/001-trilingual-portal/spec.md`, `specs/001-trilingual-portal/plan.md` e `site/tests/`

## Dependências e ordem de execução

```text
Preparação -> Fundacional -> US1 -> US2
                              |-> US3
                              |-> US4
                              |-> US5
US2 + US3 + US4 + US5 -> Polimento e validação transversal
```

- **US1** é o MVP: entrega catálogo, três idiomas, conteúdo visualizável e downloads confiáveis.
- **US2** depende de US1, pois precisa de rotas e entradas correspondentes para preservar o path durante a troca de idioma.
- **US3** depende do catálogo completo de US1, mas não de US2.
- **US4** pode começar após a Fase 2 e integrar-se à home e às rotas assim que US1 existir.
- **US5** pode começar após a Fase 2 e depende do build de catálogo para a validação final de publicação.

## Exemplos de execução paralela

### US1

```text
T011 e T013 podem avançar em paralelo após T010, pois alteram páginas distintas.
T014 depende de T004, T005 e T009, mas não de T011 ou T013.
T015 pode ser feita em paralelo com T011-T014.
```

### US2

```text
T017 e T019 podem avançar em paralelo após a Fase 2.
T018 depende de T005; T020 integra T017-T019 e a rota criada em T014.
```

### US3

```text
T023 e T024 podem avançar em paralelo após US1.
T025 depende de T024 para integrar os controles no shell.
```

### US4

```text
T027 e o trabalho de tokens em T029 podem avançar em paralelo após a Fase 2.
T028 integra os controles criados em T027 no layout compartilhado.
```

### US5

```text
T031 e T033 podem avançar em paralelo após T006 e T009.
T032 depende de T031; T034 valida o fluxo integrado.
```

## Estratégia de implementação

1. Concluir Preparação e Fundacional para criar um catálogo estrito, reproduzível e seguro.
2. Entregar US1 e validar o MVP, incluindo a tabela de três idiomas no `README.md` que hoje bloqueia a suíte Markdown.
3. Acrescentar US2 para a leitura contínua e, em seguida, US3 e US4 conforme prioridade de experiência.
4. Integrar US5 e concluir o build, auditoria e testes de navegador antes de qualquer publicação.
