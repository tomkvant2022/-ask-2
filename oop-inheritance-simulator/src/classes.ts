/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LogStep } from './types';

type LogCallback = (
  type: LogStep['type'],
  sender: LogStep['sender'],
  message: string,
  snippet?: string
) => void;

export class Vehicle {
  public brand: string;
  public speed: number = 0;
  public engineOn: boolean = false;
  protected log: LogCallback;

  constructor(brand: string, log: LogCallback) {
    this.brand = brand;
    this.log = log;
    this.log(
      'constructor',
      'Vehicle (Base)',
      `Конструктор Vehicle(brand: "${brand}") запущен. Поля базового класса инициализированы: speed = 0, engineOn = false`,
      'constructor(brand: string) {\n  this.brand = brand;\n  this.speed = 0;\n  this.engineOn = false;\n}'
    );
  }

  public startEngine(): string {
    if (this.engineOn) {
      this.log(
        'warn',
        'Vehicle (Base)',
        `Попытка запустить уже работающий двигатель машины "${this.brand}".`,
        'if (this.engineOn) return;'
      );
      return "Двигатель уже заведен.";
    }
    this.engineOn = true;
    this.log(
      'method_base',
      'Vehicle (Base)',
      `Метод startEngine() базового класса. Двигатель машины "${this.brand}" успешно запущен.`,
      'this.engineOn = true;'
    );
    return "Двигатель заведен.";
  }

  public stopEngine(): string {
    if (!this.engineOn) {
      this.log(
        'warn',
        'Vehicle (Base)',
        `Попытка остановить уже выключенный двигатель машины "${this.brand}".`,
        'if (!this.engineOn) return;'
      );
      return "Двигатель уже заглушен.";
    }
    this.speed = 0;
    this.engineOn = false;
    this.log(
      'method_base',
      'Vehicle (Base)',
      `Метод stopEngine() базового класса. Двигатель остановлен, скорость снижена до 0 км/ч.`,
      'this.speed = 0;\nthis.engineOn = false;'
    );
    return "Двигатель остановлен.";
  }

  public accelerate(amount: number): string {
    if (!this.engineOn) {
      this.log(
        'warn',
        'Vehicle (Base)',
        `Попытка разогнаться с выключенным двигателем. Метод accelerate() прерван.`,
        'if (!this.engineOn) { throw Error("Двигатель заглушен"); }'
      );
      return "Ошибка: заведите сначала двигатель!";
    }
    this.speed = Math.min(this.speed + amount, 220);
    this.log(
      'method_base',
      'Vehicle (Base)',
      `Метод accelerate(${amount}) базового класса. Текущая скорость: ${this.speed} км/ч (лимит 220 по ТТХ).`,
      'this.speed = Math.min(this.speed + amount, 220);'
    );
    return `Скорость увеличена до ${this.speed} км/ч.`;
  }

  public getDetails(): string {
    this.log(
      'method_base',
      'Vehicle (Base)',
      `Метод getDetails() базового класса. Сбор базового описания бренда и статуса.`,
      'return `Бренд: ${this.brand}, Скорость: ${this.speed} км/ч, Заведен: ${this.engineOn}`;'
    );
    return `Бренд: ${this.brand}, Скорость: ${this.speed} км/ч, Двигатель: ${this.engineOn ? "Работает" : "Остановлен"}`;
  }
}

export class ElectricCar extends Vehicle {
  public batteryLevel: number;
  public autopilotActive: boolean = false;

  constructor(brand: string, batteryLevel: number, log: LogCallback) {
    // В TypeScript вызов super() - строгая обязанность до использования `this`!
    log(
      'constructor',
      'ElectricCar (Derived)',
      `Конструктор ElectricCar(brand: "${brand}", batteryLevel: ${batteryLevel}%) запущен. Первым шагом вызываем super(brand).`,
      'constructor(brand: string, batteryLevel: number) {\n  super(brand); // Сначала инициализируем предка!'
    );

    super(brand, log);

    this.batteryLevel = batteryLevel;
    this.log(
      'constructor',
      'ElectricCar (Derived)',
      `Завершен вызов super(). Начинается инициализация полей ElectricCar: batteryLevel = ${batteryLevel}%, autopilotActive = false`,
      '  this.batteryLevel = batteryLevel;\n  this.autopilotActive = false;\n}'
    );
  }

