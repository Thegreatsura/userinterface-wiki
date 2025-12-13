"use client";

import Document from "@tiptap/extension-document";
import History from "@tiptap/extension-history";
import Paragraph from "@tiptap/extension-paragraph";
import Placeholder from "@tiptap/extension-placeholder";
import Text from "@tiptap/extension-text";
import { useEditor } from "@tiptap/react";
import * as React from "react";

import type { UseSearchEditorReturn } from "../types";
import { type OperatorKey, OperatorToken, ValueToken } from "../utils";
import { detectTypedOperator, OPERATORS, SORT_OPTIONS } from "../utils/config";
import { serializeQuery } from "../utils/serializer";
import styles from "./styles.module.css";

interface UseSearchEditorOptions {
  authors: string[];
  tags: string[];
  placeholder: string;
  autoFocus: boolean;
  onQueryChange?: (query: string) => void;
}

export function useSearchEditor({
  authors,
  tags,
  placeholder,
  autoFocus,
  onQueryChange,
}: UseSearchEditorOptions): UseSearchEditorReturn {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [showMenu, setShowMenu] = React.useState(false);
  const [activeOperator, setActiveOperator] =
    React.useState<OperatorKey | null>(null);

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

      const typedOperator = detectTypedOperator(text);
      if (typedOperator) {
        setActiveOperator(typedOperator);
        setSelectedIndex(0);
        setShowMenu(false);
      } else if (text.length === 0) {
        setActiveOperator(null);
        setShowMenu(true);
        setSelectedIndex(0);
      } else {
        setShowMenu(false);
        setActiveOperator(null);
      }
    },
    onFocus: () => {
      if (!editor?.getText().length) {
        setShowMenu(true);
        setSelectedIndex(0);
      }
    },
    onBlur: () => {
      setTimeout(() => {
        setShowMenu(false);
        setActiveOperator(null);
      }, 150);
    },
  });

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

  const menuItems = activeOperator
    ? getValueOptions(activeOperator)
    : OPERATORS;

  const handleOperatorSelect = React.useCallback(
    (op: OperatorKey) => {
      editor?.chain().focus().insertOperator(op).run();
      setActiveOperator(op);
      setSelectedIndex(0);
    },
    [editor],
  );

  const handleValueSelect = React.useCallback(
    (value: string) => {
      if (!editor || !activeOperator) return;

      const text = editor.getText();
      const typedMatch = text.match(
        new RegExp(`(^|\\s)(${activeOperator}):$`, "i"),
      );

      if (typedMatch) {
        const operatorStart = text.lastIndexOf(typedMatch[2]);
        const operatorLength = typedMatch[2].length + 1;

        editor
          .chain()
          .focus()
          .deleteRange({
            from: operatorStart + 1,
            to: operatorStart + operatorLength + 1,
          })
          .insertOperator(activeOperator)
          .insertValue(value)
          .insertContent(" ")
          .run();
      } else {
        editor.chain().focus().insertValue(value).insertContent(" ").run();
      }

      setActiveOperator(null);
      setShowMenu(false);
    },
    [editor, activeOperator],
  );

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

  return {
    editor,
    menuState: {
      isOpen: showMenu || activeOperator !== null,
      items: menuItems,
      selectedIndex,
      activeOperator,
    },
    handlers: {
      onOperatorSelect: handleOperatorSelect,
      onValueSelect: handleValueSelect,
      onKeyDown: handleKeyDown,
    },
  };
}
