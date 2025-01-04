import { useRef, useEffect, useState } from "react";
import { Item } from "../type/Item";

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
    const [reload, set_reload] =  useState<number>(0);

    function user_image_draw(x: number, y: number) {
        const user_canvas = imageRef.current;
        const image = user_image.current;
        if (user_canvas) {
            const ctx = user_canvas.getContext('2d');
            image_width.current = image.width *(box_height/image.height);
            image_height.current = box_height;
            if (ctx) {
                ctx.clearRect(0, 0, user_canvas.width, user_canvas.height);
                ctx.drawImage(image, x, y, image.width *(box_height/image.height), box_height);
                ctx.fillStyle = '#F0F0F0';
                ctx.fillRect(box_width, 0, 1920 -box_width, box_height);
            }
            set_reload(reload +1);
        }
    }

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
            x.current += e.pageX -user_canvas.offsetLeft -startX.current;
            x.current = clamp(box_width -image_width.current, x.current, 0);
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
    }, []);
    
    useEffect(() => {
        x.current = 0;
        // y.current = 0;
        user_image.current.src = image_src;
        user_image.current.onload = () => {user_image_draw(0, 0);};

    }, [image_src]);

    return (
        <canvas 
            className="user-canvas" 
            width="1920" 
            height="1080"
            ref={imageRef}
        />
    )
}