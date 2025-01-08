import "../css/ColorPalette.css";
import { ColorInfo } from "../type/color_info";
import Color_background_list_raw from "../json/color_background.json";
import { useState } from "react";
import { Item } from "../type/Item";

export default function ColorPalette({
  item,
  edit_equiped_item,
}: {
  item: Item;
  edit_equiped_item: (slot: number, item: Item) => void;
}) {
  const Color_background_list: ColorInfo[] =
    Color_background_list_raw as ColorInfo[];
  const ColorPaletteRow = () => {
    const [is_open, set_is_open] = useState<boolean>(false);

    const palette_modal = () => {
      set_is_open(!is_open);
    };

    const ColorPaletteModal = () => {
      const color_categories = [
        "white",
        "red",
        "brown",
        "yellow",
        "green",
        "blue",
        "purple",
        "rare",
      ];
      const colors = [
        Color_background_list.slice(0, 6),
        Color_background_list.slice(6, 17),
        Color_background_list.slice(17, 35),
        Color_background_list.slice(35, 46),
        Color_background_list.slice(46, 63),
        Color_background_list.slice(63, 82),
        Color_background_list.slice(82, 91),
        Color_background_list.slice(91, 114),
      ];
      const [color_category, set_color_category] = useState<number>(0);
      const [color, set_color] = useState<number>(0);

      const ColorCategory = ({
        category,
        selected_category,
        color,
        set_color_category,
      }: {
        category: number;
        selected_category: number;
        color: string;
        set_color_category: (color_category: number) => void;
      }) => {
        const click_handler = () => {
          set_color_category(category);
        };
        return (
          <div
            className={
              "color-category " +
              color +
              (selected_category === category ? " selected" : "")
            }
            onClick={click_handler}
          />
        );
      };
      const Color = ({
        colorInfo,
        color,
        set_color,
      }: {
        colorInfo: ColorInfo;
        color: number;
        set_color: (color: number) => void;
      }) => {
        const style = { backgroundColor: "#" + colorInfo.background_color };

        const click_handler = () => {
          set_color(colorInfo.color_id);
        };

        return (
          <div
            className={
              "color-category" +
              (colorInfo.color_id === color ? " selected" : "")
            }
            style={style}
            onClick={click_handler}
          />
        );
      };

      return (
        <div className="color-palette-modal">
          <div className="color-category-container">
            {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
              <ColorCategory
                category={i}
                color={color_categories[i]}
                selected_category={color_category}
                set_color_category={set_color_category}
                key={i}
              />
            ))}
          </div>
          <hr />
          <div className="color-category-container">
            <p>{color === 0 ? "_" : Color_background_list[color - 1].name}</p>
            {colors[color_category].map(colorInfo => (
              <Color
                colorInfo={colorInfo}
                color={color}
                set_color={set_color}
                key={colorInfo.color_id}
              />
            ))}
          </div>
        </div>
      );
    };

    return (
      <div className="palette-container">
        <div className="palette-name" onClick={palette_modal}>
          <img src="../../public/img/color_plus.svg" alt="add_color_icon" />
          1염색 색상추가
        </div>
        {is_open && <ColorPaletteModal />}
      </div>
    );
  };

  return (
    <div>
      <p className="selected-item-title">선택된 아이템</p>
      <p className="selected-item-name">{item.Name}</p>

      {item.DyeCount >= 1 && <ColorPaletteRow />}
    </div>
  );
}
