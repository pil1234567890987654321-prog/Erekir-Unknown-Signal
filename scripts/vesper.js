
var VESPER_BUILD_X = 21;
var VESPER_BUILD_Y = 51.4;
var VESPER_WING_MOVE = 3;
var VESPER_SMALL_MOVE = 3;
var VESPER_CELL_Z = 0.02;

var vesperType = null;
var vesperCellL = null;
var vesperCellR = null;

var vesperLogged = false;
var vesperErrCount = 0;
var vesperSearchTimer = 0;

var VLayer = Packages.mindustry.graphics.Layer;

function vesperFindAssets(){
    var units = Vars.content.units();

    for(var i = 0; i < units.size; i++){
        var u = units.get(i);

        if(u.name == "vesper" || u.name.endsWith("-vesper")){
            vesperType = u;
            break;
        }
    }

    if(vesperType == null){
        Log.info("[vesper.js] Vesper unit not found yet.");
        return false;
    }

    vesperCellL = Core.atlas.find(vesperType.name + "-wingbig-left-cell");
    vesperCellR = Core.atlas.find(vesperType.name + "-wingbig-right-cell");

    var leftFound = vesperCellL != null && vesperCellL.found();
    var rightFound = vesperCellR != null && vesperCellR.found();

    Log.info("[vesper.js] type=@ leftCell=@ rightCell=@",
        vesperType.name, leftFound, rightFound);

    return true;
}

function vesperErr(what, e){
    if(vesperErrCount++ < 10){
        Log.err("[vesper.js] Error in @: @", what, e);
    }
}

Events.run(Trigger.draw, run(function(){
    if(vesperType == null){
        vesperSearchTimer++;

        if(vesperSearchTimer >= 60){
            vesperSearchTimer = 0;

            try{
                vesperFindAssets();
            }catch(e){
                vesperErr("asset search", e);
            }
        }

        return;
    }

    Groups.unit.each(cons(function(u){
        if(u.type != vesperType || u.dead || !u.isAdded()) return;

        try{
            if(Vars.state.rules.fog && u.inFogTo(Vars.player.team())) return;
        }catch(e){}

        try{
            var prog = 0;
            try{
                if(u.mounts != null && u.mounts.length > 0){
                    prog = Mathf.clamp(u.mounts[0].warmup);
                }
            }catch(e){}

            var rot = u.rotation - 90;
            var z = (vesperType.lowAltitude
                ? VLayer.flyingUnitLow
                : VLayer.flyingUnit) + VESPER_CELL_Z;

            if(vesperCellL != null && vesperCellR != null){
                for(var s = -1; s <= 1; s += 2){
                    var reg = s < 0 ? vesperCellL : vesperCellR;

                    if(!reg.found()) continue;

                    var v = Tmp.v1;
                    v.set(VESPER_WING_MOVE * prog * s, 0).rotate(rot);

                    Draw.z(z);
                    Draw.color(vesperType.cellColor(u));
                    Draw.rect(reg, u.x + v.x, u.y + v.y, rot);
                    Draw.reset();
                }
            }
            var by = VESPER_BUILD_Y
                + VESPER_SMALL_MOVE * prog
                + Mathf.absin(Time.time, 3, 0.6);

            for(var k = -1; k <= 1; k += 2){
                var b = Tmp.v1;
                b.set(VESPER_BUILD_X * k, by).rotate(rot);

                u.drawBuildingBeam(u.x + b.x, u.y + b.y);
            }

            if(!vesperLogged){
                vesperLogged = true;
                Log.info("[vesper.js] Drawing active for @", u.type.name);
            }
        }catch(e){
            vesperErr("unit drawing", e);
        }
    }));
}));

try{
    vesperFindAssets();
}catch(e){
    vesperErr("initial search", e);
}
