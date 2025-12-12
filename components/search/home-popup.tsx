"use client";

import { clsx } from "clsx";
import { DayPicker } from "react-day-picker";

import type { FilterOption } from "./filter-options";
import styles from "./home.module.css";

// ─────────────────────────────────────────────────────────────────────────────
// Popup Header
// ─────────────────────────────────────────────────────────────────────────────

export function PopupHeader() {
  return (
    <div className={styles.popupheader}>
      <span className={styles.label}>Search Filters</span>
      <span className={styles.hint}>
        <kbd>↑</kbd> <kbd>↓</kbd> to navigate · <kbd>Tab</kbd> to select ·{" "}
        <kbd>Esc</kbd> to close
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Popup Footer
// ─────────────────────────────────────────────────────────────────────────────

export function PopupFooter() {
  return (
    <div className={styles.popupfooter}>
      <span className={styles.tip}>
        Use <code>-</code> to exclude: <code>-tag:draft</code> · Quotes for
        spaces: <code>author:"John Doe"</code>
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Filter Options List
// ─────────────────────────────────────────────────────────────────────────────

interface FilterOptionsListProps {
  options: FilterOption[];
  highlightedIndex: number;
  onSelect: (option: FilterOption) => void;
}

export function FilterOptionsList({
  options,
  highlightedIndex,
  onSelect,
}: FilterOptionsListProps) {
  return (
    <div className={styles.list}>
      {options.map((option, index) => (
        <button
          type="button"
          key={option.key}
          className={clsx(
            styles.option,
            index === highlightedIndex && styles.highlighted,
          )}
          onClick={() => onSelect(option)}
        >
          <span className={styles.optionkey}>{option.label}</span>
          <span className={styles.optiondesc}>{option.description}</span>
          {option.example && (
            <span className={styles.optionexample}>{option.example}</span>
          )}
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Value Suggestions List
// ─────────────────────────────────────────────────────────────────────────────

interface ValueSuggestionsListProps {
  type: "tags" | "authors" | "sort";
  items: string[];
  highlightedIndex: number;
  onSelect: (item: string) => void;
}

export function ValueSuggestionsList({
  type,
  items,
  highlightedIndex,
  onSelect,
}: ValueSuggestionsListProps) {
  const categoryLabel =
    type === "tags" ? "Tags" : type === "authors" ? "Authors" : "Sort Options";

  return (
    <>
      <div className={styles.category}>{categoryLabel}</div>
      <div className={styles.list}>
        {items.length === 0 ? (
          <div className={styles.empty}>No matches found</div>
        ) : (
          items.map((item, index) => (
            <button
              type="button"
              key={item}
              className={clsx(
                styles.option,
                index === highlightedIndex && styles.highlighted,
              )}
              onClick={() => onSelect(item)}
            >
              <span className={styles.optionkey}>{item}</span>
            </button>
          ))
        )}
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Date Picker Section
// ─────────────────────────────────────────────────────────────────────────────

interface DatePickerSectionProps {
  dateType: "before" | "after" | "during";
  isNegated: boolean;
  onSelect: (
    date: Date,
    dateType: "before" | "after" | "during",
    isNegated: boolean,
  ) => void;
}

export function DatePickerSection({
  dateType,
  isNegated,
  onSelect,
}: DatePickerSectionProps) {
  return (
    <div className={styles.datepicker}>
      <DayPicker
        mode="single"
        onSelect={(date) => {
          if (date) {
            onSelect(date, dateType, isNegated);
          }
        }}
      />
    </div>
  );
}
