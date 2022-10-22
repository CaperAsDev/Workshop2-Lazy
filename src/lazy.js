//todo 
//*imagen gris mientras carga la imagen
//*boton de limpiar
//*reporte de cuantas imagenes han sido agregadas y cuantas cargadas

export let imagesSeen = 0
const observer = new IntersectionObserver((entries) => {
    if(entries[0].isIntersecting){
        imagesSeen += 1;
        
        const imagen = entries[0].target
        imagen.src = imagen.dataset.src
        observer.unobserve(imagen);
    }
    return console.log (`Imagenes vistas ${imagesSeen}`);
});

export const registerImage = (image) => {
    observer.observe(image)
};