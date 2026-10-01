var signalStarted = false;

Events.on(
    WorldLoadEndEvent,
    function(){

        signalStarted = false;

        Time.run(30, function(){

            if(!Vars.state.isPlaying())
                return;

            if(signalStarted)
                return;

            signalStarted = true;

            Vars.ui.hudfrag.showToast(
                "[#9b9b9b]SIGNAL MONITOR // INITIALIZING...[]",
                3
            );

            Time.run(45, function(){
                Vars.ui.hudfrag.showToast(
                    "[#9b9b9b]SOURCE: UNKNOWN[]",
                    3
                );
            });

            Time.run(90, function(){
                Vars.ui.hudfrag.showToast(
                    "[#9b9b9b]SIGNAL STRENGTH: 17%[]",
                    3
                );
            });

            Time.run(135, function(){
                Vars.ui.hudfrag.showToast(
                    "[#ff8a24]SIGNAL STRENGTH: 63%[]",
                    3
                );
            });

            Time.run(180, function(){
                Vars.ui.hudfrag.showToast(
                    "[#ff3030]SIGNAL STRENGTH: 100%[]",
                    3
                );
            });

            Time.run(225, function(){
                Vars.ui.hudfrag.showToast(
                    "[#00d9ff]CONNECTION ESTABLISHED[]",
                    3
                );
            });

        });
    }
);