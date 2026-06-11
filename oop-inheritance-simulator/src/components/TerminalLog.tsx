/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LogStep } from '../types';
import { Terminal, Trash2, Cpu, HelpCircle, Code, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TerminalLogProps {
  logs: LogStep[];
  onClear: () => void;
  highlightedSnippet: string | null;
  setHighlightedSnippet: (snippet: string | null) => void;
}

export default function TerminalLog({
  logs,
  onClear,
  highlightedSnippet,
  setHighlightedSnippet,
}: TerminalLogProps) {
  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Header bar */}
      <div className="flex justify-between items-center bg-slate-950 px-4 py-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="font-mono text-xs font-semibold text-slate-300 tracking-wider">
            ЛОГ ВЫПОЛНЕНИЯ МЕТОДОВ (CALL STACK)
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
            {logs.length} шагов
          </span>
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-rose-400 transition-colors p-1 rounded hover:bg-slate-800"
            title="Очистить лог терминала"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Очистить</span>
          </button>
        </div>
      </div>

      {/* Terminal logs list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-sm min-h-[250px] max-h-[450px]">
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 py-10">
            <Cpu className="w-8 h-8 opacity-25 mb-2 animate-pulse text-emerald-400" />
            <p className="text-xs">Лог пуст. Создайте объект и вызовите его методы,</p>
            <p className="text-xs mt-0.5">чтобы увидеть пошаговую трассировку наследования.</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {logs.map((log) => {
              const senderColor =
                log.sender === 'Vehicle (Base)'
                  ? 'text-indigo-400 border-indigo-900/50 bg-indigo-950/20'
                  : log.sender === 'ElectricCar (Derived)'
                  ? 'text-emerald-400 border-emerald-900/50 bg-emerald-950/20'
                  : 'text-slate-400 border-slate-800 bg-slate-800/30';

              const badgeText =
                log.type === 'constructor'
                  ? 'constructor'
                  : log.type === 'method_base'
                  ? 'base method'
                  : log.type === 'method_overridden'
                  ? 'override method'
                  : log.type === 'method_derived'
                  ? 'derived method'
                  : log.type === 'warn'
                  ? 'warning'
                  : 'info';

              const badgeColor =
                log.type === 'constructor'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  : log.type === 'method_base'
                  ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                  : log.type === 'method_overridden'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : log.type === 'method_derived'
                  ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                  : log.type === 'warn'
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  : 'bg-slate-500/10 text-slate-400 border-slate-500/20';

              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-3 border rounded-lg bg-slate-950/50 hover:bg-slate-950 transition-all group ${
                    highlightedSnippet === log.codeSnippet ? 'ring-1 ring-amber-500/40 bg-amber-950/10' : ''
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-600 text-xs">{log.timestamp}</span>
                      <span className={`text-[11px] px-1.5 py-0.5 rounded border font-semibold ${senderColor}`}>
                        {log.sender}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded border uppercase tracking-wider font-extrabold ${badgeColor}`}>
                        {badgeText}
                      </span>
                    </div>

                    {log.codeSnippet && (
                      <button
                        onClick={() =>
                          setHighlightedSnippet(
                            highlightedSnippet === log.codeSnippet ? null : log.codeSnippet || null
                          )
                        }
                        className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[11px] text-amber-400/80 hover:text-amber-300 font-mono"
                      >
                        <Code className="w-3 h-3" />
                        <span>Код под капотом</span>
                      </button>
                    )}
                  </div>

                  <p className="text-slate-200 leading-relaxed text-xs sm:text-sm">
                    {log.message}
                  </p>

                  {log.codeSnippet && (
                    <AnimatePresence>
                      {(highlightedSnippet === log.codeSnippet || true) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-2 overflow-hidden"
                        >
                          <div className="bg-slate-950 px-3 py-2 rounded border border-slate-800 text-[11px] text-slate-400 font-mono relative">
                            <div className="absolute top-1 right-2 text-[8px] uppercase tracking-widest text-slate-600 font-bold">
                              фрагмент TS
                            </div>
                            <pre className="whitespace-pre-wrap leading-tight text-emerald-400">
                              {log.codeSnippet}
                            </pre>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
