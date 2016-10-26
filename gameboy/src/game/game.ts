/// <reference path="./../lib/foster.d.ts"/>
class Game
{

	public static TAGS = {
		PLAYER: "player",
		SOLID: "solid"
	};

	public static KEYS = {
		LEFT: "left",
		RIGHT: "right",
		UP: "up",
		DOWN: "down",
		A: "a",
		B: "b",
		START: "start",
		SELECT: "select"
	};

	public static COLORS:Color[] = [
		new Color(155 / 255, 188 / 255, 15 / 255, 1),
		new Color(139 / 255, 172 / 255, 15 / 255, 1),
		new Color(48 / 255, 98 / 255, 48 / 255, 1),
		new Color(15 / 255, 56 / 255, 15 / 255, 1)
	];

	public static start()
	{
		Engine.start("GBJAM 2016", 160, 144, 5, () => { Game.load(); });
	}

	private static load()
	{
		Engine.graphics.clearColor = Game.COLORS[0].clone();

		// kaymapping
		Keys.map(Game.KEYS.LEFT, [Key.left, Key.a]);
		Keys.map(Game.KEYS.RIGHT, [Key.right, Key.d]);
		Keys.map(Game.KEYS.UP, [Key.up, Key.w]);
		Keys.map(Game.KEYS.DOWN, [Key.down, Key.s]);
		Keys.map(Game.KEYS.A, [Key.z, Key.c]);
		Keys.map(Game.KEYS.B, [Key.x, Key.v]);
		Keys.map(Game.KEYS.START, [Key.enter]);
		Keys.map(Game.KEYS.SELECT, [Key.shift]);

		// dust particles
		let template = new ParticleTemplate("dust");
		template.accelX(120, 40);
		template.accelY(-20, 10);
		template.colors([Game.COLORS[0]]);
		template.duration(12);
		template.scale(1, 0);

		// assets
		var assets = new AssetLoader()
			.addAtlas("gfx", "assets/atlas.png", "assets/atlas.json", AtlasType.ASEPRITE)
			.addJson("assets/scenes/bottom.json")
			.addJson("assets/scenes/bottom2.json")
			.load(() => { Game.begin(); });
	}

	private static begin()
	{
		Engine.graphics.clearColor = Game.COLORS[3].clone();
		Engine.graphics.pixel = Assets.atlases["gfx"].get("pixel");
		Engine.goto(new Level("bottom", "start"), false);
	}
}
Game.start();