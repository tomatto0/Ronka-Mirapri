export default function ItemUploader(props) {
    const image_validate = (e) => {
        const ext = e.target.value.substring(
            e.target.value.lastIndexOf('.')+1,
            e.target.value.length
        ).toLowerCase();
        if (['bmp', 'png', 'jpeg', 'jpg'].includes(ext)) {
            const reader = new FileReader();
            reader.readAsDataURL(e.target.files[0]);
            reader.onloadend = () => {
                props.setter(reader.result);
            }
        } else {
            console.log('유효하지 않은 이미지');
            e.target.value = '';
        }
    }

    return (
        <input
            type="file"
            accept="image/bmp, image/png, image/jpeg"
            onChange={image_validate}
        >
        </input>
    )
}