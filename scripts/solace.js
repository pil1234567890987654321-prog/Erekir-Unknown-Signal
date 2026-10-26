var solaceType = null, heatStatus = null, solaceLooked = false;
var solaceFiring = {};

const FAST_TICKS = 361;
const HEAT_TICKS = 700;
const UNMOVING_TICKS = 280;

Events.run(Trigger.update, run(function(){
    if(!solaceLooked){
        solaceLooked = true;
        solaceType = Vars.content.units().find(boolf(function(u){
            return u.name.endsWith("-solace");
        }));
        heatStatus = Vars.content.statusEffects().find(boolf(function(s){
            return s.name.endsWith("-overheating");
        }));
        Log.info("[solace.js] unit=@ status=@", solaceType, heatStatus);
    }

    if(solaceType == null || heatStatus == null) return;

    Groups.unit.each(cons(function(u){
        if(u.type != solaceType) return;

        var firing = false;
        for(var i = 0; i < u.mounts.length; i++){
            var m = u.mounts[i];
            if(m.weapon.continuous && m.bullet != null && m.bullet.isAdded()){
                firing = true;
                break;
            }
        }
        if(firing && !solaceFiring[u.id]){
            solaceFiring[u.id] = true;

            if(!Vars.net.client()){
                u.apply(StatusEffects.fast, FAST_TICKS);
            }
        }

        if(!firing && solaceFiring[u.id]){
            delete solaceFiring[u.id];

            if(!Vars.net.client()){
                u.apply(heatStatus, HEAT_TICKS);
                u.apply(StatusEffects.unmoving, UNMOVING_TICKS);
            }
        }
    }));
}));
