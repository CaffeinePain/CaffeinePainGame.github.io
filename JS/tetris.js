import BLOCKS from "./blocks.js";

// DOM
const playground = document.querySelector(".playground > ul");

// Setting
const GAME_ROWS = 20;
const GAME_COLS = 10;

// variables
let score = 0;
let duration = 500;
let downInterval;
let tempMovingItem;

const MovingItem = {
    type: "tree",
    direction: 0,
    top: 0,
    left: 0, 
};

init();

// functions
function init() {
    tempMovingItem = { ...MovingItem };
    for(let i=0; i<GAME_ROWS; i++) {
        prependNewLine();
    }
    renderBlocks();
}

function prependNewLine() {
    const li = document.createElement("li");
    const ul = document.createElement("ul");
    for(let j=0; j<10; j++) {
        const matrix = document.createElement("li");
        ul.prepend(matrix);
    }
    li.prepend(ul);
    playground.prepend(li);
}

function renderBlocks(moveType="") {
    const { type, direction, top, left } = tempMovingItem;
    const movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach(moving=>{
        moving.classList.remove(type, "moving");
    })
    BLOCKS[type][direction].some(block=>{
        const x = block[0] + left;
        const y = block[1] + top;
        const target = playground.childNodes[y] ? playground.childNodes[y].childNodes[0].childNodes[x] : null;
        const isAvailable = checkEmpty(target);
        if(isAvailable) {
            target.classList.add(type, "moving");
        } else {
            tempMovingItem = { ...MovingItem };
            setTimeout(()=>{
                renderBlocks();
                if(moveType === "top"){
                    seizeBlock();
                }
            },0)
            return true;
        }
    })
    MovingItem.left = left;
    MovingItem.top = top;
    MovingItem.direction = direction;
}

function seizeBlock() {
    const movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach(moving=>{
        moving.classList.remove("moving");
        moving.classList.add("seized");
    })
    generateNewBlock()
}

function generateNewBlock() {
    MovingItem.top = 0;
    MovingItem.left = 3;
    MovingItem.direction = 0;
    tempMovingItem = { ...MovingItem };
    renderBlocks();
}

function checkEmpty(target) {
    if(!target || target.classList.contains("seized")) {
        return false;
    }
    return true;
}
function moveBlock(moveType, amount) {
    tempMovingItem[moveType] += amount;
    renderBlocks(moveType);
}

function changeDirection() {
    const direction = tempMovingItem.direction;
    direction === 3 ? tempMovingItem.direction = 0 : tempMovingItem.direction += 1;
    renderBlocks();
}
//event handling
document.addEventListener("keydown", event=>{
    switch(event.keyCode){
        case 37: //왼쪽이동
            moveBlock("left", -1);
            break;
        case 39: //오른쪽이동
            moveBlock("left", 1);
            break;
        case 40: //아래쪽이동
            moveBlock("top", 1);
            break;
        case 38: //블록회전
            changeDirection();
            break;
        default:
            //console.log(event);
            break;
    }
})