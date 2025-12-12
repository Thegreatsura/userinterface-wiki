// ─────────────────────────────────────────────────────────────────────────────
// Search Component Library
// ─────────────────────────────────────────────────────────────────────────────
// A headless search component system inspired by Base UI's Combobox pattern.
// Provides composable primitives for building accessible search interfaces
// with filter chips, suggestions, and keyboard navigation.
//
// @example
// ```tsx
// import { Search } from "@/components/search";
//
// function MySearch() {
//   return (
//     <Search.Root pages={pages} allTags={tags}>
//       <Search.Input placeholder="Search..." />
//       <Search.Clear />
//       <Search.Popup>
//         <Search.Positioner sideOffset={8}>
//           <Search.List>
//             <Search.Empty>No results found</Search.Empty>
//             <Search.Item index={0} />
//           </Search.List>
//         </Search.Positioner>
//       </Search.Popup>
//     </Search.Root>
//   );
// }
// ```
// ─────────────────────────────────────────────────────────────────────────────

export type { SerializedChipNode } from "./chip-node";
// Re-export Lexical utilities
export { $createChipNode, $isChipNode, ChipNode } from "./chip-node";
export type { SearchActions, SearchState } from "./context";
// Re-export context hooks
export { useSearchContext } from "./context";
// Re-export filter options
export type { FilterOption } from "./filter-options";
export { FILTER_OPTIONS, SORT_OPTIONS } from "./filter-options";
// Re-export HomeSearch for convenience
export { HomeSearch } from "./home-search";

// Re-export types
export type {
  ChipPayload,
  SerializedPage,
  SortOrder,
  SuggestionResult,
} from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// Component Imports
// ─────────────────────────────────────────────────────────────────────────────

import { Chip, ChipRemove, Chips, Clear, Value } from "./clear";
import { Input } from "./input";
import { Empty, Group, GroupLabel, Item, List, Separator } from "./list";
import { Backdrop, Popup, Positioner } from "./popup";
import { Root } from "./root";

export type {
  ChipProps,
  ChipRemoveProps,
  ChipState,
  ChipsProps,
  ClearProps,
  ClearState,
  ValueProps,
} from "./clear";
export type { InputProps } from "./input";
export type {
  EmptyProps,
  GroupLabelProps,
  GroupProps,
  ItemProps,
  ListProps,
  SeparatorProps,
} from "./list";
export type { BackdropProps, PopupProps, PositionerProps } from "./popup";
// Re-export types for components
export type { RootProps } from "./root";

// ─────────────────────────────────────────────────────────────────────────────
// Search Namespace
// ─────────────────────────────────────────────────────────────────────────────

export const Search = {
  /**
   * The root provider component. Wraps all Search.* components.
   */
  Root,

  /**
   * The search input field powered by Lexical.
   * Supports filter chips inline with text.
   */
  Input,

  /**
   * A button that clears all filters and text.
   */
  Clear,

  /**
   * Displays the current search text value.
   */
  Value,

  /**
   * Container for external chip display.
   */
  Chips,

  /**
   * An individual chip representing a filter.
   */
  Chip,

  /**
   * A button to remove a chip.
   */
  ChipRemove,

  /**
   * The popup container for suggestions.
   */
  Popup,

  /**
   * Positions the popup relative to the input.
   */
  Positioner,

  /**
   * An overlay backdrop shown when popup is open.
   */
  Backdrop,

  /**
   * The list of suggestions.
   */
  List,

  /**
   * A suggestion item in the list.
   */
  Item,

  /**
   * A group of related items.
   */
  Group,

  /**
   * A label for a group.
   */
  GroupLabel,

  /**
   * A visual separator between items.
   */
  Separator,

  /**
   * Content shown when there are no results.
   */
  Empty,
} as const;
