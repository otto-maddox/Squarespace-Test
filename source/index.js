 import _ from 'lodash';
import 'normalize.css';
import './style/style.sass';



function snakeGame(){

  var config = {
        autoInit : true,
        gridWidth : 40,
        frameInterval : 500
      },
      snake = {
        snakeArray: [],
        length
      },
      snakeStart = [ 10, 10 ],
      food = {
        node: {},
        position: {}
      },
      openSquares,
      direction,
      lastDirection,
      arrowKeys = [37, 38, 39, 40],
      gameInterval,
      playing = false,
      gameStart = false,
      stage = document.querySelector('section.app div.board');
  
  console.log(stage);
  
  this.init = function(){
    this.setListeners();
  }
  
  this.setListeners = () => {
    window.addEventListener( "keydown", this.keyDown, true );
    window.addEventListener( "blur", this.pauseGame, true );
    window.addEventListener( "focus", this.playGame, true );
  }
  
  this.setStage = () => {
  
    snake = {
      snakeArray: [],
      length: 5
    }
    
    gameStart = true;
    
    stage.innerHTML = "";
    
    this.createSnakeSegment(snakeStart);
    
    this.playGame();
    
  }
  
  this.createSnakeSegment = (pos) => {
    
    var newSegment = document.createElement("div");
    newSegment.className = "snake";
    this.setSegmentPosition(newSegment, pos);
    
    stage.appendChild(newSegment);
    
    snake.snakeArray.unshift({ node: newSegment , position: pos });
    
    
  }
  
  this.setSegmentPosition = ( seg, pos ) => {
  
    seg.style.left = ( ( pos[0]-1 ) * 2.5 ) + "%";
    seg.style.top = ( ( pos[1]-1 ) * 2.5 ) + "%";
    
    
  }
  
  this.playGame = () => {
  
    if(!playing && gameStart){
      gameInterval = setInterval(this.moveSnake, config.frameInterval);
      playing = true;
    }
    
  }
  
  this.pauseGame = () => {
    if(playing){
      clearInterval(gameInterval);
      playing = false;
    }
    
  }
  
  this.endGame = () => {
  
    this.pauseGame();
    
    direction = false;
    
    gameStart = false;
    
    alert("FAIL");
    
  }
  
  this.moveSnake = () => {
  
    var currentHead = snake.snakeArray[0];
    var currentPosition = currentHead.position;
    var newPosition = _.clone(currentPosition);
    lastDirection = direction;
    switch (direction) {
				case "LEFT":
					newPosition[0] = newPosition[0] - 1;
					break;
				case "UP":
					newPosition[1] = newPosition[1] - 1;
					break;
				case "RIGHT":
					newPosition[0] = newPosition[0] + 1;
					break;
				case "DOWN":
					newPosition[1] = newPosition[1] + 1;
					break;
    }
    if(this.failPosition(newPosition)){
      this.endGame();
      return false;
    } else {
      var newHead;
      if(snake.snakeArray.length < snake.length){
        this.createSnakeSegment(newPosition);
      } else {
        newHead = snake.snakeArray.pop();
        newHead.position = newPosition;
        this.setSegmentPosition(newHead.node, newPosition);
        snake.snakeArray.unshift(newHead);
      }
    }
  
  }
  
  this.keyDown = (event) => {
    if (arrowKeys.indexOf(event.keyCode) >= 0) {
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
          if(this.isntOppositeDirection("LEFT")){
            direction = "LEFT";
          }
					break;
				case 38:
          if(this.isntOppositeDirection("UP")){
            direction = "UP";
          }
					break;
				case 39:
          if(this.isntOppositeDirection("RIGHT")){
            direction = "RIGHT";
          }
					break;
				case 40:
          if(this.isntOppositeDirection("DOWN")){
            direction = "DOWN";
          }
					break;
      }
  };
  
  this.failPosition = (pos) => {
  
    var fail = false;
    
    snake.snakeArray.forEach((elm) => {
      if(elm.position.toString() == pos.toString()){
        fail = true;
      }
    })
    
    if(pos.indexOf(0) >= 0 || pos.indexOf(config.gridWidth+1) >= 0){
      fail = true;
    }
    
    return fail;
  
  }
  
  this.isntOppositeDirection = (dir) => {
    switch (dir) {
      case "LEFT":
        if(lastDirection == "RIGHT"){
          return false;
        }
        break;
      case "RIGHT":
        if(lastDirection == "LEFT"){
          return false;
        }
        break;
      case "UP":
        if(lastDirection == "DOWN"){
          return false;
        }
        break;
      case "DOWN":
        if(lastDirection == "UP"){
          return false;
        }
        break;
    }
    
    return true;
  }
  
  if (config.autoInit) {
		this.init();
  }
}

var game = new snakeGame();
