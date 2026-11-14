# Control Consultoria — código do site

Todo o código do site, organizado em pastas.

## Pastas

| Pasta | O que tem |
| --- | --- |
| `src/routes/` | As páginas. `index.tsx` é a página inicial; `__root.tsx` é a moldura comum (fontes, ícone, tema claro/escuro). |
| `src/components/site/` | Cada parte da página inicial: topo (`Header`), abertura (`Hero`), Sobre, Serviços, Como trabalhamos (`Method`), Números e Liderança (`Numbers`), Dúvidas (`Faq`), Contato e rodapé (`Contact`), botão claro/escuro (`ThemeToggle`). |
| `src/components/site/data.ts` | Textos e dados do site num só lugar: contatos, CNPJ, redes sociais, menu, serviços, etapas do método, dúvidas frequentes. |
| `src/components/ui/` | Peças de interface prontas (botões, acordeão, campos etc.). |
| `src/lib/` | Regras do site: validação do formulário de contato, mensagem do WhatsApp, diagnóstico rápido, busca sem acento. |
| `src/test/` | Testes automáticos dessas regras. |
| `src/assets/` | Referências das fotos e do logo usados no site. |
| `src/styles.css` | Cores, fontes e estilos (tema escuro e tema claro). |
| `public/` | Ícone da aba do navegador e `robots.txt`. |
| `imagens/` | Cópia das fotos e do logo em arquivo, para você guardar ou reutilizar. |

Arquivos soltos na raiz (`package.json`, `vite.config.ts`, `tsconfig.json` etc.) são as configurações do projeto.

## Rodar no computador

Precisa do Node.js instalado.

```sh
npm install
npm run dev
```

Observação: as fotos são carregadas pela hospedagem do Lovable. Fora do Lovable, use os arquivos da pasta `imagens/`.

## Fotos

As fotos de fundo e dos serviços são do Unsplash (licença gratuita, uso comercial permitido). O logo e a foto da Viviane Andrade são da empresa.
