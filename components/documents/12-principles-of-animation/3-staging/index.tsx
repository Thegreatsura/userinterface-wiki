"use client";

import { Dialog } from "@base-ui/react/dialog";
import type { Variants } from "motion/react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import type { ComponentProps, ReactNode, RefObject } from "react";
import { useEffect, useRef } from "react";
import { create } from "zustand";
import {
  Bell2Icon,
  DotGrid1X3HorizontalIcon,
  SquareBehindSquare2Icon,
} from "@/icons";
import styles from "./styles.module.css";

// ============================================================================
// Types
// ============================================================================

type WalletState = "collapsed" | "expanded" | "customize" | "editNickname";

interface Wallet {
  id: string;
  name: string;
  balance: number;
  address: string;
  color: string;
}

interface WalletStore {
  wallet: Wallet;
  state: WalletState;
  setName: (name: string) => void;
  setColor: (color: string) => void;
  setState: (state: WalletState) => void;
  reset: () => void;
  copyAddress: () => void;
  handleDone: () => void;
  handleToggle: () => void;
  handleSave: () => void;
}

// ============================================================================
// Constants
// ============================================================================

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
] as const;

const STATE_CONFIG: Record<WalletState, { label: string; next?: WalletState }> =
  {
    collapsed: { label: "" },
    expanded: { label: "Customize", next: "customize" },
    customize: { label: "Edit Nickname", next: "editNickname" },
    editNickname: { label: "Done", next: "customize" },
  };

const LAYOUT_ID = {
  wallet: "wallet",
  topTrailing: "top-trailing",
  bottomTrailing: "bottom-trailing",
  topLeading: "top-leading",
  bottomLeading: "bottom-leading",
} as const;

const VARIANTS = {
  blur: {
    hidden: { filter: "blur(10px)" },
    visible: { filter: "blur(0px)" },
  },
  picker: {
    hidden: { opacity: 0, translateY: 32, filter: "blur(12px)", scale: 0.9 },
    visible: { opacity: 1, filter: "blur(0px)", translateY: 0, scale: 1 },
    exit: {
      opacity: 0,
      translateY: 32,
      scale: 0,
      filter: "blur(12px)",
      transition: { duration: 0.2 },
    },
  },
} as const satisfies Record<string, Variants>;

// ============================================================================
// Store
// ============================================================================

const useWalletStore = create<WalletStore>()((set, get) => ({
  wallet: {
    id: "1",
    name: "Raphael",
    balance: 57_206,
    address: "0x1234567890abcdef1234567890abcdef12345678",
    color: COLORS[10],
  },
  state: "collapsed",

  setName: (name) => set((s) => ({ wallet: { ...s.wallet, name } })),
  setColor: (color) => set((s) => ({ wallet: { ...s.wallet, color } })),
  setState: (state) => set({ state }),
  reset: () => set({ state: "collapsed" }),

  copyAddress: () => navigator.clipboard.writeText(get().wallet.address),

  handleDone: () => {
    const { state, wallet } = get();
    const { next } = STATE_CONFIG[state];
    if (state === "editNickname" && next) set({ state: next });
    if (!wallet.name.trim())
      set((s) => ({ wallet: { ...s.wallet, name: "New Wallet" } }));
  },

  handleToggle: () => {
    const { state, handleDone } = get();
    if (state === "editNickname") handleDone();
    else if (STATE_CONFIG[state].next) set({ state: STATE_CONFIG[state].next });
  },

  handleSave: () => set({ state: "expanded" }),
}));

// ============================================================================
// Selectors
// ============================================================================

const selectIsEditing = (s: WalletStore) => s.state === "editNickname";
const selectIsCustomizing = (s: WalletStore) => s.state === "customize";
const selectIsExpanded = (s: WalletStore) => s.state !== "collapsed";
const selectBg = (s: WalletStore) => `var(${s.wallet.color})`;
const selectLabel = (s: WalletStore) => STATE_CONFIG[s.state].label;

// ============================================================================
// Utils
// ============================================================================

const formatCurrency = (value: number) =>
  value.toLocaleString("en-US", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  });

// ============================================================================
// Components
// ============================================================================

interface WalletCardProps extends ComponentProps<typeof motion.div> {
  inputRef?: RefObject<HTMLInputElement | null>;
  actions: ReactNode;
}

function WalletCard({ inputRef, actions, style, ...props }: WalletCardProps) {
  const wallet = useWalletStore((s) => s.wallet);
  const setName = useWalletStore((s) => s.setName);
  const handleDone = useWalletStore((s) => s.handleDone);
  const isEditing = useWalletStore(selectIsEditing);
  const bg = useWalletStore(selectBg);

  return (
    <motion.div
      className={styles.wallet}
      layoutId={LAYOUT_ID.wallet}
      style={{ background: bg, ...style }}
      {...props}
    >
      <div className={styles.column}>
        <motion.div layoutId={LAYOUT_ID.topTrailing} className={styles.icon}>
          <Bell2Icon className={styles.shape} color="var(--white-a12)" />
        </motion.div>
        <motion.span
          layoutId={LAYOUT_ID.bottomTrailing}
          className={styles.details}
        >
          <input
            ref={inputRef}
            data-text="primary"
            className={styles.text}
            type="text"
            value={wallet.name}
            onChange={(e) => setName(e.target.value)}
            disabled={!isEditing}
            placeholder="Wallet Name"
            onBlur={handleDone}
            onKeyDown={(e) => e.key === "Enter" && handleDone()}
          />
          <motion.p
            data-text="secondary"
            className={styles.text}
            animate={{ opacity: isEditing ? 0.5 : 1 }}
          >
            {formatCurrency(wallet.balance)}
          </motion.p>
        </motion.span>
      </div>
      <div className={styles.column}>{actions}</div>
    </motion.div>
  );
}

