---
name: Умный конспект
description: Цифровой сервис для совместной работы с учебными материалами. Образовательная платформа с фокусом на ясность, продуктивность и академическую эстетику.

colors:
  primary: "#4F46E5"
  primary-light: "#6366F1"
  primary-dark: "#3730A3"
  secondary: "#7C3AED"
  secondary-light: "#8B5CF6"
  accent: "#F59E0B"
  success: "#10B981"
  warning: "#F59E0B"
  error: "#EF4444"
  info: "#3B82F6"
  
  neutral-50: "#FAFAFA"
  neutral-100: "#F5F5F5"
  neutral-200: "#E5E5E5"
  neutral-300: "#D4D4D4"
  neutral-400: "#A3A3A3"
  neutral-500: "#737373"
  neutral-600: "#525252"
  neutral-700: "#404040"
  neutral-800: "#262626"
  neutral-900: "#171717"
  
  surface-light: "#FFFFFF"
  surface-dark: "#1F2937"
  background-light: "#F9FAFB"
  background-dark: "#111827"

typography:
  font-primary:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: 1rem
    lineHeight: 1.5
    fontWeight: 400
  
  font-mono:
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace"
    fontSize: 0.875rem
    lineHeight: 1.6
  
  h1:
    fontFamily: "Inter, sans-serif"
    fontSize: 2rem
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  
  h2:
    fontFamily: "Inter, sans-serif"
    fontSize: 1.5rem
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  
  h3:
    fontFamily: "Inter, sans-serif"
    fontSize: 1.25rem
    fontWeight: 600
    lineHeight: 1.4
  
  body-lg:
    fontFamily: "Inter, sans-serif"
    fontSize: 1.125rem
    lineHeight: 1.6
  
  body-md:
    fontFamily: "Inter, sans-serif"
    fontSize: 1rem
    lineHeight: 1.5
  
  body-sm:
    fontFamily: "Inter, sans-serif"
    fontSize: 0.875rem
    lineHeight: 1.5
  
  caption:
    fontFamily: "Inter, sans-serif"
    fontSize: 0.75rem
    lineHeight: 1.4
    letterSpacing: "0.01em"

rounded:
  none: 0px
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  2xl: 20px
  full: 9999px

spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px

elevation:
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)"
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)"
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)"
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
    padding: "12px 24px"
    typography: "{typography.body-md}"
  
  button-primary-hover:
    backgroundColor: "{colors.primary-dark}"
  
  button-secondary:
    backgroundColor: "{colors.neutral-100}"
    textColor: "{colors.neutral-700}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  
  card:
    backgroundColor: "{colors.surface-light}"
    rounded: "{rounded.xl}"
    padding: "{spacing.lg}"
    elevation: "{elevation.sm}"
  
  input:
    backgroundColor: "{colors.surface-light}"
    textColor: "{colors.neutral-900}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
    typography: "{typography.body-md}"
  
  sidebar:
    backgroundColor: "{colors.surface-light}"
    width: "288px"
    padding: "{spacing.lg}"
---

## Overview

«Умный конспект» — образовательная платформа, сочетающая академическую строгость с современным минимализмом. Дизайн вдохновлён премиальными нотбуками и инструментами для продуктивности: чистые линии, продуманная типографика, щедрые отступы и интуитивная навигация.

Визуальный язык передаёт ощущение структурированности и ясности — ключевых качеств для учебного процесса. Интерфейс не отвлекает от содержания, а помогает сосредоточиться на главном.

## Colors

Палитра построена на контрасте между глубоким индиго (основной цвет) и тёплыми нейтральными оттенками. Индиго ассоциируется с академической средой, интеллектом и доверием.

- **Primary (#4F46E5):** Основной индиго — для ключевых действий, ссылок и акцентов.
- **Secondary (#7C3AED):** Фиолетовый — для ИИ-функций и творческих элементов.
- **Accent (#F59E0B):** Янтарный — для уведомлений, достижений и серии дней (streak).
- **Success (#10B981):** Изумрудный — для положительных результатов и подтверждений.
- **Neutral (#F9FAFB → #171717):** Шкала серых — для фона, текста и границ.

Тёмная тема использует те же цветовые токены с инвертированной яркостью для комфортной работы в вечернее время.

## Typography

Интерфейс использует Inter — современный гротеск с отличной читаемостью на экранах. Моноширинный шрифт JetBrains Mono применяется для кода и формул.

- **Заголовки:** Inter Bold с отрицательным letter-spacing для компактности.
- **Основной текст:** Inter Regular с line-height 1.5 для комфортного чтения.
- **Код:** JetBrains Mono с увеличенным line-height 1.6 для разборчивости.
- **Подписи:** Inter с увеличенным letter-spacing для метаданных.

## Layout & Spacing

Система отступов основана на 4-пиксельной сетке. Компоненты используют щедрые внутренние отступы (16-24px) для создания «воздуха» и визуальной иерархии.

- **xs (4px):** Микро-отступы внутри элементов.
- **sm (8px):** Отступы между связанными элементами.
- **md (16px):** Стандартные отступы в компонентах.
- **lg (24px):** Отступы между секциями.
- **xl (32px):** Отступы между крупными блоками.

Сайдбар фиксированной ширины 288px обеспечивает стабильную навигацию на десктопе и скрывается на мобильных устройствах.

## Elevation & Depth

Тени создают ощущение глубины и иерархии. Компоненты с более высокой тенью визуально «приподняты» над поверхностью.

- **sm:** Карточки и панели — лёгкая тень для отделения от фона.
- **md:** Выпадающие меню и модалки — средняя тень для фокуса внимания.
- **lg:** Диалоговые окна — выраженная тень для критически важных элементов.
- **xl:** Всплывающие подсказки — максимальная тень для временных элементов.

## Shapes

Скругления создают дружелюбный и современный вид. Используются умеренные радиусы (6-16px) для баланса между строгостью и доступностью.

- **sm (6px):** Кнопки, инпуты, бейджи.
- **md (8px):** Теги, чипы, аватары.
- **lg (12px):** Карточки, панели.
- **xl (16px):** Модальные окна, крупные контейнеры.
- **full (9999px):** Аватары, бейджи, индикаторы.

## Components

### Buttons
Основные кнопки используют primary color с белым текстом. При наведении фон становится темнее (primary-dark). Вторичные кнопки — нейтральный серый фон с тёмным текстом.

### Cards
Карточки имеют белый фон, скругление xl, padding lg и лёгкую тень sm. При наведении тень усиливается для интерактивности.

### Inputs
Поля ввода имеют белый фон, скругление md, padding 10px 16px и фокусное кольцо primary color с прозрачностью.

### Sidebar
Боковая панель фиксированной ширины 288px с белым фоном и правой границей. На мобильных устройствах скрывается за гамбургер-меню.

## Do's and Don'ts

### ✅ Do
- Используйте primary color для ключевых действий (CTA).
- Применяйте secondary color для ИИ-функций и творческих элементов.
- Соблюдайте контрастность текста (минимум 4.5:1 для WCAG AA).
- Используйте щедрые отступы для создания «воздуха».
- Применяйте тени для создания иерархии.
- Используйте Inter для основного текста и JetBrains Mono для кода.

### ❌ Don't
- Не используйте более 2 основных цветов в одном экране.
- Не размещайте текст на цветном фоне без проверки контрастности.
- Не используйте декоративные шрифты для основного текста.
- Не перегружайте интерфейс тенями — достаточно 1-2 уровней.
- Не используйте чистый чёрный (#000) — применяйте neutral-900 (#171717).
- Не размещайте интерактивные элементы слишком близко друг к другу (минимум 8px).
