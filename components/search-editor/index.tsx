"use client";

import { EditorContent } from "@tiptap/react";
import * as React from "react";
import { useSearchEditor } from "./hooks/use-search-editor";
import styles from "./styles.module.css";
import type { MenuHandlers, MenuState, SearchEditorProps } from "./types";
import type { OperatorKey } from "./utils";
import { OPERATOR_CONFIG } from "./utils/config";

export function SearchEditor({
  authors = [],
  tags = [],
  onQueryChange,
  placeholder = "Search…",
  className,
  autoFocus = false,
}: SearchEditorProps) {
  const { editor, menuState, handlers } = useSearchEditor({
    authors,
    tags,
    placeholder,
    autoFocus,
    onQueryChange,
  });

  return (
    <search
      className={className}
      data-search-editor=""
      onKeyDownCapture={handlers.onKeyDown}
    >
      <EditorContent editor={editor} />
      <SuggestionMenu state={menuState} handlers={handlers} />
    </search>
  );
}

interface SuggestionMenuProps {
  state: MenuState;
  handlers: MenuHandlers;
}

function SuggestionMenu({ state, handlers }: SuggestionMenuProps) {
  const { isOpen, items, selectedIndex, activeOperator } = state;
  const [shouldRender, setShouldRender] = React.useState(false);
  const [isExiting, setIsExiting] = React.useState(false);

  React.useEffect(() => {
    if (isOpen && items.length > 0) {
      setShouldRender(true);
      setIsExiting(false);
    } else if (shouldRender) {
      setIsExiting(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsExiting(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen, items.length, shouldRender]);

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      className={styles.menu}
      data-suggestion-menu=""
      data-exiting={isExiting}
    >
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
