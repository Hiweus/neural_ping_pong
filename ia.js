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
