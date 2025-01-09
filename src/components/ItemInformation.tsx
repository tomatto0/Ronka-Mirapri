import "../css/ItemInformation.css";
import { Item } from "../type/Item.ts";

export default function ItemInformation({
  open_modal,
  equiped_item,
  slot_active,
  reset_equiped_item,
}: {
  open_modal: (slot: number) => void;
  equiped_item: Item[];
  slot_active: boolean[];
  reset_equiped_item: () => void;
}) {
  const slots = [
    "머리 방어구",
    "몸통 방어구",
    "손 방어구",
    "다리 방어구",
    "발 방어구",
    "추가 옵션",
    "추가 옵션",
    "추가 옵션",
  ];
  const image_download = () => {};

  const ItemSlot = ({
    slot_name,
    open_modal,
    slot,
    src,
    is_active,
  }: {
    slot_name: string;
    open_modal: (slot: number) => void;
    slot: number;
    src: string;
    is_active: boolean;
  }) => {
    const item_search_modal_open = () => {
      if (is_active) {
        open_modal(slot);
      }
    };
    if (!is_active) {
      src = "./img/item_slot_inactive.svg";
    }

    return (
      <div className="item-slot">
        <span>{slot_name}</span>
        <img
          src={src}
          alt={slot_name + "아이콘"}
          onClick={item_search_modal_open}
        />
      </div>
    );
  };

  return (
    <div className="item-information">
      <div className="item-information-header">
        <span>코디 정보 입력</span>
        <button onClick={reset_equiped_item}>초기화</button>
      </div>
      <hr />
      <div className="item-slot-container">
        <div className="item-slot-row">
          {[0, 1, 2, 3].map((i) => (
            <ItemSlot
              slot_name={slots[i]}
              open_modal={open_modal}
              slot={i}
              src={equiped_item[i].Icon}
              is_active={slot_active[i]}
              key={i}
            />
          ))}
        </div>
        <div className="item-slot-row">
          {[4, 5, 6, 7].map((i) => (
            <ItemSlot
              slot_name={slots[i]}
              open_modal={open_modal}
              slot={i}
              src={equiped_item[i].Icon}
              is_active={slot_active[i]}
              key={i}
            />
          ))}
        </div>
      </div>
      <button className="image-download inactive" onClick={image_download}>
        이미지 다운로드
      </button>
    </div>
  );
}
