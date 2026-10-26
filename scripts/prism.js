

var PCommandAI = Packages.mindustry.ai.types.CommandAI;
var PMoveCommand = Packages.mindustry.ai.UnitCommand.moveCommand;

const PRISM_MAX_DRONES = 10;
const PRISM_LEASH = 280;
const PRISM_STAND_FRAC = 0.75;
const PRISM_ORPHAN_TICKS = 0;
const PRISM_IDLE_RADIUS = 38;
const PRISM_HOLD_FRAC = 0.95;
const PRISM_ARRIVE = 8;
const PRISM_RETARGET = 16;

var prismBlock = null;
var prismDroneTypes = [];
var prismLooked = false;

var prismOwner = {}; 
var prismOrphan = {};  
var prismGoal = {};    

Events.run(Trigger.update, run(function(){

    if(!prismLooked){
        prismLooked = true;

        prismBlock = Vars.content.blocks().find(boolf(function(b){
            return b.name.endsWith("-prism");
        }));

        Vars.content.units().each(cons(function(u){
            if(
                u.name.endsWith("-prism-drone-thorium") ||
                u.name.endsWith("-prism-drone-oxide") ||
                u.name.endsWith("-prism-drone-graphite")
            ){
                prismDroneTypes.push(u);

                u.controlSelectGlobal = false;
                u.commands.clear();
                u.stances.clear();
            }
        }));

        Log.info(
            "[prism.js] block=@ drones=@",
            prismBlock,
            prismDroneTypes.length
        );
    }

    if(prismBlock == null || prismDroneTypes.length == 0) return;


    if(Vars.control != null && Vars.control.input != null){
        var selected = Vars.control.input.selectedUnits;

        if(selected != null){
            selected.removeAll(boolf(function(u){
                return u != null &&
                    prismDroneTypes.indexOf(u.type) >= 0;
            }));
        }
    }


    if(Vars.net.client()) return;


    Vars.state.teams.getActive().each(cons(function(data){

        var motherSeq = data.getBuildings(prismBlock);
        var counts = {};
        var drones = [];

        Groups.unit.each(cons(function(u){
            if(u.team != data.team) return;
            if(prismDroneTypes.indexOf(u.type) < 0) return;
            drones.push(u);
        }));


        for(var i = 0; i < drones.length; i++){
            var u = drones[i];

            var ownerPos = prismOwner[u.id];
            var owner = ownerPos === undefined
                ? null
                : Vars.world.build(ownerPos);
            if(ownerPos !== undefined && (
                owner == null ||
                owner.block != prismBlock ||
                owner.team != data.team
            )){
                delete prismOwner[u.id];
                delete prismOrphan[u.id];
                delete prismGoal[u.id];

                u.kill();
                continue;
            }
          if(ownerPos === undefined){
                var best = 1e9;

                for(var k = 0; k < motherSeq.size; k++){
                    var m = motherSeq.get(k);
                    var d = Mathf.dst(u.x, u.y, m.x, m.y);

                    if(d < best && d < PRISM_LEASH * 2){
                        best = d;
                        owner = m;
                    }
                }

                if(owner != null){
                    prismOwner[u.id] = owner.pos();
                }
            }

            if(owner != null){
                counts[owner.pos()] =
                    (counts[owner.pos()] || 0) + 1;

                delete prismOrphan[u.id];
            }else{
                prismOrphan[u.id] =
                    (prismOrphan[u.id] || 0) + 1;

                if(prismOrphan[u.id] > PRISM_ORPHAN_TICKS){
                    delete prismOrphan[u.id];
                    delete prismOwner[u.id];
                    delete prismGoal[u.id];

                    u.kill();
                }
            }
        }

        for(var k2 = 0; k2 < motherSeq.size; k2++){
            var mb = motherSeq.get(k2);

            if((counts[mb.pos()] || 0) >= PRISM_MAX_DRONES){
                mb.reloadCounter = 0;
            }
        }

        var index = {};

        for(var j = 0; j < drones.length; j++){
            var du = drones[j];
            var op = prismOwner[du.id];

            if(op === undefined) continue;

            var mother = Vars.world.build(op);

            if(
                mother == null ||
                mother.block != prismBlock ||
                mother.team != data.team
            ){
                delete prismOwner[du.id];
                delete prismOrphan[du.id];
                delete prismGoal[du.id];

                du.kill();
                continue;
            }

            var slot = index[op] || 0;
            index[op] = slot + 1;

            var total = counts[op] || 1;
            var ang = 360 * slot / Math.max(1, total);

            var tx, ty;
            var tgt = mother.target;

            if(
                tgt != null &&
                Mathf.dst(
                    tgt.getX(), tgt.getY(),
                    mother.x, mother.y
                ) < PRISM_LEASH + 160
            ){

                var dist = Mathf.dst(
                    mother.x, mother.y,
                    tgt.getX(), tgt.getY()
                );

                var stand = du.type.range * PRISM_STAND_FRAC;
                var go = Math.min(
                    Math.max(dist - stand, 0),
                    PRISM_LEASH
                );

                var dir = Angles.angle(
                    mother.x, mother.y,
                    tgt.getX(), tgt.getY()
                );

                tx = mother.x
                    + Angles.trnsx(dir, go)
                    + Angles.trnsx(ang + dir, 18);

                ty = mother.y
                    + Angles.trnsy(dir, go)
                    + Angles.trnsy(ang + dir, 18);
            }else{
                tx = mother.x
                    + Angles.trnsx(ang, PRISM_IDLE_RADIUS);

                ty = mother.y
                    + Angles.trnsy(ang, PRISM_IDLE_RADIUS);
            }

            var ctrl = du.controller();

            if(!(ctrl instanceof PCommandAI)){
                ctrl = new PCommandAI();
                du.controller(ctrl);
            }

            if(ctrl.stances.length() > 0) ctrl.stances.clear();
            if(ctrl.attackTarget != null || ctrl.commandQueue.size > 0 || ctrl.command != PMoveCommand){
                ctrl.attackTarget = null;
                ctrl.commandQueue.clear();
                if(ctrl.command != PMoveCommand) ctrl.command(PMoveCommand);
                ctrl.targetPos = null;
                delete prismGoal[du.id];
            }else if(ctrl.targetPos != null){
                var own = prismGoal[du.id];
                if(own === undefined || Mathf.dst(own[0], own[1], ctrl.targetPos.x, ctrl.targetPos.y) > 2){
                    ctrl.targetPos = null;
                    delete prismGoal[du.id];
                }
            }

            if(
                tgt != null &&
                Mathf.dst(
                    du.x, du.y,
                    tgt.getX(), tgt.getY()
                ) < du.type.range * PRISM_HOLD_FRAC &&
                Mathf.dst(
                    du.x, du.y,
                    mother.x, mother.y
                ) < PRISM_LEASH
            ){
                if(ctrl.targetPos != null){
                    ctrl.targetPos = null;
                }

                delete prismGoal[du.id];
                continue;
            }


            if(Mathf.dst(du.x, du.y, tx, ty) < PRISM_ARRIVE){
                continue;
            }

            var goal = prismGoal[du.id];

            if(
                goal !== undefined &&
                ctrl.targetPos != null &&
                Mathf.dst(goal[0], goal[1], tx, ty) < PRISM_RETARGET
            ){
                continue;
            }

            prismGoal[du.id] = [tx, ty];
            ctrl.commandPosition(new Vec2(tx, ty));
        }
    }));
}));