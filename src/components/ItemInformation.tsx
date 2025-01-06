import '../css/ItemInformation.css';

function ItemSlot({slot_name, open_modal, slot}: {
        slot_name: string, 
        open_modal: (slot: number) => void,
        slot: number}
    ) {

    const item_search_modal_open = () => {
        open_modal(slot);
    }

    return (
        <div className="item-slot">
            <span>{slot_name}</span>
            <img src="./img/item_slot.svg" alt={slot_name +"아이콘"} onClick={item_search_modal_open}/>
        </div>
    )
}

export default function ItemInformation({open_modal}: {open_modal: (slot: number) => void}) {
    const slots = [
        "머리 방어구", "몸통 방어구", "손 방어구", "다리 방어구", "발 방어구", "추가 옵션", "추가 옵션", "추가 옵션"
    ]

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
                        <ItemSlot slot_name={slot} open_modal={open_modal} slot={i} key={i}/>
                    ))}
                </div>
                <div className="item-slot-row">
                    {slots.slice(4, 8).map((slot, i) => (
                        <ItemSlot slot_name={slot} open_modal={open_modal} slot={i+4} key={i}/>
                    ))}
                </div>
            </div>
            <button className="image-download" onClick={image_download}>이미지 다운로드</button>
        </div>
    );
}