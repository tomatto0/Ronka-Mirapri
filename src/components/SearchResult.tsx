import { useRef, useEffect } from 'react';
import { Item } from '../type/Item.ts';

const SearchedItem = ({item, set_equiped_item}:
     {item: Item, set_equiped_item: (item: Item[]) => void}) => {
    const component = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const div = component.current;
        
        if (div == null) {
            return;
        }
        
        const click_handler = () => {
            console.log(item);
        };
        div.addEventListener('click', click_handler);
        return () => {
            div.removeEventListener('click', click_handler);
        }
    }, []);
    return (
        <div className="search-result" ref={component}>
            <img src={'./' +item.Icon} alt={item.Name}/>
            <span>{item.Name}</span>
        </div>
    )
};

export default function SearchResult({search_result, set_equiped_item}:
     {search_result: Item[], set_equiped_item: (item: Item[]) => void}) {

    return (
        <div className='search-result-container'>
            {search_result.map(item => (
                <SearchedItem key={item.Id} item={item} set_equiped_item={set_equiped_item}/>
            ))}
        </div>
    )
}