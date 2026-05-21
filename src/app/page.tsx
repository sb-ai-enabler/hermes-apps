"use client";

import { useMemo, useState } from "react";

type Operator = "+" | "-" | "*" | "/";
type CalculatorButton =
  | { label: string; kind: "number"; className?: string }
  | { label: string; kind: "operator"; value: Operator }
  | { label: string; kind: "action"; action: "clear" | "equals"; className?: string };

const buttons: CalculatorButton[] = [
  { label: "Clear", kind: "action", action: "clear", className: "col-span-2" },
  { label: "/", kind: "operator", value: "/" },
  { label: "x", kind: "operator", value: "*" },
  { label: "7", kind: "number" },
  { label: "8", kind: "number" },
  { label: "9", kind: "number" },
  { label: "-", kind: "operator", value: "-" },
  { label: "4", kind: "number" },
  { label: "5", kind: "number" },
  { label: "6", kind: "number" },
  { label: "+", kind: "operator", value: "+" },
  { label: "1", kind: "number" },
  { label: "2", kind: "number" },
  { label: "3", kind: "number" },
  { label: "=", kind: "action", action: "equals", className: "row-span-2" },
  { label: "0", kind: "number", className: "col-span-2" },
  { label: ".", kind: "number" },
];

function calculate(left: number, right: number, operator: Operator) {
  switch (operator) {
    case "+":
      return left + right;
    case "-":
      return left - right;
    case "*":
      return left * right;
    case "/":
      return right === 0 ? Number.NaN : left / right;
  }
}

function formatValue(value: number) {
  if (!Number.isFinite(value)) {
    return "Error";
  }

  return Number.parseFloat(value.toFixed(10)).toString();
}

export default function Home() {
  const [display, setDisplay] = useState("0");
  const [storedValue, setStoredValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [waitingForValue, setWaitingForValue] = useState(false);

  const expression = useMemo(() => {
    if (storedValue === null || operator === null) {
      return "Ready";
    }

    return `${formatValue(storedValue)} ${operator}`;
  }, [operator, storedValue]);

  function clearCalculator() {
    setDisplay("0");
    setStoredValue(null);
    setOperator(null);
    setWaitingForValue(false);
  }

  function inputNumber(value: string) {
    if (display === "Error") {
      setDisplay(value === "." ? "0." : value);
      setWaitingForValue(false);
      return;
    }

    if (waitingForValue) {
      setDisplay(value === "." ? "0." : value);
      setWaitingForValue(false);
      return;
    }

    if (value === "." && display.includes(".")) {
      return;
    }

    setDisplay(display === "0" && value !== "." ? value : `${display}${value}`);
  }

  function chooseOperator(nextOperator: Operator) {
    const inputValue = Number(display);

    if (operator && storedValue !== null && !waitingForValue) {
      const result = calculate(storedValue, inputValue, operator);
      const formatted = formatValue(result);

      setDisplay(formatted);
      setStoredValue(Number.isFinite(result) ? result : null);
      setOperator(Number.isFinite(result) ? nextOperator : null);
      setWaitingForValue(Number.isFinite(result));
      return;
    }

    setStoredValue(inputValue);
    setOperator(nextOperator);
    setWaitingForValue(true);
  }

  function evaluate() {
    if (!operator || storedValue === null || waitingForValue) {
      return;
    }

    const result = calculate(storedValue, Number(display), operator);

    setDisplay(formatValue(result));
    setStoredValue(null);
    setOperator(null);
    setWaitingForValue(true);
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
      <section className="w-full max-w-sm rounded-lg border border-white/70 bg-white/85 p-5 shadow-2xl shadow-slate-300/50 backdrop-blur sm:p-6">
        <div className="mb-5 rounded-lg bg-slate-950 p-5 text-right text-white shadow-inner">
          <p className="min-h-6 text-sm font-medium text-cyan-200">{expression}</p>
          <p className="mt-3 min-h-14 break-all text-4xl font-semibold tracking-normal sm:text-5xl">
            {display}
          </p>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {buttons.map((button) => {
            const baseClass =
              "rounded-lg px-4 py-4 text-lg font-semibold shadow-sm transition focus:outline-none focus:ring-4";

            if (button.kind === "operator") {
              return (
                <button
                  key={button.label}
                  type="button"
                  onClick={() => chooseOperator(button.value)}
                  className={`${baseClass} bg-slate-900 text-white shadow-slate-200 hover:bg-slate-800 focus:ring-slate-300`}
                >
                  {button.label}
                </button>
              );
            }

            if (button.kind === "action") {
              const isEquals = button.action === "equals";

              return (
                <button
                  key={button.label}
                  type="button"
                  onClick={isEquals ? evaluate : clearCalculator}
                  className={`${baseClass} ${button.className ?? ""} ${
                    isEquals
                      ? "bg-emerald-500 text-white shadow-emerald-200 hover:bg-emerald-600 focus:ring-emerald-200"
                      : "bg-rose-500 text-white shadow-rose-200 hover:bg-rose-600 focus:ring-rose-200"
                  }`}
                >
                  {button.label}
                </button>
              );
            }

            return (
              <button
                key={button.label}
                type="button"
                onClick={() => inputNumber(button.label)}
                className={`${baseClass} ${button.className ?? ""} border border-slate-200 bg-white text-slate-900 hover:border-cyan-200 hover:bg-cyan-50 focus:ring-cyan-100`}
              >
                {button.label}
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
}
