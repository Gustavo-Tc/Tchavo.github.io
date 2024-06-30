document.body.onload = Start;

class Angle
{
    constructor(_angle = 0, _minutes = 0, _seconds = 0){
        this.angle = _angle;
        this.minutes = _minutes;
        this.seconds = _seconds;
    }

    get negativo(){
        return this.calcNegativo();
    }

    calcNegativo() {
        return new Angle(-this.angle, -this.minutes, -this.seconds)
    }

    get AngleInt(){
        return this.angle + (this.minutes/60) + (this.seconds / 3600);
    }
    
}

class Vector extends Array {
    // example methods
    add(other) {
      return this.map((e, i) => e + other[i]);
    }
  }

  

function Start(){
    console.log(document.title + " has loaded")

    let _Angulos = new Array(new Angle(285,56,3), new Angle(316,20,35), new Angle(297,44,7));
    let _Vertices = 3;

    let _Distances = new Array(29.85398235, 15.99803481, 52.45689655);

    let _Perímetro = 0;
    _Distances.forEach(element => {
        _Perímetro += element;
    });
    //console.log(_Perímetro);

    let _SomatórioAngular = CalculoSomatórioAngular(_Angulos);
    //console.log( _SomatórioAngular);

    let _ExatoAngular = sum(SomatórioAngularExternos(_Vertices));
    //console.log( _ExatoAngular);

    let _ErroAngular = ErroAngular(_SomatórioAngular, _ExatoAngular);
    //console.log(_ErroAngular);

    let _TolerânciaAngular = TolerânciaAngular(30, _Vertices);
    //console.log(_TolerânciaAngular);

    if(_ErroAngular.AngleInt >= _TolerânciaAngular.AngleInt){
        console.log("Desaprovado! ultrapassou limite de erro!"); return;
    }
    else{ console.log("Passou no teste do limite de erro");}

    let _CorreçãoPorVértice = CorreçãoVértice(_ErroAngular, _Vertices);
    //console.log(_CorreçãoPorVértice);

    //console.log(_Angulos[0]);

    let _AngulosCorrigidos = CorreçãoDosAngulos(_Angulos, _CorreçãoPorVértice);
    //console.log(_AngulosCorrigidos[0]);


    let _Azimutes = CalculoAzimutes(new Angle(94,53,17), _AngulosCorrigidos);
    //Azimutes.forEach(function (element){ console.log(element); })

    let _ProjeçõesRelativas = ProjeçõesRelativas(_Azimutes, _Distances);
    //_ProjeçõesRelativas.forEach(function (element){ console.log(element); })

    let _SomatórioPosições = SomatórioPosições(_ProjeçõesRelativas);
    //console.log(_SomatórioPosições);

    let _ErroLinearTotal = CalculoErroLinearTotal(_SomatórioPosições);
    //console.log(_ErroLinearTotal);

    let _ErroLinearPermitido = ErroLinearPermitido(_Perímetro , 200);
    //console.log(_ErroLinearPermitido);
    
    if(_ErroLinearTotal > _ErroLinearPermitido){
        console.log("Passou no teste do perímetro, pode prosseguir com os cálculos");
    }else{
        console.log("Reprovado nos testes! é necessário um novo levantamento em campo!"); return;
    }
    
    let _PositionsCorrected = CorrigirProjeções(_ProjeçõesRelativas, _Distances, _Perímetro);
    //console.log(_PositionsCorrected[0]);
    //_PositionsCorrected.forEach(function (element){ console.log(element); })

    let _CoordenadasTotais = CoordenadasTotais(new Vector(100,200), _PositionsCorrected);
    //_CoordenadasTotais.forEach(function (element){ console.log(element); })
    
    let _AzimutesCorrigidos = AzimutesCorrigidos(_PositionsCorrected);
    //_AzimutesCorrigidos.forEach(function (element){ console.log(element); })
    
    let _LadosCorrigidos = LadosCorrigidos(_PositionsCorrected);
    //_LadosCorrigidos.forEach(function (element){ console.log(element); })


}


function sum(...valores){
    let resultado = 0;

    valores.forEach(function (element) {
        resultado += element.AngleInt;
    })
    
    return toAngle(resultado);
}

function SomatórioAngularInternos(_n){
    return new Angle(180 * (_n - 2),0,0)
}

function SomatórioAngularExternos(_n){
    return new Angle(180 * (_n + 2),0,0)
}

function CalculoSomatórioAngular(_Angles){
    let result = new Angle(0,0,0);

    _Angles.forEach(element => {
        result = sum(result, element);
    })
    
    return result;
}

function ErroAngular(_Sa, _ExatoAngular){
    return sum(_Sa, _ExatoAngular.negativo);
}

function TolerânciaAngular(_K, _Vertices){
    //_K é a precisão do aparelho
    return toAngle( (new Angle(0,0,_K)).AngleInt * (Math.sqrt(_Vertices)));
}

function CorreçãoVértice(_ErroAngular, _Vertices){
    return toAngle((_ErroAngular.AngleInt)/_Vertices).negativo;
}

function CorreçãoDosAngulos(_Angulos, _Correção){
    let result = [_Angulos.length];
    for(let i = 0; i < _Angulos.length; i++){
        
        result[i] = sum(_Angulos[i], _Correção);
    }

    return result;
}


