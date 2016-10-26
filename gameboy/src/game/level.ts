/// <reference path="./../lib/foster.d.ts"/>
class Level extends Scene
{
	
	private scene:string;
	private entrance:string;
	private dust:ParticleSystem;
	private slider:number = 0;
	private sliderTo:number = -1;
	private sliderOnEnd:()=>void;

	public constructor(scene:string, entrance:string)
	{
		super();

		this.scene = scene;
		this.entrance = entrance;
	}

	public begin():void
	{
		super.begin();
		
		this.camera.origin.set(Engine.width / 2, Engine.height / 2);
		this.camera.position.set(Engine.width / 2, Engine.height / 2);

		let terrain = this.add(new Entity());
		terrain.depth = 1;

		let level:any = Assets.json["assets/scenes/" + this.scene + ".json"];
		for (let i = 0; i < level.layers.length; i ++)
		{
			let layer = level.layers[i];
			if (layer.name == "terrain")
			{
				let tilemap = new Tilemap(Assets.atlases["gfx"].get("tilemap"), 8, 8);
				terrain.add(tilemap);

				let rows = layer.data.split('\n');
				for (let y = 0; y < rows.length; y ++)
				{
					let x = 0;
					let tiles = rows[y].split(',');
					for (let j = 0; j < tiles.length - 1; j ++)
					{
						if (tiles[j] == "-1")
						{
							x ++;
							continue;
						}

						let tx = tiles[j];
						let ty = tiles[j + 1];

						tilemap.set(parseInt(tx), parseInt(ty), x, y);

						x ++;
						j ++;
					}
				}
			}
			else if (layer.name == "solids")
			{
				let solids = new Hitgrid(8, 8, [Game.TAGS.SOLID]);
				terrain.add(solids);

				let rows = layer.data.split('\n');
				for (let y = 0; y < rows.length; y ++)
					for (let x = 0; x < rows[y].length; x ++)
						if (rows[y][x] == '1')
							solids.set(true, x, y);
			}
			else if (layer.name == "bgclouds")
			{
				for (let j = 0; j < layer.entities.length; j ++)
					this.add(new Clouds(layer.entities[j].index, 10), new Vector(layer.entities[j].x, layer.entities[j].y));
			}
			else if (layer.name == "fgclouds")
			{
				for (let j = 0; j < layer.entities.length; j ++)
					this.add(new Clouds(layer.entities[j].index, -10), new Vector(layer.entities[j].x, layer.entities[j].y));
			}
			else if (layer.name == "entities")
			{
				for (let j = 0; j < layer.entities.length; j ++)
				{
					let entity = layer.entities[j];
					if (entity.name == "door")
					{
						this.add(new Door(entity.doorName, entity.gotoScene, entity.gotoDoor, entity.doorName == this.entrance), new Vector(parseInt(entity.x), parseInt(entity.y)));
					}
				}
			}
		}

		// dust entity
		let dustEntity = new Entity();
		dustEntity.depth = -100;
		dustEntity.add(this.dust = new ParticleSystem("dust"));
		this.add(dustEntity);

		for  (let i = 0; i < 100; i ++)
		{
			dustEntity.update();
			this.dust.burst(this.camera.position.x - Engine.width, this.camera.position.y - Engine.height + Math.random() * Engine.height * 2, 0);
		}
	}

	public doSlide(from:number, to:number, onEnd: () => void):void
	{
		this.slider = from;
		this.sliderTo = to;
		this.sliderOnEnd = onEnd;
	}

	public update():void
	{
		super.update();

		if (this.slider  != this.sliderTo)
		{
			this.slider = Calc.approach(this.slider, this.sliderTo, Engine.delta * 1.5);
			if (this.slider == this.sliderTo && this.sliderOnEnd != undefined && this.sliderOnEnd != null)
				this.sliderOnEnd();
		}

		this.dust.burst(this.camera.position.x - Engine.width, this.camera.position.y - Engine.height + Math.random() * Engine.height * 2, 0);
	}

	public render():void
	{
		super.render();

		if (this.slider > -1 || this.slider < 1)
		{
			let color = Game.COLORS[0];
			let px = this.camera.position.x + Ease.cubeInOut(this.slider) * (Engine.width + 32);
			let py = this.camera.position.y - Engine.height / 2;
			let left = px - Engine.width / 2;
			let right = px + Engine.width / 2;

            Engine.graphics.setRenderTarget(Engine.graphics.buffer);
            Engine.graphics.shader = Shaders.texture;
			Engine.graphics.shader.set("matrix", this.camera.matrix);
			Engine.graphics.pixelRect(new Rectangle(left - 1, py, Engine.width + 2, Engine.height), color);
			Engine.graphics.pixelTriangle(new Vector(left, py), new Vector(left - 32, py + Engine.height), new Vector(left, py + Engine.height), color);
			Engine.graphics.pixelTriangle(new Vector(right, py), new Vector(right + 32, py), new Vector(right, py + Engine.height), color);
		}
	}
}