import '../css/ItemInformation.css';

function ItemSlot({slot_name}: {slot_name: string}) {
    return (
        <div className="item-slot">
            <span>{slot_name}</span>
            <img src="./img/item_slot.svg" alt={slot_name +"아이콘"}/>
        </div>
    )
}

export default function ItemInformation() {
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
                    <ItemSlot slot_name="머리 방어구" key='1'/>
                    <ItemSlot slot_name="몸통 방어구" key='2'/>
                    <ItemSlot slot_name="손 방어구" key='3'/>
                    <ItemSlot slot_name="다리 방어구" key='4'/>
                </div>
                <div className="item-slot-row">
                    <ItemSlot slot_name="발 방어구" key='5'/>
                    <ItemSlot slot_name="추가 옵션" key='6'/>
                    <ItemSlot slot_name="추가 옵션" key='7'/>
                    <ItemSlot slot_name="추가 옵션" key='8'/>
                </div>
            </div>
            <button className="image-download" onClick={image_download}>이미지 다운로드</button>
        </div>
    );
}