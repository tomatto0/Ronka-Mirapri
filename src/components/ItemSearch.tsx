import { useState } from 'react';
import filtered_item_list from '../json/filtered_items.json';
import { Item } from '../type/Item.ts';
import Hangul from 'hangul-js';

export default function ItemSearch({setter}: {setter: (items: Item[]) => void}) {
    const [keyword, set_keyword] = useState<string>('');
    const item_list: Item[] = filtered_item_list as Item[];

    const keyword_update = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input_keyword = e.target.value.trim();
        set_keyword(e.target.value);
        const searcher = new Hangul.Searcher(input_keyword);
        
        if (input_keyword === '' || input_keyword === ' ') {
            setter([]);
            return false;
        }
        // const result = item_list.filter(item => item.Name.includes(input_keyword));
        const result = item_list.filter(
            item => (searcher.search(item.Name) >= 0)
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