import '../css/ColorPallete.css';
import { ColorInfo } from "../type/color_info";
import Color_background_list_raw from '../json/color_background.json';
import { useState } from "react";
import { Item } from "../type/Item";

export default function ColorPallete({item, edit_equiped_item}: {
    item: Item, 
    edit_equiped_item: (slot: number, item: Item) => void}) {
    
    const Color_background_list: ColorInfo[] = Color_background_list_raw as ColorInfo[];
    const ColorPalleteRow = () => {
        const [is_open, set_is_open] = useState<boolean>(false);

        const pallete_modal = () => {
            set_is_open(!is_open);
        }

        return (
            <div className="pallete-container">
                <div onClick={pallete_modal}>
                    1염색 색상추가
                </div>
                {
                    is_open &&
                    <ColorPalleteModal/>
                }
            </div>
        )
    };

    const ColorPalleteModal = () => {
        const color_categories = ['white', 'red', 'brown', 'yellow', 'green', 'blue', 'purple', 'rare'];
        const colors = [
            Color_background_list.slice(0, 6),
            Color_background_list.slice(6, 17),
            Color_background_list.slice(17, 35),
            Color_background_list.slice(35, 46),
            Color_background_list.slice(46, 63),
            Color_background_list.slice(63, 82),
            Color_background_list.slice(82, 91),
            Color_background_list.slice(91, 114)
        ];
        const [color_category, set_color_category] = useState<number>(0);
        const ColorCategory = ({category, color, set_color_category}: {
            category: number,
            color: string,
            set_color_category: (color_category: number) => void
        }) => {
            const click_handler = () => {
                set_color_category(category);
            }
            return (
                <div 
                    className={"color-category " +color}
                    onClick={click_handler}
                />
            )
        }
        const Color = ({color}: {color: ColorInfo}) => {
            const style = {backgroundColor: '#'+color.background_color};

            return (
                <div className={"color-category"} style={style}>

                </div>
            )
        }

        return (
            <div className='color-pallete-modal'>
                <div className='color-category-container'>
                    {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
                        <ColorCategory 
                            category={i}
                            color={color_categories[i]} 
                            set_color_category={set_color_category}
                            key={i}
                        />
                    ))}
                </div>
                <hr/>
                <div className='color-category-container'>
                    {colors[color_category].map(color => (
                        <Color color={color} key={color.color_id}/>
                    ))}
                </div>
            </div>
        );
    }
    
    return (
        <div>
            선택된 아이템
            <hr/>
            {item.Name}
            <hr/>
            {
                item.DyeCount >= 1 &&
                <ColorPalleteRow/>
            }
        </div>
    )
}