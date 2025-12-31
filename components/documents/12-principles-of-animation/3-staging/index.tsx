"use client";

import { Dialog } from "@base-ui/react/dialog";
import { CopyIcon, EllipsisIcon } from "lucide-react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Bell2Icon } from "@/icons";
import styles from "./styles.module.css";

enum WalletState {
  Collapsed = "collapsed",
  Expanded = "expanded",
  Customize = "customize",
  EditNickname = "editNickname",
}

interface Wallet {
  id: string;
  name: string;
  balance: number;
  address: string;
  color: string;
}

const COLORS = [
  "--family-wallet-redPink",
  "--family-wallet-pink",
  "--family-wallet-purple",
  "--family-wallet-darkPurple",
  "--family-wallet-bluePurple",
  "--family-wallet-darkBlue",
  "--family-wallet-seaBlue",
  "--family-wallet-blue",
  "--family-wallet-emerald",
  "--family-wallet-grassGreen",
  "--family-wallet-green",
  "--family-wallet-lime",
  "--family-wallet-offYellow",
  "--family-wallet-orange",
  "--family-wallet-burntOrange",
  "--family-wallet-red",
  "--family-wallet-yellowBrown",
  "--family-wallet-copper",
  "--family-wallet-navy",
  "--family-wallet-black",
];

