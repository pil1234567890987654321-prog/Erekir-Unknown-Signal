// Erekir: Unknown Signal
// Intro sequence
var introSound = Vars.tree.loadSound("intro");


// ==================================================
// СОСТОЯНИЕ
// ==================================================

var introStarted = false;
var introFinished = false;

var introRoot = null;

var introBackground = null;
var introTitle = null;

var introScanline = null;
var introVignette = null;
var introFlash = null;

var introStatus = null;
var introProgress = null;
var introWarning = null;
var introSource = null;

var introLineTop = null;
var introLineBottom = null;

var introTime = 0;

var lastGlitchSlot = -1;
var currentGlitchText = "";


// ==================================================
// FIX:
// СОХРАНЕНИЕ ЦВЕТА ROOT
// ==================================================

var originalRootR = 1;
var originalRootG = 1;
var originalRootB = 1;
var originalRootA = 1;


// ==================================================
// НАСТРОЙКИ РАЗМЕРА
// ==================================================

var titleStartScale = 2.5;
var titleFinalScale = 4.25;

var statusScale = 0.8;
var sourceScale = 1;
var progressScale = 1.5;
var warningScale = 1.2;


// ==================================================
// НАСТРОЙКИ ВСПЫШКИ
// ==================================================

// FIX:
// Вспышка немного выходит за границы экрана,
// чтобы не оставалось тонкой полоски сверху/по краям.

var flashOverscan = 16;


// ==================================================
// НАСТРОЙКИ ГЛИТЧА
// ==================================================

var glitchStepTime = 0.05;


// ==================================================
// ФИНАЛЬНЫЙ ТЕКСТ
// ==================================================

var finalText =
    "[#ff4a28]Erekir[]: [#ff8a24]Unknown[] [#ff3030]Signal[]";


// ==================================================
// ФИНАЛЬНЫЕ ГЛИТЧ-ВАРИАНТЫ
// ==================================================

