# Pesquisa: Portal de documentação trilíngue

## Decisão 1: publicação estática com Astro

- **Decisão:** usar o site Astro existente com saída estática, integração React apenas para interações de cliente e Pagefind para busca.
- **Racional:** `site/astro.config.mjs` já configura `output: "static"`, base path de GitHub Pages e URLs verificadas. O `site/package.json` já contém Astro, React, Pagefind e Playwright. Isso mantém o portal independente de um backend e compatível com GitHub Pages.
- **Alternativas consideradas:** Next.js com servidor; rejeitado porque acrescentaria runtime e infraestrutura sem necessidade para conteúdo versionado. Uma SPA totalmente client-side; rejeitada porque prejudicaria carregamento, acessibilidade e renderização de documentos.

## Decisão 2: ingestão por snapshots Git e blobs imutáveis

- **Decisão:** ler `main`, `espanol` e `portugues-br` como snapshots Git, registrar o commit de cada edição e gerar o catálogo em `.generated/catalog.json`.
- **Racional:** `site/scripts/build-content.mjs` já percorre árvores Git, valida paths, lê blobs e gera links para o commit exato. O conteúdo original é gravado em `public/content-raw/` para download sem conversão.
- **Alternativas consideradas:** buscar arquivos pela API do GitHub em runtime; rejeitado por dependência de rede, credenciais e comportamento variável. Copiar apenas Markdown; rejeitado porque REQ-PORTAL-001 exige cobertura de todos os arquivos versionados.

## Decisão 3: cobertura estrita das três edições

- **Decisão:** exigir exatamente as três edições e o mesmo conjunto lógico de caminhos; bloquear documentos não traduzidos e divergência do motor do portal.
- **Racional:** `assertCoverage` em `site/scripts/lib/content.mjs` implementa a regra e evita publicação silenciosa em inglês quando uma tradução está ausente.
- **Alternativas consideradas:** fallback automático para inglês; rejeitado explicitamente por REQ-PORTAL-002. Permitir catálogos parciais; rejeitado porque torna a navegação entre idiomas imprevisível.

## Decisão 4: segurança de caminhos e conteúdo técnico

- **Decisão:** rejeitar paths absolutos, `..`, links que escapem do repositório, estado sensível, chaves privadas, symlinks de saída e SVGs perigosos; escapar código como texto.
- **Racional:** `validatePath`, `resolveRepositoryTarget`, `assertPublishable`, `renderSourceLines` e `audit-built-site.mjs` formam uma defesa em profundidade para REQ-PORTAL-008.
- **Alternativas consideradas:** confiar no caminho retornado pelo Git; rejeitado porque links simbólicos e referências relativas podem atravessar limites. Renderizar código como HTML; rejeitado por risco de execução e perda de bytes originais.

## Decisão 5: bloqueio fail-closed da publicação

- **Decisão:** verificar repositório, visibilidade do Pages, tipo de build e URL HTTPS imediatamente antes da criação do artefato e novamente durante o deploy.
- **Racional:** `pages-guard.mjs` e `assertPagesAccess` atendem REQ-PORTAL-009; `site/.github/workflows/pages.yml` mantém permissões mínimas e falha quando a visibilidade é desconhecida ou incompatível.
- **Alternativas consideradas:** confiar na configuração manual do GitHub Pages; rejeitado porque uma mudança administrativa poderia expor conteúdo privado sem alteração no código.

## Decisão 6: validação em camadas

- **Decisão:** executar testes de ingestão, `astro check`, build, Pagefind, auditoria do site e Playwright em desktop e mobile.
- **Racional:** a combinação valida regras puras, tipos/componentes, rotas geradas, bytes de download, fragments, índice de busca e interação responsiva. O workflow existente já codifica essa ordem.
- **Alternativas consideradas:** somente teste de unidade; rejeitado porque não detectaria rotas ausentes, bytes alterados ou problemas de publicação. Somente teste E2E; rejeitado porque seria mais lento e menos diagnóstico para invariantes de ingestão.

## Pontos ainda dependentes do ambiente

- As refs `origin/main`, `origin/espanol` e `origin/portugues-br` precisam estar disponíveis no checkout completo para uma compilação de produção.
- A URL do GitHub Pages precisa ser fornecida por `SITE_URL` no CI e corresponder à configuração verificada pelo guard.
- O catálogo final depende dos commits presentes nas três branches no momento da compilação; esses IDs devem ser tratados como metadados de publicação, não como valores fixos no código.