  // Переопределение метода accelerate (override)
  public override accelerate(amount: number): string {
    if (!this.engineOn) {
      this.log(
        'warn',
        'ElectricCar (Derived)',
        `Двигатель выключен. Передаем выполнение в родительский класс, чтобы отработала базовая логика ошибки.`
      );
      return super.accelerate(amount);
    }

    if (this.batteryLevel <= 0) {
      this.log(
        'warn',
        'ElectricCar (Derived)',
        `Ускорение отменено: батарея на критическом нуле (0%).`,
        'if (this.batteryLevel <= 0) return;'
      );
      return "Ошибка: Недостаточно заряда батареи.";
    }

    this.log(
      'method_overridden',
      'ElectricCar (Derived)',
      `Вход в переопределенный метод accelerate(${amount}). Вызываем базовое ускорение через super.accelerate(${amount}).`,
      'super.accelerate(amount); // Вызов родительской логики'
    );

    // Вызываем родительский метод для обработки скорости
    const baseResult = super.accelerate(amount);

    // Наша уникальная логика (расход энергии)
    const drain = Math.min(Math.ceil(amount * 0.15), this.batteryLevel);
    this.batteryLevel -= drain;

    this.log(
      'method_overridden',
      'ElectricCar (Derived)',
      `Возврат в ElectricCar. Снижен уровень заряда батареи на -${drain}%. Текущий заряд: ${this.batteryLevel}%`,
      'this.batteryLevel -= drain;\nreturn `${baseResult} (Заряд: ${this.batteryLevel}%)`;'
    );

    if (this.batteryLevel <= 0) {
      this.speed = 0;
      this.engineOn = false;
      this.autopilotActive = false;
      this.log(
        'warn',
        'ElectricCar (Derived)',
        `Батарея полностью разряжена (0%). Двигатель и автопилот автоматически выключены!`,
        'this.speed = 0;\nthis.engineOn = false;'
      );
    }

    return `${baseResult} (Расход энергии: -${drain}%, Заряд: ${this.batteryLevel}%)`;
  }

  // Уникальный разработанный метод (отсутствует в базовом классе)
  public charge(): string {
    if (this.speed > 0) {
      this.log(
        'warn',
        'ElectricCar (Derived)',
        `Попытка зарядить электрокар на ходу (текущая скорость: ${this.speed} км/ч). Безопасность блокирует процесс.`,
        'if (this.speed > 0) return;'
      );
      return "Зарядка невозможна в движении! Остановитесь сначала.";
    }
    this.batteryLevel = 100;
    this.log(
      'method_derived',
      'ElectricCar (Derived)',
      `Уникальный метод charge(). Батарея успешно заряжена до 100%.`,
      'this.batteryLevel = 100;'
    );
    return "Батарея полностью заряжена до 100%.";
  }

  // Еще один уникальный метод
  public toggleAutopilot(): string {
    if (!this.engineOn) {
      this.log(
        'warn',
        'ElectricCar (Derived)',
        `Попытка активировать автопилот, когда двигатель заглушен. Активация отклонена.`,
        'if (!this.engineOn) return;'
      );
      return "Включите сначала двигатель!";
    }
    this.autopilotActive = !this.autopilotActive;
    this.log(
      'method_derived',
      'ElectricCar (Derived)',
      `Уникальный метод toggleAutopilot(). Автопилот переключен в состояние: ${this.autopilotActive ? "АКТИВЕН" : "ОТКЛЮЧЕН"}`,
      'this.autopilotActive = !this.autopilotActive;'
    );
    return `Автопилот ${this.autopilotActive ? "включен" : "выключен"}.`;
  }

  // Переопределение метода getDetails (override)
  public override getDetails(): string {
    this.log(
      'method_overridden',
      'ElectricCar (Derived)',
      `Вход в переопределенный getDetails(). Вызываем родительский super.getDetails() для старта.`,
      'const baseDetails = super.getDetails();'
    );

    const baseDetails = super.getDetails();

    this.log(
      'method_overridden',
      'ElectricCar (Derived)',
      `Возврат в ElectricCar. Дописываем к деталям уровень батареи (${this.batteryLevel}%) и автопилот.`,
      'return `${baseDetails} | Батарея: ${this.batteryLevel}%, Автопилот: ${this.autopilotActive}`;'
    );

    return `${baseDetails} | Заряд: ${this.batteryLevel}%, Автопилот: ${this.autopilotActive ? "Включен" : "Выключен"}`;
  }
}
