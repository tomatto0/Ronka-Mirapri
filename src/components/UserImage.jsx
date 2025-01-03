import { useRef, useEffect, useState } from "react";

function clamp(min, val, max) {
    min = min > max ? max : min;
    return val < min ? min : val > max ? max : val;
}

export default function UserImage({upload_image}) {
    const imageRef = useRef(null);
    const isDown = useRef(false);
    const startX = useRef(0);
    const startY = useRef(0);
    const x = useRef(0);
    const y = useRef(0);
    const [style, set_style] = useState({transform: 'translate(0px, 0px)'});
    const image_width = useRef(0);
    const image_height = useRef(0);
    const box_width = 512;
    const box_height = 512;

    useEffect(() => {
        const user_image = imageRef.current;
        
        const mousedown_handler = (e) => {
            isDown.current = true;
            startX.current = e.pageX -user_image.offsetLeft;
            startY.current = e.pageY -user_image.offsetTop;
        };
        const mouseup_handler = (e) => {
            isDown.current = false;
            e.preventDefault();
        }
        const mouseleave_handler = () => {
            isDown.current = false;
        }
        const mousemove_handler = (e) => {
            if (!isDown.current) {
                return;
            }
            e.preventDefault();
            x.current += e.pageX -user_image.offsetLeft -startX.current;
            x.current = clamp(box_width -image_width.current, x.current, 0);
            y.current += e.pageY -user_image.offsetTop -startY.current;
            y.current = clamp(box_height -image_height.current, y.current, 0);
            startX.current = e.pageX -user_image.offsetLeft;
            startY.current = e.pageY -user_image.offsetTop;
            set_style({transform: `translate(${x.current}px, ${y.current}px)`});
        }

        user_image.addEventListener('mousedown', mousedown_handler);
        user_image.addEventListener('mouseup', mouseup_handler);
        user_image.addEventListener('mouseleave', mouseleave_handler);
        user_image.addEventListener('mousemove', mousemove_handler);
        return () => {
            user_image.removeEventListener('mousedown', mousedown_handler);
            user_image.removeEventListener('mouseup', mouseup_handler);
            user_image.removeEventListener('mouseleave', mouseleave_handler);
            user_image.removeEventListener('mousemove', mousemove_handler);
        }
    }, []);

    useEffect(() => {
        const user_image = imageRef.current;
        image_width.current = user_image.width;
        image_height.current = user_image.height;
        x.current = 0;
        y.current = 0;
        set_style({transform: `translate(0px, 0px)`});
    }, [upload_image]);
    
    return (
        <div className="user-image-container">
            <img 
                className="user-image"
                src={upload_image}
                alt=""
                ref={imageRef}
                style={style}
            />
        </div>
    )
}