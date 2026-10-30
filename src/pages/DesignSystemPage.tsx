import React from 'react';
import { Palette, Type, Layout, Layers, Box, CheckCircle, XCircle } from 'lucide-react';

export default function DesignSystemPage() {
  const colors = {
    primary: { value: '#4F46E5', name: 'Primary', desc: 'Основные действия, ссылки' },
    primaryLight: { value: '#6366F1', name: 'Primary Light', desc: 'Hover-состояния' },
    primaryDark: { value: '#3730A3', name: 'Primary Dark', desc: 'Active-состояния' },
    secondary: { value: '#7C3AED', name: 'Secondary', desc: 'ИИ-функции' },
    accent: { value: '#F59E0B', name: 'Accent', desc: 'Уведомления, streak' },
    success: { value: '#10B981', name: 'Success', desc: 'Успешные действия' },
    error: { value: '#EF4444', name: 'Error', desc: 'Ошибки' },
    info: { value: '#3B82F6', name: 'Info', desc: 'Информация' },
  };

  const neutrals = [
    { value: '#FAFAFA', name: '50' },
    { value: '#F5F5F5', name: '100' },
    { value: '#E5E5E5', name: '200' },
    { value: '#D4D4D4', name: '300' },
    { value: '#A3A3A3', name: '400' },
    { value: '#737373', name: '500' },
    { value: '#525252', name: '600' },
    { value: '#404040', name: '700' },
    { value: '#262626', name: '800' },
    { value: '#171717', name: '900' },
  ];

  const spacing = [
    { name: 'xs', value: '4px' },
    { name: 'sm', value: '8px' },
    { name: 'md', value: '16px' },
    { name: 'lg', value: '24px' },
    { name: 'xl', value: '32px' },
    { name: '2xl', value: '48px' },
    { name: '3xl', value: '64px' },
  ];

  const rounded = [
    { name: 'sm', value: '6px' },
    { name: 'md', value: '8px' },
    { name: 'lg', value: '12px' },
    { name: 'xl', value: '16px' },
    { name: '2xl', value: '20px' },
    { name: 'full', value: '9999px' },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>Дизайн-система</h2>
        <p style={{ color: 'var(--color-text-secondary)' }} className="mt-1">
          Визуальная идентичность «Умный конспект» на основе DESIGN.md
        </p>
      </div>

      {/* Colors */}
      <section>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
          <Palette className="w-5 h-5" style={{ color: 'var(--color-primary)' }} /> Цветовая палитра
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.values(colors).map(color => (
            <div key={color.name} className="rounded-xl overflow-hidden" style={{ boxShadow: 'var(--shadow-sm)' }}>
              <div className="h-20" style={{ backgroundColor: color.value }} />
              <div className="p-3" style={{ backgroundColor: 'var(--color-surface)' }}>
                <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{color.name}</p>
                <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{color.value}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>{color.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <h4 className="text-sm font-medium mt-6 mb-3" style={{ color: 'var(--color-text-secondary)' }}>Нейтральные оттенки</h4>
        <div className="flex rounded-xl overflow-hidden" style={{ boxShadow: 'var(--shadow-sm)' }}>
          {neutrals.map(n => (
            <div key={n.name} className="flex-1 h-16 relative group" style={{ backgroundColor: n.value }}>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <span className="text-xs text-white font-mono">{n.name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Typography */}
      <section>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
          <Type className="w-5 h-5" style={{ color: 'var(--color-primary)' }} /> Типографика
        </h3>
        <div className="rounded-xl p-6 space-y-4" style={{ backgroundColor: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)' }}>
          <div>
            <p className="text-xs font-mono mb-1" style={{ color: 'var(--color-text-secondary)' }}>H1 — 2rem / Bold / -0.02em</p>
            <h1 style={{ color: 'var(--color-text)' }}>Заголовок первого уровня</h1>
          </div>
          <div>
            <p className="text-xs font-mono mb-1" style={{ color: 'var(--color-text-secondary)' }}>H2 — 1.5rem / Bold / -0.01em</p>
            <h2 style={{ color: 'var(--color-text)' }}>Заголовок второго уровня</h2>
          </div>
          <div>
            <p className="text-xs font-mono mb-1" style={{ color: 'var(--color-text-secondary)' }}>H3 — 1.25rem / Semibold</p>
            <h3 style={{ color: 'var(--color-text)' }}>Заголовок третьего уровня</h3>
          </div>
          <div>
            <p className="text-xs font-mono mb-1" style={{ color: 'var(--color-text-secondary)' }}>Body — 1rem / Regular / line-height 1.5</p>
            <p style={{ color: 'var(--color-text)' }}>Основной текст для чтения. Inter — современный гротеск с отличной читаемостью на экранах.</p>
          </div>
          <div>
            <p className="text-xs font-mono mb-1" style={{ color: 'var(--color-text-secondary)' }}>Caption — 0.75rem / Regular / +0.01em</p>
            <p className="text-xs" style={{ color: 'var(--color-text-secondary)', letterSpacing: '0.01em' }}>МЕТАДАННЫЕ И ПОДПИСИ</p>
          </div>
          <div>
            <p className="text-xs font-mono mb-1" style={{ color: 'var(--color-text-secondary)' }}>Mono — JetBrains Mono / 0.875rem</p>
            <code className="text-sm px-2 py-1 rounded" style={{ backgroundColor: 'var(--color-neutral-100)', fontFamily: 'var(--font-mono)', color: '#db2777' }}>const x = 42;</code>
          </div>
        </div>
      </section>

      {/* Spacing */}
      <section>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
          <Layout className="w-5 h-5" style={{ color: 'var(--color-primary)' }} /> Отступы
        </h3>
        <div className="space-y-2">
          {spacing.map(s => (
            <div key={s.name} className="flex items-center gap-4">
              <span className="text-sm font-mono w-12" style={{ color: 'var(--color-text-secondary)' }}>{s.name}</span>
              <div className="h-6 rounded" style={{ width: s.value, backgroundColor: 'var(--color-primary)', opacity: 0.7 }} />
              <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{s.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Rounded */}
      <section>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
          <Box className="w-5 h-5" style={{ color: 'var(--color-primary)' }} /> Скругления
        </h3>
        <div className="flex flex-wrap gap-4">
          {rounded.map(r => (
            <div key={r.name} className="text-center">
              <div className="w-16 h-16 mb-2" style={{ backgroundColor: 'var(--color-primary)', borderRadius: r.value }} />
              <p className="text-xs font-medium" style={{ color: 'var(--color-text)' }}>{r.name}</p>
              <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{r.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Elevation */}
      <section>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
          <Layers className="w-5 h-5" style={{ color: 'var(--color-primary)' }} /> Уровни глубины
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { name: 'sm', shadow: 'var(--shadow-sm)' },
            { name: 'md', shadow: 'var(--shadow-md)' },
            { name: 'lg', shadow: 'var(--shadow-lg)' },
            { name: 'xl', shadow: 'var(--shadow-xl)' },
          ].map(e => (
            <div key={e.name} className="p-6 rounded-xl text-center" style={{ backgroundColor: 'var(--color-surface)', boxShadow: e.shadow }}>
              <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{e.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Components */}
      <section>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
          <Layers className="w-5 h-5" style={{ color: 'var(--color-primary)' }} /> Компоненты
        </h3>
        <div className="rounded-xl p-6 space-y-6" style={{ backgroundColor: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)' }}>
          {/* Buttons */}
          <div>
            <p className="text-sm font-medium mb-3" style={{ color: 'var(--color-text)' }}>Кнопки</p>
            <div className="flex flex-wrap gap-3">
              <button className="btn-primary">Primary</button>
              <button className="btn-secondary">Secondary</button>
              <button className="px-4 py-2 rounded-lg text-sm font-medium transition" style={{ backgroundColor: 'var(--color-secondary)', color: '#fff' }}>AI</button>
              <button className="px-4 py-2 rounded-lg text-sm font-medium transition" style={{ backgroundColor: 'var(--color-success)', color: '#fff' }}>Success</button>
            </div>
          </div>

          {/* Inputs */}
          <div>
            <p className="text-sm font-medium mb-3" style={{ color: 'var(--color-text)' }}>Поля ввода</p>
            <div className="flex flex-wrap gap-3 max-w-md">
              <input className="input flex-1" placeholder="Обычное поле" />
              <input className="input flex-1" placeholder="С ошибкой" style={{ borderColor: 'var(--color-error)' }} />
            </div>
          </div>

          {/* Badges */}
          <div>
            <p className="text-sm font-medium mb-3" style={{ color: 'var(--color-text)' }}>Бейджи</p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: '#DBEAFE', color: '#1D4ED8' }}>Info</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: '#D1FAE5', color: '#065F46' }}>Success</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>Warning</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: '#FEE2E2', color: '#991B1B' }}>Error</span>
            </div>
          </div>
        </div>
      </section>

      {/* Do's and Don'ts */}
      <section>
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Правила использования</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-xl p-5" style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
            <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: '#166534' }}>
              <CheckCircle className="w-5 h-5" /> ✅ Do
            </h4>
            <ul className="space-y-2 text-sm" style={{ color: '#15803D' }}>
              <li>• Primary color для ключевых действий</li>
              <li>• Secondary color для ИИ-функций</li>
              <li>• Контрастность ≥ 4.5:1 (WCAG AA)</li>
              <li>• Щедрые отступы для «воздуха»</li>
              <li>• Тени для иерархии</li>
            </ul>
          </div>
          <div className="rounded-xl p-5" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}>
            <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: '#991B1B' }}>
              <XCircle className="w-5 h-5" /> ❌ Don't
            </h4>
            <ul className="space-y-2 text-sm" style={{ color: '#B91C1C' }}>
              <li>• Более 2 основных цветов на экране</li>
              <li>• Текст на цветном фоне без проверки</li>
              <li>• Декоративные шрифты для текста</li>
              <li>• Перегрузка тенями</li>
              <li>• Чистый чёрный (#000)</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
