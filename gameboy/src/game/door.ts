/// <reference path="./../lib/foster.d.ts"/>
class Door extends Entity
{

	public name:string;
	public gotoScene:string;
	public gotoDoor:string;

	private spawnPlayer:boolean;
	private spawnPlayerTimer = 1;
	private hitbbox:Hitbox;
	private playerOn:boolean = true;
	private isOpen:boolean = true;
	private closedEase:number = 1;

	constructor(name:string, gotoScene:string, gotoDoor:string, spawnPlayer:boolean)
	{
		super();

		this.name = name;
		this.gotoScene = gotoScene;
		this.gotoDoor = gotoDoor;
		this.spawnPlayer = spawnPlayer;

		this.add(this.hitbbox = new Hitbox(-4, -8, 8, 8));
	}

	public added():void
	{
		if (this.spawnPlayer)
			this.scene.camera.position.set(this.x, this.y - 64);
	}

	public update():void
	{
		// spawn the player
		if (this.spawnPlayer && this.spawnPlayerTimer > 0)
		{
			this.spawnPlayerTimer -= Engine.delta * 1.25;
			this.scene.camera.position.set(this.x, this.y - Ease.cubeIn(this.spawnPlayerTimer) * 64);
			if (this.spawnPlayerTimer <= 0)
			{
				let player:Player;
				this.scene.add(player = new Player(), new Vector(this.x, this.y));
				player.physics.speed.y = 120;
				this.closedEase = 0;
			}
		}
		// check for the player
		else
		{
			// player is on us, try to enter
			if (this.hitbbox.check(Game.TAGS.PLAYER))
			{
				if (this.gotoScene.length > 0 && !this.playerOn)
				{
					this.scene.remove(this.scene.find(Player));
					this.playerOn = true;
					(<Level>this.scene).doSlide(1, 0, () => { Engine.goto(new Level(this.gotoScene, this.gotoDoor), false); })
				}
			}
			// player is no longer on us (close if we have no where to go)
			else
			{
				if (this.isOpen && this.gotoScene.length <= 0)
				{
					this.hitbbox.tag(Game.TAGS.SOLID);
					this.isOpen = false;
				}
				this.playerOn = false;

				if (!this.isOpen)
					this.closedEase = Calc.approach(this.closedEase, 1, Engine.delta);
			}
		}
	}

	public render():void
	{
		Engine.graphics.rect(this.x + -6, this.y - 13, 12, 13, Game.COLORS[3]);
		Engine.graphics.rect(this.x + -5, this.y - 12, 10, 12, Game.COLORS[2]);
		Engine.graphics.rect(this.x + -4, this.y - 11, 8, 11, Game.COLORS[3]);

		if (!this.isOpen)
			Engine.graphics.rect(this.x + -3, this.y - 10, 6, 10 * this.closedEase, Game.COLORS[2]);
	}
}