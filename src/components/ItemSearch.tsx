import { useState } from 'react';
import filtered_item_list from '../json/filtered_items.json';
import { Item } from '../type/Item.ts';

export default function ItemSearch({setter}: {setter: (items: Item[]) => void}) {
    const [keyword, set_keyword] = useState<string>('');
    const item_list: Item[] = filtered_item_list as Item[];

    const keyword_update = (e: React.ChangeEvent<HTMLInputElement>) => {
        set_keyword(e.target.value);
    }
    const item_search = () => {
        if (keyword === '' || keyword === ' ') {
            return false;
        }
        const result = item_list.filter(item => item.Name.includes(keyword));
        setter(result);
    }
    return (
        <div className="item-search-container">
            <input
                type='text'
                placeholder='search...'
                value={keyword}
                onChange={keyword_update}
            >
            </input>
            <button
                onClick={item_search}
            >
                Search
            </button>
        </div>
    );
}