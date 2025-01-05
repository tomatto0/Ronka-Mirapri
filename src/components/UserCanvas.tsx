import { useRef, useEffect, useCallback } from "react";
import { Item } from "../type/Item";

type ItemImage = {
    Id: number;
    Image: HTMLImageElement;
}

function clamp(min: number, val: number, max: number) {
    min = min > max ? max : min;
    return val < min ? min : val > max ? max : val;
}

export default function UserCanvas({image_src, equiped_item}: {image_src: string, equiped_item: Item[]}) {
    const imageRef = useRef<HTMLCanvasElement | null>(null);
    const user_image = useRef<HTMLImageElement>(new Image());
    const isDown = useRef<boolean>(false);
    const startX = useRef<number>(0);
    // const startY = useRef<number>(0);
    const x = useRef<number>(0);
    // const y = useRef<number>(0);
    const image_width = useRef<number>(0);
    const image_height = useRef<number>(0);
    const box_width = 608;
    const box_height = 1080;
    const item_images = useRef<ItemImage[]>([]);
    const equiped_item_ref = useRef<Item[]>(equiped_item);

    const user_image_draw = useCallback((x: number, y: number) => {
        const user_canvas = imageRef.current;
        const image = user_image.current;
        if (user_canvas) {
            const ctx = user_canvas.getContext('2d');
            if (ctx) {
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, box_width, box_height);
                ctx.drawImage(
                    image,
                    -x, -y, image.height *9/16, image.height,
                    0, 0, box_width, box_height
                );
            }
        }
    }, []);

    function user_item_draw(item_list: Item[]) {
        const user_canvas = imageRef.current;
        if (user_canvas) {
            const ctx = user_canvas.getContext('2d');
            if (ctx) {
                ctx.textAlign = 'start';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(box_width, 0, user_canvas.width, user_canvas.height);
                ctx.fillStyle = '#000000';
                for (let [i, item] of item_list.entries()) {
                    const image = item_images.current.find(i => i.Id === item.Id);
                    if (image) ctx.drawImage(image.Image, box_width +20, i*100 +20, 80, 80);
                    ctx.fillText(item.Name, box_width +110, i*100 +60);
                }
            }
        }
    };

    useEffect(() => {
        const user_canvas = imageRef.current;
        if (user_canvas == null) {
            return;
        }

        const mousedown_handler = (e: MouseEvent) => {
            isDown.current = true;
            startX.current = e.pageX -user_canvas.offsetLeft;
            // startY.current = e.pageY -user_canvas.offsetTop;
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

            x.current += (e.pageX -user_canvas.offsetLeft -startX.current) *(image_height.current /box_height);
            x.current = clamp(box_width *(image_height.current /box_height) -image_width.current, x.current, 0);
            startX.current = e.pageX -user_canvas.offsetLeft;
            // y.current += e.pageY -user_canvas.offsetTop -startY.current;
            // y.current = clamp(box_height -image_height.current, y.current, 0);
            // startY.current = e.pageY -user_canvas.offsetTop;
            user_image_draw(x.current, 0);
        }

        user_canvas.addEventListener('mousedown', mousedown_handler);
        user_canvas.addEventListener('mouseup', mouseup_handler);
        user_canvas.addEventListener('mouseleave', mouseleave_handler);
        user_canvas.addEventListener('mousemove', mousemove_handler);
        return () => {
            user_canvas.removeEventListener('mousedown', mousedown_handler);
            user_canvas.removeEventListener('mouseup', mouseup_handler);
            user_canvas.removeEventListener('mouseleave', mouseleave_handler);
            user_canvas.removeEventListener('mousemove', mousemove_handler);
        }
    }, [user_image_draw]);
    
    useEffect(() => {
        x.current = 0;
        // y.current = 0;
        user_image.current.src = image_src;
        user_image.current.onload = () => {
            image_width.current = user_image.current.width;
            image_height.current = user_image.current.height;
            user_image_draw(0, 0);
        };
    }, [image_src, user_image_draw]);

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

    useEffect(() => {
        equiped_item_ref.current = equiped_item;
        image_load_check();
    }, [equiped_item, image_load_check]);

    return (
        <canvas 
            className="user-canvas" 
            width="1920" 
            height="1080"
            ref={imageRef}
        />
    )
}