function WalletTrigger() {
  const isOpen = useWalletStore(selectIsExpanded);
  const setState = useWalletStore((s) => s.setState);

  return (
    <AnimatePresence initial={false} mode="popLayout">
      {!isOpen && (
        <Dialog.Trigger
          nativeButton={false}
          onClick={() => setState("expanded")}
          style={{ cursor: "pointer" }}
          render={
            <WalletCard
              whileHover={{ scale: 0.98, opacity: 0.8 }}
              whileTap={{ scale: 0.95 }}
              style={{ width: 200 }}
              actions={
                <>
                  <motion.div
                    variants={VARIANTS.blur}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    whileHover={{ scale: 0.98 }}
                    whileTap={{ scale: 0.95 }}
                    className={styles.options}
                    layoutId={LAYOUT_ID.topLeading}
                  >
                    <DotGrid1X3HorizontalIcon color="var(--white-a12)" />
                  </motion.div>
                  <motion.div
                    layout
                    layoutId={LAYOUT_ID.bottomLeading}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0, filter: "blur(10px)" }}
                    exit={{ opacity: 0 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "fit-content",
                      height: 32,
                      padding: "0 16px",
                      color: "var(--white-a10)",
                      background: "var(--white-a4)",
                      borderRadius: 100,
                    }}
                  >
                    <motion.p
                      className={styles.text}
                      variants={VARIANTS.blur}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                    >
                      {STATE_CONFIG.expanded.label}
                    </motion.p>
                  </motion.div>
                </>
              }
            />
          }
        />
      )}
    </AnimatePresence>
  );
}

function WalletColorPicker() {
  const wallet = useWalletStore((s) => s.wallet);
  const setColor = useWalletStore((s) => s.setColor);
  const handleSave = useWalletStore((s) => s.handleSave);
  const bg = useWalletStore(selectBg);

  return (
    <motion.div
      className={styles.picker}
      key="picker"
      variants={VARIANTS.picker}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className={styles.swatch}>
        {COLORS.map((c) => (
          <motion.div
            key={c}
            className={styles.color}
            style={{ background: `var(${c})` }}
            onClick={() => setColor(c)}
            whileHover={{ opacity: 0.8 }}
            data-selected={wallet.color === c}
          />
        ))}
      </div>
      <motion.div
        onClick={handleSave}
        whileHover={{ scale: 0.98, opacity: 0.8 }}
        whileTap={{ scale: 0.95 }}
        style={{ background: bg }}
        className={styles.save}
      >
        Save
      </motion.div>
    </motion.div>
  );
}

function WalletPopup() {
  const inputRef = useRef<HTMLInputElement>(null);

  const copyAddress = useWalletStore((s) => s.copyAddress);
  const handleToggle = useWalletStore((s) => s.handleToggle);

  const isEditing = useWalletStore(selectIsEditing);
  const isCustomizing = useWalletStore(selectIsCustomizing);
  const bg = useWalletStore(selectBg);
  const label = useWalletStore(selectLabel);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      const len = inputRef.current.value.length;
      inputRef.current.setSelectionRange(len, len);
    }
  }, [isEditing]);

  return (
    <Dialog.Popup
      render={
        <div className={styles.popup}>
          <AnimatePresence mode="popLayout">
            {isCustomizing && <WalletColorPicker />}
          </AnimatePresence>

          <WalletCard
            inputRef={inputRef}
            style={{ width: 400 }}
            actions={
              <>
                <motion.div
                  variants={VARIANTS.blur}
                  initial="hidden"
                  animate={{
                    ...VARIANTS.blur.visible,
                    opacity: isEditing ? 0.5 : 1,
                  }}
                  exit="hidden"
                  whileHover={{ scale: 0.98 }}
                  whileTap={{ scale: 0.95 }}
                  layoutId={LAYOUT_ID.topLeading}
                  className={styles.copy}
                  onClick={copyAddress}
                >
                  <p data-text="primary" className={styles.text}>
                    Copy Address
                  </p>
                  <SquareBehindSquare2Icon
                    strokeWidth={3}
                    className={styles.symbol}
                  />
                </motion.div>
                <motion.div
                  layout
                  layoutId={LAYOUT_ID.bottomLeading}
                  className={styles.customize}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0 }}
                  whileHover={{ scale: 0.98, opacity: 0.8 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    color: isEditing ? bg : "var(--white-a10)",
                    background: isEditing
                      ? "var(--white-a12)"
                      : "var(--white-a4)",
                    borderRadius: 100,
                  }}
                  onClick={handleToggle}
                >
                  <motion.p
                    key={label}
                    className={styles.text}
                    variants={VARIANTS.blur}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    {label}
                  </motion.p>
                </motion.div>
              </>
            }
          />
        </div>
      }
    />
  );
}

// ============================================================================
// Main
// ============================================================================

export function Staging() {
  const isExpanded = useWalletStore(selectIsExpanded);
  const reset = useWalletStore((s) => s.reset);

  return (
    <div>
      <MotionConfig transition={{ type: "spring", bounce: 0, duration: 0.5 }}>
        <Dialog.Root
          open={isExpanded}
          onOpenChange={(open) => !open && reset()}
        >
          <WalletTrigger />

          <Dialog.Portal keepMounted>
            <Dialog.Backdrop className={styles.backdrop} />

            <AnimatePresence initial={false} mode="wait">
              {isExpanded && <WalletPopup />}
            </AnimatePresence>
          </Dialog.Portal>
        </Dialog.Root>
      </MotionConfig>
    </div>
  );
}
