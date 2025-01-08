import '../css/ColorPallete.css';
import { ColorInfo } from "../type/color_info";
import Color_background_list_raw from '../json/color_background.json';
import { useRef, useState, useEffect } from "react";
import { Item } from "../type/Item";

export default function ColorPallete({item, slot, edit_equiped_item, modal_close}: {
        item: Item, 
        slot: number,
        edit_equiped_item: (slot: number, item: Item) => void,
        modal_close: () => void}) {
    const Color_background_list: ColorInfo[] = Color_background_list_raw as ColorInfo[];
    const itemRef = useRef<Item>(item);
    
    const [is_f_open, set_is_f_open] = useState<boolean>(false);
    const [is_s_open, set_is_s_open] = useState<boolean>(false);

    const pallete_f_controll = () => {
        set_is_f_open(!is_f_open);
        set_is_s_open(false);
    }

    const pallete_s_controll = () => {
        set_is_s_open(!is_s_open);
        set_is_f_open(false);
    }

    useEffect(() => {
        itemRef.current = {...item};
    }, [item]);

    const ColorPalleteRow = ({is_open, pallete_controll, dye_slot}: {
            is_open: boolean,
            pallete_controll: () => void,
            dye_slot: number
        }) => {
        
        const ColorPalleteModal = ({slot, pallete_controll}: {
                slot: number,
                pallete_controll: () => void}) => {
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
            const [color_id, set_color_id] = useState<number>(0);
                        
            const commit = () => {
                if (dye_slot === 1) {
                    itemRef.current.DyeFirst = color_id;
                } else {
                    itemRef.current.DyeSecond = color_id;
                }
                edit_equiped_item(slot, itemRef.current);

                pallete_controll();
            }

            const cancle = () => {
                set_color_id(0);
            }

            const ColorCategory = ({category, selected_category, color, set_color_category}: {
                category: number,
                selected_category: number,
                color: string,
                set_color_category: (color_category: number) => void
            }) => {
                const click_handler = () => {
                    set_color_category(category);
                    set_color_id(colors[category][0].color_id);
                }
                return (
                    <div 
                        className={"color-category " +color +(selected_category === category ? ' selected' : '')}
                        onClick={click_handler}
                    />
                )
            }
            const Color = ({colorInfo, color_id, set_color_id}: {
                colorInfo: ColorInfo,
                color_id: number,
                set_color_id: (color: number) => void
            }) => {
                const style = {backgroundColor: '#'+colorInfo.background_color};
                
                const click_handler = () => {
                    set_color_id(colorInfo.color_id);
                }

                return (
                    <div 
                        className={"color-category" +(colorInfo.color_id === color_id ? ' selected' : '')} 
                        style={style}
                        onClick={click_handler}
                    />
                )
            }

            return (
                <div className='color-pallete-modal'>
                    <div className='color-category-container'>
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
                    <hr/>
                    <div className='color-category-container'>
                        <p>{color_id === 0 ? '테레빈유' : Color_background_list[color_id -1].name}</p>
                        {colors[color_category].map(colorInfo => (
                            <Color 
                                colorInfo={colorInfo}
                                color_id={color_id} 
                                set_color_id={set_color_id}
                                key={colorInfo.color_id}
                            />
                        ))}
                    </div>
                    <button onClick={cancle}>취소</button>
                    <button onClick={commit}>색상 선택</button>
                </div>
            );
        }
        
        return (
            <div className="pallete-container">
                <div onClick={pallete_controll}>
                    {dye_slot}염색 색상추가
                </div>
                {
                    is_open &&
                    <ColorPalleteModal
                        slot={slot}
                        pallete_controll={pallete_controll}
                    />
                }
                <hr/>
            </div>
        )
    };
    
    return (
        <div>
            선택된 아이템
            <hr/>
            {item.Name}
            <hr/>
            {
                item.DyeCount >= 1 &&
                <ColorPalleteRow 
                    is_open={is_f_open}
                    pallete_controll={pallete_f_controll}
                    dye_slot={1}
                />
            }
            {
                item.DyeCount >= 2 &&
                <ColorPalleteRow 
                    is_open={is_s_open}
                    pallete_controll={pallete_s_controll}
                    dye_slot={2}
                />
            }
            <button onClick={modal_close}>저장하기</button>
        </div>
    )
}