export function Staging() {
  const nameInputRef = useRef<HTMLInputElement>(null);

  const [state, setState] = useState<WalletState>(WalletState.Collapsed);
  const [isOpen, setIsOpen] = useState(false);

  const [wallet, setWallet] = useState<Wallet>({
    id: "1",
    name: "Raphael",
    balance: 57_206,
    address: "0x1234567890abcdef1234567890abcdef12345678",
    color: COLORS[10],
  });

  const isEdit = state === WalletState.EditNickname;
  const isCustomize = state === WalletState.Customize;
  const handleDone = () => {
    setState(WalletState.Customize);
    if (wallet.name.trim() === "") {
      setWallet({ ...wallet, name: "New Wallet" });
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setState(WalletState.Collapsed);
    }
  }, [isOpen]);

  function family(color: string) {
    return `var(${color})`;
  }

  useEffect(() => {
    if (state === WalletState.EditNickname && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
      const length = nameInputRef.current.value.length;
      nameInputRef.current.setSelectionRange(length, length);
    }
  }, [state]);

  return (
    <div>
      <MotionConfig
        transition={{
          ease: [0.19, 1, 0.22, 1],
          duration: 0.4,
        }}
      >
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
          <AnimatePresence initial={false} mode="popLayout">
            {!isOpen && (
              <Dialog.Trigger
                className={styles.Button}
                onClick={() => setState(WalletState.Expanded)}
                style={{ cursor: "pointer" }}
                render={
                  <motion.div
                    className={styles.wallet}
                    layoutId="wallet"
                    whileHover={{
                      scale: 0.98,
                      opacity: 0.8,
                    }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      background: `var(${wallet.color})`,
                      width: 200,
                    }}
                  >
                    <div className={styles.column}>
                      <motion.div
                        layoutId="top-trailing"
                        className={styles.icon}
                      >
                        <Bell2Icon
                          className={styles.shape}
                          color="var(--white-a12)"
                        />
                      </motion.div>

                      <motion.span
                        layoutId="bottom-trailing"
                        className={styles.details}
                      >
                        <input
                          data-text="primary"
                          className={styles.text}
                          type="text"
                          value={wallet.name}
                          onChange={(e) =>
                            setWallet({ ...wallet, name: e.target.value })
                          }
                          onSubmit={handleDone}
                          disabled={!isEdit}
                        />
                        <div data-text="secondary" className={styles.text}>
                          {wallet.balance.toLocaleString("en-US", {
                            style: "currency",
                            currency: "EUR",
                            minimumFractionDigits: 0,
                          })}
                        </div>
                      </motion.span>
                    </div>

                    <div className={styles.column}>
                      <motion.div
                        initial={{ filter: "blur(10px)" }}
                        animate={{ filter: "blur(0px)" }}
                        exit={{ filter: "blur(10px)" }}
                        whileHover={{ scale: 0.98 }}
                        whileTap={{ scale: 0.95 }}
                        className={styles.options}
                        layoutId="top-leading"
                      >
                        <EllipsisIcon color="var(--white-a12)" />
                      </motion.div>

                      <motion.div
                        layout
                        layoutId="bottom-leading"
                        className={styles.customize}
                        initial={{ opacity: 0, filter: "blur(10px)" }}
                        animate={{ opacity: 0, filter: "blur(10px)" }}
                        exit={{ opacity: 0, filter: "blur(10px)" }}
                        style={{
                          color: isEdit
                            ? family(wallet.color)
                            : "var(--white-a10)",
                          background: isEdit
                            ? "var(--white-a12)"
                            : "var(--white-a4)",
                          borderRadius: 100,
                        }}
                        onClick={() => {
                          switch (state) {
                            case WalletState.Expanded:
                              setState(WalletState.Customize);
                              break;
                            case WalletState.Customize:
                              setState(WalletState.EditNickname);
                              break;
                            case WalletState.EditNickname:
                              setState(WalletState.Customize);
                              break;
                          }
                        }}
                      >
                        <motion.p
                          key={state}
                          className={styles.text}
                          initial={{ filter: "blur(10px)" }}
                          animate={{ filter: "blur(0px)" }}
                          exit={{ filter: "blur(10px)" }}
                        >
                          {state === WalletState.EditNickname && "Done"}
                          {state === WalletState.Expanded && "Customize"}
                          {state === WalletState.Customize && "Edit Nickname"}
                        </motion.p>
                      </motion.div>
                    </div>
                  </motion.div>
                }
              />
            )}
          </AnimatePresence>

          <Dialog.Portal keepMounted>
            <Dialog.Backdrop className={styles.backdrop} />

            <AnimatePresence initial={false} mode="wait">
              {state !== WalletState.Collapsed && (
                <Dialog.Popup
                  render={
                    <div className={styles.popup}>
                      <AnimatePresence mode="popLayout">
                        {isCustomize && (
                          <motion.div
                            className={styles.picker}
                            key="color-picker"
                            initial={{
                              opacity: 0,
                              translateY: 32,
                              filter: "blur(12px)",
                              scale: 0.9,
                            }}
                            animate={{
                              opacity: 1,
                              filter: "blur(0px)",
                              translateY: 0,
                              scale: 1,
                            }}
                            exit={{
                              opacity: 0,
                              translateY: 32,
                              scale: 0.0,
                              filter: "blur(12px)",
                              transition: { duration: 0.2 },
                            }}
                          >
                            <div className={styles.swatch}>
                              {COLORS.map((color) => (
                                <motion.div
                                  key={color}
                                  className={styles.color}
                                  style={{ background: `var(${color})` }}
                                  onClick={() =>
                                    setWallet({ ...wallet, color })
                                  }
                                  whileHover={{
                                    opacity: 0.8,
                                  }}
                                  data-selected={
                                    wallet.color === color ? "true" : "false"
                                  }
                                />
                              ))}
                            </div>
                            <motion.div
                              onClick={() => {
                                setState(WalletState.Expanded);
                                setIsOpen(false);
                              }}
                              whileHover={{ scale: 0.98, opacity: 0.8 }}
                              whileTap={{ scale: 0.95 }}
                              style={{
                                background: `var(${wallet.color})`,
                              }}
                              className={styles.save}
                            >
                              Save
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <motion.button
                        style={{
                          width: 400,
                          background: `var(${wallet.color})`,
                        }}
                        className={styles.wallet}
                        layoutId="wallet"
                      >
                        <div className={styles.column}>
                          <motion.div
                            layoutId="top-trailing"
                            className={styles.icon}
                          >
                            <Bell2Icon
                              className={styles.shape}
                              color="var(--white-a12)"
                            />
                          </motion.div>

                          <motion.span
                            layoutId="bottom-trailing"
                            className={styles.details}
                          >
                            <input
                              ref={nameInputRef}
                              data-text="primary"
                              className={styles.text}
                              type="text"
                              value={wallet.name}
                              onChange={(e) =>
                                setWallet({ ...wallet, name: e.target.value })
                              }
                              onSubmit={handleDone}
                              disabled={!isEdit}
                              placeholder="Wallet Name"
                              onBlur={() => {
                                if (wallet.name.trim() === "") {
                                  setWallet({ ...wallet, name: "New Wallet" });
                                }
                              }}
                              // on enter
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleDone();
                                }
                              }}
                            />
                            <motion.p
                              data-text="secondary"
                              className={styles.text}
                              animate={{ opacity: isEdit ? 0.5 : 1 }}
                            >
                              {wallet.balance.toLocaleString("en-US", {
                                style: "currency",
                                currency: "EUR",
                                minimumFractionDigits: 0,
                              })}
                            </motion.p>
                          </motion.span>
                        </div>

                        <div className={styles.column}>
                          <motion.div
                            initial={{ filter: "blur(10px)" }}
                            animate={{
                              filter: "blur(0px)",
                              opacity: isEdit ? 0.5 : 1,
                            }}
                            exit={{ filter: "blur(10px)" }}
                            whileHover={{ scale: 0.98 }}
                            whileTap={{ scale: 0.95 }}
                            layoutId="top-leading"
                            className={styles.copy}
                            onClick={() =>
                              navigator.clipboard.writeText(wallet.address)
                            }
                          >
                            <p data-text="primary" className={styles.text}>
                              Copy Address
                            </p>
                            <CopyIcon
                              strokeWidth={3}
                              className={styles.symbol}
                            />
                          </motion.div>

                          <motion.div
                            layout
                            layoutId="bottom-leading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className={styles.customize}
                            whileHover={{ scale: 0.98, opacity: 0.8 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                              color: isEdit
                                ? family(wallet.color)
                                : "var(--white-a10)",
                              background: isEdit
                                ? "var(--white-a12)"
                                : "var(--white-a4)",
                              borderRadius: 100,
                            }}
                            onClick={() => {
                              switch (state) {
                                case WalletState.Expanded:
                                  setState(WalletState.Customize);
                                  break;
                                case WalletState.Customize:
                                  setState(WalletState.EditNickname);
                                  break;
                                case WalletState.EditNickname:
                                  setState(WalletState.Customize);
                                  break;
                              }
                            }}
                          >
                            <motion.p
                              key={state}
                              className={styles.text}
                              initial={{ filter: "blur(10px)" }}
                              animate={{ filter: "blur(0px)" }}
                              exit={{ filter: "blur(10px)" }}
                            >
                              {state === WalletState.EditNickname && "Done"}
                              {state === WalletState.Expanded && "Customize"}
                              {state === WalletState.Customize &&
                                "Edit Nickname"}
                            </motion.p>
                          </motion.div>
                        </div>
                      </motion.button>
                    </div>
                  }
                />
              )}
            </AnimatePresence>
          </Dialog.Portal>
        </Dialog.Root>
      </MotionConfig>
    </div>
  );
}
