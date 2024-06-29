
document.body.onload = Start;

class Angle
{
    constructor(_angle = 0, _minutes = 0, _seconds = 0){
        this.angle = _angle;
        this.minutes = _minutes;
        this.seconds = _seconds;
    }
}

let espelhos = [16, 16.5, 17, 17.5, 18];
let pisos = [28, 28.5, 29, 29.5, 30, 30.5, 31, 31.5, 32];


function Start(){
    console.log(document.title + " has loaded")
    //addElement("p", "", "_SA_Text","in");

    var Angulo = new Angle(14,43,123);
    console.log(angleToText(Angulo));
}

function debug(element){
    console.log(element.className);
}

function GetEspelhoEPiso(height){
    for(var espelho in espelhos)
}


function angleToText(_angle){
    let Text = _angle.angle + "°" + _angle.minutes + "'" + _angle.seconds + "''"
    return Text;
}

function addElement(type = "p", text = "" ,parent = "", position = "''"){
    const newElement = document.createElement(type);
    const content = document.createTextNode(text);

    newElement.appendChild(content);

    let parentElement = document.getElementById(parent);

    if(parent === ""){
        document.body.appendChild(newElement);
        return;
    }
    if(position === "in")
        {
        parentElement.appendChild(newElement);
        } 
        else if(position === "b")
            {
                document.insertBefore(newElement, parentElement);
            }
            else{
                
            }
}