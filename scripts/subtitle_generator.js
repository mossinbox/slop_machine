(function () {
    function parseSRT(srtContent) {
        var pattern = /(\d+)\n(\d{2}):(\d{2}):(\d{2}),(\d{3}) --> (\d{2}):(\d{2}):(\d{2}),(\d{3})\n([\s\S]*?)(?=\n{2,}|\n*$)/g;
        var match;
        var result = [];

        while ((match = pattern.exec(srtContent)) !== null) {
            var startTime =
                parseInt(match[2]) * 3600 +
                parseInt(match[3]) * 60 +
                parseInt(match[4]) +
                parseInt(match[5]) / 1000;

            var endTime =
                parseInt(match[6]) * 3600 +
                parseInt(match[7]) * 60 +
                parseInt(match[8]) +
                parseInt(match[9]) / 1000;

            endTime = Math.ceil(endTime * 100 + 100) / 100;

            var text = match[10].replace(/\n/g, " ").trim();

            result.push({
                text: text,
                start: Math.round(startTime * 1000) / 1000,
                end: endTime
            });
        }

        return result;
    }

    var selected;


    function selectSRTFile() {
        var file = File.openDialog("Select an SRT file", "*.srt");
        if (!file) {
            alert("No file selected.");
            return null;
        }

        if (!file.open("r")) {
            alert("Error opening the file.");
            return null;
        }

        selected = file.read();
        var name = file.name;
        file.close();

        return name;
    }

    function applySubtitles() {
        var comp = app.project.activeItem;

        if (!(comp && comp instanceof CompItem)) {
            alert("Please select an active composition.");
            return;
        }

        if (comp.numLayers < 1 || !(comp.layer(1) instanceof TextLayer)) {
            alert("Please ensure the first layer is a text layer to use as a reference.");
            return;
        }

        var templateLayer = comp.layer(1);

        if (!selected) return;
        var subtitles = parseSRT(selected);

        app.beginUndoGroup("Create and Apply SRT Subtitles");

        for (var i = 0; i < subtitles.length; i++) {
            var subtitle = subtitles[i];
            var newLayer;

            if (i === 0) {
                // Use the original reference layer
                newLayer = templateLayer;
            } else {
                // Duplicate the template for all others
                newLayer = templateLayer.duplicate();
            }

            newLayer.property("ADBE Text Properties").property("ADBE Text Document").setValue(subtitle.text);

            newLayer.startTime = subtitle.start;
            newLayer.outPoint = subtitle.start + 2.0;
        }

        app.endUndoGroup();
    }

    // ========================
    // Script Loader UI Check
    // ========================
    if (typeof group !== "undefined") {

        var fileText = group.add("statictext", undefined, "No Image Selected!");
        fileText.alignment = "center";

        var loadSRTButton = group.add("button", undefined, "Load SRT File");
        loadSRTButton.onClick = function () {
            fileText.text = selectSRTFile();
        };

        var applyButton = group.add("button", undefined, "Apply SRT Subtitles");
        applyButton.onClick = applySubtitles;
        group.layout.layout(true);
    }
})();
