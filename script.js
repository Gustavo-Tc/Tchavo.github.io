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

function GetFront(_className){
    let bake = document.getElementsByClassName(_className)[0];

    return Number(bake.value);
}

function SetFront(_className, _strings){
    let bake = document.getElementById(_className);

    let result = "";
    for(let i = 0; i < _strings.length; i++){
        result += _strings[i] + "  ";
    }

    bake.innerHTML = result;

}

function GetAngleFront(_className){
	let inputDegrees = GetFront(_className + "graus");
	let inputMinutes = GetFront(_className + "minutos");
	let inputSeconds = GetFront(_className + "segundos");

    return new Angle(inputDegrees, inputMinutes, inputSeconds);
}


function Start(){
    Execute();
}




function Execute(){
    console.log(document.title + " has loaded")

    let _Angulos = new Array(GetAngleFront("horizontal1"), GetAngleFront("horizontal2"), GetAngleFront("horizontal3"));
    //let _Angulos = new Array(new Angle(285,56,3), new Angle(316,20,35), new Angle(297,44,7));
    //_Angulos.forEach(function (element){ console.log(element); })
    let _Norte = GetAngleFront("norte");

    let _Vertices = 3;

    let _Distances = new Array(GetFront("distancia1"), GetFront("distancia2"), GetFront("distancia3"));

    let _Perímetro = 0; _Distances.forEach(element => {  _Perímetro += element;  });
    //console.log(_Perímetro);

    let _SomatórioAngular = CalculoSomatórioAngular(_Angulos);
    SetFront("somatorioangular", new Array("Somatório Angular:", angleToText(_SomatórioAngular)));
    //console.log( _SomatórioAngular);

    let _ExatoAngular = sum(SomatórioAngularExternos(_Vertices));
    SetFront("somatorioangulardevido", new Array("Somatório Angular Devido:", angleToText(_ExatoAngular)));
    //console.log( _ExatoAngular);

    let _ErroAngular = ErroAngular(_SomatórioAngular, _ExatoAngular);
    SetFront("erroangularcometido", new Array("Erro Angular Cometido:", angleToText(_ErroAngular)));

    //console.log(_ErroAngular);

    let _TolerânciaAngular = TolerânciaAngular(30, _Vertices);
    SetFront("erroangularmaximopermitido", new Array("Erro Angular Máximo Permitido:", angleToText(_TolerânciaAngular)));

    //console.log(_TolerânciaAngular);

    if(_ErroAngular.AngleInt >= _TolerânciaAngular.AngleInt){
        SetFront("testedeerroangular", new Array("Desaprovado! ultrapassou limite de erro!"));
        console.log("Desaprovado! ultrapassou limite de erro!"); return;
    }
    else{ 
        SetFront("testedeerroangular", new Array("Passou no teste do limite de erro, continuando operações"));
        console.log("Passou no teste do limite de erro");
    }

    let _CorreçãoPorVértice = CorreçãoVértice(_ErroAngular, _Vertices);
    SetFront("correçaonecessaria", new Array("Correção Necessária:", angleToText(_CorreçãoPorVértice)));

    //console.log(_CorreçãoPorVértice);

    //console.log(_Angulos[0]);

    let _AngulosCorrigidos = CorreçãoDosAngulos(_Angulos, _CorreçãoPorVértice);
    SetFront("anguloscorrigidos", new Array("Angulos Corrigidos:", "Ângulo 1 : " + angleToText(_AngulosCorrigidos[0]), "   Ângulo 2 : " + angleToText(_AngulosCorrigidos[1]), "   Ângulo 3 : " + angleToText(_AngulosCorrigidos[2])));

    //console.log(_AngulosCorrigidos[0]);


    let _Azimutes = CalculoAzimutes(_Norte, _AngulosCorrigidos);
    SetFront("azimutesdospontos", new Array("Azimutes Dos Pontos: ", " Azimute 1: " + angleToText(_Azimutes[0]), "|| Azimute 2: " + angleToText(_Azimutes[1]), "|| Azimute 3: " + angleToText(_Azimutes[2])));
    //Azimutes.forEach(function (element){ console.log(element); })

    let _ProjeçõesRelativas = ProjeçõesRelativas(_Azimutes, _Distances);
    SetFront("projeçoesrelativas", new Array("Projeções Relativas Dos Pontos: ", " Ponto 1: " + rounded(_ProjeçõesRelativas[0]), "|| Ponto 2: " + rounded(_ProjeçõesRelativas[1]), "|| Ponto 3: " + rounded(_ProjeçõesRelativas[2])));
    //_ProjeçõesRelativas.forEach(function (element){ console.log(element); })

    let _SomatórioPosições = SomatórioPosições(_ProjeçõesRelativas);
    //console.log(_SomatórioPosições);

    let _ErroLinearTotal = CalculoErroLinearTotal(_SomatórioPosições);
    SetFront("errolineartotal", new Array("Erro Linear Total: ", round(_ErroLinearTotal, 6)));

    //console.log(_ErroLinearTotal);

    let _ErroLinearPermitido = ErroLinearPermitido(_Perímetro , 200);
    SetFront("errolinearmaximo", new Array("Erro Linear Máximo Permitido: ", round(_ErroLinearPermitido, 6)));

    //console.log(_ErroLinearPermitido);
    
    if(_ErroLinearTotal > _ErroLinearPermitido){
        SetFront("testeerrolinear", new Array("Passou no teste do perímetro, pode prosseguir com os cálculos"));
        console.log("Passou no teste do perímetro, pode prosseguir com os cálculos");
    }else{
        SetFront("testeerrolinear", new Array("Reprovado nos testes! é necessário um novo levantamento em campo!"));
        console.log("Reprovado nos testes! é necessário um novo levantamento em campo!"); return;
    }
    
    let _PositionsCorrected = CorrigirProjeções(_ProjeçõesRelativas, _Distances, _Perímetro);
    SetFront("projeçoescorrigidas", new Array("Projeções Corrigidas Dos Pontos: ", " Ponto 1: " + rounded(_PositionsCorrected[0],6), "|| Ponto 2: " + rounded(_PositionsCorrected[1],6), "|| Ponto 3: " + rounded(_PositionsCorrected[2],6)));
    //console.log(_PositionsCorrected[0]);
    //_PositionsCorrected.forEach(function (element){ console.log(element); })

    let _CoordenadasTotais = CoordenadasTotais(new Vector(100,200), _PositionsCorrected);
    SetFront("coordenadastotais", new Array("Cordenadas Totais Dos Pontos: ", " Ponto 1: " + rounded(_CoordenadasTotais[0],6), "|| Ponto 2: " + rounded(_CoordenadasTotais[1],6), "|| Ponto 3: " + rounded(_CoordenadasTotais[2],6)))
    //_CoordenadasTotais.forEach(function (element){ console.log(element); })
    
    let _AzimutesCorrigidos = AzimutesCorrigidos(_PositionsCorrected);
    SetFront("azimutescorrigidos", new Array("Azimutes Corrigidos Dos Pontos: ", " Ponto 1: " + angleToText(_AzimutesCorrigidos[0]), "|| Ponto 2: " + angleToText(_AzimutesCorrigidos[1]), "|| Ponto 3: " + angleToText(_AzimutesCorrigidos[2])));
    //_AzimutesCorrigidos.forEach(function (element){ console.log(element); })
    
    let _LadosCorrigidos = LadosCorrigidos(_PositionsCorrected);
    SetFront("ladoscorrigidos", new Array("Lados Corrigidos Da Poligonal: ", " D1: " + round(_LadosCorrigidos[0], 6), " D2: " + round(_LadosCorrigidos[1], 6), " D3: " + round(_LadosCorrigidos[2], 6)));
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

function round(_value , _casas = 4){
    return Math.round( _value * (10 ** _casas) ) / (10 ** _casas);
}

function rounded(_value , _casas = 4){
   let x = round(_value[0], _casas);
   let y = round(_value[1], _casas);

   return new Vector(x,y);
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
    let Text = _angle.angle + "°" + _angle.minutes + "'" + _angle.seconds + "''";
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