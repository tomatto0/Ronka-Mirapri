import './App.css';
import React, { useState, useCallback } from 'react';
import { Item } from './type/Item.ts';
import UserCanvas from './components/UserCanvas.tsx';
import ItemInformation from './components/ItemInformation.tsx';
import ItemSearchModal from './components/ItemSearchModal.tsx';

function App() {
    const [image_src, set_image_src] = useState<string>('./logo512.png');
    const [is_open, set_is_open] = useState<boolean>(false);
    const [modal_slot, set_modal_slot] = useState<number>(1);

    const item_null = {
        Id: 0,
        Name: '',
        Icon: './img/item_slot.svg',
        EquipSlotCategory: 0,
        ClassJobCategory: 0,
        DyeCount: 0,
        DyeFirst: 0,
        DyeSecond: 0
    }

    const [equiped_item, set_equiped_item] = useState<Item[]>(new Array(8).fill(item_null));
    const add_equiped_item = useCallback((item: Item) => {
        set_equiped_item(items => [...items, item]);
    }, []);
    const edit_equiped_item = useCallback((slot: number, item: Item) => {
        set_equiped_item(items => {
            const updated_item = [...items];
            updated_item[slot] = item;
            return updated_item;
        });
    }, []);
    const open_modal = useCallback((slot: number) => {
        set_is_open(true);
        set_modal_slot(slot);
    }, []);

    return (
        <div className="App">
            <div className="header">
                <img src="./img/title.svg" alt="FFXIV-KOR MIRAPRI GENERATOR" id="title"/>
            </div>
            <div className="main-container">
                <UserCanvas image_src={image_src} equiped_item={equiped_item}/>
                <ItemInformation open_modal={open_modal} equiped_item={equiped_item}/>
            </div>
            <div className="footer">
                <a href="https://ronkacloset.com">https://ronkacloset.com</a><br/>
                <p>© SQUARE ENIX Published in Korea by Actoz Soft CO., LTD.</p>
            </div>
            <ItemSearchModal
                slot={modal_slot}
                is_open={is_open}
                set_is_open={set_is_open}
                edit_equiped_item={edit_equiped_item}
            />
        </div>
    );
}

export default App;