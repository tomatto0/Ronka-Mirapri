import '../css/SearchResult.css';
import { useRef, useEffect } from 'react';
import { Item } from '../type/Item.ts';

export default function SearchResult({slot, search_result, edit_equiped_item}: {
        slot: number,
        search_result: Item[], 
        edit_equiped_item: (slot: number, item: Item) => void}) {

        const SearchedItem = ({slot, item, edit_equiped_item}: {
                slot: number,
                item: Item, 
                edit_equiped_item: (slot: number, item: Item) => void}) => {
            const component = useRef<HTMLDivElement | null>(null);
        
            useEffect(() => {
                const div = component.current;
                if (div == null) { return; }
                
                const click_handler = () => {
                    edit_equiped_item(slot, item);
                };
        
                div.addEventListener('click', click_handler);
                return () => {
                    div.removeEventListener('click', click_handler);
                }
            }, [edit_equiped_item, item]);
        
            return (
                <div className="search-result" ref={component}>
                    <img className="item-icon" src={'./' +item.Icon} alt={item.Name}/>
                    <span>{item.Name}</span>
                </div>
            )
        };

    return (
        <div className='search-result-container'>
            {search_result.map(item => (
                <SearchedItem key={item.Id} slot={slot} item={item} edit_equiped_item={edit_equiped_item}/>
            ))}
        </div>
    )
}