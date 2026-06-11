/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Step-by-step execution log item for teaching the call stack
export interface LogStep {
  id: string;
  timestamp: string;
  type: 'info' | 'constructor' | 'method_base' | 'method_overridden' | 'method_derived' | 'success' | 'warn';
  sender: 'System' | 'Vehicle (Base)' | 'ElectricCar (Derived)';
  message: string;
  codeSnippet?: string;
}

// Current simulated object state
export interface SimulatedObjectState {
  type: 'Vehicle' | 'ElectricCar';
  brand: string;
  speed: number;
  engineOn: boolean;
  // Derived only
  batteryLevel?: number;
  autopilotActive?: boolean;
}

// Interactive method available to call
export interface InteractiveMethod {
  name: string;
  label: string;
  description: string;
  parameters?: { name: string; type: string; default: any; min?: number; max?: number }[];
  classType: 'base' | 'derived' | 'overridden';
}
