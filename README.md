# The Slop Machine for After Effects

A basic ExtendScript-based tool designed to speed up your After Effects workflow (thus, your "slop" production) by providing a quick and accessible user interface for running custom scripts.

## Features

* **Automatic Script Loading:** Automatically loads all `.jsx` and `.js` scripts from a designated directory (`/Documents/SlopScripts` by default).
* **Intuitive UI:** Presents a simple window with a button for each loaded script, allowing for instant execution.
* **"Load Scripts" Button:** Loads up a script and automatically updates the UI, no reload needed.
* **"Clear Scripts" Button:** Removes all the loaded scripts from the UI.

## Installation

1.  **Download the Repository:** Clone or download the contents of this repository to your local machine.
2.  **Locate the `slop_machine.jsx` file.**
3.  **Install as a ScriptUI Panel:** In After Effects, go to `File > Scripts > Install ScriptUI Panel...`.
4.  **Navigate to the downloaded `slop_machine.jsx` file and click "Install".** After Effects may prompt you to restart for the panel to appear in the Window menu.
5.  **Open the panel by going to `Window > slop_machine.jsx.`(at the very bottom)** Although it might sometimes open on its own.
7.  **Place your custom `.jsx` or `.js` scripts inside the `Documents/SlopScripts` directory.**

## Usage

1.  Once the "Slop Machine" panel opens, it will automatically list all the `.jsx` and `.js` scripts found in your `/Documents/SlopScripts` directory.
2.  Click the button next to a script's name to execute that script.
3.  If you add new scripts to the `/Documents/SlopScripts` directory while the "Slop Machine" panel is open, click the **"Load Scripts"** button to refresh the list.
4.  Click the **"Clear Scripts"** button to remove all the dynamically loaded script buttons from the UI. This can be useful for a cleaner interface if you temporarily don't need certain scripts. Clicking "Load Scripts" again will repopulate the list.

## For Script Developers

When writing your own scripts to be used with the Slop Machine, you can easily integrate your UI elements into the dynamically created section for your script.

**Important Note:** Within the scope of your loaded script, a `Group` object named **`group`** will be pre-defined and available for you to directly add your UI elements to. This group is the container for your script's section in the "Slop Machine" panel.

**Example of a custom script (`my_awesome_script.jsx`) for the "Slop Machine":**

```javascript
// 'group' is already defined in this scope

if (group) {
  var myButton = group.add("button", undefined, "produce slop");
  myButton.onClick = function() {
    alert("woe, slop be upon ye");
    // Your script's main functionality here
  };

  var myCheckbox = group.add("checkbox", undefined, "Enable Feature X");
  myCheckbox.value = true;

  var myEditText = group.add("edittext", undefined, "Enter some text");
} else {
  $.writeln("Error: The 'group' object was not found for UI elements.");
}

// You can also define your functions and other logic outside this 'if' block.
```