var finalGlitchStages = [

    // ==================================================
    // 0 — ПОЧТИ НОРМА
    // ==================================================

    "[#ff4a28]Erekir[]: [#ff8a24]Unknown[] [#ff3030]Signal[]",
    "[#ff4a28]Er?kir[]: [#ff8a24]Unknown[] [#ff3030]Signal[]",
    "[#ff4a28]Erek?r[]: [#ff8a24]Unknown[] [#ff3030]Sign?l[]",
    "[#ff4a28]E?ekir[]: [#ff8a24]Unkn?wn[] [#ff3030]Signal[]",
    "[#ff4a28]Erekir[]: [#ff8a24]Unk?own[] [#ff3030]Sign?l[]",
    "[#ff4a28]Er?k?r[]: [#ff8a24]Unknown[] [#ff3030]S?gnal[]",

    // ==================================================
    // 1 — ЛЕГКИЙ СБОЙ
    // ==================================================

    "[#ff4a28]Er?k?r[]: [#ff8a24]Unkn?wn[] [#ff3030]S?gnal[]",
    "[#ff4a28]E?ek?r[]: [#ff8a24]Unk?own[] [#ff3030]S?gn?l[]",
    "[#ff4a28]Ere?ir[]: [#ff8a24]Unkn?wn[] [#ff3030]S!gnal[]",
    "[#ff4a28]E?ekir[]: [#ff8a24]Unk#own[] [#ff3030]Signal[]",
    "[#ff4a28]E|ekir[]: [#ff8a24]Unkn?wn[] [#ff3030]S!gn?l[]",
    "[#ff4a28]Er?k?r[]: [#ff8a24]U?known[] [#ff3030]S?gn@l[]",

    // ==================================================
    // 2 — СБОЙ УСИЛИВАЕТСЯ
    // ==================================================

    "[#ff4a28]E?e?ir[]: [#ff8a24]Unk0wn[] [#ff3030]S!gnal[]",
    "[#ff4a28]Erek?r[]: [#ff8a24]Unkn?wn[] [#ff3030]S/g?al[]",
    "[#ff4a28]E?e|ir[]: [#ff8a24]U#known[] [#ff3030]S?gn@l[]",
    "[#ff4a28]E|?k?r[]: [#ff8a24]Unk#?wn[] [#ff3030]S!g?al[]",
    "[#ff4a28]E?ek'r[]: [#ff8a24]!nknown[] [#ff3030]S?gnal[]",
    "[#ff4a28]E#ekir[]: [#ff8a24]Unk0?n[] [#ff3030]S!gn?l[]",
    "[#ff4a28]Er?e?[]: [#ff8a24]U#k?own[] [#ff3030]S/g?al[]",

    // ==================================================
    // 3 — РЕЗКИЙ СКАЧОК
    // ==================================================

    "[#ff4a28]E?e?ir[]: [#ff8a24]Un#n?wn[] [#ff3030]S!g?@l[]",
    "[#ff4a28]E|?k?r[]: [#ff8a24]U#kn?wn[] [#ff3030]S?g/@l[]",
    "[#ff4a28]E//kir[]: [#ff8a24]Unk#?n[] [#ff3030]S!gn?l[]",
    "[#ff4a28]Er?#ir[]: [#ff8a24]U?k?o?n[] [#ff3030]S!g?al[]",

    "[#ff4a28]E?ek?r[]: [#ff8a24]Unk?own[] [#ff3030]S?gn?l[]",
    "[#ff4a28]E#ekir[]: [#ff8a24]Unk0?n[] [#ff3030]S!gn?l[]",

    // ==================================================
    // 4 — СИЛЬНЫЙ СБОЙ
    // ==================================================

    "[#ff4a28]E?e|?[]: [#ff8a24]?#known[] [#ff3030]S?gn@l[]",
    "[#ff4a28]E#?k?r[]: [#ff8a24]U##?wn[] [#ff3030]S!/?al[]",
    "[#ff4a28]E?##ir[]: [#ff8a24]Unk0?n[] [#ff3030]S?g#?l[]",
    "[#ff4a28]E|?e?r[]: [#ff8a24]U#k?0?n[] [#ff3030]S!gn?l[]",
    "[#ff4a28]E?//?r[]: [#ff8a24]?#k?o?n[] [#ff3030]S?/?@l[]",
    "[#ff4a28]E#e?ir[]: [#ff8a24]U#n#?n[] [#ff3030]S!?#?l[]",

    // ==================================================
    // 5 — ХАОТИЧНЫЙ СКАЧОК
    // ==================================================

    "[#ff4a28]E?e|?[]: [#ff8a24]#n?0?n[] [#ff3030]S!/?@[]",
    "[#ff4a28]E|#?ir[]: [#ff8a24]U?#?o?n[] [#ff3030]S?g??l[]",
    "[#ff4a28]E?/?r[]: [#ff8a24]?#k##n[] [#ff3030]S!?#?l[]",

    "[#ff4a28]Er?#ir[]: [#ff8a24]U?k?o?n[] [#ff3030]S!g?al[]",

    "[#ff4a28]E##?r[]: [#ff8a24]U?##?n[] [#ff3030]S?/?@[]",
    "[#ff4a28]E?//?[]: [#ff8a24]#?#?o?[] [#ff3030]S!#?@[]",
    "[#ff4a28]E|?##?[]: [#ff8a24]U#?##?[] [#ff3030]S?/?@[]",

    // ==================================================
    // 6 — ТЕКСТ ПОЧТИ РАЗРУШЕН
    // ==================================================

    "[#ff4a28]E???r[]: [#ff8a24]?#k???[] [#ff3030]S!???l[]",
    "[#ff4a28]E#?/?r[]: [#ff8a24]U#?##?[] [#ff3030]S!/?@[]",
    "[#ff4a28]E|#??[]: [#ff8a24]?#?0?n[] [#ff3030]S?##?l[]",
    "[#ff4a28]E?##?[]: [#ff8a24]#?###?[] [#ff3030]S!?#?@[]",
    "[#ff4a28]E#/#?[]: [#ff8a24]U?###?[] [#ff3030]S?/?##[]",

    // ==================================================
    // 7 — ХАОС
    // ==================================================

    "[#ff4a28]E?/?r[]: [#ff8a24]?#?#??[] [#ff3030]S!?#??[]",
    "[#ff4a28]E|###?[]: [#ff8a24]U####?[] [#ff3030]S?##@[]",
    "[#ff4a28]E###??[]: [#ff8a24]#####?[] [#ff3030]S!#?##[]",

    "[#ff4a28]E#?/?r[]: [#ff8a24]U#?##?[] [#ff3030]S!/?@[]",

    "[#ff4a28]??#???[]: [#ff8a24]##?###[] [#ff3030]??!???[]",
    "[#ff4a28]?#?#??[]: [#ff8a24]????##[] [#ff3030]#?!?#?[]",

    // ==================================================
    // 8 — ПОТЕРЯ СИГНАЛА
    // ==================================================

    "[#ff4a28]??????[]: [#ff8a24]??#???[] [#ff3030]??????[]",
    "[#ff4a28]##?##?[]: [#ff8a24]?#?#??[] [#ff3030]#?!##?[]",
    "[#ff4a28]?#???#[]: [#ff8a24]##??##[] [#ff3030]?!?###[]",
    "[#ff4a28]??????[]: [#ff8a24]???????[] [#ff3030]??????[]",
    "[#ff4a28]?#?##?[]: [#ff8a24]??##???[] [#ff3030]##?!??[]",

    // ==================================================
    // 9 — ПОЧТИ ПОЛНЫЙ ОБРЫВ
    // ==================================================

    "[#ff4a28]??#???[]: [#ff8a24]???????[] [#ff3030]#??!??[]",
    "[#ff4a28]#?#???[]: [#ff8a24]??#????[] [#ff3030]?!#???[]",
    "[#ff4a28]?????#[]: [#ff8a24]#??????[] [#ff3030]??##??[]",
    "[#ff4a28]?#????[]: [#ff8a24]????#??[] [#ff3030]#?!???[]",

    // ==================================================
    // 10 — ПОЛНЫЙ GLITCH
    // ==================================================

    "[#ff4a28]??????[]: [#ff8a24]??#???[] [#ff3030]??????[]",
    "[#ff4a28]#?#?#?[]: [#ff8a24]??????[] [#ff3030]?!#???[]",
    "[#ff4a28]??##??[]: [#ff8a24]?#????[] [#ff3030]#??!??[]",
    "[#ff4a28]??????[]: [#ff8a24]???????[] [#ff3030]??????[]",
    "[#ff4a28]?#?#??[]: [#ff8a24]??#?#??[] [#ff3030]#?!?#?[]",
    "[#ff4a28]??????[]: [#ff8a24]???????[] [#ff3030]??????[]",

    "[#ff4a28]??????[]: [#ff8a24]???????[] [#ff3030]??????[]",

    "",
    "",
    "",
    "",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    ".",
    "..",
    "..",
    "..",
    "..",
    "..",
    "..",
    "...",
    "...",
    "...",
    "...",
    "...",
    "...",
    "...",
    "...",
    "",
    "",
    "",
    "...",
    "",
    "",
    "...",
    "",
    "",
    "",
    "",
    "",
    ""
];


