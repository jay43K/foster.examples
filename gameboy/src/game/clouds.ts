/// <reference path="./../lib/foster.d.ts"/>
class Clouds extends Entity
{
	private sprite:Graphic;
	private timerY:number;
	private timerX:number;

	constructor(index:string, depth:number)
	{
		super();

		this.add(this.sprite = new Graphic(Assets.atlases["gfx"].get("clouds " + index)));
		this.sprite.origin.set(this.sprite.width / 2, this.sprite.height / 2);
		this.depth = depth;
		this.timerY = Math.random() * Math.PI * 2;
		this.timerX = Math.random() * Math.PI * 2;
	}

	public update():void
	{
		this.timerY += Engine.delta;
		this.timerX += Engine.delta;
		this.sprite.x = Math.sin(this.timerX * 2) * 4;
		this.sprite.y = Math.sin(this.timerY) * 2;
	}
}