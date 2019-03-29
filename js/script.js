(function(){
  'use strict'
  
  var canvas = document.getElementById('canvas');
  var c = canvas.getContext('2d');
  
  const BLOCK_SIZE = 50;
  const LEVEL = 2
  const BLOCK_COLOR = ['#F27398', '#FBA848', '#58BE89', '#40AAEF', '#a29bfe'];
  const CHECK_COLOR = ['#FAD0DC', '#FDD6AA', '#B0DFC3', '#9AD2F7', '#d1cdff'];
  const FRAME_COLOR = '#FFFFFF';
  const WHITE = '#FFFFFF';
  
  var bX = c.canvas.width / BLOCK_SIZE;
  var bY = c.canvas.height / BLOCK_SIZE;
  
  var squares = [];
  var tgtBlocks = [];
  var tgtIndex = 0;
  var deleteBlocks = [];
  var blockNum = bX * bY;
  
  var deletedClmX = 0;
  var numDltX = 0
  
  canvas.addEventListener('click', touchBlock, false);
  
  class Square {
    constructor(x, y){
      this.x = x * BLOCK_SIZE;
      this.y = y * BLOCK_SIZE;
      var n = Math.floor(Math.random() * (LEVEL + 2));
      this.colorIndex = n;
      this.color = BLOCK_COLOR[this.colorIndex];
      this.chkColor = CHECK_COLOR[this.colorIndex];
      this.chkFlg = false;
      this.deleteFlg = false;
    }
    
    draw() {
      if (this.deleteFlg) {
        this.color = WHITE;
      } else {
        if (this.chkFlg) {
          this.color = CHECK_COLOR[this.colorIndex];
        } else {
          this.color = BLOCK_COLOR[this.colorIndex];
        }
      }
      c.fillStyle = this.color;
      c.strokeStyle = FRAME_COLOR;
      c.beginPath();
      c.fillRect(this.x, this.y, BLOCK_SIZE, BLOCK_SIZE);
      c.strokeRect(this.x, this.y, BLOCK_SIZE, BLOCK_SIZE);
    }
  }
  
  function init(){
    var cnt = 0;
    for (var i = 0; i < bY; i++) {
      for (var j = 0; j < bX; j++) {
        squares[cnt] = new Square(i, j);
        squares[cnt].draw();
        cnt++;
      }
    }
  }
  
  function getSquare(x, y){
    var sX = Math.floor(x / BLOCK_SIZE) * BLOCK_SIZE;
    var sY = Math.floor(y / BLOCK_SIZE) * BLOCK_SIZE;
    var target;
    for (var i = 0; i < (bX * bY); i++) {
      if ((sX == squares[i].x) && (sY == squares[i].y)) {
        target = squares[i];
      }
    }
    return target;
  };
  
  function whiten(){
    var dltIndex = 0;
    for (var i = 0; i < tgtBlocks.length; i++) {
      tgtBlocks[i].deleteFlg = true;
      tgtBlocks[i].draw();
      deleteBlocks[dltIndex++] = tgtBlocks[i];
    }
    tgtBlocks = [];
  };
  
  function toLeft(){
    //get Xs of tgt
    var tgtX = [];
    var index = 0;
    for (var i = 0; i < bX; i++) {
      var leftTgt = getSquare(i * BLOCK_SIZE, BLOCK_SIZE * (bY - 1));
      if (leftTgt.deleteFlg) {
        if (tgtX.length <= 0){
          tgtX[index] = leftTgt.x;
          index++;
        } else {
          if (leftTgt.x == tgtX[tgtX.length - 1].x + BLOCK_SIZE) {
            tgtX[index] = leftTgt.x;
            index++;
          }
        }
      }
    }
    
    //set the right to tgt
    if(tgtX.length > 0) {
      var t = getSquare(tgtX[0], 0);
      while(t.x < (bX - 1) * BLOCK_SIZE){
        for (var i = 0; i < bY; i++) {
          t = getSquare(t.x, i * BLOCK_SIZE);
          var right = getSquare(t.x + tgtX.length * BLOCK_SIZE, i * BLOCK_SIZE);
          //update tgt with the right of tgt
          t.colorIndex = right.colorIndex;
          t.color = right.color;
          t.chkColor = right.chkColor;
          t.chkFlg = right.chkFlg;
          t.deleteFlg = right.deleteFlg;
          t.draw();
          //update the right to deleted
          right.chkFlg = true;
          right.deleteFlg = true;
          right.draw();
        }
        var nextTgtX = t.x + BLOCK_SIZE;
        t = getSquare(nextTgtX, 0);
      }
    }
    bX = bX - tgtX.length;
    tgtX = [];
  };
  
  function drop(){
    for (var i = 0; i < deleteBlocks.length; i++) {
      var tgt = deleteBlocks[i];
      while (tgt.y >= BLOCK_SIZE) {
        var dltTop = getSquare(tgt.x, tgt.y - BLOCK_SIZE);
        if (!dltTop.deleteFlg) {
          //update tgt with top of tgt
          tgt.colorIndex = dltTop.colorIndex;
          tgt.color = dltTop.color;
          tgt.chkColor = dltTop.chkColor;
          tgt.chkFlg = dltTop.chkFlg;
          tgt.deleteFlg = dltTop.deleteFlg;
          tgt.draw();
          
          //update top to deleted
          dltTop.chkFlg = true;
          dltTop.deleteFlg = true;
          dltTop.draw();
        }
        tgt = dltTop;
      }
    }
    deleteBlocks = [];
  };
  
  function setChkFlg2Targets(target) {
    if(target.y >= BLOCK_SIZE){
      var top = getSquare(target.x, target.y - BLOCK_SIZE);
      if(top.color == target.color){
        if(!top.chkFlg){
          top.chkFlg = true;
          setChkFlg2Targets(top);
        }
      }
    }
    if(target.y < BLOCK_SIZE * (bY - 1)){
      var btm = getSquare(target.x, target.y + BLOCK_SIZE);
      if(btm.color == target.color){
        if(!btm.chkFlg){
          btm.chkFlg = true;
          setChkFlg2Targets(btm);
        }
      }
    }
    if(target.x >= BLOCK_SIZE){
      var left = getSquare(target.x - BLOCK_SIZE, target.y);
      if(left.color == target.color){
        if(!left.chkFlg){
          left.chkFlg = true;
          setChkFlg2Targets(left);
        }
      }      
    }
    if(target.x < BLOCK_SIZE * (bX - 1)){
      var right = getSquare(target.x + BLOCK_SIZE, target.y);
      if(right.color == target.color){
        if(!right.chkFlg){
          right.chkFlg = true;
          setChkFlg2Targets(right);
        }
      }
    }
  }
  
  function touchBlock(e){
    var rect = e.target.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    var target = getSquare(x, y);
    
    if (target.chkFlg) {//2click
      if (tgtBlocks.length > 1) {
        //white
        whiten();
        
        //drop
        drop();
      
        //toLeft
        var xCnt = 0;
       while((xCnt < bX) || (getSquare(xCnt * BLOCK_SIZE, (bY - 1) * BLOCK_SIZE).deleteFlg)) {
         toLeft();
         xCnt++;
       }
       tgtBlocks = [];
        tgtIndex = 0;
      }
    }else{//1click
      //init deleteFlg = false
      for (var i = 0; i < tgtBlocks.length; i++) {
        tgtBlocks[i].chkFlg = false;
        tgtBlocks[i].draw();
      }
      tgtBlocks = [];
      tgtIndex = 0;
      
      //deleteFlg = true
      target.chkFlg = true;
      
      //set targets to tgtSquares[]
      setChkFlg2Targets(target);
      for (var i = 0; i < squares.length; i++) {
        if(squares[i].chkFlg){
          if (!squares[i].deleteFlg) {
            tgtBlocks[tgtIndex++] = squares[i];
          }
        }
      }
      //draw with chkColor
      for (var i = 0; i < tgtBlocks.length; i++) {
        tgtBlocks[i].draw();
      }
    };
  }
  
  init();
  
})();
