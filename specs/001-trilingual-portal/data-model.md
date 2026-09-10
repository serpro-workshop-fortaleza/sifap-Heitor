# Modelo de dados: Portal de documentação trilíngue

O portal usa dados gerados em tempo de build. Não há banco de dados nem escrita de conteúdo em runtime.

## Catalog

Representa a publicação completa do portal.

| Campo | Tipo | Regras |
|---|---|---|
| `schemaVersion` | inteiro | Versão explícita do contrato; atualmente `1`. |
| `repository` | string | Slug `owner/name` validado contra o repositório atual. |
| `audience` | enum | `team` ou `instructor`; controla o aviso de conteúdo privado. |
| `siteUrl` | URL HTTPS | URL verificada do GitHub Pages, sem credenciais, query ou fragmento. |
| `basePath` | string | Prefixo do site, sempre terminado em `/`. |
| `generatedAt` | ISO datetime | Instante da geração do catálogo. |
| `editions` | `Edition[3]` | Deve conter `en`, `es` e `pt-br`, uma vez cada. |

## Edition

Uma edição linguística materializada de uma branch.

| Campo | Tipo | Regras |
|---|---|---|
| `code` | enum | `en`, `es` ou `pt-br`. |
| `label` | string | Nome localizável da edição. |
| `branch` | string | `main`, `espanol` ou `portugues-br`. |
| `commit` | SHA string | Commit real e não um fixture de zeros em produção. |
| `entries` | `Entry[]` | Inventário completo da branch; paths não podem duplicar. |

## Entry

Representa um arquivo versionado e sua visualização no portal.

| Campo | Tipo | Regras |
|---|---|---|
| `id` | string | Derivado de SHA-256 do path lógico. |
| `path` | string | Path relativo seguro; sem vazio, `.` ou `..`, barra invertida ou path absoluto. |
| `title` | string | Último componente do path. |
| `description` | string | Descrição derivada ou vazia. |
| `kind` | enum | `document`, `source`, `image` ou `binary`. |
| `category` | enum | Categoria editorial do primeiro diretório. |
| `extension` | string | Extensão normalizada. |
| `bytes` | inteiro | Tamanho informado pela árvore Git. |
| `lines` | inteiro | Número de linhas quando o blob é texto; zero para binário. |
| `blob` | SHA string | Identidade Git do conteúdo original. |
| `route` | string | Rota determinística, sem colisão dentro da edição. |
| `href` | URL relativa | Visualização do arquivo no idioma da edição. |
| `sourceHref` | URL | Arquivo no GitHub no commit imutável. |
| `downloadHref` | URL relativa | Download do blob original. |
| `mediaHref` | URL relativa opcional | Mídia segura para imagens permitidas. |
| `text` | string opcional | Conteúdo UTF-8 de documentos e fontes legíveis. |
| `html` | string opcional | Linhas escapadas para visualização de código; nunca é fonte confiável. |
| `headings` | `Heading[]` | Títulos e slugs de documentos. |
| `anchors` | string[] | Âncoras resolvidas e aliases. |

## Heading

| Campo | Tipo | Regras |
|---|---|---|
| `depth` | inteiro | Nível do heading Markdown. |
| `slug` | string | Identificador único na página. |
| `text` | string | Texto visível do heading. |

## PublicationReport

Artefato de auditoria, não parte do catálogo público.

| Campo | Tipo | Regras |
|---|---|---|
| `sources` | resumo por edição | Commit, branch, idioma, quantidade de arquivos e documentos. |
| `references` | inteiro | Links de repositório processados. |
| `missingFragments` | string[] | Deve estar vazio para publicação. |
| `unresolved` | lista | Deve estar vazia para publicação. |
| `placeholders` | lista | Registrada para revisão editorial. |
| `coverage` | resumo | Cobertura final de arquivos e Markdown. |
| `issues` | lista | Deve estar vazia após `audit-built-site.mjs`. |

## Preferências locais

Estado opcional do navegador, fora do conteúdo versionado:

- tema claro/escuro;
- progresso de leitura por entrada;
- preferência `prefers-reduced-motion`.

Esses valores não são enviados ao repositório, não alteram o catálogo e não podem ocultar conteúdo obrigatório.

## Relações e invariantes

- Um `Catalog` possui exatamente três `Edition`.
- Cada `Edition` tem uma entrada para todo path presente no conjunto união das três branches.
- O mesmo path lógico deve apontar para a rota correspondente nas três edições.
- Cada `Entry.downloadHref` deve recuperar bytes cujo hash Git é igual a `Entry.blob`.
- Cada documento publicado deve ter uma visualização, um download e links de troca para as três edições.
- O `PublicationReport` só é publicável quando links, fragments, cobertura, segurança de conteúdo e acesso ao Pages passam.
