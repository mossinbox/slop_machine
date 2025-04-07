var scriptsFolder = "~/Documents/SlopScripts";
var windowTitle = "Slop Machine";

scriptCheckInterval = 1000;

var scriptsDir = new Folder(scriptsFolder);
var scripts = [];
var win = null;

function buildScriptsDir(){
    if(!scriptsDir.exists){
        if (scriptsDir.create()) {
        $.writeln("Destination directory created: " + scriptsDir.path);
      } else {
        alert("Error creating destination directory: " + scriptsDir.path);
        return false;
      }
    }
    return true;
}

function getScriptFiles(directoryPath) {
  if (!scriptsDir.exists) {
    alert("Directory not found: " + directoryPath);
    return [];
  }
  var files = scriptsDir.getFiles("*.jsx");
  files = files.concat(scriptsDir.getFiles("*.js")); // Include .js files as well
  return files;
}

function buildTitleGroup(titleGroup){
    titleGroup.orientation = "column"; 
    titleGroup.alignChildren = ["left","center"]; 
    titleGroup.spacing = 10; 
    titleGroup.margins = 0; 

    var title = titleGroup.add("statictext", undefined, undefined, {name: "titleText"}); 
    title.text = "The Slop Machine"; 
    title.justify = "center"; 
    title.alignment = ["center","center"]; 

    var buttonRow = titleGroup.add("group", undefined, {name: "buttonRow"}); 
    buttonRow.orientation = "row"; 
    buttonRow.alignChildren = ["left","center"]; 
    buttonRow.spacing = 10; 
    buttonRow.margins = 0; 

    var clearButton = buttonRow.add("button", undefined, undefined, {name: "clearButton"}); 
    clearButton.text = "Clear Scripts"; 

    var loadButton = buttonRow.add("button", undefined, undefined, {name: "loadButton"}); 
    loadButton.text = "Load Script"; 

    clearButton.onClick = clearScripts;
    loadButton.onClick = addScript;

    var divider = titleGroup.add("panel", undefined, undefined, {name: "titleDivider"});
    divider.alignment = "fill";
}

function buildScript(scriptFile, group){
    try {
        $.evalFile(scriptFile);
        return true;
    } catch (e) {
        $.writeln("Error loading/executing script: " + scriptFile.name + "\n" + e);
        return false;
    }
}

function clearScripts(){
    var fileList = scriptsDir.getFiles();

    for(var i = 0; i < fileList.length; i++){
        fileList[i].remove();
    }

    buildWindowContent();
}

function addScript(){
    var originalFile = File.openDialog("Select script to load");

    if(originalFile){
        var copiedFile = new File(scriptsFolder + "/" + originalFile.name);

        if(copiedFile.exists){
            alert("Script already loaded!");
            return;
        }

        if (originalFile.copy(copiedFile)) {
            $.writeln("Script copied successfully to:\n" + copiedFile.path);
            scripts.push(copiedFile);
            buildWindowContent();
        } else {
            alert("Error copying script to:\n" + copiedFile.path);
        }
    } else {
        // The user cancelled the file selection dialog
        $.writeln("File selection cancelled by the user.");
    }
}

function buildWindowContent() {
    if (win) {
        // Destroy existing script sections
        for (var i = win.children.length - 1; i >= 1; i--) { // Keep titleGroup
            win.remove(win.children[i]);
        }

        var scripts = getScriptFiles(scriptsFolder);

        if (scripts.length === 0) {
            var noScriptsText = win.add("statictext", undefined, "No scripts found in:" );
            var pathText = win.add("statictext", undefined, scriptsFolder);
            noScriptsText.alignment = "center";
            pathText.alignment = "center";
        } else {
            for (var i = 0; i < scripts.length; i++) {
                var scriptFile = scripts[i];
                var scriptName = scriptFile.name.replace(/\.(jsx|js)$/i, "");

                var scriptSectionGrp = win.add("group");
                scriptSectionGrp.orientation = "column";
                scriptSectionGrp.alignChildren = ["fill", "top"];
                scriptSectionGrp.spacing = 5;
                scriptSectionGrp.margins = 10;
                scriptSectionGrp.borderStyle = "etched";

                var divider = win.add("panel", undefined, undefined, {name: "divider" + i});
                divider.alignment = "fill";

                buildScript(scriptFile, scriptSectionGrp);
            }
        }

        win.layout.layout(true);
        win.update(); // Force the window to redraw
    }
}

function main() {
    if(!buildScriptsDir()) return;

    win = new Window("palette", windowTitle);
    win.orientation = "column";
    win.alignChildren = ["fill", "top"];

    var titleGroup = win.add("group", undefined, {name: "titleGroup"}); 
    buildTitleGroup(titleGroup);

    buildWindowContent();
    win.layout.layout(true);
    win.show();
}

main();

//PERMISSIONS NEEDED:
//Allow scritps to read and write files