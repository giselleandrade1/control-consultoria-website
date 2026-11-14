
## Control Consultoria Empresarial

A responsive institutional website developed for Control Consultoria Empresarial, focused on accessibility, performance, usability, and a consistent experience across different devices.

The project delivers a professional digital presence through a clean interface, intuitive navigation, and carefully implemented responsive layouts.

**Live Website:** [control-consultoria-website.vercel.app](https://control-consultoria-website.vercel.app)

---

## Overview

This project consists of a static corporate website built with HTML, CSS, and JavaScript, without external runtime dependencies.

The development focuses on creating an accessible, responsive, and lightweight experience while maintaining visual consistency, readable content, and reliable interactions.

## Features

### User Interface & Experience

- Responsive layouts adapted to different screen sizes.
- Light and dark themes with persistent user preferences.
- Mobile navigation with modal behavior, keyboard support, and focus management.
- Accessible FAQ accordion.
- Fluid typography and spacing using CSS variables and `clamp()`.
- Consistent content hierarchy and readable text layouts.
- Touch targets with a minimum size of 44px.

### Accessibility

- Semantic HTML landmarks and Brazilian Portuguese document language.
- Consistent heading hierarchy with a single H1.
- Skip navigation link and visible keyboard focus indicators.
- Keyboard navigation support.
- Reduced-motion support through `prefers-reduced-motion`.
- Form labels, associated validation messages, and ARIA states.
- Verified contrast for text, form borders, and focus indicators.
- Content remains accessible when JavaScript is unavailable.

### Performance & Optimization

- Responsive WebP images.
- Explicit image dimensions to help prevent layout shifts.
- Lazy loading for images outside the main content.
- Locally stored assets without external font, library, or resource requests.
- Optimized layout dimensions and fluid grid systems.

### Forms & Interactions

- Field-level form validation.
- WhatsApp integration for contact requests.
- Accessible accordion interactions.
- Keyboard-accessible mobile navigation.

---

## Technologies

| Technology | Application |
|---|---|
| HTML5 | Semantic structure and content |
| CSS3 | Responsive layouts, themes, typography, and visual styling |
| JavaScript | Interface interactions, navigation, and form validation |
| CSS Variables | Consistent design tokens and styling |
| WebP | Optimized image assets |

**Development approach:** Vanilla JavaScript, semantic HTML, and native CSS, without external runtime libraries.

---

## Project Structure

```text
control-consultoria-website/
│
├── assets/
│   ├── icons/
│   └── images/
│
├── css/
│   └── styles.css
│
├── js/
│   └── main.js
│
├── scripts/
│
├── index.html
├── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

Clone the repository:

```bash
git clone https://github.com/giselleandrade1/control-consultoria-website.git
```

Navigate to the project directory:

```bash
cd control-consultoria-website
```

Install the project dependencies:

```bash
npm install
```

### Run locally

Start the development server:

```bash
npm run dev
```

Access the application at:

```text
http://127.0.0.1:4173/
```

---

## Responsive Design & Testing

The responsive layout was validated in Chrome across the following viewport widths:

`320, 375, 390, 425, 480, 560, 561, 576, 768, 820, 821, 1024, 1100, 1101, 1280, 1366, 1440, 1600, 1920, 2560px`.

### Validation Results

- No horizontal overflow across the tested viewport widths.
- Compact H1 typography and H2 headings maintained within three lines.
- Local images and resources loaded without errors.
- Light and dark themes maintained consistent contrast and proportions.
- Zero cumulative layout shift (CLS = 0) in the local validation test.

---

## Project Goals

The main objectives behind this project were to:

- Develop a professional and accessible corporate website.
- Apply responsive design principles across multiple screen sizes.
- Improve usability through intuitive navigation and interactions.
- Prioritize performance and efficient asset loading.
- Implement semantic HTML and accessibility best practices.
- Maintain clean, organized, and maintainable source code.

---

## Contact

For inquiries and business information:

- **WhatsApp:** (11) 96137-1183
- **Email:** control01@outlook.com.br
- **Instagram:** [@controlconsultoria1](https://www.instagram.com/controlconsultoria1)
- **LinkedIn:** [Control Consultoria](https://www.linkedin.com/company/control-c-gerenciamento-empresarial-ltda/)

---

## Author

**Giselle Andrade**

Full Stack Developer in Progress | Backend Focus | Java & JavaScript

GitHub: [@giselleandrade1](https://github.com/giselleandrade1)

Developed with attention to detail, accessibility, performance, and user experience.
