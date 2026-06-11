/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { BookOpen, Sparkles, AlertCircle, Info, Shuffle } from 'lucide-react';

export default function TheoryGuide() {
  const [activeConcept, setActiveConcept] = useState<'concepts' | 'super' | 'override' | 'polymorphism'>('concepts');

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
      {/* Header Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto">
        <button
          onClick={() => setActiveConcept('concepts')}
          className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 ${
            activeConcept === 'concepts'
              ? 'border-indigo-600 text-slate-900 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
          <span>1. Наследование (Inheritance)</span>
        </button>

        <button
          onClick={() => setActiveConcept('super')}
          className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 ${
            activeConcept === 'super'
              ? 'border-indigo-600 text-slate-900 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-pink-500" />
          <span>2. Конструктор & Super()</span>
        </button>

        <button
          onClick={() => setActiveConcept('override')}
          className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 ${
            activeConcept === 'override'
              ? 'border-indigo-600 text-slate-900 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5 text-emerald-500" />
          <span>3. Переопределение (Override)</span>
        </button>

        <button
          onClick={() => setActiveConcept('polymorphism')}
          className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 ${
            activeConcept === 'polymorphism'
              ? 'border-indigo-600 text-slate-900 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Shuffle className="w-3.5 h-3.5 text-amber-500" />
          <span>4. Полиморфизм & instanceof</span>
        </button>
      </div>

      {/* Concept Body */}
      <div className="p-5 text-slate-700 space-y-4 max-h-[350px] overflow-y-auto">
        {activeConcept === 'concepts' && (
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              Отношение «Является» (IS-A)
            </h4>
            <p className="text-sm leading-relaxed text-slate-600">
              Наследование — это механизм ООП, позволяющий создать новый класс на основе уже существующего. 
              Новый класс (производный, наследник или подкласс) автоматически перенимает все публичные и защищенные поля и методы 
              родительского (базового) класса. Это позволяет избежать дублирования кода.
            </p>
            <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-lg text-xs space-y-1 text-slate-700">
              <span className="font-semibold text-indigo-900">Пример из нашей песочницы:</span>
              <p>Класс <strong className="text-emerald-700 font-mono">ElectricCar</strong> расширяет (наследует) <strong className="text-indigo-800 font-mono">Vehicle</strong>.</p>
              <p>Следовательно, любой объект электрокара автоматически получает свойства <code className="bg-indigo-150 inline-block px-1 rounded">brand</code>, <code className="bg-indigo-150 inline-block px-1 rounded">speed</code> и методы <code className="bg-indigo-150 inline-block px-1 rounded">startEngine()</code>, <code className="bg-indigo-150 inline-block px-1 rounded">stopEngine()</code> без необходимости повторно объявлять их!</p>
            </div>
          </div>
        )}

        {activeConcept === 'super' && (
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              Ключевое слово super
            </h4>
            <p className="text-sm leading-relaxed text-slate-600">
              Если в производном классе объявляется собственный конструктор, он <strong className="text-rose-600">обязан</strong> первым делом вызвать конструктор родителя через <code className="bg-slate-100 p-0.5 rounded font-mono font-bold text-pink-600 text-xs">super()</code>.
            </p>
            <p className="text-sm leading-relaxed text-slate-600">
              Это вызвано тем, что подкласс не знает, как правильно инициализировать данные родительского объекта, и поручает это самому родителю. В TypeScript обращение к <code className="bg-slate-100 px-1 rounded font-mono text-xs">this</code> запрещено до тех пор, пока не отработает родительский конструктор!
            </p>
            <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3.5 rounded-lg text-xs font-mono space-y-1">
              <span className="font-bold uppercase tracking-wide block mb-1">Порядок выполнения инициализации:</span>
              <div>1. <span className="font-bold text-emerald-700">new ElectricCar("Tesla", 80)</span></div>
              <div>2. Запуск конструктора <span className="text-emerald-700">ElectricCar</span></div>
              <div>3. Вызов <span className="text-pink-600 font-bold">super("Tesla")</span> <span className="text-slate-500">← обязательный прыжок вверх!</span></div>
              <div>4. Отрабатывает конструктор <span className="text-indigo-800 font-bold">Vehicle</span> (настраивает бренд, заводит базовые поля)</div>
              <div>5. Возврат в тело конструктора <span className="text-emerald-700">ElectricCar</span> (устанавливает батарею и т.д.)</div>
            </div>
          </div>
        )}

        {activeConcept === 'override' && (
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm sm:text-base">
              Переопределение методов (Method Overriding)
            </h4>
            <p className="text-sm leading-relaxed text-slate-600">
              Иногда логика базового класса не совсем подходит потомку. Например, обычная машина разгоняется просто сжигая топливо или
              развивая скорость, а электрокар должен тратить заряд аккумулятора.
            </p>
            <p className="text-sm leading-relaxed text-slate-600">
              Мы переопределяем метод <code className="bg-slate-100 p-0.5 rounded font-mono font-semibold text-emerald-600 text-xs">accelerate()</code> в <code className="bg-slate-100 px-1 font-mono text-emerald-600">ElectricCar</code>. При этом, мы можем не переписывать логику разгона с нуля, а вызвать родительский вариант через <code className="bg-slate-100 p-0.5 rounded font-mono font-bold text-xs text-indigo-700">super.accelerate()</code>, выполнив дополнительный код до или после него.
            </p>
            <div className="bg-emerald-50 border border-emerald-100 text-slate-700 p-3 rounded-lg text-xs space-y-1">
              <span className="font-semibold text-emerald-900">Зачем использовать ключевое слово override?</span>
              <p>В TypeScript модификатор <code className="bg-slate-100 px-1 font-mono text-rose-500">override</code> защищает разработчика от случайных опечаток. Если вы опечатаетесь в названии (например, <code className="bg-slate-100 px-1 font-mono text-xs">accelerateee()</code>), компилятор выдаст ошибку о том, что такого метода нет у родителя.</p>
            </div>
          </div>
        )}

        {activeConcept === 'polymorphism' && (
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-1.5">
              Полиморфизм и оператор instanceof
            </h4>
            <p className="text-sm leading-relaxed text-slate-605">
              <strong>Полиморфизм</strong> позволяет обращаться к разным объектам единообразно. Если у нас есть массив транспортных средств <code className="font-mono text-xs text-indigo-800 bg-slate-100 px-1">vehicles: Vehicle[]</code>, мы можем вызвать метод <code className="font-mono text-xs bg-slate-100 px-1">getDetails()</code> для каждого элемента, не зная, тепловоз это, бензиновая машина или электрокар. Метод отыграет согласно фактическому типу объекта во время выполнения!
            </p>
            <p className="text-sm leading-relaxed text-slate-600">
              Оператор <code className="font-mono text-xs bg-slate-100 px-1 p-0.5 font-bold text-amber-600">instanceof</code> позволяет на лету проверить, является ли объект экземпляром конкретного класса (или его наследником):
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 border border-indigo-100 bg-indigo-50/50 rounded-md">
                <span className="font-bold text-indigo-900 block mb-0.5">Tesla instanceof Vehicle</span>
                <span className="text-emerald-600 font-bold">true</span>
                <span className="text-slate-500 block text-[10px] italic">Потому что ElectricCar является наследником Vehicle!</span>
              </div>
              <div className="p-2 border border-emerald-100 bg-emerald-50/50 rounded-md">
                <span className="font-bold text-emerald-900 block mb-0.5">Toyota instanceof ElectricCar</span>
                <span className="text-rose-500 font-bold">false</span>
                <span className="text-slate-500 block text-[10px] italic">Обычная Toyota не умеет заряжаться и не имеет полей ElectricCar.</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Info footer */}
      <div className="bg-amber-50 p-3.5 border-t border-slate-200 flex gap-2.5 text-xs text-amber-800">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <span>Вы можете подтвердить все эти правила, поэкспериментировав в интерактивной панели сборки выше.</span>
      </div>
    </div>
  );
}
