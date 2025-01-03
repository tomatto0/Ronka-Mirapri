import { useState } from 'react';
import item_list from '../json/filtered_item.json';
import html2canvas from 'html2canvas';

export default function ItemSearch(props) {
    const [keyword, set_keyword] = useState('');

    const keyword_update = e => {
        set_keyword(e.target.value);
    }
    const item_search = () => {
        if (keyword === '' || keyword === ' ') {
            return false;
        }
        const result = item_list.filter(item => item.Name.includes(keyword));
        props.setter(result);
    }
    const capture = async () => {
        const canv = await html2canvas(document.querySelector('.search-result-container'));
        let link = document.createElement('a');
        link.href = canv.toDataURL('image/png', true);
        link.download = 'capture.png';
        link.click();
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
            <button
                onClick={capture}
            >
                capture
            </button>
        </div>
    );
}