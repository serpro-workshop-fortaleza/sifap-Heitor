# Quickstart de validação

Este guia valida a publicação do portal a partir de um checkout com as três branches de idioma.

## Pré-requisitos

- Node.js `24.20.0` ou superior compatível com `site/package.json`.
- npm 11 e `site/package-lock.json` presente.
- Git com histórico completo e refs `origin/main`, `origin/espanol` e `origin/portugues-br`.
- Acesso somente leitura ao repositório e ao GitHub Pages configurado.
- Chromium instalado para os testes Playwright.

## Preparar dependências

```powershell
Set-Location site
npm ci
npx playwright install --with-deps chromium
```

## Verificar conteúdo sem publicar

```powershell
npm run content:status
npm test
```

Resultado esperado: o relatório de prontidão não possui bloqueadores e os testes de ingestão passam.

## Executar validação completa de produção

Defina `SITE_URL` com a URL HTTPS verificada do Pages e execute:

```powershell
$env:SITE_URL = "https://owner.github.io/repository/"
npm run build
```

O build executa, nesta ordem:

1. ingestão das três branches e geração do catálogo;
2. verificação de tipos e páginas Astro;
3. compilação estática;
4. indexação Pagefind;
5. auditoria de rotas, fragments, links de idioma e bytes originais.

Resultado esperado: `site/dist` é gerado e `site/.generated/site-audit.json` contém `issues: []`.

## Validar interação no navegador

Com `site/dist` disponível:

```powershell
npm run test:browser
```

Resultado esperado nos projetos `desktop` e `mobile`:

- `/en/`, `/es/` e `/pt-br/` carregam;
- a troca de idioma mantém o documento lógico;
- busca e filtros anunciam carregamento, resultados e vazio educadamente, e falhas imediatamente;
- navegação por teclado funciona;
- não há transbordamento horizontal nos viewports de `375px`, `768px` e `1440px`;
- tema e preferências de leitura não alteram o catálogo.

## Validar proteção de publicação

No CI, o workflow `.github/workflows/pages.yml` deve executar `site/scripts/pages-guard.mjs` antes do build e novamente antes do deploy. Para um repositório privado, o teste esperado é falha quando Pages for público ou quando a visibilidade for desconhecida.

Nunca publique um artefato quando o guard falhar, quando uma branch estiver ausente ou quando o relatório de auditoria tiver problemas.
