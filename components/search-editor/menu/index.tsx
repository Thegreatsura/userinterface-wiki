import styles from "../styles.module.css";
import type { MenuHandlers, MenuState } from "../types";
import type { OperatorKey } from "../utils";
import { OPERATOR_CONFIG } from "../utils/config";

interface SuggestionMenuProps {
  state: MenuState;
  handlers: MenuHandlers;
}

export function SuggestionMenu({ state, handlers }: SuggestionMenuProps) {
  const { isOpen, items, selectedIndex, activeOperator } = state;

  if (!isOpen || items.length === 0) {
    return null;
  }

  return (
    <div className={styles.menu} data-suggestion-menu="">
      <div className={styles.header}>
        <span className={styles.title}>
          {activeOperator ? `Select ${activeOperator}` : "SEARCH FILTERS"}
        </span>
        {!activeOperator && (
          <span className={styles.shortcuts}>
            <kbd>↑</kbd> <kbd>↓</kbd> to navigate · <kbd>Tab</kbd> to select ·{" "}
            <kbd>Esc</kbd> to close
          </span>
        )}
      </div>

      <div className={styles.items}>
        {items.map((item, index) => (
          <button
            key={item}
            type="button"
            className={styles.item}
            data-suggestion-item=""
            data-selected={index === selectedIndex}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              if (activeOperator) {
                handlers.onValueSelect(item);
              } else {
                handlers.onOperatorSelect(item as OperatorKey);
              }
            }}
          >
            {activeOperator ? (
              item
            ) : (
              <>
                <span className={styles.left}>
                  <span className={styles.operator}>{item}:</span>
                  <span className={styles.hint}>
                    {OPERATOR_CONFIG[item as OperatorKey]?.hint}
                  </span>
                </span>
                <span className={styles.example}>
                  {OPERATOR_CONFIG[item as OperatorKey]?.example}
                </span>
              </>
            )}
          </button>
        ))}
      </div>

      {!activeOperator && (
        <div className={styles.footer}>
          Use <code>-</code> to exclude: <code>-tag:draft</code> · Quotes for
          spaces: <code>author:"John Doe"</code>
        </div>
      )}
    </div>
  );
}
