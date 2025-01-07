import { useState } from 'react';
import filtered_item_list from '../json/filtered_items.json';
import equip_slot_categories from '../json/equip_slot_categories.json';
import { Item } from '../type/Item.ts';
import { EquipSlot } from '../type/EquipSlot.ts';
import Hangul from 'hangul-js';

export default function ItemSearch({slot, setter}: {slot: number, setter: (items: Item[]) => void}) {
    const [keyword, set_keyword] = useState<string>('');
    const item_list: Item[] = filtered_item_list as Item[];
    const slot_category: {[key: number]: EquipSlot} = equip_slot_categories;

    const keyword_update = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input_keyword = e.target.value.trim();
        set_keyword(e.target.value);
        const searcher = new Hangul.Searcher(input_keyword);
        const eslot = slot > 4 ? 5 : slot;
        
        if (input_keyword === '' || input_keyword === ' ') {
            setter([]);
            return false;
        }
        const result = item_list.filter(
            item => (
                searcher.search(item.Name) >= 0 &&
                slot_category[item.EquipSlotCategory]['Slot'] == eslot
            )
        );
        setter(result);
    }
    return (
        <div className="item-search-container">
            <input
                type='text'
                placeholder='search...'
                value={keyword}
                onChange={keyword_update}
            />
        </div>
    );
}