import './App.css';
import React, { useState, useCallback } from 'react';
import ImageUploder from './components/ImageUploader.tsx';
import ItemSearch from './components/ItemSearch.tsx';
import SearchResult from './components/SearchResult.tsx';
import { Item } from './type/Item.ts';
import UserCanvas from './components/UserCanvas.tsx';
import ItemInformation from './components/ItemInformation.tsx';

function App() {
    const [image_src, set_image_src] = useState<string>('./logo512.png');
    const [search_result, set_search_result] = useState<Item[]>([]);
    const [equiped_item, set_equiped_item] = useState<Item[]>([]);

    const add_equiped_item = useCallback((item: Item) => {
        set_equiped_item(items => [...items, item]);
    }, []);

    return (
        <div className="App">
            <div className="header">
                <img src="./img/title.svg" alt="FFXIV-KOR MIRAPRI GENERATOR" id="title"/>
            </div>
            <div className="main-container">
                <UserCanvas image_src={image_src} equiped_item={equiped_item}/>
                <ItemInformation/>
            </div>
            <div className="footer">
                <a href="https://ronkacloset.com">https://ronkacloset.com</a><br/>
                <p>© SQUARE ENIX Published in Korea by Actoz Soft CO., LTD.</p>
            </div>
        </div>
    );
}

export default App;