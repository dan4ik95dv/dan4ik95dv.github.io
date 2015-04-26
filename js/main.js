var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.getSession().setMode("ace/mode/javascript");
editor.setOptions({
    enableBasicAutocompletion: true
});

/**
 * Callback on Unity
 * @param eventName
 */
function callbackEvent(eventName) {
    console.log("function callbackEvent Start with eventName "+eventName);
    switch (eventName){
        case "Win":
            console.log("Win");
            break;
        case "Lose":
            console.log("Lose");
            break;
        default :
                console.log("callbackEvent", eventName);
                console.log("events size", events.length);
                events.pop();
                if (events.length >= 1) {
                    events.slice(-1)[0]();
                }
            break;
    }


}

/**
 * Clear TextArea
 * @constructor
 */
function RemoveCode() {
    if (confirm('Remove?')) {
        $('#logger').empty();
        editor.setValue("");
    }
}
/**
 * Magic function
 * @constructor
 */
function DeployCode() {
    var myCode = editor.getSession().getValue();
    $('#logger').empty();
    var stackErrors = editor.getSession().getAnnotations();
    if (stackErrors.length > 0){
        $(this).parent().addClass('panel-danger');
        for (var key in stackErrors) {
            if (stackErrors.hasOwnProperty(key)) {
                $("#logger").append('<p class="text-danger">' + stackErrors[key].text + " Line " + " " + (parseInt(stackErrors[key].row) + 1) + '</p>');
            }
        }
    }
    else {
        try {
            events = [];
            eval(myCode);
            startEvents();
        } catch (x) {
            console.log(x);
        }
    }
}


$('#removeButton').on('click', function () {
    RemoveCode();
});

$('#runButton').on('click', function () {
    DeployCode();
});

var events = [];
var gravity = 1;
const RIGHT = 1;
const LEFT = -1;
const UP = 0;

function move(direction) {
    console.log("function Move");
    events.push(function () {
        console.log("function Move Start");
        u.getUnity().SendMessage("Global_CTRL", "Move", direction);
    });
}
function jump(direction) {
    console.log("function jump");
    events.push(function () {
        console.log("function jump Start");
        u.getUnity().SendMessage("Global_CTRL", "Jump", direction);
    });
}
function restart() {
    console.log("function Restart");
    events.push(function () {
        console.log("function Restart start");
        u.getUnity().SendMessage("Global_CTRL", "Restart", null);
    });

}

function setGravity(newGravity){
    console.log("function setGravity");
    gravity = newGravity;
    events.push(function () {
        console.log("function Restart start");
        u.getUnity().SendMessage("Global_CTRL", "setGravity", gravity);
    });
}

function startEvents() {
    console.log("function startEvents");
    events.reverse();
    events.slice(-1)[0]();

}




