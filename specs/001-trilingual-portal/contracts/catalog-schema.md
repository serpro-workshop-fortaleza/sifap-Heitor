# Contrato do catálogo publicado

## Arquivo

`site/.generated/catalog.json` é o contrato interno entre a preparação de conteúdo e as páginas Astro. O arquivo é gerado durante o build e não deve ser editado manualmente.

## Forma JSON

```json
{
  "schemaVersion": 1,
  "repository": "owner/name",
  "audience": "team",
  "siteUrl": "https://owner.github.io/repository/",
  "basePath": "/repository/",
  "generatedAt": "2026-09-10T00:00:00.000Z",
  "editions": [
    {
      "code": "en",
      "label": "English",
      "branch": "main",
      "commit": "<real git sha>",
      "entries": [
        {
          "id": "<stable id>",
          "path": "README.md",
          "title": "README.md",
          "description": "",
          "kind": "document",
          "category": "start",
          "extension": "md",
          "bytes": 123,
          "lines": 10,
          "blob": "<git blob sha>",
          "route": "docs/README",
          "href": "/repository/en/docs/README/",
          "sourceHref": "https://github.com/owner/name/blob/<commit>/README.md",
          "downloadHref": "/repository/content-raw/<blob>.bin",
          "text": "# README",
          "headings": [],
          "anchors": []
        }
      ]
    }
  ]
}
```

## Regras de compatibilidade

- `schemaVersion` deve ser incrementado quando campos forem removidos ou mudarem de significado.
- `code` deve permanecer em `en`, `es` e `pt-br`; a troca de idioma depende desse conjunto estável.
- `path`, `route`, `href`, `sourceHref` e `downloadHref` devem continuar distinguíveis: origem, visualização e bytes não são o mesmo recurso.
- `commit` deve identificar a revisão exata da branch; valores de fixture não são válidos em produção.
- `kind` controla o renderizador: documentos passam pelo Markdown sanitizado; fontes são escapadas como texto; binários somente podem ser baixados; imagens precisam passar pelo filtro de mídia.
- O catálogo não deve conter credenciais, estado de runtime, chaves privadas ou conteúdo gerado rastreado.

## Contrato de links de idioma

Para cada `Entry.path`, cada edição deve fornecer uma entrada correspondente. A página renderizada deve expor links para as três entradas correspondentes, mantendo o path lógico e alterando somente a edição/locale.

## Contrato de publicação

A pipeline deve falhar antes do upload quando qualquer uma destas condições ocorrer:

- edição ausente, path ausente ou documento não traduzido;
- path ou link que escape do repositório;
- bytes do download diferentes do blob Git;
- rota ou fragmento local ausente;
- acesso ao Pages desconhecido, público para repositório privado ou sem workflow verificado;
- ausência do índice de busca ou auditoria com problemas.
