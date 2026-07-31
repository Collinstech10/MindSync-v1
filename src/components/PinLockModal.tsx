import React, { useState, useEffect } from "react";
import { Lock, Delete, Check, ShieldCheck, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import MindsyncLogo from "./MindsyncLogo";

interface PinLockModalProps {
  isOpen: boolean;
  onUnlock: (pin: string) => boolean; // returns true if valid
  isSettingPin?: boolean;
  onSaveNewPin?: (newPin: string) => void;
  onClose?: () => void;
}

export default function PinLockModal({
  isOpen,
  onUnlock,
  isSettingPin = false,
  onSaveNewPin,
  onClose,
}: PinLockModalProps) {
  const [pin, setPin] = useState<string>("");
  const [confirmPin, setConfirmPin] = useState<string>("");
  const [step, setStep] = useState<"enter" | "set" | "confirm">("enter");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isShaking, setIsShaking] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setPin("");
      setConfirmPin("");
      setErrorMsg("");
      setStep(isSettingPin ? "set" : "enter");
    }
  }, [isOpen, isSettingPin]);

  // Handle keyboard typing
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") {
        handlePressNumber(e.key);
      } else if (e.key === "Backspace") {
        handlePressDelete();
      } else if (e.key === "Escape" && onClose) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, pin, step, confirmPin]);

  if (!isOpen) return null;

  const triggerError = (msg: string) => {
    setErrorMsg(msg);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
    setPin("");
    setConfirmPin("");
  };

  const handlePressNumber = (num: string) => {
    setErrorMsg("");
    if (step === "enter") {
      if (pin.length < 4) {
        const nextPin = pin + num;
        setPin(nextPin);
        if (nextPin.length === 4) {
          // Attempt unlock
          setTimeout(() => {
            const success = onUnlock(nextPin);
            if (!success) {
              triggerError("Incorrect PIN. Please try again.");
            }
          }, 150);
        }
      }
    } else if (step === "set") {
      if (pin.length < 4) {
        const nextPin = pin + num;
        setPin(nextPin);
        if (nextPin.length === 4) {
          setTimeout(() => {
            setStep("confirm");
            setErrorMsg("");
          }, 150);
        }
      }
    } else if (step === "confirm") {
      if (confirmPin.length < 4) {
        const nextConfirm = confirmPin + num;
        setConfirmPin(nextConfirm);
        if (nextConfirm.length === 4) {
          setTimeout(() => {
            if (nextConfirm === pin) {
              if (onSaveNewPin) onSaveNewPin(pin);
              if (onClose) onClose();
            } else {
              triggerError("PINs do not match. Start over.");
              setStep("set");
            }
          }, 150);
        }
      }
    }
  };

  const handlePressDelete = () => {
    setErrorMsg("");
    if (step === "confirm") {
      setConfirmPin((prev) => prev.slice(0, -1));
    } else {
      setPin((prev) => prev.slice(0, -1));
    }
  };

  const handleClear = () => {
    setErrorMsg("");
    setPin("");
    setConfirmPin("");
  };

  const activeDigits = step === "confirm" ? confirmPin : pin;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] bg-slate-950 flex flex-col items-center justify-center p-4 min-h-[100dvh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={`w-full max-w-sm bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center space-y-6 relative ${
            isShaking ? "animate-shake" : ""
          }`}
        >
          {/* Close button if optional */}
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Header Branding */}
          <div className="flex flex-col items-center space-y-2">
            <div className="p-3.5 rounded-2xl bg-[#57f1db]/10 border border-[#57f1db]/20 text-[#57f1db] shadow-inner mb-1">
              <Lock className="w-7 h-7" />
            </div>
            <MindsyncLogo iconSize={24} showSlogan={false} textSize="sm" />
            <h2 className="text-xl font-bold text-white mt-2">
              {step === "enter" && "Security PIN Required"}
              {step === "set" && "Create a 4-Digit PIN"}
              {step === "confirm" && "Confirm Your 4-Digit PIN"}
            </h2>
            <p className="text-xs text-slate-400 max-w-xs">
              {step === "enter" && "Enter your 4-digit security code to unlock Mindsync."}
              {step === "set" && "Set a local passcode to keep your mental health logs private."}
              {step === "confirm" && "Re-enter the 4-digit passcode to verify."}
            </p>
          </div>

          {/* PIN Dots display */}
          <div className="flex items-center justify-center gap-4 py-2">
            {[0, 1, 2, 3].map((idx) => {
              const isFilled = activeDigits.length > idx;
              return (
                <motion.div
                  key={idx}
                  animate={{ scale: isFilled ? 1.15 : 1 }}
                  className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                    isFilled
                      ? "bg-[#57f1db] border-[#57f1db] shadow-[0_0_12px_rgba(87,241,219,0.5)]"
                      : "bg-slate-950 border-slate-700"
                  }`}
                />
              );
            })}
          </div>

          {/* Error Message */}
          {errorMsg ? (
            <p className="text-xs text-red-400 font-semibold min-h-[18px] animate-pulse">
              {errorMsg}
            </p>
          ) : (
            <p className="text-[11px] text-slate-500 min-h-[18px]">
              Default PIN is <span className="font-mono font-bold text-slate-300">1234</span> unless updated.
            </p>
          )}

          {/* Keypad Grid */}
          <div className="grid grid-cols-3 gap-3.5 w-full max-w-[260px] pt-1">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handlePressNumber(num)}
                className="h-13 rounded-2xl bg-slate-950/80 border border-slate-800 text-white font-bold text-lg hover:bg-slate-800 hover:border-slate-700 active:scale-95 transition-all cursor-pointer flex items-center justify-center shadow-sm"
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={handleClear}
              className="h-13 rounded-2xl bg-slate-950/40 border border-slate-800/80 text-slate-400 font-semibold text-xs hover:bg-slate-800 hover:text-white active:scale-95 transition-all cursor-pointer flex items-center justify-center"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => handlePressNumber("0")}
              className="h-13 rounded-2xl bg-slate-950/80 border border-slate-800 text-white font-bold text-lg hover:bg-slate-800 hover:border-slate-700 active:scale-95 transition-all cursor-pointer flex items-center justify-center shadow-sm"
            >
              0
            </button>
            <button
              type="button"
              onClick={handlePressDelete}
              className="h-13 rounded-2xl bg-slate-950/40 border border-slate-800/80 text-slate-400 hover:text-white active:scale-95 transition-all cursor-pointer flex items-center justify-center"
            >
              <Delete className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
