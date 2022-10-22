//! Vamos a crear y traer los elementos 

const columns = [...document.querySelectorAll('.column')];
let columnNumber = 0;

const images_container =document.querySelector('#image');
const new_image_button =document.querySelector('#new-image-button');
const reset_button =document.querySelector('#reset-button');
new_image_button.addEventListener('click', moreImages);
reset_button.addEventListener('click', resetImages);

const imagesLink = 'random';

export let imagesRequested = 0;
let imagesSeen = 0
let imagesCounter = 0;
let interval;

let loadaingNewSet = false;

/* document.addEventListener('scroll', (e) => {
    console.log(window.scrollY);
    console.log(images_container.offsetHeight);

}) */
//! Esta funcion es una intancia de una API que nos permite escuchar cuando un elemento es agregado, cuando es visto en el viewport y cuando ya no es visto.
    //*En este caso lo usamos para saber cuantas imagenes hemos visto y para cargar la imagen solo cuando sea vista en el viewport
    //?Tambien la usamos para saber cuando el usuario ha visto la mayoria de las imagenes solicitadas, cuando se cumpla solicitara mas imagenes a la API de las fotos 
    //Al final de la funcion tiene una propiedad para dejar de observar(seguir) las imagenes que ya han sido vistas, si no se usara leeria cada que entra o sale cada imagen
    //! Cabe resaltar que en este caso hace seguimiento a las imagenes porque eso es lo que le pasamos como parametro cuando la llamamos, si pusieramos otro elemento leeria su respectiva aparicion en el viewport
const observer = new IntersectionObserver((entries) => {
    if(entries[0].isIntersecting){
        imagesSeen += 1;
        
        const imagen = entries[0].target
        imagen.src = imagen.dataset.src

        if((imagesSeen + 3) >= imagesRequested && imagesRequested >= 10 && !loadaingNewSet){
            moreImages();
        }
        observer.unobserve(imagen);
    }
    return console.log (`Imagenes vistas ${imagesSeen}`);
});
//!En esta funcion estamos llamando el metodo "observe" de la instacia de "IntersectionObserver" llamada "observer".. Le ponemos un argumento que recibira lo que sera cada imagen que creemos en el HTML
const registerImage = (image) => {
    observer.observe(image)
};
//! Esta es la funcion hace bastante del trabajo de la pagina:
    //*Primero crea los elementos que pondremos en el HTML y los organiza segun la maquetacion previa, les pone las clases y a las imagenes un gif de carga
    //*Luego hace una peticion a la Pagina de las imagenes, en la respuesta tomamos la url y se la asignamos como data-src a la imagen
    //*Luego llamamos a nuestra funcion de registrar imagen donde ademas de hacerle seguimiento a la imagen para cuando sea vista se le asignara su url guardada como propiedad en su dataset.src
    //?Tenemos variables de soporte que nos ayudan a hacer seguimiento sobre cuantas imagenes han sido solicitadas y una variable para intercalar la columna en que son puestas las imagenes
    //!Importante anotar que esta funcion es llamada por otra funcion a partir de un setInterval que llama a esta funcion cada 1.2seg por cada tanda de 10 imagenes solicitadas. Ese intervalo se detiene al completar las 10 imagenes, de no ser asi cargaria imagenes infinitamente
function newImage ( ){
    if (imagesRequested < (imagesCounter * 10)) {
        const contenedor_imagen = document.createElement('div');
        contenedor_imagen.classList.add('p-4');
        
        const imagen =document.createElement('img');
        contenedor_imagen.append(imagen);
        imagen.classList.add('mx-auto','rounded-md');
        imagen.src = 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif?20151024034921';

        fetch(`https://source.unsplash.com/${imagesLink}`)
            .then((res) => {
                if(res){
                    imagesRequested += 1;
                    columns[columnNumber].append(contenedor_imagen);
                    
                    console.log(`Imagenes solicitadas = ${imagesRequested}`);

                    imagen.setAttribute('data-src',`${res.url}`)
                    registerImage(imagen);
                    
                    columnNumber++;
                    if(columnNumber == 3){
                        columnNumber = 0;
                    }
                }
            });
    }else{
        clearInterval(interval);
        interval = undefined;
        loadaingNewSet = false;
    }
};
//!Esta es la funcion que llama con el intervalo nuestra funcion de newImage
    //*Ademas tenemos una variable que nos sirve para validar si actualmente se esta llevando a cabo el proceso de solicitud de imagenes, esto para no tener varias solicitudes simultaneas ya que provoca que sean vistas varias imagenes repeticas multiples veces
function moreImages(){
    loadaingNewSet = true;
    interval = setInterval(newImage,1200);
    imagesCounter++;
};
//!Esta es la funcion de reset, limpia la pantalla y resetea los contadores
function resetImages(){
    imagesCounter = 0;
    imagesRequested = 0;
    columnNumber = 0;
    imagesSeen = 0;
    for (let element of columns) {
        element.innerHTML = '';
        console.log(element);
    }
};
