import '../css/ItemInformation.css';
import { Item } from '../type/Item.ts';

function ItemSlot({slot_name, open_modal, slot, src}: {
        slot_name: string, 
        open_modal: (slot: number) => void,
        slot: number,
        src: string
    }) {

    const item_search_modal_open = () => {
        open_modal(slot);
    }

    return (
        <div className="item-slot">
            <span>{slot_name}</span>
            <img src={src} alt={slot_name +"아이콘"} onClick={item_search_modal_open}/>
        </div>
    )
}

export default function ItemInformation({open_modal, equiped_item}: {
    open_modal: (slot: number) => void,
    equiped_item: Item[]}) {
    const slots = [
        "머리 방어구", "몸통 방어구", "손 방어구", "다리 방어구", "발 방어구", "추가 옵션", "추가 옵션", "추가 옵션"
    ];
    const image_download = () =>{
    };

    return (
        <div className="item-information">
            <div className="item-information-header">
                <span>코디 정보 입력</span>
                <button>초기화</button>
            </div>
            <hr/>
            <div className="item-slot-container">
                <div className="item-slot-row">
                    {slots.slice(0, 4).map((slot, i) => (
                        <ItemSlot 
                            slot_name={slot} 
                            open_modal={open_modal} 
                            slot={i} 
                            src={equiped_item[i].Icon} 
                            key={i}
                        />
                    ))}
                </div>
                <div className="item-slot-row">
                    {slots.slice(4, 8).map((slot, i) => (
                        <ItemSlot 
                            slot_name={slot} 
                            open_modal={open_modal} 
                            slot={i +4} 
                            src={equiped_item[i +4].Icon}
                            key={i}
                        />
                    ))}
                </div>
            </div>
            <button className="image-download" onClick={image_download}>이미지 다운로드</button>
        </div>
    );
}