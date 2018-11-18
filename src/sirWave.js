export default class SirWave {
    constructor(opt){
        this.opt = opt || {};

        this.K = 2;
        this.F = 2;
        this.speed = this.opt.speed || 0.1;
        this.noise = this.opt.noise || 0;
        this.phase = this.opt.phase || 0;
        this.lines = this.opt.lines || [
			[-2, 'rgba(255,255,255, 0.1)'],
			[-6, 'rgba(255,255,255,0.2)'],
			[4, 'rgba(255,255,255,0.4)'],
			[2, 'rgba(255,255,255,0.6)'],
			[1, 'rgba(255,255,255,1)', 1.5],
		];

        if (!devicePixelRatio) devicePixelRatio = 1;
        this.width = devicePixelRatio * (this.opt.width || 320);
        this.height = devicePixelRatio * (this.opt.height || 100);
        this.MAX = (this.height/2)-4;

		if(this.opt.ctx){
			this.ctx = this.opt.ctx
		}else{
			this.canvas = document.createElement('canvas');
			this.canvas.width = this.width;
			this.canvas.height = this.height;
			this.canvas.style.width = (this.width/devicePixelRatio)+'px';
			this.canvas.style.height = (this.height/devicePixelRatio)+'px';
			(this.opt.container || document.body).appendChild(this.canvas);
			this.ctx = this.canvas.getContext('2d');
		}
        this.run = false;
    }

    _globalAttenuationFn=(x)=>{
		return Math.pow(this.K*4/(this.K*4+Math.pow(x,4)),this.K*2);
	}

	_drawLine=(attenuation, color, width)=>{
		this.ctx.moveTo(0,0);
		this.ctx.beginPath();
		this.ctx.strokeStyle = color;
		this.ctx.lineWidth = width || 1;
		var x, y;
		for (var i=-this.K; i<=this.K; i+=0.01) {
			x = this.width*((i+this.K)/(this.K*2));
			y = this.height/2 + this.noise * this._globalAttenuationFn(i) * (1/attenuation) * Math.sin(this.F*i-this.phase);
			this.ctx.lineTo(x, y);
		}
		this.ctx.stroke();
	}

	_clear=()=>{
		this.ctx.globalCompositeOperation = 'destination-out';
		this.ctx.fillRect(0, 0, this.width, this.height);
		this.ctx.globalCompositeOperation = 'source-over';
	}

	_draw=()=>{
		if (!this.run) return;

		this.phase = (this.phase+this.speed)%(Math.PI*64);
		this._clear();

		this.lines.forEach((line)=>{
			this._drawLine.apply(this, line)
		})

		requestAnimationFrame(this._draw.bind(this), 1000);
	}

	start=()=>{
		this.phase = 0;
		this.run = true;
		this._draw();
	}

	stop=()=>{
		this.run = false;
		this._clear();
	}

	pause=()=>{
		this.run = false;
	}

	setNoise=(v)=>{
		this.noise = Math.min(v, 1)*this.MAX;
	}

	setSpeed=(v)=>{
		this.speed = v;
	}

	set=(noise, speed)=>{
		this.setNoise(noise);
		this.setSpeed(speed);
	}
}