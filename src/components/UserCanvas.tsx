import { useRef, useEffect, useCallback } from "react";
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
        const user_canvas = imageRef.current;
        if (user_canvas) {
            const ctx = user_canvas.getContext('2d');
            if (ctx) {
                ctx.textAlign = 'start';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = '#26272B';
                ctx.fillRect(box_width, 0, user_canvas.width, user_canvas.height); // 아이템 표시 영역 초기화
                ctx.fillStyle = '#FFFFFF';
                for (let [i, item] of item_list.entries()) {
                    const image = item_images.current.find(i => i.Id === item.Id);
                    if (image) ctx.drawImage(image.Image, box_width +20, i*100 +20, 80, 80); 
                    ctx.fillText(item.Name, box_width +110, i*100 +60);
                }
            }
        }
    };

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
            }
        } else {
            console.log('유효하지 않은 이미지');
            e.target.value = '';
        }
    }

    // 캔버스 이벤트 등록
    useEffect(() => {
        const user_canvas = imageRef.current;
        if (user_canvas == null) {
            return;
        }

        const mousedown_handler = (e: MouseEvent) => {
            isDown.current = true;
            startX.current = e.pageX -user_canvas.offsetLeft; // 클릭 시작 X좌표 저장
            // startY.current = e.pageY -user_canvas.offsetTop;

            if (startX.current < box_width) {
                console.log(user_image.current.src);
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
                isDown.current = true;
                startX.current = touch.pageX - user_canvas.offsetLeft;
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
        user_canvas.addEventListener('mouseup', mouseup_handler);
        user_canvas.addEventListener('mouseleave', mouseleave_handler);
        user_canvas.addEventListener('mousemove', mousemove_handler);

        user_canvas.addEventListener("touchstart", touchstart_handler);
        user_canvas.addEventListener("touchend", touchend_handler);
        user_canvas.addEventListener("touchcancel", touchcancel_handler);
        user_canvas.addEventListener("touchmove", touchmove_handler);

        return () => {
            // 이벤트 해제
            user_canvas.removeEventListener('mousedown', mousedown_handler);
            user_canvas.removeEventListener('mouseup', mouseup_handler);
            user_canvas.removeEventListener('mouseleave', mouseleave_handler);
            user_canvas.removeEventListener('mousemove', mousemove_handler);

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

    return (
        <div className="canvas-container">
            <canvas 
                className="user-canvas" 
                width="1080" 
                height="1080"
                ref={imageRef}
            />
            <input
                className="user-canvas-input"
                type="file"
                accept="image/bmp, image/png, image/jpeg"
                // onChange={image_validate}
            />
        </div>
    )
}