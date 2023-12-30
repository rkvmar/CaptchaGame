let checkbox = document.getElementById("checkbox")
let checkstate = 0
let text = document.getElementById("text")
let text2 = document.getElementById("text2")
let game = document.getElementById("grid")
checkbox.addEventListener("click", function(){
    if(checkstate == 0){
        checkstate = 1
        checkbox.style.backgroundColor = '#fc5f5f'
        checkbox.style.borderRadius = '30px'
        game.style.opacity='100%'
    }
})