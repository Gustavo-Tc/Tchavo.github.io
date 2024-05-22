
document.body.onload = Start;

class Angle
{
    constructor(_angle = 0, _minutes = 0, _seconds = 0){
        this.angle = _angle;
        this.minutes = _minutes;
        this.seconds = _seconds;
    }
}

function Start(){
    console.log(document.title + " has loaded")
    //addElement("p", "", "_SA_Text","in");

    var Angulo = new Angle(14,43,123);
    console.log(angleToText(Angulo));
}

function debug(element){
    console.log(element.className);
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