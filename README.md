# v2-timer-component

This is a simple countdown timer – a browser-native web component designed for seamless integration with any framework
or standalone use. Whether you're enhancing a Kanban board with a thirty-minute task timer or adding a customizable
countdown to your project, this component can help. Easily control the timer through buttons or events, adjust its duration, and
personalize its appearance using CSS variables.

<img src="https://github.com/Version2Software/v2-timer-component/blob/main/timer.png" alt="Timer" width="300"/>

## Installation

```bash
npm install v2-timer-component
```

## Usage

```usage
<v2-timer-component></v2-timer-component>
```

## Example

```example
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>V2 Timer Component Example</title>

    <style>
        html, body {
            height: 100%;
        }
        .example {
            --color: white;
            --background-color: red;
            --button-color: white;
            --button-background-color: red;
            --width: 30vw;
            --height: 30vh;
            --border: none;
        }
        v2-timer-component {
            margin: 2rem;
        }
        button {
            margin: 2em;
            font-size: larger;
        }
    </style>
</head>
<body>
<v2-timer-component></v2-timer-component>
<v2-timer-component class="example" duration="15"></v2-timer-component>
<v2-timer-component small></v2-timer-component>

<button onclick="startAllTimers()">Start all timers</button>
<button onclick="stopAllTimers()">Stop all timers</button>

<script type="module">
    import "v2-timer-component"
</script>
<script>
    function startAllTimers() {
        document.dispatchEvent(new Event("v2-timer-start"));
    }
    function stopAllTimers() {
        document.dispatchEvent(new Event("v2-timer-stop"));
    }
</script>
</body>
</html>

```

## Class

```class
V2TimerComponent
```

### CSS Variables

```cssvars
--color: black;
--background-color: white;
--button-color: black;
--button-background-color: white;
--width: 300px;
--height: 180px;
--border: 2px solid #000;
```

### Properties

```props
duration = 30;
small = false;
xsmall = false;
```

### Methods

```methods
startTimer()
stopTimer()
pauseTimer()
resumeTimer()
```

### Dispatches

The component dispatches events to publicize component state changes.

```dispatches
v2-timer-started
v2-timer-stopped
v2-timer-paused
v2-timer-resumed
v2-timer-completed
```

### Listeners

The component registers listeners with the document in order to be controlled by external events.

```listeners
document.addEventListener('v2-timer-start', this.startTimer);
document.addEventListener('v2-timer-stop', this.stopTimer);
document.addEventListener('v2-timer-pause', this.pauseTimer);
document.addEventListener('v2-timer-resume', this.resumeTimer);
```

## License

This project is licensed under the [MIT License](https://github.com/Version2Software/v2-timer-component/blob/main/LICENSE).
