import { Extension } from "@tiptap/core";
import { PluginKey } from "@tiptap/pm/state";
import Suggestion from "@tiptap/suggestion";

import type { OperatorKey } from "./operator-token";

export interface ValueSuggestionOptions {
  authors: string[];
  tags: string[];
  sortOptions: string[];
  onRender: (props: ValueSuggestionRenderProps) => void;
  onHide: () => void;
}

export interface ValueSuggestionRenderProps {
  items: string[];
  operatorContext: OperatorKey | null;
  command: (item: string) => void;
  clientRect: (() => DOMRect | null) | null;
}

export const ValueSuggestionPluginKey = new PluginKey("valueSuggestion");

export const ValueSuggestion = Extension.create<ValueSuggestionOptions>({
  name: "valueSuggestion",

  addOptions() {
    return {
      authors: [],
      tags: [],
      sortOptions: ["newest", "oldest", "a-z", "z-a"],
      onRender: () => {},
      onHide: () => {},
    };
  },

  addProseMirrorPlugins() {
    const { authors, tags, sortOptions, onRender, onHide } = this.options;

    return [
      Suggestion({
        editor: this.editor,
        pluginKey: ValueSuggestionPluginKey,
        char: ":",
        startOfLine: false,
        allowSpaces: false,
        allowedPrefixes: null,

        items: ({ query, editor }) => {
          // Get the text before the colon to determine which operator was typed
          const state = editor.state;
          const { from } = state.selection;

          // Look backwards to find the operator before the colon
          let operatorText = "";
          const doc = state.doc;
          const beforePos = from - query.length - 1; // -1 for the colon

          // Get text from start of line or paragraph to the colon
          let nodeStart = 0;
          doc.nodesBetween(0, beforePos, (node, pos) => {
            if (node.isTextblock) {
              nodeStart = pos + 1;
            }
          });

          const textBefore = doc.textBetween(nodeStart, beforePos, " ");
          const words = textBefore.trim().split(/\s+/);
          operatorText = words[words.length - 1]?.toLowerCase() || "";

          const q = query.toLowerCase();

          switch (operatorText) {
            case "author":
              return authors.filter((a) => a.toLowerCase().includes(q));
            case "tag":
              return tags.filter((t) => t.toLowerCase().includes(q));
            case "sort":
              return sortOptions.filter((s) => s.toLowerCase().includes(q));
            case "before":
            case "after":
            case "during":
              // Return date format hints
              return [
                "2024",
                "2025",
                "last-week",
                "last-month",
                "last-year",
              ].filter((d) => d.includes(q));
            default:
              return [];
          }
        },

        render: () => {
          return {
            onStart: (props) => {
              onRender({
                items: props.items as string[],
                operatorContext: null,
                command: (item) => {
                  props.command({ id: item });
                },
                clientRect: props.clientRect ?? null,
              });
            },
            onUpdate: (props) => {
              onRender({
                items: props.items as string[],
                operatorContext: null,
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
          const value = props.id as string;

          editor
            .chain()
            .focus()
            .deleteRange(range)
            .insertValue(value)
            .insertContent(" ")
            .run();
        },
      }),
    ];
  },
});
