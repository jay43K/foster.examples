/// <reference path="./../lib/foster.d.ts"/>
class Player extends Entity
{
	public physics:Physics;
	private rect:Rectsprite;

	constructor()
	{
		super();

		this.add(this.physics = new Physics(-3, -4, 6, 4, [Game.TAGS.PLAYER], [Game.TAGS.SOLID]));
		this.add(this.rect = new Rectsprite(6, 8, Game.COLORS[0].clone()));
		this.rect.origin.set(3, 8);

		this.physics.onCollideX = () => { this.physics.speed.x = 0; }
		this.physics.onCollideY = () => { this.physics.speed.y = 0; }
	}

	public update():void
	{
		super.update();

		if (Keys.mapDown(Game.KEYS.LEFT))
			this.physics.speed.x -= 200 * Engine.delta;
		else if (Keys.mapDown(Game.KEYS.RIGHT))
			this.physics.speed.x += 200 * Engine.delta;
		else
			this.physics.friction(200, 0);
		
		if (Keys.mapDown(Game.KEYS.UP))
			this.physics.speed.y -= 200 * Engine.delta;
		else if (Keys.mapDown(Game.KEYS.DOWN))
			this.physics.speed.y += 200 * Engine.delta;
		else
			this.physics.friction(0, 200);

		this.physics.circularMaxspeed(48);
		this.scene.camera.position.x = this.x;//+= (this.x - this.scene.camera.position.x) / 10;
		this.scene.camera.position.y = this.y;//+= (this.y - this.scene.camera.position.y) / 10;
	}
}