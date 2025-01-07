import { useRef, useState, useEffect, useCallback } from "react";
import { ColorInfo } from "../type/color_info";
import Color_background_list_raw from '../json/color_background.json';
import { Item } from "../type/Item";
import '../css/UserCanvas.css';


type ItemImage = {
    Id: number;
    Image: HTMLImageElement;
}

// 마우스와 터치 범위 설정시 사용하는
// 값을 최소와 최대 범위로 제한하는 함수
function clamp(min: number, val: number, max: number) {
    min = min > max ? max : min;
    return val < min ? min : val > max ? max : val;
}

export default function UserCanvas({image_src, equiped_item, set_image_src}: {
        image_src: string, 
        equiped_item: Item[],
        set_image_src: (image_src: string) => void
    }) {
    const imageRef = useRef<HTMLCanvasElement | null>(null); // 캔버스 참조
    const user_image = useRef<HTMLImageElement>(new Image());
    const isDown = useRef<boolean>(false); // 마우스 클릭 여부 확인
    const startX = useRef<number>(0); // 마우스 시작 X좌표
    // const startY = useRef<number>(0);
    const x = useRef<number>(0); // 이미지의 X좌표 위치
    // const y = useRef<number>(0);
    const image_width = useRef<number>(0); // 이미지의 너비
    const image_height = useRef<number>(0); // 이미지의 높이
    const ratio = 450/1080;
    const box_height = 1080; 
    const box_width = box_height * ratio; 
    const item_images = useRef<ItemImage[]>([]); // 장착 아이템 이미지 배열
    const equiped_item_ref = useRef<Item[]>(equiped_item); 
    const Color_background_list: ColorInfo[] = Color_background_list_raw as ColorInfo[];
    const dyeFirstWidthRef = useRef<number>(0); // Ref로 선언
    const [is_selected, set_is_selected] = useState<boolean>(false);

    // 사용자의 이미지를 그리는 함수
    const user_image_draw = useCallback((x: number, y: number) => {
        const user_canvas = imageRef.current;
        const image = user_image.current;
        if (user_canvas) {
            const ctx = user_canvas.getContext('2d');
            if (ctx) {
                ctx.fillStyle = '#EFF1F5'; 
                ctx.fillRect(0, 0, box_width, box_height); // 캔버스 초기화
                ctx.drawImage(
                    image,
                    -x, -y, image.height *ratio, image.height, // 원본 이미지의 위치 및 크기
                    0, 0, box_width, box_height // 캔버스에서의 위치 및 크기
                );
            }
        }
    }, []);

    // 장착된 아이템을 그리는 함수
    function user_item_draw(item_list: Item[]) {
        console.log('item_list:', item_list);

        const user_canvas = imageRef.current;
        if (user_canvas) {
            const ctx = user_canvas.getContext('2d');
            if (ctx) {
                ctx.textAlign = 'start';
                ctx.textBaseline = 'middle';
            
                // 아이템 표시 영역 초기화
                ctx.fillStyle = '#26272B';
                ctx.fillRect(box_width, 0, user_canvas.width, user_canvas.height);
                
                for (let [i, item] of item_list.entries()) {
                    const image = item_images.current.find(i => i.Id === item.Id);

                    // 아이템 아이콘 그리기
                    if (image) ctx.drawImage(image.Image, box_width +20, i*100 +20, 80, 80); 
                    ctx.font = "29px Pretendard-Regular"
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillText(item.Name, box_width +120, i*100 +45);

                    // 1염색 컬러 표시
                    // DyeFirst 값을 사용해 Color_background_list에서 색상 데이터 찾기
                    const colorInfo1 = Color_background_list.find(color => color.color_id === item.DyeFirst);

                        if(colorInfo1){
                        // 배경색과 텍스트 색상 설정
                            const backgroundColor = colorInfo1.background_color || '#FFFFFF'; // 기본값 설정
                            const textColor = colorInfo1.text_color || 'black';

                            // 텍스트 배경 그리기
                            ctx.font = "21px Pretendard-Regular"
                            const textWidth = ctx.measureText(colorInfo1.name).width;
                            dyeFirstWidthRef.current = textWidth;
                            ctx.fillStyle = `#${backgroundColor}`; // 배경 색상
                            ctx.fillRect(box_width + 120, i * 100 + 70, textWidth + 44, 26); // 배경 사각형 (텍스트 크기 기반)

                            // 텍스트 그리기
                            ctx.fillStyle = textColor; // 텍스트 색상
                            ctx.fillText(("1 - " + colorInfo1.name), box_width + 127, i * 100 + 84);
                        }
                    

                
                        // 2염색 컬러 표시
                        // DyeFirst 값을 사용해 Color_background_list에서 색상 데이터 찾기
                        const colorInfo2 = Color_background_list.find(color => color.color_id === item.DyeSecond);
    
                        if(colorInfo2){
                            // 배경색과 텍스트 색상 설정
                            const backgroundColor = colorInfo2.background_color || '#FFFFFF'; // 기본값 설정
                            const textColor = colorInfo2.text_color || 'black';
                            
                            // 텍스트 배경 그리기
                            ctx.font = "21px Pretendard-Regular"
                            const textWidth = ctx.measureText(colorInfo2.name).width;
                            ctx.fillStyle = `#${backgroundColor}`; // 배경 색상

                            if(colorInfo1){
                            ctx.fillRect(box_width + dyeFirstWidthRef.current + 174, i * 100 + 70, textWidth + 44, 26); // 배경 사각형 (텍스트 크기 기반)
        
                            // 텍스트 그리기
                            ctx.fillStyle = textColor; // 텍스트 색상
                            ctx.fillText(("2 - " + colorInfo2.name), box_width + dyeFirstWidthRef.current + 180, i * 100 + 84);
                        } else{
                            ctx.fillRect(box_width + 120, i * 100 + 70, textWidth + 44, 26);// 배경 사각형 (텍스트 크기 기반)
        
                            // 텍스트 그리기
                            ctx.fillStyle = textColor; // 텍스트 색상
                            ctx.fillText(("2 - " + colorInfo2.name), box_width + 127, i * 100 + 84);
                        }
                        }
                    
                }
            }
        }
    };

    // 캔버스 이벤트 등록
    useEffect(() => {
        const user_canvas = imageRef.current;
        if (user_canvas == null) {
            return;
        }

        const mousedown_handler = (e: MouseEvent) => {
            startX.current = e.pageX -user_canvas.offsetLeft; // 클릭 시작 X좌표 저장
            // startY.current = e.pageY -user_canvas.offsetTop;
            if (startX.current <= box_width) {
                isDown.current = true;
            }
        };
        const mouseup_handler = (e: MouseEvent) => {
            isDown.current = false;
            e.preventDefault();
        }
        const mouseleave_handler = () => {
            isDown.current = false;
        }
        const mousemove_handler = (e: MouseEvent) => {
            if (!isDown.current) {
                return;
            }
            e.preventDefault();

            // 이미지 이동 계산
            x.current += (e.pageX -user_canvas.offsetLeft -startX.current) *(image_height.current /box_height);
            x.current = clamp(box_width *(image_height.current /box_height) -image_width.current, x.current, 0);
            startX.current = e.pageX -user_canvas.offsetLeft; // 현재 X좌표 갱신
            // y.current += e.pageY -user_canvas.offsetTop -startY.current;
            // y.current = clamp(box_height -image_height.current, y.current, 0);
            // startY.current = e.pageY -user_canvas.offsetTop;
            user_image_draw(x.current, 0);
        }

        // 터치 이벤트 처리
        const touchstart_handler = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                startX.current = touch.pageX - user_canvas.offsetLeft;
                
                if (startX.current <= box_width) {
                    isDown.current = true;
                }
            }
        };
        
        const touchend_handler = (e: TouchEvent) => {
            isDown.current = false;
            e.preventDefault();
        };
        
        const touchcancel_handler = () => {
            isDown.current = false;
        };
        
        const touchmove_handler = (e: TouchEvent) => {
            if (!isDown.current || e.touches.length === 0) {
                return;
            }
        
            e.preventDefault();
            const touch = e.touches[0];
        
            // 터치로 이미지 이동 계산
            x.current += (touch.pageX - user_canvas.offsetLeft - startX.current) *(image_height.current / box_height);
            x.current = clamp(box_width * (image_height.current / box_height) - image_width.current, x.current, 0);
            startX.current = touch.pageX - user_canvas.offsetLeft;
            user_image_draw(x.current, 0);
        };

        // 마우스 및 터치 이벤트 등록
        user_canvas.addEventListener('mousedown', mousedown_handler);
        window.addEventListener('mouseup', mouseup_handler);
        window.addEventListener('mousemove', mousemove_handler);
        // user_canvas.addEventListener('mouseup', mouseup_handler);
        // user_canvas.addEventListener('mouseleave', mouseleave_handler);
        // user_canvas.addEventListener('mousemove', mousemove_handler);

        user_canvas.addEventListener("touchstart", touchstart_handler);
        user_canvas.addEventListener("touchend", touchend_handler);
        user_canvas.addEventListener("touchcancel", touchcancel_handler);
        user_canvas.addEventListener("touchmove", touchmove_handler);

        return () => {
            // 이벤트 해제
            user_canvas.removeEventListener('mousedown', mousedown_handler);
            window.removeEventListener('mouseup', mouseup_handler);
            window.removeEventListener('mousemove', mousemove_handler);
            // user_canvas.removeEventListener('mouseup', mouseup_handler);
            // user_canvas.removeEventListener('mouseleave', mouseleave_handler);
            // user_canvas.removeEventListener('mousemove', mousemove_handler);

            user_canvas.removeEventListener('touchstart', touchstart_handler);
            user_canvas.removeEventListener("touchend", touchend_handler);
            user_canvas.removeEventListener("touchcancel", touchcancel_handler);
            user_canvas.removeEventListener("touchmove", touchmove_handler);
        }
    }, [user_image_draw]);

    // 이미지 로드 및 초기화
    useEffect(() => {
        x.current = 0;
        // y.current = 0;
        user_image.current.src = image_src;
        user_image.current.onload = () => {
            image_width.current = user_image.current.width;
            image_height.current = user_image.current.height;
            user_image_draw(0, 0); // 초기 이미지 그리기
        };
    }, [image_src, user_image_draw]);

    // 아이템 이미지 로드 확인
    const image_load_check = useCallback(async () => {
        const image_load = (id: number, src: string): Promise<ItemImage> => {
            return new Promise((resolve, reject) => {
                const item_image = new Image();
                item_image.src = src;

                item_image.onload = () => resolve({Id: id, Image: item_image});
                item_image.onerror = (error) => reject(error);
            });
        };

        try {
            const promises = equiped_item_ref.current.map(item => image_load(item.Id, './' +item.Icon));
            item_images.current =  await Promise.all(promises);
        } catch(error) {
            console.error(error);
        }
        user_item_draw(equiped_item_ref.current);
    }, []);

    // 장착 아이템이 변경될 때 이미지 로드
    useEffect(() => {
        equiped_item_ref.current = equiped_item;
        image_load_check();
    }, [equiped_item, image_load_check]);
    
    const image_validate = (e: React.ChangeEvent<HTMLInputElement>) => {
        // 입력된 파일의 확장자 추출
        const ext = e.target.value.substring(
            e.target.value.lastIndexOf('.') + 1,
            e.target.value.length
        ).toLowerCase();

        if (['bmp', 'png', 'jpeg', 'jpg'].includes(ext) && e.target.files !== null) {
            const reader = new FileReader();
            reader.readAsDataURL(e.target.files[0]);
            reader.onloadend = () => {
                set_image_src(reader.result as string);
                set_is_selected(true);
            }
        } else {
            console.log('유효하지 않은 이미지');
            e.target.value = '';
        }
    }
    
    const image_delete = () => {
        set_image_src('../img/thumbnail.svg');
        set_is_selected(false);
    }

    function CanvasClickLayer({is_selected}: {is_selected: boolean}) {
        if (!is_selected) {
            return (
                <div className="input-container">
                    <label 
                        htmlFor="canvas-input"
                        className="canvas-input-label"
                    />
                    <input
                        className="user-canvas-input"
                        type="file"
                        accept="image/bmp, image/png, image/jpeg"
                        id="canvas-input"
                        onChange={image_validate}
                    />
                </div>
            )
        } else {
            return (
                <div className="input-container">
                    <div className="image-delete" onClick={image_delete}>
                        이미지 삭제
                    </div>
                </div>
            )
        }
    }

    return (
        <div className="canvas-container">
            <CanvasClickLayer is_selected={is_selected}/>
            <canvas 
                className="user-canvas" 
                width="1080" 
                height="1080"
                ref={imageRef}
            />
        </div>
    )
}