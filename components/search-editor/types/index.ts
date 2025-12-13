import type { Editor } from "@tiptap/react";
import type { OperatorKey } from "../utils";

export interface SearchEditorProps {
  authors?: string[];
  tags?: string[];
  onQueryChange?: (query: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export interface UseSearchEditorReturn {
  editor: Editor | null;
  menuState: MenuState;
  handlers: MenuHandlers;
}

export interface MenuState {
  isOpen: boolean;
  items: string[];
  selectedIndex: number;
  activeOperator: OperatorKey | null;
}

export interface MenuHandlers {
  onOperatorSelect: (op: OperatorKey) => void;
  onValueSelect: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}
