/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import {
  Milestone,
  Layers,
  Sparkles,
  Play,
  Square,
  Zap,
  Cpu,
  Info,
  ChevronRight,
  ShieldAlert,
  Sliders,
  Maximize2,
  Gauge,
  HelpCircle,
  Code
} from 'lucide-react';
import { Vehicle, ElectricCar } from './classes';
import { LogStep, SimulatedObjectState } from './types';
import TerminalLog from './components/TerminalLog';
import ClassCodeViewer from './components/ClassCodeViewer';
import TheoryGuide from './components/TheoryGuide';

export default function App() {
  // References to holds the actual live OOP instances
  const activeInstance = useRef<Vehicle | null>(null);

  // React State for re-rendering is synchronized with the live instance
  const [objectState, setObjectState] = useState<SimulatedObjectState | null>(null);
  const [logs, setLogs] = useState<LogStep[]>([]);
  const [highlightedSnippet, setHighlightedSnippet] = useState<string | null>(null);

  // Creation params state
  const [selectedCreator, setSelectedCreator] = useState<'Vehicle' | 'ElectricCar'>('Vehicle');
  const [brandInput, setBrandInput] = useState<string>('Toyota Camry');
  const [batteryInput, setBatteryInput] = useState<number>(85);
  const [accelAmount, setAccelAmount] = useState<number>(30);
  const [methodReturnValue, setMethodReturnValue] = useState<string | null>(null);

  // Pre-configured options for brands
  const vehicleBrands = ['Toyota Camry', 'BMW 3-Series', 'Ford Mustang', 'Lada Vesta'];
  const electricBrands = ['Tesla Model S', 'Porsche Taycan', 'Zeekr 001', 'Evolute i-Pro'];

  // Automatically update suggested brand value on type switch
  useEffect(() => {
    if (selectedCreator === 'Vehicle') {
      setBrandInput(vehicleBrands[0]);
    } else {
      setBrandInput(electricBrands[0]);
    }
  }, [selectedCreator]);

  // Create general system initial log
  useEffect(() => {
    addSystemLog('Добро пожаловать в Интерактивный симулятор наследования TypeScript!', 'info');
    addSystemLog('Выберите класс, настройте начальные характеристики автомобиля и нажмите кнопку "СОЗДАТЬ ОБЪЕКТ", чтобы запустить тестовую программу.', 'info');
  }, []);

  const addLogCallback = (
    type: LogStep['type'],
    sender: LogStep['sender'],
    message: string,
    snippet?: string
  ) => {
    const newLog: LogStep = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      type,
      sender,
      message,
      codeSnippet: snippet,
    };
    setLogs((prev) => [newLog, ...prev]);
    if (snippet) {
      setHighlightedSnippet(snippet);
    }
  };

  const addSystemLog = (message: string, type: 'info' | 'success' | 'warn' = 'info') => {
    addLogCallback(type, 'System', message);
  };

  const syncStateWithInstance = () => {
    const inst = activeInstance.current;
    if (!inst) {
      setObjectState(null);
      return;
    }
    const isElectric = inst instanceof ElectricCar;
    setObjectState({
      type: isElectric ? 'ElectricCar' : 'Vehicle',
      brand: inst.brand,
      speed: inst.speed,
      engineOn: inst.engineOn,
      batteryLevel: isElectric ? (inst as ElectricCar).batteryLevel : undefined,
      autopilotActive: isElectric ? (inst as ElectricCar).autopilotActive : undefined,
    });
  };

  // Instantiate OOP objects
  const handleCreateObject = () => {
    setMethodReturnValue(null);
    setLogs([]); // Reset logs to prioritize new constructor trace

    if (selectedCreator === 'Vehicle') {
      addSystemLog(`--- НАЧАЛО ТЕСТА: Создание объекта базового класса (class Vehicle) ---`);
      const v = new Vehicle(brandInput, addLogCallback);
      activeInstance.current = v;
    } else {
      addSystemLog(`--- НАЧАЛО ТЕСТА: Создание объекта производного класса (class ElectricCar extends Vehicle) ---`);
      const ec = new ElectricCar(brandInput, batteryInput, addLogCallback);
      activeInstance.current = ec;
    }

    syncStateWithInstance();
    addSystemLog(`Экземпляр класса успешно запущен и сохранен в памяти виртуального стенда. Доступно тестирование методов!`, 'success');
  };

  // Intercept and call methods on actual typescript instances
  const triggerStartEngine = () => {
    if (!activeInstance.current) return;
    const res = activeInstance.current.startEngine();
    setMethodReturnValue(res);
    syncStateWithInstance();
  };

  const triggerStopEngine = () => {
    if (!activeInstance.current) return;
    const res = activeInstance.current.stopEngine();
    setMethodReturnValue(res);
    syncStateWithInstance();
  };

  const triggerAccelerate = () => {
    if (!activeInstance.current) return;
    // Call the method. If electric, it runs overridden accelerate, otherwise base accelerate
    const res = activeInstance.current.accelerate(accelAmount);
    setMethodReturnValue(res);
    syncStateWithInstance();
  };

  const triggerGetDetails = () => {
    if (!activeInstance.current) return;
    const res = activeInstance.current.getDetails();
    setMethodReturnValue(res);
    syncStateWithInstance();
  };

  const triggerCharge = () => {
    if (!activeInstance.current) return;
    if (activeInstance.current instanceof ElectricCar) {
      const res = (activeInstance.current as ElectricCar).charge();
      setMethodReturnValue(res);
      syncStateWithInstance();
    } else {
      addSystemLog('Ошибка: Метод charge() недоступен для базового класса Vehicle! Он не объявлен в его структуре.', 'warn');
    }
  };

  const triggerToggleAutopilot = () => {
    if (!activeInstance.current) return;
    if (activeInstance.current instanceof ElectricCar) {
      const res = (activeInstance.current as ElectricCar).toggleAutopilot();
      setMethodReturnValue(res);
      syncStateWithInstance();
    } else {
      addSystemLog('Ошибка: Метод toggleAutopilot() недоступен для базового класса Vehicle!', 'warn');
    }
  };

  const clearObject = () => {
    activeInstance.current = null;
    setObjectState(null);
    setMethodReturnValue(null);
    addSystemLog('Экземпляр очищен из памяти. Создайте новый объект ниже.');
  };

  // Helper values for instanceof displays
  const isInstanceVehicle = activeInstance.current instanceof Vehicle;
  const isInstanceElectric = activeInstance.current instanceof ElectricCar;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col antialiased">
      {/* Visual Header */}
      <header className="bg-slate-900 text-white py-6 border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-900/30">
                <Cpu className="w-6 h-6 text-indigo-100" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-0.5">
                  TypeScript OOP inheritance Simulator
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 font-medium">
                  Интерактивная демонстрация работы методов базового и производного классов
                </p>
              </div>
            </div>
            {/* Creator Badges */}
            <div className="flex gap-2">
              <span className="text-[11px] font-mono font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded">
                class Vehicle
              </span>
              <span className="text-[11px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded">
                class ElectricCar extends Vehicle
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Interactive Playground Frame (7 Cols) */}
        <div className="lg:col-span-7 space-y-6 flex flex-col">
          
          {/* STEP 1: Factory / Constructor Panel */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Шаг 1: Сборка и создание экземпляра
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-slate-400">new Class()</span>
            </div>

            {/* Selector Buttons */}
            <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 rounded-lg">
              <button
                onClick={() => setSelectedCreator('Vehicle')}
                className={`flex items-center justify-center gap-2 py-3 rounded-md text-xs sm:text-sm font-semibold transition-all ${
                  selectedCreator === 'Vehicle'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <Milestone className="w-4 h-4" />
                <div className="text-left">
                  <div className="leading-tight">Базовый класс</div>
                  <div className="text-[9px] opacity-80 font-mono">Vehicle</div>
                </div>
              </button>

              <button
                onClick={() => setSelectedCreator('ElectricCar')}
                className={`flex items-center justify-center gap-2 py-3 rounded-md text-xs sm:text-sm font-semibold transition-all ${
                  selectedCreator === 'ElectricCar'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <Layers className="w-4 h-4" />
                <div className="text-left">
                  <div className="leading-tight">Производный класс</div>
                  <div className="text-[9px] opacity-80 font-mono">ElectricCar : Vehicle</div>
                </div>
              </button>
            </div>

            {/* Customizer Forms */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5/5">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest">
                  Бренд / Название машины
                </label>
                <div className="flex gap-2">
                  <select
                    value={brandInput}
                    onChange={(e) => setBrandInput(e.target.value)}
                    className="flex-1 text-xs sm:text-sm border border-slate-300 rounded p-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none bg-white font-medium"
                  >
                    {(selectedCreator === 'Vehicle' ? vehicleBrands : electricBrands).map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={brandInput}
                    onChange={(e) => setBrandInput(e.target.value)}
                    placeholder="Свой бренд..."
                    className="flex-1 text-xs sm:text-sm border border-slate-300 rounded p-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none bg-white"
                  />
                </div>
                <p className="text-[10px] text-slate-400 italic">
                  Строка передается в конструктор в качестве первого аргумента.
                </p>
              </div>

              {selectedCreator === 'ElectricCar' ? (
                <div className="space-y-2 border-l border-slate-100 sm:pl-4">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-600 uppercase tracking-widest">
                    <span>Начальный заряд батареи</span>
                    <span className="text-emerald-600 font-mono font-bold text-sm">{batteryInput}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={batteryInput}
                    onChange={(e) => setBatteryInput(Number(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                  <p className="text-[10px] text-slate-400 italic leading-tight">
                    Передается вторым аргументом конструктора у уникального класса-наследника.
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-slate-50 rounded border border-dashed border-slate-200 flex items-center justify-center text-center opacity-70">
                  <div className="text-xs text-slate-400">
                    У базового класса Vehicle <br /> нет поля <span className="font-mono text-[10px] bg-slate-200/50 text-slate-600 px-1 rounded">batteryLevel</span>
                  </div>
                </div>
              )}
            </div>

            {/* Launch Constructor Button */}
            <div className="pt-2">
              <button
                onClick={handleCreateObject}
                className={`w-full py-3.5 px-4 rounded-xl text-white font-bold text-sm tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 ${
                  selectedCreator === 'Vehicle'
                    ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/10'
                    : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/10'
                }`}
              >
                <Sparkles className="w-4 h-4 animate-spin-slow" />
                <span>Создать экземпляр класса {selectedCreator === 'Vehicle' ? 'Vehicle' : 'ElectricCar'}</span>
              </button>
            </div>
          </div>

          {/* STEP 2: Object Dashboard & Methods Console */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-5 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    Шаг 2: Симуляция памяти объекта и вызов методов
                  </h3>
                </div>
                {objectState && (
                  <button
                    onClick={clearObject}
                    className="text-slate-400 hover:text-rose-500 text-xs font-semibold px-2 py-1 rounded hover:bg-slate-100"
                  >
                    Удалить объект
                  </button>
                )}
              </div>

              {!objectState ? (
                <div className="p-10 text-center flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl my-4">
                  <Milestone className="w-12 h-12 text-slate-300 mb-2 animate-bounce" />
                  <p className="font-semibold text-slate-700 text-sm">Память стенда пуста</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm">
                    Настройте параметры в Шаге 1 и создайте экземпляр, чтобы разблокировать пульт управления и датчики ООП полиморфизма.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Active Class Type & Inheritance checks */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-slate-900 text-white rounded-xl p-4 shadow-inner">
                    
                    {/* Class badge */}
                    <div className="md:col-span-5 flex flex-col justify-center space-y-1 bg-slate-950/40 p-3 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                        Экземпляр в памяти:
                      </span>
                      <strong className={`text-base sm:text-lg font-mono ${objectState.type === 'ElectricCar' ? 'text-emerald-400' : 'text-indigo-400'}`}>
                        {objectState.type === 'ElectricCar' ? 'const ec' : 'const v'} = new {objectState.type}();
                      </strong>
                    </div>

                    {/* Runtime instanceof checks */}
                    <div className="md:col-span-7 flex flex-col justify-center space-y-1 bg-slate-950/20 p-3 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                        Динамическая сверка типов (Polymorphism):
                      </span>
                      <div className="flex flex-wrap gap-2 pt-1 font-mono text-[10px]">
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-850/50 border border-slate-800">
                          <span className="text-slate-400">instanceof Vehicle:</span>
                          <span className={isInstanceVehicle ? "text-emerald-400 font-bold" : "text-rose-500 font-bold"}>
                            {isInstanceVehicle ? "true (Да)" : "false (Нет)"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-850/50 border border-slate-800">
                          <span className="text-slate-400">instanceof ElectricCar:</span>
                          <span className={isInstanceElectric ? "text-emerald-400 font-bold" : "text-rose-500 font-bold"}>
                            {isInstanceElectric ? "true (Да)" : "false (Нет)"}
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Instrumentation Dashboards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Speedometer card */}
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 flex flex-col justify-between">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-slate-500 uppercase">Скорость</span>
                        <span className="text-[10px] text-slate-400 font-mono">public speed</span>
                      </div>
                      <div className="text-center py-2">
                        <div className="text-3xl font-black text-slate-900 font-mono select-none">
                          {objectState.speed} <span className="text-xs text-slate-500 font-normal">км/ч</span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-indigo-600 h-full transition-all duration-300"
                          style={{ width: `${(objectState.speed / 220) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Battery Card (Derived-only, fallback mock representation for generic) */}
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 flex flex-col justify-between relative">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-slate-500 uppercase">Аккумулятор</span>
                        <span className="text-[10px] text-slate-400 font-mono">batteryLevel</span>
                      </div>
                      <div className="text-center py-2">
                        {objectState.batteryLevel !== undefined ? (
                          <div className="text-3xl font-black text-emerald-600 font-mono select-none">
                            {objectState.batteryLevel}%
                          </div>
                        ) : (
                          <div className="text-sm font-bold text-slate-400 py-1 font-mono">
                            N/A (Нет поля)
                          </div>
                        )}
                      </div>
                      {objectState.batteryLevel !== undefined ? (
                        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${
                              objectState.batteryLevel < 20 ? 'bg-rose-500 animate-pulse' : 'bg-emerald-600'
                            }`}
                            style={{ width: `${objectState.batteryLevel}%` }}
                          />
                        </div>
                      ) : (
                        <div className="w-full bg-slate-200 rounded-full h-1.5">
                          <div className="bg-slate-300 h-full w-0" />
                        </div>
                      )}
                    </div>

                    {/* Simple States (Boolean status triggers) */}
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 flex flex-col justify-between">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold text-slate-500 uppercase">ТТХ Статус</span>
                        <span className="text-[10px] text-slate-400 font-mono">boolean state</span>
                      </div>
                      <div className="space-y-1.5 font-mono text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">Двигатель:</span>
                          <span className={`font-bold ${objectState.engineOn ? 'text-indigo-600' : 'text-slate-400'}`}>
                            {objectState.engineOn ? 'РАБОТАЕТ' : 'ВЫКЛЮЧЕН'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">Автопилот:</span>
                          {objectState.autopilotActive !== undefined ? (
                            <span className={`font-bold ${objectState.autopilotActive ? 'text-emerald-600 font-extrabold' : 'text-slate-400'}`}>
                              {objectState.autopilotActive ? 'АКТИВЕН' : 'ВЫКЛЮЧЕН'}
                            </span>
                          ) : (
                            <span className="text-slate-400 font-medium">ОТСУТСТВУЕТ</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ACTIVE METHOD CALL TRIGGERS */}
                  <div className="space-y-3 pt-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
                      Доступные кнопки вызова методов класса:
                    </span>

                    {/* Method Row 1: Common / Base Group */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* startEngine / stopEngine */}
                      <div className="p-3 bg-indigo-50/40 border border-indigo-100 rounded-lg space-y-2">
                        <div className="flex items-center gap-1.5 text-xs text-indigo-900 font-semibold mb-1">
                          <Milestone className="w-3.5 h-3.5 text-indigo-500" />
                          <span>Наследовано из Vehicle (Base):</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={triggerStartEngine}
                            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded text-xs font-bold text-indigo-700 bg-white border border-indigo-250 hover:bg-indigo-50 hover:border-indigo-400 transition-colors shadow-sm`}
                          >
                            <Play className="w-3 h-3 block fill-current" />
                            <span>startEngine()</span>
                          </button>
                          <button
                            onClick={triggerStopEngine}
                            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded text-xs font-bold text-indigo-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-350 transition-colors shadow-sm`}
                          >
                            <Square className="w-3 h-3 block fill-current" />
                            <span>stopEngine()</span>
                          </button>
                        </div>
                      </div>

                      {/* Overridden & Parameterized logic (Accelerate) */}
                      <div className="p-3 bg-amber-50/40 border border-amber-100 rounded-lg space-y-2">
                        <div className="flex items-center justify-between text-xs text-amber-900 font-semibold mb-1">
                          <span className="flex items-center gap-1.5">
                            {objectState.type === 'ElectricCar' ? (
                              <Layers className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                            ) : (
                              <Milestone className="w-3.5 h-3.5 text-indigo-500" />
                            )}
                            <span>{objectState.type === 'ElectricCar' ? 'Переопределено (Overridden)' : 'Базовый метод'}:</span>
                          </span>
                        </div>
                        <div className="flex gap-2 items-center">
                          <div className="flex-1 flex gap-1.5 bg-white border border-slate-200 rounded p-1.5">
                            {[15, 40, 60].map((amt) => (
                              <button
                                key={amt}
                                onClick={() => setAccelAmount(amt)}
                                className={`flex-1 py-1 rounded text-[10px] font-bold font-mono transition-colors ${
                                  accelAmount === amt ? 'bg-amber-100 text-amber-900' : 'text-slate-500 hover:bg-slate-100'
                                }`}
                              >
                                +{amt}
                              </button>
                            ))}
                          </div>
                          <button
                            onClick={triggerAccelerate}
                            className={`py-2 px-3.5 rounded text-xs font-bold text-amber-800 bg-amber-100 border border-amber-300 hover:bg-amber-200 transition-colors shadow-sm`}
                          >
                            <span>accelerate({accelAmount})</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Method Row 2: Derived specifics & diagnostic getters */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* getDetails (Overridden in ElectricCar, returns strings) */}
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-col justify-center">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-semibold text-slate-500">Диагностический отчет:</span>
                          <span className="text-[9px] font-mono text-slate-400">polymorphic return</span>
                        </div>
                        <button
                          onClick={triggerGetDetails}
                          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition-colors shadow-sm"
                        >
                          <Maximize2 className="w-3 h-3 text-slate-600" />
                          <span>getDetails()</span>
                        </button>
                      </div>

                      {/* ElectricCar UNIQUE methods (Hidden / Disabled if simple Vehicle is loaded) */}
                      <div className="p-3 bg-emerald-50/50 border border-emerald-100/80 rounded-lg space-y-2">
                        <div className="flex items-center justify-between text-xs text-emerald-900 font-semibold mb-1">
                          <span className="flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Уникально для ElectricCar (Derived Only):</span>
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={triggerCharge}
                            disabled={objectState.type !== 'ElectricCar'}
                            className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded text-xs font-bold transition-all shadow-sm ${
                              objectState.type === 'ElectricCar'
                                ? 'text-emerald-700 bg-emerald-100 border border-emerald-300 hover:bg-emerald-200'
                                : 'text-slate-400 bg-slate-100 border border-slate-200 cursor-not-allowed opacity-45'
                            }`}
                          >
                            <Zap className="w-3 h-3 fill-current" />
                            <span>charge()</span>
                          </button>
                          <button
                            onClick={triggerToggleAutopilot}
                            disabled={objectState.type !== 'ElectricCar'}
                            className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded text-xs font-bold transition-all shadow-sm ${
                              objectState.type === 'ElectricCar'
                                ? 'text-emerald-700 bg-emerald-100 border border-emerald-300 hover:bg-emerald-100'
                                : 'text-slate-400 bg-slate-100 border border-slate-200 cursor-not-allowed opacity-45'
                            }`}
                          >
                            <Cpu className="w-3 h-3" />
                            <span>toggleAutopilot()</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Method Return Bubble */}
                  {methodReturnValue && (
                    <div className="mt-2 bg-gradient-to-r from-slate-900 to-slate-950 text-emerald-400 p-4 border-l-4 border-emerald-500 rounded-r-lg shadow-sm font-mono text-xs sm:text-sm">
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">
                        Данные, возвращенные методом (Return):
                      </div>
                      <div className="text-slate-100 select-all font-semibold">
                        &quot;{methodReturnValue}&quot;
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Hint Box */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-800 flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                <strong>Инструкция:</strong> Попробуйте разогнаться на электрокаре (<code className="bg-blue-100 inline-block px-1 rounded">ElectricCar.accelerate</code>). В логе ниже вы наглядно увидите, как сначала вызывается цепочка из подкласса, затем вызывается <code className="bg-blue-100 inline-block px-1 rounded">super.accelerate()</code>, отрабатывая в родительском классе <code className="bg-blue-100 inline-block px-1 rounded">Vehicle</code>, и возвращается обратно!
              </span>
            </div>
          </div>

        </div>

        {/* Right Section containing Source Code Viewer & Theory Guide (5 Cols) */}
        <div className="lg:col-span-5 space-y-6 flex flex-col">
          {/* TAB 1: Source Files */}
          <div className="flex flex-col flex-1 min-h-[350px]">
            <div className="flex items-center gap-2 mb-2">
              <Code className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Код тестовой программы
              </h3>
            </div>
            <ClassCodeViewer />
          </div>

          {/* TAB 2: Theorist Guide */}
          <div className="mt-auto">
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Шпаргалка по наследованию
              </h3>
            </div>
            <TheoryGuide />
          </div>
        </div>
      </main>

      {/* Terminal log at the bottom spanned entirely or split vertically */}
      <footer className="bg-slate-950 border-t border-slate-900 mt-6 py-6 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <TerminalLog
            logs={logs}
            onClear={() => {
              setLogs([]);
              setMethodReturnValue(null);
            }}
            highlightedSnippet={highlightedSnippet}
            setHighlightedSnippet={setHighlightedSnippet}
          />
        </div>
      </footer>
    </div>
  );
}
