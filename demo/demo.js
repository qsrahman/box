/*global Class, Engine, Box */
var AbstractBox = Class(function(world, position, extend, mass) {
    this.aabb = new Box.AABB(position, extend, mass);
    this.aabb.user = this;

}, {

    render: function(context, color) {

        var p = this.aabb.pixelPosition,
            v = this.aabb.velocity,
            s = this.aabb.extend;

        context.save();

        context.globalAlpha = 0.25;
        context.fillStyle = color;
        context.fillRect(
            p.x - s.x,
            p.y - s.y,
            s.x * 2,
            s.y * 2
        );

        var width = 2;
        context.globalAlpha = 1;
        context.lineWidth = width;
        context.strokeStyle = color;
        context.strokeRect(
            p.x - s.x + width - 1,
            p.y - s.y + width - 1,
            s.x * 2 - width,
            s.y * 2 - width
        );

        var d = v.unit(),
            cx = p.x,
            cy = p.y;

        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(cx, cy);
        context.lineTo(cx + d.x * s.x, cy + d.y * s.y);
        context.stroke();

        context.restore();

    }

});


var StaticBox = Class(function(world, position, extend) {
    AbstractBox(this, world, position, extend, 0);

}, AbstractBox, {

    render: function(context) {
        AbstractBox.render(this, context, '#999999');
    }

});


var DynamicBox = Class(function(world, position, extend) {
    AbstractBox(this, world, position, extend, 10);

}, AbstractBox, {

    render: function(context) {
        AbstractBox.render(this, context, '#ccff00');
    }

});


var Game = Class(function() {

    this.world = new Box.World(new Box.Vector2(0, 200));
    this.boxes = [];

    Engine(this, 'scene', 480, 480);
    this.start(30);

}, Engine, {

    update: function(time, dt) {
        this.world.update(dt);
    },

    render: function(context, time, dt) {

        context.save();
        context.clearRect(0, 0, 480, 480);
        context.translate(240, 240);

        for(var i = 0; i < this.boxes.length; i++) {
            this.boxes[i].render(context);
        }

        for(i = 0; i < this.world.contactCount; i++) {
            var contact = this.world.contacts[i];
            this.renderContact(context, contact);
        }

        context.restore();

    },

    renderContact: function(context, m) {

        var a = m.a,
            b = m.b,
            contacts = m.contacts;

        if (m.contactCount === 2) {

            var c = contacts[0],
                d = contacts[1],
                o = c.add(d).mul(0.5);

            context.fillStyle = '#00ff00';
            context.fillRect(
                c.x - Math.abs(m.normal.x),
                c.y - Math.abs(m.normal.y),
                Math.max(d.x - c.x, 2),
                Math.max(d.y - c.y, 2)
            );

            context.fillStyle = '#ff0000';
            context.fillRect(c.x - 1, c.y - 1, 2, 2);

            context.fillStyle = '#0000ff';
            context.fillRect(d.x - 1, d.y - 1, 2, 2);

            context.fillStyle = '#cc00ff';
            context.fillRect(Box.round(o.x - 1), Box.round(o.y - 1), 2, 2);

        }

    },

    addBox: function(box) {
        this.world.add(box.aabb);
        this.boxes.push(box);
        return box;
    }

});

var game = new Game();
var ground = game.addBox(new StaticBox(this, { x: 0, y: 0 }, { x: 100, y: 20}));
game.addBox(new StaticBox(this, { x: 150, y: 0 }, { x: 50, y: 20}));
game.addBox(new StaticBox(this, { x: -135, y: 0 }, { x: 10, y: 50}));
//
//var a = game.addBox(new DynamicBox(this, { x: 0, y: -200 }, { x: 10, y: 10}));

var b = game.addBox(new DynamicBox(this, { x: 0, y: -100 }, { x: 20, y: 20}));
var c = game.addBox(new DynamicBox(this, { x: -100, y: -100 }, { x: 20, y: 20}));
var d = game.addBox(new DynamicBox(this, { x: 50, y: -40 }, { x: 20, y: 20}));

game.addBox(new DynamicBox(this, { x: 0, y: -200 }, { x: 20, y: 20}));
//game.addBox(new DynamicBox(this, { x: 0, y: -300 }, { x: 20, y: 20}));
//game.addBox(new DynamicBox(this, { x: 0, y: -400 }, { x: 20, y: 20}));
//game.addBox(new DynamicBox(this, { x: 0, y: -500 }, { x: 20, y: 20}));
//game.addBox(new DynamicBox(this, { x: 0, y: -600 }, { x: 20, y: 20}));

c.aabb.applyImpulse(-70, 0, 0, 0);
d.aabb.applyImpulse(1500, 0, 0, 0);
