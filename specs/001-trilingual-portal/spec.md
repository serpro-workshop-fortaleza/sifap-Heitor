# Portal de documentação trilíngue

Esta é uma nova superfície de distribuição do kit, não uma alteração no comportamento de negócio do SIFAP.

## Visão

Disponibilizar uma edição web confiável e acessível do kit de modernização, permitindo que pessoas falantes de inglês, espanhol e português do Brasil encontrem, consultem e baixem a mesma base versionada de documentação e código, com o idioma ativo preservado durante a navegação.

O portal deve transformar o repositório em uma fonte navegável sem substituir silenciosamente conteúdo traduzido ausente, sem executar código exibido e sem publicar conteúdo privado por engano. A publicação só é considerada bem-sucedida quando a cobertura das branches de idioma, a proveniência dos commits e os links internos forem validados de forma reproduzível.

**Público principal:** participantes da imersão, equipes de engenharia e pessoas responsáveis por revisar ou ensinar o processo de modernização.

**Fora do escopo:** alteração do sistema de negócio SIFAP, edição do conteúdo do repositório pelo portal, tradução automática silenciosa e publicação de um repositório privado sem confirmação explícita de proteção.

## Clarificações

### Sessão 2026-09-10

- Q: Como os anúncios de estado da busca devem ser apresentados a pessoas que usam leitor de tela? → A: Carregamento, resultados e vazio usam anúncio educado; erro usa anúncio imediato.

## Histórias de usuário

### US1 - Consultar o repositório completo em três idiomas (P1)

Como participante, quero abrir a edição em inglês, espanhol ou português e encontrar qualquer arquivo versionado para consultar ou baixar seu conteúdo original.

### US2 - Continuar a leitura no mesmo documento em outro idioma (P1)

Como leitora ou leitor, quero trocar de idioma sem perder o documento, seus links internos nem a referência ao commit de origem.

### US3 - Encontrar conteúdo no idioma ativo (P2)

Como participante, quero buscar e filtrar a documentação no idioma selecionado com feedback acessível sobre o resultado.

### US4 - Ler confortavelmente em qualquer dispositivo (P2)

Como pessoa usuária de desktop ou celular, quero controles acessíveis de idioma, tema, movimento e progresso sem que preferências locais mudem o conteúdo versionado.

### US5 - Publicar sem expor conteúdo privado (P1)

Como pessoa responsável pela publicação, quero que a esteira bloqueie automaticamente uma configuração insegura do GitHub Pages antes de expor o material do instrutor.

## Requisitos

### REQ-PORTAL-001: Cobertura completa do repositório

QUANDO uma compilação de produção resolver as branches de idioma, o portal DEVE inventariar cada arquivo versionado e fornecer um documento, visualização de código ou download original para cada arquivo.
source_legacy: "[GREENFIELD] O portal de distribuição do repositório não existe na aplicação Natural/Adabas."

- AC-PORTAL-001.1: Dado um checkout com as três edições, Quando a compilação de produção for executada, Então cada arquivo versionado terá uma visualização compatível ou um download original disponível.

### REQ-PORTAL-002: Três edições completas de idioma

O portal DEVE fornecer rotas em inglês, espanhol e português do Brasil baseadas em `main`, `espanol` e `portugues-br`, sem substituir silenciosamente documentação traduzida ausente por inglês.
source_legacy: "[GREENFIELD] A distribuição de documentação trilíngue é uma nova capacidade do kit."

- AC-PORTAL-002.1: Dadas as branches `main`, `espanol` e `portugues-br`, Quando o catálogo for publicado, Então ele conterá exatamente as edições `en`, `es` e `pt-br`.
- AC-PORTAL-002.2: Dado um path ausente em qualquer edição, Quando a compilação for executada, Então a publicação falhará sem apresentar o conteúdo em inglês como substituto.

### REQ-PORTAL-003: Navegação persistente entre idiomas

QUANDO uma pessoa alterar o idioma de um documento, o portal DEVE abrir o mesmo caminho lógico de origem na edição selecionada.
source_legacy: "[GREENFIELD] A navegação de idiomas do site não tem equivalente legado."

- AC-PORTAL-003.1: Dado um documento aberto em uma edição, Quando a pessoa selecionar outra edição, Então o portal abrirá o mesmo path lógico nessa edição.

### REQ-PORTAL-004: Links corretos e proveniência da fonte

QUANDO o portal renderizar um link do repositório, ele DEVE resolver o documento ou recurso correspondente no site e manter um link explícito para a fonte Git original e seu commit.
source_legacy: "[GREENFIELD] O roteamento web e a proveniência da fonte pertencem ao novo portal."

- AC-PORTAL-004.1: Dado um link relativo válido em um documento, Quando ele for selecionado, Então o recurso correspondente será aberto no portal.
- AC-PORTAL-004.2: Dado um arquivo exibido, Quando a pessoa consultar sua origem, Então encontrará um link para o arquivo no commit de origem exato.

