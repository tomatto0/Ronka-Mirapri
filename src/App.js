import './App.css';
import { useState } from 'react';
import UserImage from './components/UserImage';
import ItemSearch from './components/ItemSearch';
import ImageUploder from './components/ImageUploader';
import SearchResult from './components/SearchResult';

function App() {
    const [upload_image, set_upload_image] = useState('./logo512.png'); 
    const [search_result, set_search_result] = useState([]);
    return (
        <div className="App">
            <UserImage upload_image={upload_image}/>
            <ImageUploder setter={set_upload_image}/>
            <ItemSearch setter={set_search_result}/>
            <SearchResult search_result={search_result}/>
        </div>
    );
}

export default App;