// ==================================================
// РАСШИФРОВКА
// ==================================================

var cipherStages = [
    "",
    "[#ff4a28]E[]",
    "[#ff4a28]Er[]",
    "[#ff4a28]Ere[]",
    "[#ff4a28]Erek[]",
    "[#ff4a28]Ereki[]",
    "[#ff4a28]Erekir[]",
    "[#ff4a28]Erekir:[]",
    "[#ff4a28]Erekir:[]",
    "[#ff4a28]Erekir: [#ff8a24]U[]",
    "[#ff4a28]Erekir: [#ff8a24]Un[]",
    "[#ff4a28]Erekir: [#ff8a24]Unk[]",
    "[#ff4a28]Erekir: [#ff8a24]Unkn[]",
    "[#ff4a28]Erekir: [#ff8a24]Unkno[]",
    "[#ff4a28]Erekir: [#ff8a24]Unknow[]",
    "[#ff4a28]Erekir: [#ff8a24]Unknown[]",
    "[#ff4a28]Erekir: [#ff8a24]Unknown[]",
    "[#ff4a28]Erekir: [#ff8a24]Unknown [#ff3030]S[]",
    "[#ff4a28]Erekir: [#ff8a24]Unknown [#ff3030]Si[]",
    "[#ff4a28]Erekir: [#ff8a24]Unknown [#ff3030]Sig[]",
    "[#ff4a28]Erekir: [#ff8a24]Unknown [#ff3030]Sign[]",
    "[#ff4a28]Erekir: [#ff8a24]Unknown [#ff3030]Signa[]",
    "[#ff4a28]Erekir: [#ff8a24]Unknown [#ff3030]Signal[]",
    "[#ff4a28]Erekir: [#ff8a24]Unknown [#ff3030]Signal[]",
    "[#ff4a28]Erekir: [#ff8a24]Unknown [#ff3030]Signal[]"
];


// ==================================================
// ПЛАВНОЕ ОГИБАНИЕ 0..1
// ==================================================

function smoothFade(value){

    if(value < 0)
        value = 0;

    if(value > 1)
        value = 1;

    return value * value * (3 - 2 * value);
}


// ==================================================
// ЦЕНТРИРОВКА
// ==================================================

function centerLabel(label, x, y){

    if(label == null)
        return;

    label.validate();

    label.setPosition(
        x - label.getWidth() / 2,
        y - label.getHeight() / 2
    );
}


// ==================================================
// РАСКЛАДКА
// ==================================================

function positionIntroLabels(){

    if(introRoot == null)
        return;

    var w = Core.graphics.getWidth();
    var h = Core.graphics.getHeight();

    centerLabel(
        introTitle,
        w * 0.50,
        h * 0.50
    );

    centerLabel(
        introStatus,
        w * 0.50,
        h * 0.65
    );

    centerLabel(
        introWarning,
        w * 0.50,
        h * 0.41
    );

    centerLabel(
        introProgress,
        w * 0.50,
        h * 0.33
    );

    centerLabel(
        introSource,
        w * 0.50,
        h * 0.26
    );
}


