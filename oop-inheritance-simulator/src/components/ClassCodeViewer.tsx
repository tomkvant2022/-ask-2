/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Code, BookOpen, Layers, Milestone } from 'lucide-react';

export default function ClassCodeViewer() {
  const [activeTab, setActiveTab] = useState<'vehicle' | 'electric'>('vehicle');

  const vCode = `// 📘 БАЗОВЫЙ КЛАСС (Родительский класс — Base Class)
export class Vehicle {
  // Поля класса (свойства). По умолчанию имеют модификатор public.
  public brand: string;
  public speed: number = 0;
  public engineOn: boolean = false;

  // Конструктор — вызывается при создании нового объекта: new Vehicle("Tesla")
  constructor(brand: string) {
    this.brand = brand;
    this.speed = 0;
    this.engineOn = false;
  }

  // Метод запуска двигателя (Доступен во всех потомках)
  public startEngine(): string {
    if (this.engineOn) {
      return "Двигатель уже заведен.";
    }
    this.engineOn = true;
    return "Двигатель заведен.";
  }

  // Метод остановки двигателя
  public stopEngine(): string {
    if (!this.engineOn) {
      return "Двигатель уже заглушен.";
    }
    this.speed = 0;
    this.engineOn = false;
    return "Двигатель остановлен.";
  }

  // Базовый метод ускорения
  public accelerate(amount: number): string {
    if (!this.engineOn) {
      return "Ошибка: заведите сначала двигатель!";
    }
    this.speed = Math.min(this.speed + amount, 220);
    return \`Скорость увеличена до \${this.speed} км/ч.\`;
  }

  // Метод сбора подробностей об объекте
  public getDetails(): string {
    return \`Бренд: \${this.brand}, Скорость: \${this.speed} км/ч, Двигатель: \${this.engineOn ? "Работает" : "Остановлен"}\`;
  }
}`;

  const eCode = `// 📗 ПРОИЗВОДНЫЙ КЛАСС (Класс-потомок — Derived Class)
// Ключевое слово "extends" указывает на наследование от класса Vehicle
export class ElectricCar extends Vehicle {
  // Уникальные поля, присутствующие только у ElectricCar
  public batteryLevel: number;
  public autopilotActive: boolean = false;

  // Конструктор производного класса
  constructor(brand: string, batteryLevel: number) {
    // ⚠️ ВАЖНО: В конструкторе потомка мы ОБЯЗАНЫ вызвать super() 
    // до обращения к ключевому слову 'this'.
    // Мы передаем бренд в родительский конструктор класса Vehicle.
    super(brand); 

    // Инициализируем уникальные поля потомка
    this.batteryLevel = batteryLevel;
    this.autopilotActive = false;
  }

  // 🔄 ПЕРЕОПРЕДЕЛЕНИЕ МЕТОДА (Method Overriding)
  // Мы переопределяем метод ускорения, чтобы учесть расход заряда батареи.
  // Ключевое слово 'override' в TypeScript гарантирует, что такой метод есть у родителя.
  public override accelerate(amount: number): string {
    if (!this.engineOn) {
      // Вызываем то же поведение, что прописано в родителе
      return super.accelerate(amount); 
    }
    if (this.batteryLevel <= 0) {
      return "Ошибка: Недостаточно заряда батареи.";
    }

    // Вызываем родительский метод ускорения через ключевое слово 'super'
    const baseResult = super.accelerate(amount);

    // Добавляем специфичную логику потомка (разряд батареи)
    const drain = Math.min(Math.ceil(amount * 0.15), this.batteryLevel);
    this.batteryLevel -= drain;

    if (this.batteryLevel <= 0) {
      this.speed = 0;
      this.engineOn = false;
      this.autopilotActive = false;
    }

    return \`\${baseResult} (Расход энергии: -\${drain}%, Заряд: \${this.batteryLevel}%)\`;
  }

  // 🔋 УНИКАЛЬНЫЙ МЕТОД ПОТОМКА (Отсутствует в базовом классе)
  public charge(): string {
    if (this.speed > 0) {
      return "Зарядка невозможна в движении! Остановитесь сначала.";
    }
    this.batteryLevel = 100;
    return "Батарея полностью заряжена до 100%.";
  }

  // Специфический метод управления автопилотом Теслы/Электрокара
  public toggleAutopilot(): string {
    if (!this.engineOn) {
      return "Включите сначала двигатель!";
    }
    this.autopilotActive = !this.autopilotActive;
    return \`Автопилот \${this.autopilotActive ? "включен" : "выключен"}.\`;
  }

  // 🔄 Еще одно переопределение — дополняем информацию о машине
  public override getDetails(): string {
    // Получаем базовый текст "Бренд... Скорость..."
    const baseDetails = super.getDetails(); 
    // Склеиваем с дополнительными показателями батареи и автопилота
    return \`\${baseDetails} | Заряд: \${this.batteryLevel}%, Автопилот: \${this.autopilotActive ? "Включен" : "Выключен"}\`;
  }
}`;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col h-full">
      {/* File Selectors */}
      <div className="flex border-b border-slate-800 bg-slate-950/70 p-2 gap-2">
        <button
          onClick={() => setActiveTab('vehicle')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs sm:text-sm font-mono transition-all ${
            activeTab === 'vehicle'
              ? 'bg-indigo-600 text-white font-semibold shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Milestone className="w-4 h-4 text-indigo-300" />
          <span>Vehicle.ts (База)</span>
        </button>
        <button
          onClick={() => setActiveTab('electric')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs sm:text-sm font-mono transition-all ${
            activeTab === 'electric'
              ? 'bg-emerald-600 text-white font-semibold shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4 text-emerald-300" />
          <span>ElectricCar.ts (Потомок)</span>
        </button>
      </div>

      {/* Editor Space */}
      <div className="flex-1 p-4 overflow-auto font-mono text-[11px] sm:text-xs leading-relaxed max-h-[500px]">
        {activeTab === 'vehicle' ? (
          <div className="space-y-1">
            <div className="text-slate-500 mb-2 italic select-none">
              // Базовый класс выступает в качестве общего шаблона. Содержит базовое состояние и функции.
            </div>
            <pre className="text-indigo-200 block overflow-x-auto whitespace-pre">
              {vCode}
            </pre>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="text-slate-500 mb-2 italic select-none">
              // Производный класс расширяет (extends) базовый, добавляя свои свойства и переопределяя поведение.
            </div>
            <pre className="text-emerald-200 block overflow-x-auto whitespace-pre">
              {eCode}
            </pre>
          </div>
        )}
      </div>

      {/* Footnote */}
      <div className="bg-slate-950 p-3 border-t border-slate-800 flex items-center gap-2 text-[11px] text-slate-400">
        <Code className="w-3.5 h-3.5 text-slate-500" />
        <span>Вы можете наблюдать за вызовами этих методов в реальном времени слева!</span>
      </div>
    </div>
  );
}
