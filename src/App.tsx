import './App.css';
import React, { useState } from 'react';
import ImageUploder from './components/ImageUploader.tsx';
import ItemSearch from './components/ItemSearch.tsx';
import SearchResult from './components/SearchResult.tsx';
import { Item } from './type/Item.ts';
import UserCanvas from './components/UserCanvas.tsx';

function App() {
    const [image_src, set_image_src] = useState<string>('./logo512.png');
    const [search_result, set_search_result] = useState<Item[]>([]);
    const [equiped_item, set_equiped_item] = useState<Item[]>([]);
    return (
        <div className="App">
            <UserCanvas image_src={image_src} equiped_item={equiped_item}/>
            <ImageUploder set_image_src={set_image_src}/>
            <ItemSearch setter={set_search_result}/>
            <SearchResult search_result={search_result} set_equiped_item={set_equiped_item}/>
        </div>
    );
}

export default App;