
var canvas = document.querySelector('canvas');
var ctxt = canvas.getContext('2d');
var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;
var balls = [];
var evil = new Evil(20,45,5,5,'white', 20);

evil.setControls();
loop();

function random(min,max) {
  var num = Math.floor(Math.random()*(max-min)) + min;
  return num;
};

function Shape(x,y,vx,vy) {
	this.x = x;
	this.y = y;
	this.vx = vx;
	this.vy = vy;
	this.exists = true;
};

function Evil(x,y,vx,vy,color,r) {
	Shape.call(this,x,y,vx,vy);
	this.color = color;
	this.r = r;

	this.__proto__.draw = function() {

		this.x += this.vx;
		this.y += this.vy;
		ctxt.beginPath();
		ctxt.lineWidth = 3;
		ctxt.strokeStyle = this.color;
		ctxt.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
		ctxt.stroke();
	}

	this.__proto__.checkBounds = function() {

		if(this.x <= 0 + this.r)
		{
			this.x += this.r;
			this.vx = -(this.vx);
		}
		if(this.x >= width - this.r)
		{
			this.x -= this.r;
			this.vx = -(this.vx);
		}
		if(this.y <= 0 + this.r)
		{
			this.y += this.r;
			this.vy = -(this.vy);
		}
		if(this.y >= height - this.r)
		{
			this.y -= this.r;
			this.vy = -(this.vy);
		}
	}

	this.__proto__.setControls = function() {

		var _this = this;
		window.onkeydown = function(e) {

			if(e.keyCode === 37)
			{
				_this.vx -= 3;
			}
			else if(e.keyCode === 39)
			{
				_this.vx += 3;
			}
			else if(e.keyCode === 38)
			{
				_this.vy -= 3;
			}
			else if(e.keyCode === 40)
			{
				_this.vy += 3;
			}
		}
	}

	this.__proto__.colDetect = function() {
		for(var j = 0; j < balls.length; j++){

			if(balls[j].exists === true) {
				var dx = this.x - balls[j].x;
				var dy = this.y - balls[j].y;
				var distance = Math.sqrt(dx * dx + dy * dy);
			}

			if(distance < this.r + balls[j].r) {
					balls[j]['exists'] = false;
			}	
		}		
	}

};



function Ball(x, y, vx, vy, color, r){

	Shape.call(this, x, y, vx, vy);
	this.color = color;
	this.r = r;

	this.__proto__.draw = function() {

		ctxt.beginPath();
		ctxt.fillStyle = this.color;
		ctxt.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
		ctxt.fill();		
	}

	this.__proto__.update = function() {

		if((this.x + this.r) >= width)
		{
			this.vx = -(this.vx);
		}

		if((this.x - this.r) <= 0)
		{
			this.vx = -(this.vx);
		}

		if((this.y + this.r) >= height)
		{
			this.vy = -(this.vy);
		}

		if((this.y - this.r) <= 0)
		{
			this.vy = -(this.vy);
		}

		this.x += this.vx;
		this.y += this.vy;		
	}

	this.__proto__.colDetect = function() {
		for(var j = 0; j < balls.length; j++){

			if(balls[j].exists === true) {

				if(!(this === balls[j])) {
					var dx = this.x - balls[j].x;
					var dy = this.y - balls[j].y;
					var distance = Math.sqrt(dx * dx + dy * dy);
				}

				if(distance < this.r + balls[j].r){
					if(this.x > balls[j].x)
					{
						this.x += this.r / 50;
						balls[j].x -= balls[j].r / 50;
					}
					else if(this.x < balls[j].x)
					{
						this.x -= this.r / 50;
						balls[j].x += balls[j].r / 50;
					}
					if(this.y > balls[j].y)
					{
						this.y += this.r / 50;
						balls[j].y -= balls[j].y / 50;
					}
					else if(this.y < balls[j].y)
					{
						this.y -= this.r / 50;
						balls[j].y += balls[j].r / 50;
					}

				this.vx = -(this.vx);
				this.vy = -(this.vy);
				balls[j].vx = -(balls[j].vx);
				balls[j].vy = -(balls[j].vy);
				}
			}	
		}		
	}

};

function loop(){

	ctxt.fillStyle = 'rgba(0,0,0,0.5)';
	ctxt.fillRect(0,0,width,height);

	while(balls.length < 35){

		var ball = new Ball(
			random(0,width),
			random(0,height),
			random(-7,7),
			random(-7,7),
			'rgb('+random(0,255)+','+random(0,255)+','+random(0,255)+')',
			random(10,20));

		balls.push(ball);
	}

	for(var i = 0; i < balls.length; i++){
		if(balls[i].exists === true)
		{	
			balls[i].update();
			balls[i].colDetect();
			balls[i].draw();
		}
	}

	evil.checkBounds();
	evil.colDetect();
	evil.draw();

	requestAnimationFrame(loop);

};