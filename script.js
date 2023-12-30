let checkbox = document.getElementById("checkbox")
let checkstate = 0
let text = document.getElementById("topic")
let game = document.getElementById("grid")
let stage = 1
let image1 = document.getElementById('image1')
let image2 = document.getElementById('image2')
let image3 = document.getElementById('image3')
let image4 = document.getElementById('image4')
let image5 = document.getElementById('image5')
let image6 = document.getElementById('image6')
let image7 = document.getElementById('image7')
let image8 = document.getElementById('image8')
let image9 = document.getElementById('image9')
checkbox.addEventListener("click", function(){
    if(checkstate == 0){
        checkstate = 1
        checkbox.style.backgroundColor = '#fc5f5f'
        checkbox.style.borderRadius = '30px'
        game.style.opacity='100%'
        stage1()
    }
})
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
function stage1(){
    text = "cow"
    images = ['url(/images/Cow1.jpg)','url(/images/Cow2.jpg)','url(/images/Cow3.jpg)','url(/images/Sheep1.jpg)','url(/images/Sheep2.jpg)','url(/images/Sheep3.jpg)','url(/images/Sheep4.jpg)','url(/images/Sheep5.jpg)','url(/images/Sheep6.jpg)']
    shuffleArray(images)
    image1.style.backgroundImage = images[0]
    image2.style.backgroundImage = images[1]
    image3.style.backgroundImage = images[2]
    image4.style.backgroundImage = images[3]
    image5.style.backgroundImage = images[4]
    image6.style.backgroundImage = images[5]
    image7.style.backgroundImage = images[6]
    image8.style.backgroundImage = images[7]
    image9.style.backgroundImage = images[8]
}