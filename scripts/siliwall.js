Events.on(ContentInitEvent, cons(function() {
    const siliconWall = Vars.content.block("erekir-lost-sectors-siliwall");

    if (siliconWall == null) {
        Log.err("[Silicon Wall] Not Found!");
        return;
    }

    const unitTypes = [
        UnitTypes.stell,
        UnitTypes.merui,
        UnitTypes.elude
    ];

    Events.on(BlockDestroyEvent, cons(function(event) {
        if (Vars.net.client()) return;

        const tile = event.tile;
        if (tile == null || tile.build == null) return;
        if (tile.build.block != siliconWall) return;

        if (Math.random() >= 0.25) return;

        const team = tile.build.team;
        const x = tile.worldx();
        const y = tile.worldy();
        const unit = unitTypes[
            Math.floor(Math.random() * unitTypes.length)
        ];

        Time.run(1, run(function() {
            unit.spawn(team, x, y);
        }));
    }));
}));