function CalculoAzimutes(_AzimuteNorte, _Angulos){

    let result = [_Angulos.length];
    result[0] = _AzimuteNorte;
    //console.log(result[0]);

    for(let i = 1; i < _Angulos.length; i++){
        //console.log(result[i - 1]);        console.log( " + ");  console.log(_Angulos[i]);
        result[i] = sum(result[i - 1], _Angulos[i]);
        //console.log(result[i]);

        if(result[i].AngleInt < 180){ result[i] = toAngle(result[i].AngleInt + 180);}
        else if(result[i].AngleInt >= 540){  result[i] = toAngle(result[i].AngleInt - 540); }
        else if(result[i].AngleInt >= 180 && result[i].AngleInt < 540){ result[i] = toAngle(result[i].AngleInt - 180);}
        
    }

    result[0] = toAngle(_Angulos[0].AngleInt + result[result.length - 1].AngleInt);

    if(result[0].AngleInt < 180){ result[0] = toAngle(result[0].AngleInt + 180);}
    else if(result[0].AngleInt >= 540){  result[0] = toAngle(result[0].AngleInt - 540); }
    else if(result[0].AngleInt >= 180 && result[0].AngleInt < 540){ result[0] = toAngle(result[0].AngleInt - 180);}
    

   //console.log(result[0]);

    return result;
}

function CalculoPosição(_Distância, _Azimute){
    let _AzimuteCooked = _Azimute.AngleInt * (Math.PI / 180);

    let x = _Distância * Math.sin(_AzimuteCooked);
    let y = _Distância * Math.cos(_AzimuteCooked);
    
    return new Vector(x,y);
}

function ProjeçõesRelativas(_Azimutes, _Distances){
    let result = [_Azimutes.length];

    for(let i = 0; i < _Azimutes.length; i++){
        result[i] = CalculoPosição(_Distances[i], _Azimutes[i]);
    }

    return result;
}

function SomatórioPosições(_Positions){
    let result = new Vector(0,0);

    _Positions.forEach( function (element) {
        result[0] += element[0];
        result[1] += element[1];
    });

    return result;
}

function CalculoErroLinearTotal(_SomatórioPosições){
    return Math.sqrt((_SomatórioPosições[0] ** 2 ) + (_SomatórioPosições[1] ** 2));

}

function ErroLinearPermitido(_Perímetro, _Precisão){
    return _Perímetro / _Precisão;
}

function CorrigirProjeções(_Positions, _Distances, _Perímetro){
    let result = [_Positions.length];
    let deltaX = (SomatórioPosições(_Positions)[0] / _Perímetro);
    let deltaY = (SomatórioPosições(_Positions)[1] / _Perímetro);

    //console.log( -(deltaX * _Distances[0]))

    for(let i = 0; i < _Positions.length; i++){
        let corrigidoX = _Positions[i][0] + (-(deltaX * _Distances[i]));
        let corrigidoY = _Positions[i][1] + (-(deltaY * _Distances[i]));;

        result[i] = new Vector(corrigidoX, corrigidoY); 
        //console.log(result[i]);
    }
    
    return result;
}

function SomatórioCorrigidas(_Corrigidas){
    let x = 0;
    let y = 0;

    _Corrigidas.forEach(function(element){
        x += element[0];
        y += element[1];
    });
    
    return new Vector((Math.round(x * 10000))/10000,(Math.round(y * 10000))/10000);
}


function CoordenadasTotais(_StartPoint, _Corrigidas){
    let result = [_Corrigidas.length];
    result[0] = new Vector(_StartPoint[0], _StartPoint[1]);

    for(let i = 1; i < _Corrigidas.length; i++){
        let totalX = result[i-1][0] + _Corrigidas[i - 1][0];
        let totalY = result[i-1][1] + _Corrigidas[i - 1][1];

        result[i] = new Vector((Math.round(totalX * 10000000))/10000000, (Math.round(totalY * 10000000))/10000000);
    }

    return result;
}


function AzimutesCorrigidos(_Corrigidas){
    let result = [_Corrigidas.length]
    
    for(let i = 0; i < _Corrigidas.length; i++){

        let deltaX = _Corrigidas[i][0];
        let deltaY = _Corrigidas[i][1];

        let resultado =  Math.atan(deltaX/deltaY)/(Math.PI / 180);

        if(deltaX > 0 && deltaY > 0){
            result[i] = toAngle(Math.abs(resultado));

        }
        if(deltaX > 0 && deltaY < 0){
            result[i] = toAngle(180 - Math.abs(resultado)); 

        }
        if(deltaX < 0 && deltaY > 0){
            result[i] = toAngle(360 - Math.abs(resultado));      

        }
        if(deltaX < 0 && deltaY < 0){
            result[i] = toAngle(180 + Math.abs(resultado)); 
        }
    }
    
    return result;
}


function LadosCorrigidos(_CoordenadasTotais){
    result = [_CoordenadasTotais.length];
    
    for(let i = 0; i < _CoordenadasTotais.length; i++){

        let squareRoot = ((_CoordenadasTotais[i][0])**2) + (_CoordenadasTotais[i][1])**2
        result[i] = Math.sqrt(squareRoot);
    }
    return result;
}



function toAngle(_value){
    let result = new Angle(0,0,0);

    result.minutes = 60 * (_value - Math.trunc(_value));
    result.angle = (Math.trunc(_value));

    result.seconds = Math.round( 60 * (result.minutes - Math.trunc(result.minutes)) * 10000  ) / 10000;
    //result.seconds = 60 * (result.minutes - Math.trunc(result.minutes));
    result.minutes = (Math.trunc(result.minutes));

    return result;
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