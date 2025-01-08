import "../css/ItemSearchModal.css";
import ItemSearch from "./ItemSearch";
import SearchResult from "./SearchResult";
import { Item } from "../type/Item.ts";
import { useState, useEffect, useCallback } from "react";
import ColorPalette from "./ColorPalette.tsx";


export default function ItemSearchModal({
  slot,
  is_open,
  equiped_item,
  set_is_open,
  edit_equiped_item,
}: {
  slot: number;
  is_open: boolean;
  equiped_item: Item[];
  set_is_open: (is_open: boolean) => void;
  edit_equiped_item: (slot: number, item: Item) => void;
}) {
  const [search_result, set_search_result] = useState<Item[]>([]);
  const [keyword, set_keyword] = useState<string>("");
  const slots = [
    "머리 방어구",
    "몸통 방어구",
    "손 방어구",
    "다리 방어구",
    "발 방어구",
    "추가 옵션",
    "추가 옵션",
    "추가 옵션",
  ];

  const [selected_item, set_selected_item] = useState<Item>(equiped_item[slot]);
  const [is_item_select, set_is_item_select] = useState<boolean>(
    selected_item.Id !== 0
  );
  useEffect(() => {
    if (selected_item !== equiped_item[slot]) {
      set_selected_item(equiped_item[slot]);
    }
    if ((equiped_item[slot].Id! == 0) === is_item_select) {
      set_is_item_select(equiped_item[slot].Id !== 0);
    }
  }, [equiped_item, slot]);

  const select_item = useCallback((slot: number, item: Item) => {
    edit_equiped_item(slot, item);
    set_selected_item(item);
    set_is_item_select(true);
  }, []);


  const modal_close = () => {
    set_is_open(false);
    set_search_result([]);
    // set_is_item_select(false);
  };

  const reset_keyword = () => {
    set_keyword("");
  };

  if (!is_open) return;


  return (
    <div className="item-search-modal-back" onClick={modal_close}>
      <div
        className="item-search-modal"
        onClick={(e: React.MouseEvent<HTMLDivElement>) => {
          e.stopPropagation();
        }}
      >
        <span>{slots[slot]}</span>

        <ItemSearch
          keyword={keyword}
          set_keyword={set_keyword}
          set_search_result={set_search_result}
          set_is_item_select={set_is_item_select}
          slot={slot}
        />

        {!is_item_select && (
          <SearchResult
            slot={slot}
            search_result={search_result}
            edit_equiped_item={select_item}
            reset_keyword={reset_keyword}

          />
        )}
        {is_item_select && (
          <ColorPalette
            slot={slot}
            item={selected_item}
            edit_equiped_item={edit_equiped_item}
            modal_close={modal_close}
          />
        )}
      </div>
    </div>
  );
}