### REQ-PORTAL-005: Descoberta interativa

QUANDO uma pessoa buscar ou filtrar o catálogo, o portal DEVE mostrar o conteúdo correspondente no idioma ativo e anunciar de forma acessível os estados de carregamento, vazio e erro.
source_legacy: "[GREENFIELD] A busca de documentação no navegador é uma nova capacidade."

- AC-PORTAL-005.1: Dado um termo ou filtro válido, Quando a busca for concluída, Então a lista exibirá somente entradas da edição ativa que correspondam ao critério.
- AC-PORTAL-005.2: Dada uma busca ou filtro iniciado, Quando os resultados ainda estiverem sendo preparados, Então o portal anunciará educadamente que a busca está em carregamento por uma região viva acessível.
- AC-PORTAL-005.3: Dado um termo ou filtro sem correspondências, Quando a busca for concluída, Então o portal manterá os controles disponíveis e anunciará educadamente que não há resultados.
- AC-PORTAL-005.4: Dada uma falha na indexação ou na consulta de busca, Quando ela ocorrer, Então o portal manterá o catálogo previamente exibido, apresentará imediatamente uma mensagem de erro acessível e permitirá alterar ou limpar o critério.

### REQ-PORTAL-006: Interface responsiva e acessível

ENQUANTO a janela tiver largura de 375px, 768px ou 1440px, o portal DEVE manter a navegação de idiomas visível e os controles acessíveis pelo teclado sem transbordamento horizontal da página.
source_legacy: "[GREENFIELD] A navegação web responsiva é independente do comportamento da aplicação legada."

- AC-PORTAL-006.1: Dado cada viewport obrigatório de 375px, 768px e 1440px, Quando a home, a biblioteca e uma rota de documento forem abertas, Então a página não apresentará rolagem horizontal.
- AC-PORTAL-006.2: Dado cada viewport obrigatório, Quando a pessoa navegar apenas pelo teclado, Então o seletor de idioma e os controles de leitura estarão visíveis e poderão receber foco e ser acionados.

### REQ-PORTAL-007: Movimento e preferências

QUANDO uma pessoa selecionar um tema, marcar progresso de leitura ou solicitar movimento reduzido, o portal DEVE aplicar a preferência sem ocultar conteúdo obrigatório nem alterar dados do repositório.
source_legacy: "[GREENFIELD] Preferências locais de leitura e controles de animação são novos comportamentos do portal."

- AC-PORTAL-007.1: Dada uma preferência de tema, progresso ou movimento reduzido, Quando a pessoa a alterar, Então a preferência será aplicada sem modificar o catálogo nem ocultar conteúdo obrigatório.

### REQ-PORTAL-008: Preservar fontes técnicas

O portal DEVE preservar os bytes originais dos arquivos para download, renderizar código como texto não executável e evitar atravessar links simbólicos Git para fora do repositório.
source_legacy: "[GREENFIELD] A distribuição segura de arquivos-fonte é uma nova preocupação de publicação do repositório."

- AC-PORTAL-008.1: Dado um arquivo disponível para download, Quando o download for comparado ao blob de origem, Então os bytes serão idênticos.
- AC-PORTAL-008.2: Dado um arquivo-fonte exibido, Quando seu conteúdo for renderizado, Então ele será apresentado como texto e não executará código.
- AC-PORTAL-008.3: Dado um link simbólico que aponte para fora do repositório, Quando a compilação o encontrar, Então a publicação falhará.

### REQ-PORTAL-009: Proteger o conteúdo privado do instrutor

SE o repositório de origem for privado e a visibilidade do Pages for pública ou desconhecida, ENTÃO a implantação DEVE parar antes de publicar seu conteúdo.
source_legacy: "[GREENFIELD] O controle de acesso do Pages privado protege material do instrutor fora do sistema legado."

- AC-PORTAL-009.1: Dado um repositório privado com Pages público ou de visibilidade desconhecida, Quando a implantação for iniciada, Então ela falhará antes do envio do artefato.

### REQ-PORTAL-010: Validação reproduzível da publicação

QUANDO uma versão for compilada, o portal DEVE registrar IDs dos commits de origem, cobertura de idiomas e resultados de validação de links internos e DEVE falhar se alguma verificação obrigatória falhar.
source_legacy: "[GREENFIELD] A validação reproduzível de publicação da documentação é um novo requisito do kit."

- AC-PORTAL-010.1: Dada uma compilação com todas as verificações aprovadas, Quando ela for concluída, Então seu relatório registrará os commits de origem, a cobertura de idiomas e os resultados de links internos.
- AC-PORTAL-010.2: Dada uma compilação com uma verificação obrigatória reprovada, Quando ela for concluída, Então nenhum artefato será publicado.
