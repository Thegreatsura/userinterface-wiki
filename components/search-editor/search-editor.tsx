"use client";

import Document from "@tiptap/extension-document";
import History from "@tiptap/extension-history";
import Paragraph from "@tiptap/extension-paragraph";
import Placeholder from "@tiptap/extension-placeholder";
import Text from "@tiptap/extension-text";
import { EditorContent, useEditor } from "@tiptap/react";
import * as React from "react";
import { OperatorToken, ValueToken } from "./extensions";
import styles from "./styles.module.css";
import {
  OperatorSuggestion,
  type OperatorSuggestionRenderProps,
  useSuggestionFloating,
  ValueSuggestion,
  type ValueSuggestionRenderProps,
} from "./suggestions";
import { serializeQuery } from "./utils/serializer";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface SearchEditorProps {
  /** Available authors for autocomplete */
  authors?: string[];
  /** Available tags for autocomplete */
  tags?: string[];
  /** Callback when query changes */
  onQueryChange?: (query: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Additional class name */
  className?: string;
  /** Auto focus on mount */
  autoFocus?: boolean;
}

const OPERATOR_HINTS: Record<string, string> = {
  author: "Filter by author",
  tag: "Filter by tag",
  before: "Before date",
  after: "After date",
  during: "During year",
  sort: "Sort results",
};

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
  // Suggestion state
  const [operatorSuggestion, setOperatorSuggestion] =
    React.useState<OperatorSuggestionRenderProps | null>(null);
  const [valueSuggestion, setValueSuggestion] =
    React.useState<ValueSuggestionRenderProps | null>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [showOperatorsOnFocus, setShowOperatorsOnFocus] = React.useState(false);
  const [activeOperator, setActiveOperator] = React.useState<
    "author" | "tag" | "before" | "after" | "during" | "sort" | null
  >(null);
  const containerRef = React.useRef<HTMLElement>(null);

  // Available operators
  const operators: Array<
    "author" | "tag" | "before" | "after" | "during" | "sort"
  > = ["author", "tag", "before", "after", "during", "sort"];

  // Floating UI for suggestions
  const operatorFloating = useSuggestionFloating();
  const valueFloating = useSuggestionFloating();

  // Update floating position when suggestions change
  React.useEffect(() => {
    if (operatorSuggestion?.clientRect) {
      const rect = operatorSuggestion.clientRect();
      if (rect) operatorFloating.updatePosition(rect);
    }
  }, [operatorSuggestion, operatorFloating]);

  React.useEffect(() => {
    if (valueSuggestion?.clientRect) {
      const rect = valueSuggestion.clientRect();
      if (rect) valueFloating.updatePosition(rect);
    }
  }, [valueSuggestion, valueFloating]);

  // Previous items reference for comparison
  const prevOperatorItems = React.useRef(operatorSuggestion?.items);
  const prevValueItems = React.useRef(valueSuggestion?.items);

  // Reset selected index when suggestions change
  if (
    prevOperatorItems.current !== operatorSuggestion?.items ||
    prevValueItems.current !== valueSuggestion?.items
  ) {
    prevOperatorItems.current = operatorSuggestion?.items;
    prevValueItems.current = valueSuggestion?.items;
    if (selectedIndex !== 0) {
      setSelectedIndex(0);
    }
  }

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      Document,
      Paragraph,
      Text,
      History,
      Placeholder.configure({
        placeholder,
      }),
      OperatorToken,
      ValueToken,
      OperatorSuggestion.configure({
        operators: ["author", "tag", "before", "after", "during", "sort"],
        onRender: (props) => {
          if (props.items.length > 0) {
            setOperatorSuggestion(props);
          } else {
            setOperatorSuggestion(null);
          }
        },
        onHide: () => setOperatorSuggestion(null),
      }),
      ValueSuggestion.configure({
        authors,
        tags,
        sortOptions: ["newest", "oldest", "a-z", "z-a"],
        onRender: (props) => {
          if (props.items.length > 0) {
            setValueSuggestion(props);
          } else {
            setValueSuggestion(null);
          }
        },
        onHide: () => setValueSuggestion(null),
      }),
    ],
    autofocus: autoFocus,
    editorProps: {
      attributes: {
        class: styles.editor,
      },
    },
    onUpdate: ({ editor }) => {
      const query = serializeQuery(editor.getJSON());
      onQueryChange?.(query);
      // Hide focus menu when user starts typing
      if (editor.getText().length > 0) {
        setShowOperatorsOnFocus(false);
      }
    },
    onFocus: () => {
      // Show operators when focusing empty editor
      if (!editor?.getText().length) {
        setShowOperatorsOnFocus(true);
      }
    },
    onBlur: () => {
      // Delay to allow click on menu items
      setTimeout(() => {
        setShowOperatorsOnFocus(false);
      }, 150);
    },
  });

  // Get value suggestions based on active operator
  const getValueSuggestions = React.useCallback(
    (op: "author" | "tag" | "before" | "after" | "during" | "sort" | null) => {
      switch (op) {
        case "author":
          return authors;
        case "tag":
          return tags;
        case "sort":
          return ["newest", "oldest", "a-z", "z-a"];
        case "before":
        case "after":
        case "during":
          return ["2024", "2025", "last-week", "last-month", "last-year"];
        default:
          return [];
      }
    },
    [authors, tags],
  );

  // Current value options based on active operator
  const valueOptions = activeOperator ? getValueSuggestions(activeOperator) : [];

  // Handle selecting an operator from focus menu
  const handleOperatorSelect = React.useCallback(
    (op: "author" | "tag" | "before" | "after" | "during" | "sort") => {
      editor?.chain().focus().insertOperator(op).run();
      setShowOperatorsOnFocus(false);
      setActiveOperator(op);
      setSelectedIndex(0);
    },
    [editor],
  );

  // Handle selecting a value
  const handleValueSelect = React.useCallback(
    (value: string) => {
      editor?.chain().focus().insertValue(value).insertContent(" ").run();
      setActiveOperator(null);
    },
    [editor],
  );

  // Keyboard navigation for suggestions
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      // Determine active items
      const items = activeOperator
        ? valueOptions
        : showOperatorsOnFocus
          ? operators
          : operatorSuggestion?.items || [];

      if (items.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((i) => (i + 1) % items.length);
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((i) => (i - 1 + items.length) % items.length);
          break;
        case "Enter":
        case "Tab": {
          e.preventDefault();
          const selectedItem = items[selectedIndex];
          if (selectedItem) {
            if (activeOperator) {
              handleValueSelect(selectedItem);
            } else if (operatorSuggestion) {
              operatorSuggestion.command(
                selectedItem as "author" | "tag" | "before" | "after" | "during" | "sort",
              );
            } else {
              handleOperatorSelect(
                selectedItem as "author" | "tag" | "before" | "after" | "during" | "sort",
              );
            }
          }
          break;
        }
        case "Escape":
          e.preventDefault();
          setOperatorSuggestion(null);
          setValueSuggestion(null);
          setActiveOperator(null);
          setShowOperatorsOnFocus(false);
          break;
      }
    },
    [
      activeOperator,
      valueOptions,
      showOperatorsOnFocus,
      operatorSuggestion,
      selectedIndex,
      handleValueSelect,
      handleOperatorSelect,
    ],
  );

  const hasContent = (editor?.getText().trim().length ?? 0) > 0;

  // Get caret rect for positioning focus menu
  const getCaretRect = React.useCallback(() => {
    if (!containerRef.current) return null;
    const editorEl = containerRef.current.querySelector(`.${styles.editor}`);
    if (!editorEl) return null;
    return editorEl.getBoundingClientRect();
  }, []);

  // Update floating position for focus menu
  React.useEffect(() => {
    if (showOperatorsOnFocus) {
      const rect = getCaretRect();
      if (rect) {
        operatorFloating.updatePosition(
          new DOMRect(rect.left, rect.bottom, 0, 0),
        );
      }
    }
  }, [showOperatorsOnFocus, getCaretRect, operatorFloating]);

  // Determine which operator items to show
  const showOperatorMenu =
    !activeOperator &&
    (showOperatorsOnFocus ||
      (operatorSuggestion && operatorSuggestion.items.length > 0));
  const operatorItems = operatorSuggestion?.items || operators;

  // Determine which value items to show
  const showValueMenu =
    activeOperator ||
    (valueSuggestion && valueSuggestion.items.length > 0);
  const valueItems = activeOperator
    ? valueOptions
    : valueSuggestion?.items || [];

  return (
    <search
      ref={containerRef}
      className={className}
      data-search-editor=""
      onKeyDownCapture={handleKeyDown}
    >
      <EditorContent editor={editor} />

      {/* Operator Suggestions - shown on focus or while typing */}
      {showOperatorMenu && (
        <div className={styles.menu} data-suggestion-menu="">
          <div className={styles.header}>
            <span>Search Options</span>
            <button type="button" className={styles.help} aria-label="Help">
              ?
            </button>
          </div>
          {operatorItems.map((item, index) => (
            <button
              key={item}
              type="button"
              className={styles.item}
              data-suggestion-item=""
              data-selected={index === selectedIndex}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                if (operatorSuggestion) {
                  operatorSuggestion.command(item);
                } else {
                  handleOperatorSelect(item);
                }
              }}
            >
              <span className={styles.operator}>{item}:</span>
              <span className={styles.hint}>
                {OPERATOR_HINTS[item] || `Filter by ${item}`}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Value Suggestions */}
      {showValueMenu && valueItems.length > 0 && (
        <div className={styles.menu} data-suggestion-menu="">
          <div className={styles.header}>
            <span>Select {activeOperator || "value"}</span>
          </div>
          {valueItems.map((item, index) => (
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
                } else if (valueSuggestion) {
                  valueSuggestion.command(item);
                }
              }}
            >
              {item}
            </button>
          ))}
        </div>
      )}

      {/* Clear button */}
      {hasContent && (
        <button
          type="button"
          className={styles.clear}
          onClick={() => editor?.commands.clearContent()}
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </search>
  );
}