// ==================================================
// СИНХРОНИЗАЦИЯ ROOT
// ==================================================

function syncIntroRoot(){

    if(introRoot == null)
        return;

    var w = Core.graphics.getWidth();
    var h = Core.graphics.getHeight();


    introRoot.setSize(
        w,
        h
    );

    introRoot.setPosition(
        0,
        0
    );

    introRoot.setColor(
        1,
        1,
        1,
        1
    );


    // ==================================================
    // ЧЕРНЫЙ ФОН
    // ==================================================

    if(introBackground != null){

        introBackground.setSize(
            w,
            h
        );

        introBackground.setPosition(
            0,
            0
        );
    }


    // ==================================================
    // FIX:
    // ВСПЫШКА ВЫХОДИТ ЗА ГРАНИЦЫ ЭКРАНА
    // ==================================================

    if(introFlash != null){

        introFlash.setSize(
            w + flashOverscan * 2,
            h + flashOverscan * 2
        );

        introFlash.setPosition(
            -flashOverscan,
            -flashOverscan
        );
    }


    // ==================================================
    // ВИНЬЕТКА
    // ==================================================

    if(introVignette != null){

        introVignette.setSize(
            w,
            h
        );

        introVignette.setPosition(
            0,
            0
        );
    }


    // ==================================================
    // ROOT ВСЕГДА СПЕРЕДИ
    // ==================================================

    introRoot.toFront();
}


// ==================================================
// СОЗДАНИЕ ИНТРО
// ==================================================

