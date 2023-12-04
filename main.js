function end(value){
    if(value > 0.5){
        return 1;
    }else if(value<0){
        return -1;
    }else{
        return 0;
    }
}

class Neuron{
    constructor(numberOfInputs){
        this.length = numberOfInputs;
        this.weigth = [];

        for(let i=0;i<numberOfInputs;i++){
            let aux = Math.random();
            this.weigth.push(aux);
        }
    }

    ajust(erro, rate, lastInput){
        for(let i=0;i<this.length;i++){
            this.weigth[i] += (erro*rate*lastInput[i]);
        }
    }

   
    compute(inputs){
        let out=0;
        for(let i=0;i<this.length;i++){
            out += (this.weigth[i]*inputs[i]);
        }
        return end(out);
    }
}

class Layer{
    constructor(numberOfNeurons,numberOfInputs){
        this.lastInput = [];
        this.length = numberOfNeurons;
        this.neurons = []
        for (let i = 0; i < numberOfNeurons; i++) {
            this.neurons.push(new Neuron(numberOfInputs));            
        }
    }

    ajust(erro, rate){
        for (let i = 0; i < this.length; i++) {
            this.neurons[i].ajust(erro,rate,this.lastInput);            
        }
    }

    compute(inputs){
        this.lastInput = inputs;
        let out = [];
        for (let i = 0; i < this.length; i++) {
            out.push(this.neurons[i].compute(inputs));            
        }
        return out;
    }
}

class Network{
    constructor(numberOfInputs, modelLayers){
        this.length = modelLayers.length;
        this.layers = [];

        this.first = new Layer(modelLayers[0],numberOfInputs);
        this.layers.push(this.first);
        for (let i = 1; i < modelLayers.length; i++) {
            this.layers.push(new Layer(modelLayers[i],modelLayers[i-1]));
        }       
    }

    ajust(erro, rate){
        for(let i=0;i<this.length;i++){
            this.layers[i].ajust(erro, rate);
        }
    }

    compute(inputs){
        let out = inputs;
        for (let i = 0; i < this.length; i++) {
            out = this.layers[i].compute(out);
        }
        return out;
    }
}


//////////////////////////////////////////////////////////////////////


var screen = document.getElementById("screen");
var ctx = screen.getContext('2d');
var scoreBoard = document.getElementById("score");

const W = 300;
const H = 175;

function clear(){
    ctx.beginPath();
    ctx.rect(0,0,W,H);
    ctx.fillStyle='#000';
    ctx.fill();
    ctx.closePath();
}

var score = 0;

function colisionDetector(){
    if(ball.y < player.y || ball.y > player.y+player.size){
        if(play){
            alert(score);
        }
        score = 0;
    }else{
        score++;
    }
    scoreBoard.innerText = score.toString();
}

var player = {
    x: 0,
    y: 0,
    size: 50,
    draw: function(){
        ctx.beginPath();
        ctx.rect(this.x,this.y,5,this.size);
        ctx.fillStyle='#aaa';
        ctx.fill();
        ctx.closePath();
    },
    move(direction){
        if(this.y+direction >= 0 && this.y+direction+this.size <= H){
            this.y += direction;
        }
    }
};

var ball = {
    x: 50,
    y: 50,
    forcex: 1,
    forcey: 1,
    size: 8,
    draw: function(){
        ctx.beginPath();
        ctx.rect(this.x,this.y,this.size,this.size);
        ctx.fillStyle = "#aaa";
        ctx.fill();
        ctx.closePath();
    },
    move: function(){
        //evento
        if(this.x+this.forcex < 0){
            colisionDetector();
        }


        if(this.x+this.forcex < 0 || this.x+this.forcex+this.size > W){
            //this.x *= -1;
            this.forcex*=-1;
        }else{
            this.x += this.forcex;
        }

        if(this.y+this.forcey < 0 || this.y+this.forcey+this.size > H){
            this.forcey*=-1;
        }else{
            this.y+=this.forcey;
        }
    }
};

window.addEventListener('keydown',function(event){
    switch(event.keyCode){
        case 38:
            // up
            player.move(-10);
            key = -1;
        break;
        case 40:
            // down
            player.move(10);
            key = 1;
        break;
    }
});

window.addEventListener("keyup",function(){
    key = 0;
});

function frame(){
    clear();
    player.draw();
    ball.move();
    ball.draw();

    if(score == 5 && !play){
        play = true;
        score = 0;
        time = 1;
    }

    if(!play){
        let disx = player.x - ball.x;
        let disy = player.y - ball.y;
        let erro = net.compute([disx,disy]);
        erro = key - erro;
        net.ajust(erro,0.001);
    }else{
        let disx = player.x - ball.x;
        let disy = player.y - ball.y;
        let out = net.compute([disx,disy]);
        player.move((out*10));
    }
    

    setTimeout(frame, time);
}

var time = 2;
var play = false;
var key = 0;
var net = new Network(2,[5,1]);
clear();
player.draw();
frame();
