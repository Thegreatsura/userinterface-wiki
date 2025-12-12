import { Extension } from "@tiptap/core";
import { PluginKey } from "@tiptap/pm/state";
import Suggestion from "@tiptap/suggestion";

import type { OperatorKey } from "../extensions/operator-token";

export interface OperatorSuggestionOptions {
  operators: OperatorKey[];
  onRender: (props: OperatorSuggestionRenderProps) => void;
  onHide: () => void;
}

export interface OperatorSuggestionRenderProps {
  items: OperatorKey[];
  command: (item: OperatorKey) => void;
  clientRect: (() => DOMRect | null) | null;
}

export const OperatorSuggestionPluginKey = new PluginKey("operatorSuggestion");

export const OperatorSuggestion = Extension.create<OperatorSuggestionOptions>({
  name: "operatorSuggestion",

  addOptions() {
    return {
      operators: ["author", "tag", "before", "after", "during", "sort"],
      onRender: () => {},
      onHide: () => {},
    };
  },

  addProseMirrorPlugins() {
    const { operators, onRender, onHide } = this.options;

    return [
      Suggestion({
        editor: this.editor,
        pluginKey: OperatorSuggestionPluginKey,
        char: "",
        startOfLine: false,
        allowSpaces: false,
        allowedPrefixes: null, // Allow suggestion after any character

        items: ({ query }) => {
          const text = query.toLowerCase();

          // Don't show if already has a colon (operator is complete)
          if (text.includes(":")) return [];

          // Show all operators when empty (on focus/click), or filter by query
          if (text.length === 0) return operators;

          return operators.filter((op) => op.toLowerCase().startsWith(text));
        },

        render: () => {
          return {
            onStart: (props) => {
              onRender({
                items: props.items as OperatorKey[],
                command: (item) => {
                  props.command({ id: item });
                },
                clientRect: props.clientRect ?? null,
              });
            },
            onUpdate: (props) => {
              onRender({
                items: props.items as OperatorKey[],
                command: (item) => {
                  props.command({ id: item });
                },
                clientRect: props.clientRect ?? null,
              });
            },
            onKeyDown: (props) => {
              if (props.event.key === "Escape") {
                onHide();
                return true;
              }
              return false;
            },
            onExit: () => {
              onHide();
            },
          };
        },

        command: ({ editor, range, props }) => {
          const operatorKey = props.id as OperatorKey;

          editor
            .chain()
            .focus()
            .deleteRange(range)
            .insertOperator(operatorKey)
            .insertContent(" ")
            .run();
        },
      }),
    ];
  },
});
