;(function (window) {
    function Particle (dom) {
        this.dom = dom;
        this.nodes = [];
        this.lines = [];
        this.mousePos = [0, 0];
        let defaultSetting = {
            width: 600,
            height: 500,
            backgroundColor: '#fff',
            easingFactor: 5,
            nodeCount: 100,
            lineColor: '#aaa',
        };
        this.option = _extend(defaultSetting, this.getCustomSetting());
        // 生成canvas
        this.ctx = this.createCanvas();
        this.createNodes();
        window.onmousemove = function(particle) {
            let e = window.event;
            particle.mousePos[0] = e.clientX;
            particle.mousePos[1] = e.clientY;
        };
        window.onmousemove(this);
        window.onresize = function (particle) {
            particle.canvas.width = particle.option.width;
            particle.canvas.height = particle.option.height;

            if(particle.nodes.length == 0) {
                particle.createNodes();
            }
            particle.render();
        }

        window.onresize(this); // trigger the event manually.
        window.requestAnimationFrame = function () {
            return requestAnimationFrame.bind(this);
        }
        window.requestAnimationFrame(this.step)
    }

    Particle.prototype = {
        contructor: Particle,
        getCustomSetting: function () {
            return this.dom.getAttribute('particle-set') || {};
        },
        createCanvas: function () {
            let canvas = document.createElement('canvas'),
                ctx;

            canvas.width = this.option.width;
            canvas.height = this.option.height;
            this.canvas = canvas;
            this.dom.appendChild(canvas);

            ctx = canvas.getContext('2d');
            // 添加背景色
            ctx.fillStyle = this.option.backgroundColor;
            ctx.fillRect(0, 0, canvas.width, canvas.width);
            return ctx;
        },
        createNodes: function () {
            for(let i = 0; i < this.option.nodeCount; i++){
                this.nodes.push({
                    drivenByMouse: i == 0,
                    x: Math.random() * this.option.width,
                    y: Math.random() * this.option.height,
                    vx: Math.random() * 1 - 0.5,
                    vy: Math.random() * 1 - 0.5,
                    radius: Math.random() > 0.9 ? 2 + Math.random() * 2 : 1 + Math.random() * 2
                });
            }
            let len = this.nodes.length;
            for(let n = 0; n < len; n++){
                for(let m = n; m < len; m++){
                    this.lines.push({from: this.nodes[n], to: this.nodes[m]});
                }
            }
        },
        step: function () {
            let w = this.option.width,
                h = this.option.height;
            this.nodes.forEach(function (item) {
                if(item.drivenByMouse){
                    return;
                }
                item.x += item.vx;
                item.y += item.vy;
                if(item.x <= 0 || item.x >= w){
                    item.vx *= -1;
                    item.x = clamp(0, w, item.x);
                }
                if(item.y <= 0 || item.y >= h){
                    item.vy *= -1;
                    item.y = clamp(0, w, item.y);
                }
            });
            this.adjustNodeDrivenByMouse();
            this.render();
            this.requestAnimationFrame(this.step);
        },
        adjustNodeDrivenByMouse: function () {
            this.nodes[0].x += (this.mousePos[0] - this.nodes[0].x) / this.easingFactor;
            this.nodes[0].y += (this.mousePos[1] - this.nodes[0].y) / this.easingFactor;
        },
        lengthOfEdge: function (line) {
            return Math.sqrt(Math.pow((line.from.x - line.to.x), 2) + Math.pow((line.from.y - line.to.y), 2));
        },
        render: function () {
            let ctx = this.ctx,
                _this = this;
            this.lines.forEach(function (item) {
                let l = _this.lengthOfEdge(item),
                    threshold = _this.canvas.width / 8;
                if(l > threshold){
                    return;
                } 
                ctx.strokeStyle = _this.option.lineColor;
                ctx.lineWidth = (1 - l / threshold) * 2.5;
                ctx.globalAlpha = 1 - l / threshold;
                ctx.beginPath();
                ctx.moveTo(item.from.x, item.from.y);
                ctx.lineTo(item.to.x, item.to.y);
                ctx.stroke();
            });
        }
    };

    function _extend () {
        let result = {},
            isDepthExtend = true,
            prop;
        if(!arguments.length){
            return result;
        }

        Array.prototype.forEach.call(arguments, function _self(item, index) {
            // 是否深度遍历
            if(!index && _getType(item) === 'Boolean' && item){
                isDepthExtend = true;
            }
            for(prop in item){
                if(item.hasOwnProperty(prop)){
                    if(_getType(item[prop]) === 'object' && isDepthExtend){
                        _self(item);
                    }else{
                        result[prop] = item[prop];
                    }
                }
            }
        });
        return result;
    }

    function _getType (o) {
        return Object.prototype.toString.call(o).slice(8, -1);
    }

    function clamp (mix, max, value) {
        if(mix > value){
            return min;
        }
        if(max < value){
            return max;
        }
        return value;
    }
    window.Particle = Particle;
}(this))