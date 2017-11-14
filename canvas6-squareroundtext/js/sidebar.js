//侧边栏 
var btn = document.getElementById("btn");
var control = document.getElementById("control");

btn.addEventListener('click', function(e){
	control.classList.toggle("slide");
}, false)


//粒子选择
var ball = document.getElementById("ball");
var rect = document.getElementById("rect");

function chose(particleName){
    particleName.addEventListener('click', function(e){
        this.style.backgroundColor = "orange";
        (particleName == ball ? rect : ball).style.backgroundColor = "rgba(0, 0, 0, 0)";
        type = (type === "ball" ? "rect" : "ball");
        change();
        
    }, false)
}

chose(ball);
chose(rect);