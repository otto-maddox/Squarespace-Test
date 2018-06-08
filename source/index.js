import 'normalize.css';
import './style/style.sass';



function snakeGame(){

  /* Values that will not be changing in config */

  const config = {
    autoInit : true,
    gridWidth : 20,
    frameInterval : 200,
    app : document.querySelector('.app'),
    stage : document.querySelector('.app .board'),
    arrowKeys : [37, 38, 39, 40],
    directions : {
      LEFT: 'LEFT',
      RIGHT: 'RIGHT',
      UP: 'UP',
      DOWN: 'DOWN',
    }
  }
  
  /* Set values that will be updated */
  
  let snake = {
    snakeArray: [],
    length
  },
  snakeStart = [ Math.ceil(config.gridWidth/2), Math.ceil(config.gridWidth/2) ],
  food = {
    node: {},
    position: null
  },
  direction,
  lastDirection,
  gameInterval,
  playing = false,
  gameStart = false,
  now = null;
  
  /* init function that sets up our event listeners
     and begins the animation loop */
  
  this.init = function(){
    this.setListeners();
    window.requestAnimationFrame(this.snakeFrame);
  }
  
  /* setListeners function for our keydown controls,
     and focus and blur to start and stop our game steps */
  
  this.setListeners = () => {
    window.addEventListener( "keydown", this.keyDown, true );
    window.addEventListener( "blur", this.pauseGame, true );
    window.addEventListener( "focus", this.playGame, true );
  }
  
  /* keyDown and keyDownCallback function for our handling
     controls, verifying it's an arrow key, and then handling
     arrow key logic */
  
  this.keyDown = (event) => {
    if (config.arrowKeys.indexOf(event.keyCode) >= 0) {
      this.keyDownCallback(event);
    }
  }
  
  this.keyDownCallback = (event) => {
      event.preventDefault();
      if(!gameStart){
        this.setStage();
      }
      switch (event.keyCode) {
        case 37:
          if(this.isntOppositeDirection(config.directions.LEFT)){
            direction = config.directions.LEFT;
          }
					break;
        case 38:
          if(this.isntOppositeDirection(config.directions.UP)){
            direction = config.directions.UP;
          }
					break;
        case 39:
          if(this.isntOppositeDirection(config.directions.RIGHT)){
            direction = config.directions.RIGHT;
          }
					break;
        case 40:
          if(this.isntOppositeDirection(config.directions.DOWN)){
            direction = config.directions.DOWN;
          }
					break;
      }
  };
  
  /* setStage function that prepares the board for a
     lovely game of Snake */
  
  this.setStage = () => {
  
    snake = {
      snakeArray: [],
      length: 5
    }
    
    gameStart = true;
    
    config.app.classList.replace("noGame", "yesGame");
    
    config.stage.innerHTML = "";
    
    this.createFood();
    
    this.placeFood();
    
    this.createSnakeSegment(snakeStart);
    
    this.playGame();
    
  }
  
  /* createFood and placeFood functions to make the node
     used as food and move it around the gameBoard */
  
  this.createFood = () => {
    
    let newFood = document.createElement("div");
    newFood.className = "food";
    
    food.node = newFood;
    
    config.stage.appendChild(food.node);
    
    
  }
  
  this.placeFood = () => {
  
    const randomPosition =  this.getRandomPosition();
    this.setSegmentPosition(food.node, randomPosition);
    food.position = randomPosition;
  
  }
  
  /* createSnakeSegment and placeSnakeSegment functions to
     make the nodes used as the snake and move them around
     the gameBoard */
  
  this.createSnakeSegment = (pos) => {
    
    const newSegment = document.createElement("div");
    newSegment.className = "snake";
    this.setSegmentPosition(newSegment, pos);
    
    config.stage.appendChild(newSegment);
    
    snake.snakeArray.unshift({ node: newSegment, position: pos });
    
    
  }
  
  this.setSegmentPosition = ( seg, pos ) => {
  
    seg.style.left = ( ( pos[0]-1 ) * (100/config.gridWidth) ) + "%";
    seg.style.top = ( ( pos[1]-1 ) * (100/config.gridWidth) ) + "%";
    
    
  }
  
  /* playGame, pauseGame, and endGame functions to control
     game states */
  
  this.playGame = () => {
  
    if(!playing && gameStart){
      playing = true;
    }
    
  }
  
  this.pauseGame = () => {
    if(playing){
      playing = false;
    }
    
  }
  
  this.endGame = (w = false) => {
  
    this.pauseGame();
    
    gameStart = false;
    config.app.classList.replace("yesGame", "noGame");
    
    if(w){
      alert("YOU WON! Good job! Take a moment and then maybe try again?");
    } else {
      alert("GAME OVER! You gonna try again?");
    }
    
  }
  
  /* snakeFrame function to loop frames using requestAnimationFrame */
  
  this.snakeFrame = (timestamp) => {
  
    if (!now) now = timestamp;
    let delta = timestamp - now;
    if(delta >= config.frameInterval){
      if(playing){
        this.moveSnake();
      }
      now = timestamp;
    }
    window.requestAnimationFrame(this.snakeFrame);
    
  }
  
  /* moveSnake function to do the basic logic of a game frame */
  
  this.moveSnake = () => {
  
    const currentHead = snake.snakeArray[0];
    const currentPosition = currentHead.position;
    let newPosition = currentPosition.slice();
    lastDirection = direction;
    switch (direction) {
				case config.directions.LEFT:
          newPosition[0] = newPosition[0] - 1;
          break;
				case config.directions.UP:
          newPosition[1] = newPosition[1] - 1;
          break;
				case config.directions.RIGHT:
          newPosition[0] = newPosition[0] + 1;
          break;
				case config.directions.DOWN:
          newPosition[1] = newPosition[1] + 1;
          break;
    }
    if(this.failPosition(newPosition)){
      this.endGame();
      return;
    } else {
      if(this.foodPosition(newPosition)){
        this.eatFood();
      }
      if(this.winPosition()){
        this.endGame(w);
        return;
      }
      if(snake.snakeArray.length < snake.length){
        this.createSnakeSegment(newPosition);
      } else {
        let newHead = snake.snakeArray.pop();
        newHead.position = newPosition;
        this.setSegmentPosition(newHead.node, newPosition);
        snake.snakeArray.unshift(newHead);
      }
    }
  
  }
  
  /* eatFood function that handles collision with food. YUM! */
  
  this.eatFood = () => {
  
    snake.length = snake.length + 5;
    this.placeFood();
  
  }
  
  /* failPosition, foodPosition and winPosition functions
     that checks upcoming position against fail state, food
     bite, or you just ate food that puts you in a win state */
  
  this.failPosition = (pos) => {
  
    let fail = false;
    
    snake.snakeArray.forEach((elm) => {
      if(elm.position.toString() === pos.toString()){
        fail = true;
      }
    })
    
    if(pos.indexOf(0) >= 0 || pos.indexOf(config.gridWidth+1) >= 0){
      fail = true;
    }
    
    return fail;
  
  }
  
  this.foodPosition = (pos) => {
  
    let eat = false;
    
    if(food.position.toString() === pos.toString()){
      eat = true;
    }
    
    return eat;
  
  }
  
  this.winPosition = () => {
  
    let win = false;
    
    if(snake.length >= Math.pow(config.gridWidth,2)){
      win = true;
    }
    
    return win;
  
  }
  
  /* getRandomPosition, getRandomNumber, and isn'tOppositeDirection
     functions that are utility for other functions */
  
  this.getRandomPosition = () => {
  
    const randomX = this.getRandomNumber();
    const randomY = this.getRandomNumber();
    
    let newRandomPos = [ randomX, randomY ];
    
    snake.snakeArray.forEach((elm) => {
      if(elm.position.toString() == newRandomPos.toString()){
        newRandomPos = this.getRandomPosition();
      }
    })
    
    return newRandomPos;
  
  }
  
  this.getRandomNumber = () => {
  
    return Math.floor(Math.random() * config.gridWidth) + 1;
  
  }
  
  this.isntOppositeDirection = (dir) => {
    switch (true) {
      case dir === config.directions.LEFT && lastDirection === config.directions.RIGHT:
      case dir === config.directions.RIGHT && lastDirection === config.directions.LEFT:
      case dir === config.directions.UP && lastDirection === config.directions.DOWN:
      case dir === config.directions.DOWN && lastDirection === config.directions.UP:
        return false;
        break;
      default:
        return true;
    }
  }
  
  if (config.autoInit) {
		this.init();
  }
}

const game = new snakeGame();
