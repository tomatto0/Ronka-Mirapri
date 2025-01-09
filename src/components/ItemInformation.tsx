import "../css/ItemInformation.css";
import { Item } from "../type/Item.ts";
import { ColorInfo } from "../type/color_info";
import Color_background_list_raw from "../json/color_background.json";

export default function ItemInformation({
  open_modal,
  equiped_item,
  slot_active,
  image_src,
  reset_equiped_item,
}: {
  open_modal: (slot: number) => void;
  equiped_item: Item[];
  slot_active: boolean[];
  image_src: string;
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
  const Color_background_list: ColorInfo[] =
    Color_background_list_raw as ColorInfo[];
  function is_null_equiped_item(equiped_item: Item[]): boolean {
    if (
      image_src === "./img/thumbnail_mobile.svg" ||
      image_src === "./img/thumbnail.svg"
    ) {
      return true;
    }
    for (let item of equiped_item) {
      if (item.Id !== 0) {
        return false;
      }
    }
    return true;
  }

  const image_download = () => {
    if (!is_null_equiped_item(equiped_item)) {
      const options: Intl.DateTimeFormatOptions = {
        month: "2-digit", // 두 자리 월
        day: "2-digit", // 두 자리 일
        hour: "2-digit", // 두 자리 시간
        minute: "2-digit", // 두 자리 분
        hour12: false, // 24시간제
        timeZone: "Asia/Seoul", // 한국 시간대
      };

      const formattedDate = new Intl.DateTimeFormat("ko-KR", options)
        .format(new Date())
        .replace(". ", "")
        .replace(". ", "")
        .replace(":", "");

      console.log(formattedDate);

      const canvas = document.querySelector(".user-canvas");
      if (canvas instanceof HTMLCanvasElement) {
        const a = document.createElement("a");
        a.href = canvas.toDataURL();
        a.download = `RonkaMirapri ${formattedDate}.jpg`;
        a.click();
      }
    }
  };

  const ItemSlot = ({
    slot_name,
    open_modal,
    slot,
    is_active,
    item,
  }: {
    slot_name: string;
    open_modal: (slot: number) => void;
    slot: number;
    is_active: boolean;
    item: Item;
  }) => {
    const item_search_modal_open = () => {
      if (is_active) {
        open_modal(slot);
      }
    };
    const src = is_active ? item.Icon : "./img/item_slot_inactive.svg";

    return (
      <div className="item-slot">
        <span>{slot_name}</span>
        <img
          src={src}
          alt={slot_name + "아이콘"}
          onClick={item_search_modal_open}
        />
        <div className="dye-palette-container">
          {item.DyeCount > 0 && (
            <div
              className="dye-palette"
              style={
                item.DyeFirst === 0
                  ? {
                      backgroundImage: "url(./img/base_color.svg)",
                      backgroundPosition: "center",
                    }
                  : {
                      backgroundColor:
                        "#" +
                        Color_background_list[item.DyeFirst].background_color,
                    }
              }
            ></div>
          )}
          {item.DyeCount > 1 && (
            <div
              className="dye-palette"
              style={
                item.DyeSecond === 0
                  ? {
                      backgroundImage: "url(./img/base_color.svg)",
                      backgroundPosition: "center",
                    }
                  : {
                      backgroundColor:
                        "#" +
                        Color_background_list[item.DyeSecond].background_color,
                    }
              }
            ></div>
          )}
        </div>
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
              is_active={slot_active[i]}
              item={equiped_item[i]}
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
              is_active={slot_active[i]}
              item={equiped_item[i]}
              key={i}
            />
          ))}
        </div>
      </div>
      <button
        className={
          "image-download " +
          (is_null_equiped_item(equiped_item) ? "inactive" : "")
        }
        onClick={image_download}
      >
        이미지 다운로드
      </button>
    </div>
  );
}
