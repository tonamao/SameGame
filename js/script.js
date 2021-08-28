(function(){
    'use strict'

    let rest     = document.getElementById('rest');
    let param    = document.getElementById('param');
    let nRest    = 0;
    let score    = document.getElementById('score');
    let scr      = 0;
    let result   = document.getElementById('result');
    let clearNum = document.getElementById('clear-num');

    let canvasParent = document.getElementById('canvasParent');
    let canvas       = document.getElementById('canvas');
    let c            = canvas.getContext('2d');
    canvas.width     = canvasParent.clientWidth;
    canvas.height    = canvasParent.clientHeight;

    const BLOCK_SIZE = c.canvas.width / 10;
    const LEVEL = 2
    const BLOCK_COLOR = ['#F27398', '#FBA848', '#58BE89', '#40AAEF', '#a29bfe'];
    const CHECK_COLOR = ['#FAD0DC', '#FDD6AA', '#B0DFC3', '#9AD2F7', '#d1cdff'];
    const FRAME_COLOR = '#FFFFFF';
    const WHITE = '#FFFFFF';
    const POINT = 50;

    let bX = c.canvas.width / BLOCK_SIZE;
    let bY = c.canvas.height / BLOCK_SIZE;
    const ALL_SUQUARES = bX * bY;

    let squares      = [];
    let tgtBlocks    = [];
    let tgtIndex     = 0;
    let deleteBlocks = [];
    let blockNum     = bX * bY;

    let deletedClmX = 0;
    let numDltX     = 0;

    canvas.addEventListener('click', touchBlock, false);
    Array.from(document.getElementsByClassName("clear-modal-close")).forEach(selector => {
        selector.addEventListener('click', function() {
            location.reload(); //FIXME: initにする
        }, false);
    });

    class Square {
        constructor(x, y) {
            this.x = x * BLOCK_SIZE;
            this.y = y * BLOCK_SIZE;
            let n = Math.floor(Math.random() * (LEVEL + 2));
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

        test(cnt) {
            c.fillStyle = 'white';
            c.fillText(cnt, this.x, this.y+10);
        }
    }

    function init() {
        document.getElementById("game-frame").style.zIndex = 2000;
        document.getElementById("clearModal").style.opacity = 0;
        let cnt = 0;
        for (let i = 0; i < bY; i++) {
            for (let j = 0; j < bX; j++) {
                squares[cnt] = new Square(i, j);
                squares[cnt].draw();
                cnt++;
            }
        }
        nRest           = squares.length;
        rest.innerText  = nRest;
        param.innerText = squares.length;
        score.innerText = scr;

        clearNum.innerText = 10;
    }

    function getSquare(x, y){
        let sX = Math.floor(x / BLOCK_SIZE) * BLOCK_SIZE;
        let sY = Math.floor(y / BLOCK_SIZE) * BLOCK_SIZE;
        let target;
        for (let i = 0; i < (bX * bY); i++) {
            if ((sX == squares[i].x) && (sY == squares[i].y)) {
                target = squares[i];
            }
        }
        return target;
    }

    function whiten(){
        let dltIndex = 0;
        for (let i = 0; i < tgtBlocks.length; i++) {
            tgtBlocks[i].deleteFlg = true;
            tgtBlocks[i].draw();
            deleteBlocks[dltIndex++] = tgtBlocks[i];
        }
    }

    function toLeft() {
        //get Xs of tgt
        let tgtX  = [];
        let index = 0;
        for (let i = 0; i < bX; i++) {
            let leftTgt = getSquare(i * BLOCK_SIZE, BLOCK_SIZE * (bY - 1));
            if (leftTgt.deleteFlg) {
                if (tgtX.length <= 0) {
                    tgtX[index] = leftTgt.x;
                    index++;
                } else {
                    if (leftTgt.x == tgtX[tgtX.length - 1] + BLOCK_SIZE) {
                        tgtX[index] = leftTgt.x;
                        index++;
                    }
                }
            }
        }

        //set the right to tgt
        if (tgtX.length > 0) {
            let t = getSquare(tgtX[0], 0);
            while (t.x < (bX - 1) * BLOCK_SIZE) {
                for (let i = 0; i < bY; i++) {
                    t         = getSquare(t.x, i * BLOCK_SIZE);
                    let right = getSquare(t.x + tgtX.length * BLOCK_SIZE, i * BLOCK_SIZE);
                    if (!right) {
                        continue;
                    }
                    //update tgt with the right of tgt
                    t.colorIndex = right.colorIndex;
                    t.color      = right.color;
                    t.chkColor   = right.chkColor;
                    t.chkFlg     = right.chkFlg;
                    t.deleteFlg  = right.deleteFlg;
                    t.draw();
                    //update the right to deleted
                    right.chkFlg    = true;
                    right.deleteFlg = true;
                    right.draw();
                }
                let nextTgtX = t.x + BLOCK_SIZE;
                t            = getSquare(nextTgtX, 0);
            }
        }
        bX   = bX - tgtX.length;
        tgtX = [];
    };

    function drop() {
        for (let i = 0; i < deleteBlocks.length; i++) {
            let tgt = deleteBlocks[i];
            while (tgt.y >= BLOCK_SIZE) {
                let dltTop = getSquare(tgt.x, tgt.y - BLOCK_SIZE);
                if (!dltTop.deleteFlg) {
                    //update tgt with top of tgt
                    tgt.colorIndex = dltTop.colorIndex;
                    tgt.color      = dltTop.color;
                    tgt.chkColor   = dltTop.chkColor;
                    tgt.chkFlg     = dltTop.chkFlg;
                    tgt.deleteFlg  = dltTop.deleteFlg;
                    tgt.draw();
                    //update top to deleted
                    dltTop.chkFlg    = true;
                    dltTop.deleteFlg = true;
                    dltTop.draw();
                }
                tgt = dltTop;
            }
        }
        deleteBlocks = [];
    }

    function setChkFlg2Targets(target) {
        if (target.y >= BLOCK_SIZE) {
            let top = getSquare(target.x, target.y - BLOCK_SIZE);
            if (top.color == target.color) {
                if (!top.chkFlg) {
                    top.chkFlg = true;
                    setChkFlg2Targets(top);
                }
            }
        }
        if (target.y < BLOCK_SIZE * (bY - 1)) {
            let btm = getSquare(target.x, target.y + BLOCK_SIZE);
            if (btm.color == target.color) {
                if (!btm.chkFlg) {
                    btm.chkFlg = true;
                    setChkFlg2Targets(btm);
                }
            }
        }
        if (target.x >= BLOCK_SIZE) {
            let left = getSquare(target.x - BLOCK_SIZE, target.y);
            if (left.color == target.color) {
                if (!left.chkFlg) {
                    left.chkFlg = true;
                    setChkFlg2Targets(left);
                }
            }
        }
        if (target.x < BLOCK_SIZE * (bX - 1)) {
            let right = getSquare(target.x + BLOCK_SIZE, target.y);
            if (right.color == target.color) {
                if (!right.chkFlg) {
                    right.chkFlg = true;
                    setChkFlg2Targets(right);
                }
            }
        }
    }

    function getScore(dltBlocks) {
        let scorePoint       = 0;
        let dltedNum         = ALL_SUQUARES - nRest;
        let rateByClick      = dltBlocks.length * dltBlocks.length * 0.2;
        let scoreOfSumDltNum = dltedNum * 0.6;

        scorePoint = dltBlocks.length * POINT * rateByClick + scoreOfSumDltNum;
        return Math.floor(scorePoint);
    }

    function isFinished() {
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].deleteFlg) {
                continue;
            }
            if (!checkArroundColor(squares[i])) {
                return false;
            }
        }
        return true;
    }

    function checkArroundColor(target) {
        let upper, under, left, right;
        if(target.y >= BLOCK_SIZE){
            upper = getSquare(target.x, target.y - BLOCK_SIZE);
            if(upper.color == target.color){
                return false;
            }
        }
        if(target.y < BLOCK_SIZE * (bY - 1)){
            under = getSquare(target.x, target.y + BLOCK_SIZE);
            if(under.color == target.color){
                return false;
            }
        }
        if(target.x >= BLOCK_SIZE){
            left = getSquare(target.x - BLOCK_SIZE, target.y);
            if(left.color == target.color){
                return false;
            }
        }
        if(target.x < BLOCK_SIZE * (bX - 1)){
            right = getSquare(target.x + BLOCK_SIZE, target.y);
            if(right.color == target.color){
                return false;
            }
        }
        return true;
    }

    function touchBlock(e) {
        let rect   = e.target.getBoundingClientRect();
        let x      = e.clientX - rect.left;
        let y      = e.clientY - rect.top;
        let target = getSquare(x, y);

        if (target.chkFlg) { // 2click
            if (tgtBlocks.length > 1) {
                // white
                whiten();

                // score-board
                nRest           = nRest - tgtBlocks.length;
                scr             = scr + getScore(tgtBlocks);
                rest.innerText  = nRest;
                param.innerText = squares.length;
                score.innerText = scr;
                tgtBlocks       = [];

                // drop
                drop();

                // toLeft
                let xCnt = 0;
                while ((xCnt < bX)) {
                    if (getSquare(xCnt * BLOCK_SIZE, (bY - 1) * BLOCK_SIZE).deleteFlg) {
                        toLeft();
                    }
                    xCnt++;
                }

                tgtIndex = 0;

                // check clear judge
                if (isFinished()) {
                    result.innerText = 'CLEAR!!';
                    document.getElementById("game-frame").style.zIndex = 100;
                    document.getElementById("clearModal").style.opacity = 1;
                    document.getElementById("modalScore").innerText = scr;
                }
            }
        } else { // 1click
            //init deleteFlg = false
            for (let i = 0; i < tgtBlocks.length; i++) {
                tgtBlocks[i].chkFlg = false;
                tgtBlocks[i].draw();
            }
            tgtBlocks = [];
            tgtIndex = 0;

            //deleteFlg = true
            target.chkFlg = true;
            //set targets to tgtSquares[]
            setChkFlg2Targets(target);
            for (let i = 0; i < squares.length; i++) {
                if (squares[i].chkFlg) {
                    if (!squares[i].deleteFlg) {
                        tgtBlocks[tgtIndex++] = squares[i];
                    }
                }
            }

            //draw with chkColor
            for (let i = 0; i < tgtBlocks.length; i++) {
                tgtBlocks[i].draw();
            }
        }
    }

    init();

})();