function createIntro(){

    if(introStarted)
        return;

    if(introFinished)
        return;


    introStarted = true;

    introTime = 0;
    lastGlitchSlot = -1;
    currentGlitchText = "";


    var w = Core.graphics.getWidth();
    var h = Core.graphics.getHeight();


    // ==================================================
    // СОХРАНЯЕМ ЦВЕТ CORE SCENE ROOT
    // ==================================================

    if(Core.scene != null && Core.scene.root != null){

        originalRootR = Core.scene.root.color.r;
        originalRootG = Core.scene.root.color.g;
        originalRootB = Core.scene.root.color.b;
        originalRootA = Core.scene.root.color.a;


        Core.scene.root.setColor(
            1,
            1,
            1,
            1
        );
    }


    // ==================================================
    // ROOT
    // ==================================================

    introRoot = new WidgetGroup();

    introRoot.setSize(
        w,
        h
    );

    introRoot.setPosition(
        0,
        0
    );

    introRoot.setFillParent(true);

    introRoot.setColor(
        1,
        1,
        1,
        1
    );

    introRoot.touchable = Touchable.disabled;


    // ==================================================
    // ЧЕРНЫЙ ФОН
    // ==================================================

    introBackground = new Image(
        Tex.whiteui
    );

    introBackground.setSize(
        w,
        h
    );

    introBackground.setPosition(
        0,
        0
    );

    introBackground.setColor(
        0,
        0,
        0,
        1
    );

    introBackground.touchable = Touchable.disabled;

    introRoot.addChild(
        introBackground
    );


    // ==================================================
    // ДОБАВЛЯЕМ INTRO ПОВЕРХ МЕНЮ
    // ==================================================

    Core.scene.root.addChild(
        introRoot
    );

    introRoot.toFront();


    // ==================================================
    // ВИНЬЕТКА
    // ==================================================

    introVignette = new Image(
        Tex.whiteui
    );

    introVignette.setSize(
        w,
        h
    );

    introVignette.setPosition(
        0,
        0
    );

    introVignette.setColor(
        0,
        0,
        0,
        0
    );

    introVignette.touchable = Touchable.disabled;

    introRoot.addChild(
        introVignette
    );


    // ==================================================
    // ВСПЫШКА
    // ==================================================

    introFlash = new Image(
        Tex.whiteui
    );

    // FIX:
    // Сразу создаем вспышку больше экрана.

    introFlash.setSize(
        w + flashOverscan * 2,
        h + flashOverscan * 2
    );

    introFlash.setPosition(
        -flashOverscan,
        -flashOverscan
    );

    introFlash.setColor(
        1,
        1,
        1,
        0
    );

    introFlash.touchable = Touchable.disabled;

    introRoot.addChild(
        introFlash
    );


    // ==================================================
    // ВЕРХНЯЯ ЛИНИЯ
    // ==================================================

    introLineTop = new Image(
        Tex.whiteui
    );

    introLineTop.setSize(
        w * 0.72,
        2
    );

    introLineTop.setPosition(
        w * 0.14,
        h * 0.18
    );

    introLineTop.setColor(
        1,
        1,
        1,
        0
    );

    introLineTop.touchable = Touchable.disabled;

    introRoot.addChild(
        introLineTop
    );


    // ==================================================
    // НИЖНЯЯ ЛИНИЯ
    // ==================================================

    introLineBottom = new Image(
        Tex.whiteui
    );

    introLineBottom.setSize(
        w * 0.72,
        2
    );

    introLineBottom.setPosition(
        w * 0.14,
        h * 0.82
    );

    introLineBottom.setColor(
        1,
        1,
        1,
        0
    );

    introLineBottom.touchable = Touchable.disabled;

    introRoot.addChild(
        introLineBottom
    );


    // ==================================================
    // СКАНЛАЙН
    // ==================================================

    introScanline = new Image(
        Tex.whiteui
    );

    introScanline.setSize(
        w,
        3
    );

    introScanline.setPosition(
        0,
        h * 0.5
    );

    introScanline.setColor(
        1,
        1,
        1,
        0
    );

    introScanline.touchable = Touchable.disabled;

    introRoot.addChild(
        introScanline
    );


    // ==================================================
    // ОСНОВНОЙ ТЕКСТ
    // ==================================================

    introTitle = new Label(
        cipherStages[0],
        Styles.outlineLabel
    );

    introTitle.setFontScale(
        titleStartScale
    );

    introTitle.setColor(
        1,
        1,
        1,
        0
    );

    introTitle.setAlignment(
        Align.center
    );

    introRoot.addChild(
        introTitle
    );


    // ==================================================
    // INITIALIZING
    // ==================================================

    introStatus = new Label(
        "[#666666]INITIALIZING...[]",
        Styles.outlineLabel
    );

    introStatus.setFontScale(
        statusScale
    );

    introStatus.setColor(
        1,
        1,
        1,
        0
    );

    introStatus.setAlignment(
        Align.center
    );

    introRoot.addChild(
        introStatus
    );


    // ==================================================
    // SOURCE
    // ==================================================

    introSource = new Label(
        "[#555555]SOURCE: UNKNOWN[]",
        Styles.outlineLabel
    );

    introSource.setFontScale(
        sourceScale
    );

    introSource.setColor(
        1,
        1,
        1,
        0
    );

    introSource.setAlignment(
        Align.center
    );

    introRoot.addChild(
        introSource
    );


    // ==================================================
    // DECRYPTION
    // ==================================================

    introProgress = new Label(
        "[#555555]DECRYPTION // 00%[]",
        Styles.outlineLabel
    );

    introProgress.setFontScale(
        progressScale
    );

    introProgress.setColor(
        1,
        1,
        1,
        0
    );

    introProgress.setAlignment(
        Align.center
    );

    introRoot.addChild(
        introProgress
    );


    // ==================================================
    // WARNING
    // ==================================================

    introWarning = new Label(
        "[#ff3030]WARNING // UNKNOWN SOURCE[]",
        Styles.outlineLabel
    );

    introWarning.setFontScale(
        warningScale
    );

    introWarning.setColor(
        1,
        1,
        1,
        0
    );

    introWarning.setAlignment(
        Align.center
    );

    introRoot.addChild(
        introWarning
    );


    // ==================================================
    // ПЕРВИЧНАЯ ВАЛИДАЦИЯ
    // ==================================================

    introRoot.validate();

    syncIntroRoot();
    positionIntroLabels();
}


// ==================================================
// УСТАНОВКА ЗАГОЛОВКА
// ==================================================

function setTitle(
    text,
    scale,
    alpha
){

    if(introTitle == null)
        return;


    introTitle.setText(
        text
    );

    introTitle.setFontScale(
        scale
    );

    introTitle.setColor(
        1,
        1,
        1,
        alpha
    );


    positionIntroLabels();
}


// ==================================================
// ПРОЗРАЧНОСТЬ LABEL
// ==================================================

function setLabelAlpha(
    label,
    alpha
){

    if(label == null)
        return;


    label.setColor(
        1,
        1,
        1,
        alpha
    );
}


// ==================================================
// ЧЕРНЫЙ ФОН
// ==================================================

function forceBlackBackground(){

    if(introBackground == null)
        return;


    introBackground.setColor(
        0,
        0,
        0,
        1
    );
}


// ==================================================
// СБРОС ВСПЫШКИ
// ==================================================

function clearFlash(){

    if(introFlash == null)
        return;


    introFlash.setColor(
        1,
        1,
        1,
        0
    );


    if(introVignette != null){

        introVignette.setColor(
            0,
            0,
            0,
            0
        );
    }
}


