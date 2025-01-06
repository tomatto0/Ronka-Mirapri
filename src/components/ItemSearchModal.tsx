import '../css/ItemSearchModal.css';
import ItemSearch from './ItemSearch';
import SearchResult from './SearchResult';
import { Item } from '../type/Item.ts';
import { useState } from 'react';

export default function ItemSearchModal({slot, is_open, set_is_open, edit_equiped_item}: {
        slot: number,
        is_open: boolean, 
        set_is_open: (is_open: boolean) => void
        edit_equiped_item: (slot: number, item: Item) => void}) {
    const [search_result, set_search_result] = useState<Item[]>([]);

    if (!is_open) return;

    const modal_close = () => {
        set_is_open(false);
        set_search_result([]);
    }

    return (
        <div className="item-search-modal-back" onClick={modal_close}>
            <div className="item-search-modal" onClick={(e: React.MouseEvent<HTMLDivElement>) => { e.stopPropagation(); }}>
                <ItemSearch setter={set_search_result}/>
                <SearchResult 
                    slot={slot}
                    search_result={search_result} 
                    edit_equiped_item={edit_equiped_item}
                />
            </div>
        </div>
    )
}