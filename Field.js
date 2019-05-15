(function() {

    var canvas = document.getElementById('CanvasField');
    var ctx = canvas.getContext('2d');
    
    //свойства мяча
    var posBall_x = 0;
    var posBall_y = 0;
    var ballRadius = 50;
    var ballElasticity = 0.7;
    var speedBall_x = 0;
    var speedBall_y = 0;
    var acceleration = -0.05;

    var forceKick_x = 10;
    var forceKick_y = 10;

    // свойства треугольника
    var point1_x = 0;
    var point1_y = 0;
    var point2_x = 0;
    var point2_y = 0;
    var point3_x = 0;
    var point3_y = 0;


    window.addEventListener('resize', resizeCanvas, false);

    function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            posBall_x = canvas.width / 2;
            posBall_y = canvas.height - ballRadius;
            setCoordinatesPointsTriangle();
            
            draw();
    }
    resizeCanvas();



    //отрисовка мяча
    function drawBall() {
        ctx.beginPath();
        ctx.arc(posBall_x, posBall_y, ballRadius, 0, Math.PI*2);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.closePath();
    }

    //отрисовка треугольника
    function drawTriangle()
    {
        ctx.beginPath();
        ctx.moveTo(point1_x, point1_y);
        ctx.lineTo(point2_x, point2_y);
        ctx.lineTo(point3_x, point3_y);
        ctx.lineTo(point1_x, point1_y);
        ctx.fillStyle = "yellow";
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBall();
        drawTriangle();
        
        calculationPosition();
    }
    setInterval(draw, 10);

    

    //расчет позиции мяча
    function calculationPosition()
    {
        wallReflection();

        if(commonSectionCircle(point1_x, point2_x, point1_y, point2_y))
            angleReflection(point1_x, point2_x, point1_y, point2_y);

        else if (commonSectionCircle(point2_x, point3_x, point2_y, point3_y))
            angleReflection(point2_x, point3_x, point2_y, point3_y);

        else if (commonSectionCircle(point3_x, point1_x, point3_y, point1_y))
            angleReflection(point3_x, point1_x, point3_y, point1_y);

        else
            isKick = false;

        posBall_x += speedBall_x;
        posBall_y += speedBall_y;
    }
    
    //отскок от стенки
    function wallReflection()
    {
        if(posBall_x + speedBall_x > canvas.width-ballRadius || posBall_x + speedBall_x < ballRadius) {
            speedBall_x = - ballElasticity * speedBall_x;
        }

        if(posBall_y + speedBall_y < ballRadius || posBall_y + speedBall_y > canvas.height-ballRadius) {
            speedBall_y = - ballElasticity * speedBall_y;
        }

        if(canvas.height - ballRadius > posBall_y)
            speedBall_y -= acceleration; 

    }

    //опеределяем угол отражения от отрезка
    function angleReflection(x1, x2, y1, y2)
    {
        //определяем вектор нормали (ненормтированный)
        var n_x = y1 - y2;
        var n_y = x2 - x1;

        var n = Math.sqrt(n_x * n_x + n_y * n_y);

        //нормализация вектора
        n_x = n_x / n;
        n_y = n_y / n;

        //вычиление сколярного произведения
        var scal = speedBall_x * n_x + speedBall_y * n_y;
        posBall_x -= speedBall_x;
        posBall_y -= speedBall_y;
        //определение направления мяча
        speedBall_x = (speedBall_x - 2 * scal * n_x) * ballElasticity;
        speedBall_y = (speedBall_y - 2 * scal * n_y) * ballElasticity;
    }

    //возвращает true, если есть пересения на отрезке
    function commonSectionCircle(x1, x2, y1, y2)
    {
        x1 -= posBall_x;
        y1 -= posBall_y;
        x2 -= posBall_x;
        y2 -= posBall_y;

        dx = x2 - x1;
        dy = y2 - y1;
        
        //составляем коэффициенты квадратного уравнения на пересечение прямой и окружности.
        //если на отрезке [0..1] есть отрицательные значения, значит отрезок пересекает окружность
        var a = dx * dx + dy * dy;
        var b = 2 * (x1 * dx + y1 * dy);
        var c = x1 * x1 + y1 * y1 - ballRadius * ballRadius;

        //проверяем, есть ли на отрезке [0..1] решения
        if (-b < 0)
            return (c < 0);
        if (-b < (2 * a))
            return ((4 * a * c - b * b) < 0);

        return (a+b+c < 0);
    }



    //задание координат для треугольника
    function setCoordinatesPointsTriangle()
    {
        point1_x = randomInteger(-300, 300);
        point1_y = randomInteger(-300, 300);
        point2_x = randomInteger(-300, 300);
        point2_y = randomInteger(-300, 300);
        point3_x = randomInteger(-300, 300);
        point3_y = randomInteger(-300, 300);

        var center_x = (point1_x + point2_x + point3_x) / 3;
        var center_y = (point1_y + point2_y + point3_y) / 3;

        point1_x += -center_x + canvas.width / 2;
        point1_y += -center_y + canvas.height / 2;
        point2_x += -center_x + canvas.width / 2;
        point2_y += -center_y + canvas.height / 2;
        point3_x += -center_x + canvas.width / 2;
        point3_y += -center_y + canvas.height / 2;
    }

    //задание рандомного значения
    function randomInteger(min, max) {
        var rand = min + Math.random() * (max - min)
        rand = Math.round(rand);
        return rand;
    }



    //удар по мячу
    function kick(x, y)
    {
        speedBall_x += - x * forceKick_x;
        speedBall_y += - y * forceKick_y;
    }

    canvas.addEventListener('click', function(e) {
        //проверяем, попали по мячу или нет.
        var distance_X  = e.x - posBall_x;
        var distance_Y  = e.y - posBall_y;

        //находим дистанцию между центром мяча и местом клика.
        var distance = Math.sqrt(distance_X * distance_X + distance_Y * distance_Y);

        if(distance < ballRadius)
        {
            //нормализация вектора
            distance_X = distance_X / distance;
            distance_Y = distance_Y / distance;

            kick(distance_X, distance_Y);
        }
    });
})();