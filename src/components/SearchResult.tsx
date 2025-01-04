import { useRef, useEffect } from 'react';
import { Item } from '../type/Item.ts';

const SearchedItem = ({item, add_equiped_item}:
     {item: Item, add_equiped_item: (item: Item) => void}) => {
    const component = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const div = component.current;
        
        if (div == null) {
            return;
        }
        
        const click_handler = () => {
            add_equiped_item(item);
        };

        div.addEventListener('click', click_handler);
        return () => {
            div.removeEventListener('click', click_handler);
        }
    }, [add_equiped_item, item]);

    return (
        <div className="search-result" ref={component}>
            <img className="item-icon" src={'./' +item.Icon} alt={item.Name}/>
            <span>{item.Name}</span>
        </div>
    )
};

export default function SearchResult({search_result, add_equiped_item}:
     {search_result: Item[], add_equiped_item: (item: Item) => void}) {

    return (
        <div className='search-result-container'>
            {search_result.map(item => (
                <SearchedItem key={item.Id} item={item} add_equiped_item={add_equiped_item}/>
            ))}
        </div>
    )
}