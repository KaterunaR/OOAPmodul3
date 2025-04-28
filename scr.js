class Device {
    constructor(name) {
        this.name = name;
        this.state = false; 
    }

    switchOn() {
        this.state = true;
        console.log(`${this.name} увімкнено.`);
    }

    switchOff() {
        this.state = false;
        console.log(`${this.name} вимкнено.`);
    }

    getState() {
        return this.state ? "увімкнено" : "вимкнено";
    }
}

class Command {
    execute() {}
    undo() {}
}

class SwitchOnCommand extends Command {
    constructor(device) {
        super();
        this.device = device;
    }

    execute() {
        this.device.switchOn();
    }

    undo() {
        this.device.switchOff();
    }
}

class SwitchOffCommand extends Command {
    constructor(device) {
        super();
        this.device = device;
    }

    execute() {
        this.device.switchOff();
    }

    undo() {
        this.device.switchOn();
    }
}

class CommandManager {
    constructor() {
        this.history = [];
    }

    executeCommand(command) {
        command.execute();
        this.history.push(command);
        this.updateHistoryOutput();
    }

    undoLastCommand() {
        const lastCommand = this.history.pop();
        if (lastCommand) {
            lastCommand.undo();
            this.updateHistoryOutput();
        } else {
            console.log("Немає команд для скасування.");
        }
    }

    updateHistoryOutput() {
        const output = this.history.map((command) => `${command.device.name} - ${command.device.getState()}`).join("\n");
        document.getElementById('historyOutput').textContent = output;
    }
}

const manager = new CommandManager();

document.getElementById('addRowButton').addEventListener('click', () => {
    const table = document.getElementById('scheduleTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
    newRow.innerHTML = `
        <td><input type="text" placeholder="Назва пристрою" /></td>
        <td>
            <select>
                <option value="true">Увімкнено</option>
                <option value="false">Вимкнено</option>
            </select>
        </td>
        <td><input type="time" /></td>
    `;
});

document.getElementById('executeScheduleButton').addEventListener('click', () => {
    const rows = document.getElementById('scheduleTable').getElementsByTagName('tbody')[0].rows;
    for (let row of rows) {
        const deviceName = row.cells[0].children[0].value;
        const state = row.cells[1].children[0].value;
        const device = new Device(deviceName);
        const command = state === 'true' ? new SwitchOnCommand(device) : new SwitchOffCommand(device);
        manager.executeCommand(command);
    }
});

document.getElementById('undoButton').addEventListener('click', () => {
    manager.undoLastCommand();
});