// ==================================================
// ОЧИСТКА
// ==================================================

function clearIntro(){

    if(introRoot != null){
        introRoot.remove();
    }


    // ==================================================
    // ВОЗВРАЩАЕМ ИСХОДНЫЙ ROOT COLOR
    // ==================================================

    if(Core.scene != null && Core.scene.root != null){

        Core.scene.root.setColor(
            originalRootR,
            originalRootG,
            originalRootB,
            originalRootA
        );
    }


    introRoot = null;

    introBackground = null;
    introTitle = null;

    introScanline = null;
    introVignette = null;
    introFlash = null;

    introStatus = null;
    introProgress = null;
    introWarning = null;
    introSource = null;

    introLineTop = null;
    introLineBottom = null;

    introTime = 0;

    lastGlitchSlot = -1;
    currentGlitchText = "";
}


// ==================================================
// ЗАПУСК
// ==================================================

Events.on(
    ClientLoadEvent,
    function(){

        if(introStarted)
            return;

        if(introFinished)
            return;

        createIntro();

        Timer.schedule(
            run(() => {
                introSound.play(4);
            }),
            -0.05
        );
    }
);









// ==================================================
// ОСНОВНОЙ ЦИКЛ
// ==================================================

Events.run(
    Trigger.update,
    function(){

        if(!introStarted)
            return;

        if(introFinished)
            return;

        if(introRoot == null)
            return;

        if(introBackground == null)
            return;

        if(introTitle == null)
            return;


        // ==================================================
        // СИНХРОНИЗАЦИЯ
        // ==================================================

        syncIntroRoot();


        // ==================================================
        // CORE SCENE ROOT НЕ ДОЛЖЕН ЗАТУХАТЬ
        // ==================================================

        if(Core.scene != null && Core.scene.root != null){

            Core.scene.root.setColor(
                1,
                1,
                1,
                1
            );
        }


        // ==================================================
        // ВРЕМЯ
        // ==================================================

        introTime += Time.delta / 60.0;

        var w = Core.graphics.getWidth();
        var h = Core.graphics.getHeight();


        // ==================================================
        // ЧЕРНЫЙ ФОН
        // ==================================================

        forceBlackBackground();

        clearFlash();


        // ==================================================
        // 0.0 - 0.8
        // ПОЛНАЯ ТЕМНОТА
        // ==================================================

        if(introTime < 0.8){

            setTitle(
                cipherStages[0],
                titleStartScale,
                0
            );


            setLabelAlpha(
                introStatus,
                0
            );

            setLabelAlpha(
                introProgress,
                0
            );

            setLabelAlpha(
                introWarning,
                0
            );

            setLabelAlpha(
                introSource,
                0
            );


            introLineTop.setColor(
                1,
                1,
                1,
                0
            );

            introLineBottom.setColor(
                1,
                1,
                1,
                0
            );

            introScanline.setColor(
                1,
                1,
                1,
                0
            );
        }


        // ==================================================
        // 0.8 - 1.6
        // ПОЯВЛЕНИЕ ЗАГОЛОВКА
        // ==================================================

        else if(introTime < 1.6){

            var titleFade =
                smoothFade(
                    (introTime - 0.8) / 0.8
                );


            setTitle(
                cipherStages[0],
                titleStartScale,
                titleFade * 0.85
            );


            introLineTop.setColor(
                1,
                1,
                1,
                titleFade * 0.06
            );

            introLineBottom.setColor(
                1,
                1,
                1,
                titleFade * 0.06
            );
        }


        // ==================================================
        // 1.6 - 2.5
        // СЛУЖЕБНЫЕ ТЕКСТЫ
        // ==================================================

        else if(introTime < 2.5){

            setTitle(
                cipherStages[0],
                titleStartScale,
                0.85
            );


            var statusFade =
                smoothFade(
                    (introTime - 1.6) / 0.55
                );

            setLabelAlpha(
                introStatus,
                statusFade * 0.9
            );


            var sourceFade =
                smoothFade(
                    (introTime - 1.85) / 0.55
                );

            setLabelAlpha(
                introSource,
                sourceFade * 0.75
            );


            var progressFade =
                smoothFade(
                    (introTime - 2.0) / 0.5
                );

            setLabelAlpha(
                introProgress,
                progressFade * 0.75
            );


            var warningFade =
                smoothFade(
                    (introTime - 2.15) / 0.35
                );

            setLabelAlpha(
                introWarning,
                warningFade * 0.85
            );


            var lineFade =
                smoothFade(
                    (introTime - 1.7) / 0.8
                );


            introLineTop.setColor(
                1,
                1,
                1,
                lineFade * 0.08
            );

            introLineBottom.setColor(
                1,
                1,
                1,
                lineFade * 0.08
            );


            positionIntroLabels();
        }


        // ==================================================
        // 2.5 - 3.6
        // РАСШИФРОВКА
        // ==================================================

        else if(introTime < 3.6){

            var decryptTime =
                introTime - 2.5;


            var decryptProgress =
                decryptTime / 1.1;


            if(decryptProgress > 1)
                decryptProgress = 1;


            var stage =
                Math.floor(
                    decryptProgress *
                    (cipherStages.length - 1)
                );


            if(stage < 0)
                stage = 0;


            if(stage >= cipherStages.length)
                stage = cipherStages.length - 1;


            setTitle(
                cipherStages[stage],
                titleStartScale,
                0.90
            );


            var percent =
                Math.floor(
                    decryptProgress * 100
                );


            if(percent > 100)
                percent = 100;


            introProgress.setText(
                "[#555555]DECRYPTION // "
                + percent
                + "%[]"
            );


            introStatus.setText(
                "[#666666]INITIALIZING... "
                + percent
                + "%[]"
            );


            if(percent < 35){

                introSource.setText(
                    "[#555555]SOURCE: UNKNOWN[]"
                );

            }
            else if(percent < 70){

                introSource.setText(
                    "[#555555]SOURCE: UNRESOLVED[]"
                );

            }
            else{

                introSource.setText(
                    "[#555555]SOURCE: SIGNAL DETECTED[]"
                );
            }


            if(percent < 50){

                introWarning.setText(
                    "[#ff3030]WARNING // UNKNOWN SOURCE[]"
                );

            }
            else{

                introWarning.setText(
                    "[#ff3030]WARNING // SIGNAL UNSTABLE[]"
                );
            }


            setLabelAlpha(
                introStatus,
                0.90
            );

            setLabelAlpha(
                introProgress,
                0.82
            );

            setLabelAlpha(
                introSource,
                0.75
            );

            setLabelAlpha(
                introWarning,
                0.85
            );


            var scanY =
                h * 0.20 +
                (h * 0.60) *
                decryptProgress;


            introScanline.setSize(
                w,
                3
            );

            introScanline.setPosition(
                0,
                scanY
            );

            introScanline.setColor(
                1,
                1,
                1,
                0.055
            );


            positionIntroLabels();
        }


        // ==================================================
        // 3.6+
        // GLITCH
        // ==================================================

        else if(introTime >= 3.6){

            var glitchTime =
                introTime - 3.6;


            var slot =
                Math.floor(
                    glitchTime /
                    glitchStepTime
                );


            // ==================================================
            // GLITCH-ТЕКСТ
            // ==================================================

            if(slot < finalGlitchStages.length){

                if(slot != lastGlitchSlot){

                    lastGlitchSlot = slot;

                    currentGlitchText =
                        finalGlitchStages[slot];

                    setTitle(
                        currentGlitchText,
                        titleStartScale,
                        0.95
                    );
                }


                // ==================================================
                // СЛУЖЕБНЫЕ ТЕКСТЫ
                // ==================================================

                setLabelAlpha(
                    introStatus,
                    0.75
                );

                setLabelAlpha(
                    introProgress,
                    0.70
                );

                setLabelAlpha(
                    introSource,
                    0.65
                );

                setLabelAlpha(
                    introWarning,
                    0.80
                );


                // ==================================================
                // SHAKE
                // ==================================================

                var shakeX =
                    Math.sin(
                        introTime * 80
                    ) * 3;


                var shakeY =
                    Math.cos(
                        introTime * 65
                    ) * 2;


                introTitle.setTranslation(
                    shakeX,
                    shakeY
                );


                // ==================================================
                // ЛИНИИ
                // ==================================================

                introLineTop.setColor(
                    1,
                    1,
                    1,
                    0.08 +
                    Math.random() * 0.08
                );

                introLineBottom.setColor(
                    1,
                    1,
                    1,
                    0.08 +
                    Math.random() * 0.08
                );


                // ==================================================
                // РЕДКИЕ ВСПЫШКИ
                // ==================================================

                var flashChance =
                    Math.random();


                if(flashChance < 0.035){

                    var flashType =
                        Math.random();


                    if(flashType < 0.65){

                        introFlash.setColor(
                            1,
                            1,
                            1,
                            0.12
                        );

                    }
                    else{

                        introFlash.setColor(
                            1,
                            0.03,
                            0.03,
                            0.10
                        );
                    }
                }


                positionIntroLabels();
            }


            // ==================================================
            // ФИНАЛЬНЫЙ ТЕКСТ
            // ==================================================

            else{

                introTitle.setTranslation(
                    0,
                    0
                );


                var finalTime =
                    glitchTime -
                    (
                        finalGlitchStages.length *
                        glitchStepTime
                    );


                var finalProgress =
                    finalTime / 0.8;


                if(finalProgress < 0)
                    finalProgress = 0;


                if(finalProgress > 1)
                    finalProgress = 1;


                // ==================================================
                // УВЕЛИЧЕНИЕ
                // ==================================================

                var scale =
                    titleStartScale +
                    (
                        titleFinalScale -
                        titleStartScale
                    ) *
                    smoothFade(finalProgress);


                setTitle(
                    finalText,
                    scale,
                    1
                );


                // ==================================================
                // МЕЛКИЕ ТЕКСТЫ ИСЧЕЗАЮТ
                // ==================================================

                var textFade =
                    1 -
                    smoothFade(finalProgress);


                setLabelAlpha(
                    introStatus,
                    textFade * 0.75
                );

                setLabelAlpha(
                    introProgress,
                    textFade * 0.70
                );

                setLabelAlpha(
                    introSource,
                    textFade * 0.65
                );

                setLabelAlpha(
                    introWarning,
                    textFade * 0.80
                );


                // ==================================================
                // ЛИНИИ
                // ==================================================

                var lineFade =
                    1 -
                    smoothFade(finalProgress);


                introLineTop.setColor(
                    1,
                    1,
                    1,
                    0.08 * lineFade
                );

                introLineBottom.setColor(
                    1,
                    1,
                    1,
                    0.08 * lineFade
                );


                // ==================================================
                // СКАНЛАЙН
                // ==================================================

                introScanline.setColor(
                    1,
                    1,
                    1,
                    0
                );


                // ==================================================
                // SHAKE
                // ==================================================

                var finalShake =
                    (1 - finalProgress) * 2;


                var finalShakeX =
                    Math.sin(
                        introTime * 80
                    ) *
                    finalShake;


                var finalShakeY =
                    Math.cos(
                        introTime * 65
                    ) *
                    finalShake;


                introTitle.setTranslation(
                    finalShakeX,
                    finalShakeY
                );


                positionIntroLabels();
            }
        }


        // ==================================================
        // OUTRO
        // ==================================================

        var glitchEndTime =
            3.6 +
            finalGlitchStages.length *
            glitchStepTime;


        var outroStartTime =
            glitchEndTime +
            0.8;


        if(introTime >= outroStartTime){

            var fadeTime =
                introTime -
                outroStartTime;


            var fadeProgress =
                fadeTime / 0.7;


            if(fadeProgress < 0)
                fadeProgress = 0;


            if(fadeProgress > 1)
                fadeProgress = 1;


            var fade =
                1 -
                smoothFade(fadeProgress);


            // ==================================================
            // ЗАГОЛОВОК
            // ==================================================

            introTitle.setColor(
                1,
                1,
                1,
                fade
            );

            introTitle.setTranslation(
                0,
                0
            );


            // ==================================================
            // МЕЛКИЕ ТЕКСТЫ
            // ==================================================

            setLabelAlpha(
                introStatus,
                fade * 0.75
            );

            setLabelAlpha(
                introProgress,
                fade * 0.70
            );

            setLabelAlpha(
                introSource,
                fade * 0.65
            );

            setLabelAlpha(
                introWarning,
                fade * 0.80
            );


            // ==================================================
            // ЛИНИИ
            // ==================================================

            introLineTop.setColor(
                1,
                1,
                1,
                0.08 * fade
            );

            introLineBottom.setColor(
                1,
                1,
                1,
                0.08 * fade
            );


            // ==================================================
            // СКАНЛАЙН
            // ==================================================

            introScanline.setColor(
                1,
                1,
                1,
                0.055 * fade
            );


            // ==================================================
            // ВСПЫШКА
            // ==================================================

            introFlash.setColor(
                1,
                1,
                1,
                0
            );


            // ==================================================
            // ВИНЬЕТКА
            // ==================================================

            introVignette.setColor(
                0,
                0,
                0,
                0
            );


            // ==================================================
            // ЧЕРНЫЙ ФОН
            // ==================================================

            introBackground.setColor(
                0,
                0,
                0,
                fade
            );


            // ==================================================
            // ROOT COLOR
            // ==================================================

            if(Core.scene != null && Core.scene.root != null){

                var rootFade =
                    originalRootA +
                    (1 - originalRootA) * fade;


                Core.scene.root.setColor(
                    originalRootR,
                    originalRootG,
                    originalRootB,
                    rootFade
                );
            }


            // ==================================================
            // ЗАВЕРШЕНИЕ
            // ==================================================

            if(fadeProgress >= 1){

                clearIntro();

                introStarted = false;

                introFinished = true;
            }
        }
    }
);