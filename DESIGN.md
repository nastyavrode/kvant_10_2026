---
name: Умный конспект
version: 2.0
description: >
  Цифровой сервис для совместной работы с учебными материалами.
  Образовательная платформа в академическом стиле — изумрудный и золотой,
  с типографикой Playfair Display для заголовков и Inter для текста.

colors:
  primary: "#064E3B"
  primary-light: "#065F46"
  primary-medium: "#047857"
  primary-bright: "#059669"
  on-primary: "#FFFFFF"

  secondary: "#D97706"
  secondary-light: "#F59E0B"
  secondary-warm: "#FBBF24"
  on-secondary: "#FFFFFF"

  success: "#059669"
  warning: "#D97706"
  error: "#DC2626"
  info: "#0891B2"

  surface: "#FFFFFF"
  surface-dark: "#292524"
  background: "#FEFDF8"
  background-dark: "#1C1917"
  ivory: "#FFFBEB"
  light-bg: "#F0FDF4"

  text: "#1C1917"
  text-secondary: "#57534E"
  text-muted: "#A8A29E"
  on-text: "#FAFAF9"

  border: "#E7E5E4"
  border-light: "#F5F5F4"
  border-dark: "#44403C"

typography:
  font-display:
    fontFamily: "'Playfair Display', Georgia, serif"

  font-body:
    fontFamily: "Inter, -apple-system, sans-serif"

  font-mono:
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace"

  h1:
    fontFamily: "{typography.font-display.fontFamily}"
    fontSize: 2.5rem
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"

  h2:
    fontFamily: "{typography.font-display.fontFamily}"
    fontSize: 2rem
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"

  h3:
    fontFamily: "{typography.font-display.fontFamily}"
    fontSize: 1.5rem
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.01em"

  body-lg:
    fontFamily: "{typography.font-body.fontFamily}"
    fontSize: 1.125rem
    lineHeight: 1.6

  body-md:
    fontFamily: "{typography.font-body.fontFamily}"
    fontSize: 1rem
    lineHeight: 1.6

  body-sm:
    fontFamily: "{typography.font-body.fontFamily}"
    fontSize: 0.875rem
    lineHeight: 1.5

  caption:
    fontFamily: "{typography.font-body.fontFamily}"
    fontSize: 0.75rem
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.15em"

  code:
    fontFamily: "{typography.font-mono.fontFamily}"
    fontSize: 0.875rem
    lineHeight: 1.6

spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  4xl: 96px

rounded:
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  2xl: 32px
  full: 9999px

elevation:
  sm: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)"
  md: "0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05)"
  lg: "0 10px 25px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.04)"
  xl: "0 20px 40px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.04)"
  card: "0 2px 8px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)"
  card-hover: "0 4px 12px rgba(0,0,0,0.06), 0 12px 32px rgba(0,0,0,0.08)"

components:
  btn-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.full}"
    padding: "14px 32px"
    typography: "{typography.body-md}"

  btn-primary-hover:
    backgroundColor: "{colors.primary-light}"

  btn-accent:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.on-secondary}"
    rounded: "{rounded.full}"
    padding: "14px 32px"

  btn-outline:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    rounded: "{rounded.full}"
    padding: "12px 28px"

  uni-card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.xl}"
    padding: "{spacing.lg}"
    elevation: "{elevation.card}"

  program-card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.xl}"
    padding: "{spacing.lg}"
    elevation: "{elevation.card}"

  uni-input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "12px 18px"
    typography: "{typography.body-md}"

  uni-badge:
    rounded: "{rounded.full}"
    padding: "4px 12px"
    typography: "{typography.caption}"

  uni-sidebar:
    backgroundColor: "{colors.primary}"
    width: 280px
    padding: "{spacing.lg}"

  hero-section:
    backgroundColor: "{colors.primary}"
    rounded: "{rounded.2xl}"
    padding: "{spacing.3xl}"
---

## Overview

«Умный конспект» — образовательная платформа в академическом стиле. Визуальный язык вдохновлён премиальными университетскими сайтами: глубокий изумрудный, тёплое золото, кремовый фон и элегантная типографика с serif-заголовками.

Дизайн передаёт ощущение академической строгости, доверия и интеллектуальной среды. Интерфейс не отвлекает от содержания, а помогает сосредоточиться на учёбе.

## Colors

Палитра построена на контрасте между глубоким изумрудным (основной цвет) и тёплым золотом (акцент). Изумрудный ассоциируется с академической средой, ростом и стабильностью. Золото — с достижениями, наградами и мотивацией.

### Primary — Изумрудный

