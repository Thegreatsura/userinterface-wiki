"use client";

import Document from "@tiptap/extension-document";
import History from "@tiptap/extension-history";
import Paragraph from "@tiptap/extension-paragraph";
import Placeholder from "@tiptap/extension-placeholder";
import Text from "@tiptap/extension-text";
import { EditorContent, useEditor } from "@tiptap/react";
import * as React from "react";
import { type OperatorKey, OperatorToken, ValueToken } from "./extensions";
import styles from "./styles.module.css";
import { serializeQuery } from "./utils/serializer";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface SearchEditorProps {
  authors?: string[];
  tags?: string[];
  onQueryChange?: (query: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const OPERATORS: OperatorKey[] = ["author", "tag", "sort"];

const OPERATOR_CONFIG: Record<string, { hint: string; example: string }> = {
  tag: { hint: "Filter by tag", example: "tag:animation" },
  author: { hint: "Filter by author", example: "author:John" },
  sort: { hint: "Sort results", example: "sort:oldest" },
};

const SORT_OPTIONS = ["newest", "oldest", "a-z", "z-a"];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Detect if the cursor is right after a typed operator (e.g., "author:")
 * Returns the operator key if found, null otherwise.
 */
function detectTypedOperator(text: string): OperatorKey | null {
  // Match operator at end of text, e.g., "author:" or "some text tag:"
  const match = text.match(/(?:^|\s)(author|tag|sort):$/i);
  if (match) {
    return match[1].toLowerCase() as OperatorKey;
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export function SearchEditor({
  authors = [],
  tags = [],
  onQueryChange,
  placeholder = "Search…",
  className,
  autoFocus = false,
}: SearchEditorProps) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [showMenu, setShowMenu] = React.useState(false);
  const [activeOperator, setActiveOperator] =
    React.useState<OperatorKey | null>(null);
  const containerRef = React.useRef<HTMLElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      Document,
      Paragraph,
      Text,
      History,
      Placeholder.configure({ placeholder }),
      OperatorToken,
      ValueToken,
    ],
    autofocus: autoFocus,
    editorProps: {
      attributes: { class: styles.editor },
    },
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      onQueryChange?.(serializeQuery(editor.getJSON()));

      // Detect if user just typed an operator (e.g., "author:")
      const typedOperator = detectTypedOperator(text);
      if (typedOperator) {
        setActiveOperator(typedOperator);
        setSelectedIndex(0);
        setShowMenu(false);
      } else if (text.length === 0) {
        // Show menu when editor becomes empty (e.g., after backspacing)
        setActiveOperator(null);
        setShowMenu(true);
        setSelectedIndex(0);
      } else {
        // Hide menu when typing other content
        setShowMenu(false);
        setActiveOperator(null);
      }
    },
    onFocus: () => {
      // Show menu when focusing empty editor
      if (!editor?.getText().length) {
        setShowMenu(true);
        setSelectedIndex(0);
      }
    },
    onBlur: () => {
      // Delay to allow click on menu items
      setTimeout(() => {
        setShowMenu(false);
        setActiveOperator(null);
      }, 150);
    },
  });

  // Get value options for the active operator
  const getValueOptions = React.useCallback(
    (op: OperatorKey | null): string[] => {
      switch (op) {
        case "author":
          return authors;
        case "tag":
          return tags;
        case "sort":
          return SORT_OPTIONS;
        default:
          return [];
      }
    },
    [authors, tags],
  );

  const valueOptions = getValueOptions(activeOperator);

  // Current items to display in menu
  const menuItems = activeOperator ? valueOptions : OPERATORS;

  // Handle selecting an operator
  const handleOperatorSelect = React.useCallback(
    (op: OperatorKey) => {
      editor?.chain().focus().insertOperator(op).run();
      setActiveOperator(op);
      setSelectedIndex(0);
    },
    [editor],
  );

  // Handle selecting a value
  const handleValueSelect = React.useCallback(
    (value: string) => {
      if (!editor || !activeOperator) return;

      const text = editor.getText();
      // Check if operator was typed (ends with "operator:")
      const typedMatch = text.match(
        new RegExp(`(^|\\s)(${activeOperator}):$`, "i"),
      );

      if (typedMatch) {
        // Replace the typed operator text with tokens
        const operatorStart = text.lastIndexOf(typedMatch[2]);
        const operatorLength = typedMatch[2].length + 1; // +1 for colon

        editor
          .chain()
          .focus()
          // Delete the typed operator text
          .deleteRange({
            from: operatorStart + 1, // +1 because ProseMirror is 1-indexed
            to: operatorStart + operatorLength + 1,
          })
          // Insert proper tokens
          .insertOperator(activeOperator)
          .insertValue(value)
          .insertContent(" ")
          .run();
      } else {
        // Operator was inserted as a token, just add the value
        editor.chain().focus().insertValue(value).insertContent(" ").run();
      }

      setActiveOperator(null);
      setShowMenu(false);
    },
    [editor, activeOperator],
  );

  // Keyboard navigation
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (!showMenu && !activeOperator) return;
      if (menuItems.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((i) => (i + 1) % menuItems.length);
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex(
            (i) => (i - 1 + menuItems.length) % menuItems.length,
          );
          break;
        case "Enter":
        case "Tab": {
          e.preventDefault();
          const item = menuItems[selectedIndex];
          if (item) {
            if (activeOperator) {
              handleValueSelect(item);
            } else {
              handleOperatorSelect(item as OperatorKey);
            }
          }
          break;
        }
        case "Escape":
          e.preventDefault();
          setShowMenu(false);
          setActiveOperator(null);
          break;
      }
    },
    [
      showMenu,
      activeOperator,
      menuItems,
      selectedIndex,
      handleOperatorSelect,
      handleValueSelect,
    ],
  );

  const hasContent = (editor?.getText().trim().length ?? 0) > 0;
  const isMenuOpen = showMenu || activeOperator !== null;

  return (
    <search
      ref={containerRef}
      className={className}
      data-search-editor=""
      onKeyDownCapture={handleKeyDown}
    >
      <EditorContent editor={editor} />

      {isMenuOpen && menuItems.length > 0 && (
        <div className={styles.menu} data-suggestion-menu="">
          <div className={styles.header}>
            <span className={styles.title}>
              {activeOperator ? `Select ${activeOperator}` : "SEARCH FILTERS"}
            </span>
            {!activeOperator && (
              <span className={styles.shortcuts}>
                <kbd>↑</kbd> <kbd>↓</kbd> to navigate · <kbd>Tab</kbd> to select
                · <kbd>Esc</kbd> to close
              </span>
            )}
          </div>
          <div className={styles.items}>
            {menuItems.map((item, index) => (
              <button
                key={item}
                type="button"
                className={styles.item}
                data-suggestion-item=""
                data-selected={index === selectedIndex}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  if (activeOperator) {
                    handleValueSelect(item);
                  } else {
                    handleOperatorSelect(item as OperatorKey);
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
              Use <code>-</code> to exclude: <code>-tag:draft</code> · Quotes
              for spaces: <code>author:"John Doe"</code>
            </div>
          )}
        </div>
      )}

      {hasContent && (
        <button
          type="button"
          className={styles.clear}
          onClick={() => {
            editor?.commands.clearContent();
            setActiveOperator(null);
            setShowMenu(true);
            setSelectedIndex(0);
          }}
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </search>
  );
}
