import '../css/ItemSearchModal.css';
import ItemSearch from './ItemSearch';
import SearchResult from './SearchResult';
import { Item } from '../type/Item.ts';
import { useState, useCallback } from 'react';

export default function ItemSearchModal({slot, is_open, set_is_open, edit_equiped_item}: {
        slot: number,
        is_open: boolean, 
        set_is_open: (is_open: boolean) => void
        edit_equiped_item: (slot: number, item: Item) => void}) {
    const [search_result, set_search_result] = useState<Item[]>([]);
    const [is_item_select, set_is_item_select] = useState<boolean>(false);
    const slots = [
        "머리 방어구", "몸통 방어구", "손 방어구", "다리 방어구", "발 방어구", "추가 옵션", "추가 옵션", "추가 옵션"
    ];
    
    const select_item = useCallback((slot: number, item: Item) => {
        edit_equiped_item(slot, item);
        set_is_item_select(true);
    }, []);

    if (!is_open) return;

    const modal_close = () => {
        set_is_open(false);
        set_search_result([]);
        set_is_item_select(false);
    }

    return (
        <div className="item-search-modal-back" onClick={modal_close}>
            <div className="item-search-modal" onClick={(e: React.MouseEvent<HTMLDivElement>) => { e.stopPropagation(); }}>
                <span>{slots[slot]}</span>
                <ItemSearch setter={set_search_result}/>
                {
                    !is_item_select &&
                    <SearchResult 
                        slot={slot}
                        search_result={search_result} 
                        edit_equiped_item={select_item}
                    />
                }
                {
                    is_item_select &&
                    <div>
                        color pallete
                    </div>
                }
            </div>
        </div>
    )
}