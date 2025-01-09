import { useState } from "react";
import filtered_item_list from "../json/filtered_items.json";
import equip_slot_categories from "../json/equip_slot_categories.json";
import { Item } from "../type/Item.ts";
import { EquipSlot } from "../type/EquipSlot.ts";
import Hangul from "hangul-js";

export default function ItemSearch({
  keyword,
  set_keyword,
  slot,
  set_search_result,
  set_is_item_select,
}: {
  keyword: string;
  set_keyword: (keyword: string) => void;
  slot: number;
  set_search_result: (items: Item[]) => void;
  set_is_item_select: (is: boolean) => void;
}) {
  const item_list: Item[] = filtered_item_list as Item[];
  const slot_category: { [key: number]: EquipSlot } = equip_slot_categories;

  const keyword_update = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input_keyword = e.target.value.trim();
    set_keyword(e.target.value);
    const searcher = new Hangul.Searcher(input_keyword);
    const eslot = slot > 4 ? 5 : slot;

    if (input_keyword === "" || input_keyword === " ") {
      set_search_result([]);
      return false;
    }
    set_is_item_select(false);
    const result = item_list.filter(
      (item) =>
        searcher.search(item.Name) >= 0 &&
        slot_category[item.EquipSlotCategory]["Slot"] == eslot
    );
    set_search_result(result);
  };
  return (
    <div className="item-search-container">
      <input
        type="text"
        placeholder="search..."
        value={keyword}
        onChange={keyword_update}
      />
    </div>
  );
}
