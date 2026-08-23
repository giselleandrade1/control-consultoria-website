# Control Consultoria Empresarial

Website institucional estático, responsivo e sem dependências externas, desenvolvido em HTML, CSS e JavaScript.

## Executar localmente

```bash
npm run dev
```

Depois, acesse `http://127.0.0.1:4173/`.

## Estrutura

```text
control-consultoria-website/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
└── assets/
    ├── icons/
    └── images/
```

## Recursos principais

- Tema claro e escuro com persistência da preferência.
- Menu móvel modal com foco contido, fechamento por `Escape` e navegação por teclado.
- Formulário validado por campo e integração com WhatsApp.
- FAQ em accordion acessível.
- Sistema tipográfico e de espaçamento baseado em variáveis CSS e `clamp()`.
- Grids fluidos, containers limitados e áreas de toque de pelo menos 44 px.
- Textos corridos com leitura natural, hifenização em português e largura de leitura limitada.
- Imagens WebP responsivas, dimensões explícitas e carregamento adiado fora do conteúdo principal.
- Sem fontes, bibliotecas ou recursos carregados de domínios externos.

## Responsividade validada

O layout foi verificado em Chrome nas larguras de 320, 375, 390, 425, 480, 560, 561, 576, 768, 820, 821, 1024, 1100, 1101, 1280, 1366, 1440, 1600, 1920 e 2560 px.

Nos testes finais:

- não houve overflow horizontal;
- o `h1` permaneceu compacto e os `h2` em até três linhas;
- imagens e recursos locais carregaram sem erros;
- os temas claro e escuro mantiveram contraste e proporção consistentes;
- o layout não apresentou deslocamento visual acumulado (`CLS = 0`) no ensaio local.

## Acessibilidade

- HTML em português do Brasil e landmarks semânticos.
- Hierarquia contínua de headings e um único `h1`.
- Skip link, `focus-visible` e suporte a `prefers-reduced-motion`.
- Labels, mensagens de erro associadas e estados ARIA no formulário.
- Links repetidos com nomes acessíveis contextuais.
- Contraste mínimo verificado para textos, bordas de campos e indicadores de foco.
- Conteúdo permanece visível caso o JavaScript não seja executado.

## Contato

- WhatsApp: (11) 96137-1183
- E-mail: control01@outlook.com.br
- Instagram: @controlconsultoria1
- LinkedIn: control-c-gerenciamento-empresarial-ltda

Desenvolvido por [@Giselleandrade1](https://github.com/giselleandrade1).