- **primary (#064E3B):** Основной цвет — сайдбар, заголовки, ключевые элементы
- **primary-light (#065F46):** Hover-состояния кнопок
- **primary-medium (#047857):** Градиенты
- **primary-bright (#059669):** Акценты, ссылки, иконки

### Secondary — Золотой

- **secondary (#D97706):** Акцентный цвет — CTA, streak, награды
- **secondary-light (#F59E0B):** Hover-состояния
- **secondary-warm (#FBBF24):** Декоративные элементы, бейджи

### Semantic

- **success (#059669):** Успешные действия, высокие баллы
- **warning (#D97706):** Предупреждения, средние баллы
- **error (#DC2626):** Ошибки, низкие баллы
- **info (#0891B2):** Информация, статистика

### Neutral

- **surface (#FFFFFF):** Фон карточек
- **background (#FEFDF8):** Основной кремовый фон страницы
- **ivory (#FFFBEB):** Тёплый фон для акцентных блоков
- **text (#1C1917):** Основной текст
- **text-secondary (#57534E):** Вторичный текст
- **text-muted (#A8A29E):** Подписи, метаданные

## Typography

Интерфейс использует два основных шрифта: **Playfair Display** для заголовков (элегантный serif, ассоциирующийся с академической средой) и **Inter** для основного текста (чистый sans-serif для отличной читаемости).

### Заголовки (Playfair Display)

- **H1:** 2.5rem / Bold / line-height 1.2 / letter-spacing -0.02em
- **H2:** 2rem / Bold / line-height 1.2 / letter-spacing -0.02em
- **H3:** 1.5rem / Bold / line-height 1.3 / letter-spacing -0.01em

### Основной текст (Inter)

- **body-lg:** 1.125rem / Regular / line-height 1.6
- **body-md:** 1rem / Regular / line-height 1.6
- **body-sm:** 0.875rem / Regular / line-height 1.5
- **caption:** 0.75rem / Semibold / uppercase / letter-spacing 0.15em

### Код (JetBrains Mono)

- **code:** 0.875rem / Regular / line-height 1.6

## Layout & Spacing

Система отступов основана на 4-пиксельной сетке. Компоненты используют щедрые отступы для создания «воздуха» и академической элегантности.

- **xs (4px):** Микро-отступы
- **sm (8px):** Между связанными элементами
- **md (16px):** Стандартные внутренние отступы
- **lg (24px):** Карточки, секции
- **xl (32px):** Между блоками
- **2xl (48px):** Между крупными секциями
- **3xl (64px):** Hero-секции
- **4xl (96px):** Максимальные отступы

Сайдбар фиксированной ширины **280px** с тёмно-изумрудным фоном.

## Elevation & Depth

Тени мягкие и тёплые, создают ощущение глубины без агрессии.

- **sm:** Лёгкая тень для мелких элементов
- **md:** Стандартная тень для выпадающих меню
- **lg:** Для модальных окон
- **xl:** Максимальная тень для критически важных элементов
- **card:** Специальная тень для карточек — мягкая и тёплая
- **card-hover:** Усиленная тень при наведении на карточку

## Shapes

Скругления умеренные и дружелюбные. Кнопки и бейджи имеют полную скруглённость (pill-форма), карточки — крупные скругления.

- **sm (8px):** Мелкие элементы, инпуты
- **md (12px):** Теги, чипы
- **lg (16px):** Карточки
- **xl (24px):** Крупные карточки, панели
- **2xl (32px):** Hero-секции, модальные окна
- **full (9999px):** Кнопки, бейджи, аватары

## Components

### Buttons

- **btn-primary:** Изумрудный фон, белый текст, pill-форма, padding 14px 32px
- **btn-accent:** Золотой фон, белый текст, pill-форма
- **btn-outline:** Прозрачный фон, изумрудная рамка и текст

### Cards

- **uni-card:** Белый фон, скругление xl, padding lg, тень card
- **program-card:** Аналогично uni-card, используется для тем курса и конспектов

### Inputs

- **uni-input:** Белый фон, рамка border, скругление md, padding 12px 18px

### Badges

- **uni-badge:** Pill-форма, padding 4px 12px, typography caption (uppercase, letter-spacing 0.15em)

### Sidebar

- **uni-sidebar:** Изумрудный фон (primary), ширина 280px, золотые акценты для активного пункта меню

### Hero Section

- **hero-section:** Градиент изумрудный → изумрудный светлый, скругление 2xl, padding 3xl, декоративные круги

## Do's and Don'ts

### ✅ Do

- Используйте **Playfair Display** для всех заголовков (H1-H3)
- Применяйте **primary (#064E3B)** для сайдбара и ключевых заголовков
- Используйте **secondary (#D97706)** для наград, streak и CTA
- Соблюдайте контрастность текста (минимум 4.5:1 для WCAG AA)
- Используйте **pill-форму** (rounded-full) для кнопок и бейджей
- Применяйте **creamy background (#FEFDF8)** для фона страницы
- Добавляйте **section-label** (uppercase, letter-spacing, золотой) перед заголовками секций
- Используйте **uni-card** с мягкими тенями для карточек

### ❌ Don't

- Не используйте чистый чёрный (#000) — применяйте text (#1C1917)
- Не используйте Inter для заголовков — только Playfair Display
- Не размещайте текст на изумрудном фоне без проверки контрастности
- Не используйте квадратные кнопки — только pill-форма
- Не перегружайте интерфейс тенями — достаточно 1-2 уровней
- Не используйте холодные серые — только тёплые нейтральные оттенки
- Не размещайте более 2 акцентных цветов на одном экране
- Не используйте тонкие шрифты (300) для основного текста
