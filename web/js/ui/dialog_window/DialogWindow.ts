import {BrowserWindow} from "electron";

const BROWSER_WINDOW_OPTIONS = {
    backgroundColor: '#FFF',
    width: 800,
    height: 600,
    webPreferences: {
        webSecurity: false,
        nodeIntegration: true,
        defaultEncoding: 'UTF-8'
    }
};

/**
 * @MainContext
 */
export class DialogWindow {

    public readonly window: BrowserWindow;

    constructor(window: BrowserWindow) {
        this.window = window;
    }

    show(): void {
        this.window.show();
    }

    hide(): void {
        this.window.hide();
    }

    destroy(): void {
        this.hide();
        this.window.destroy();
    }

    static create(options: DialogWindowOptions): Promise<DialogWindow> {

        let browserWindowOptions = Object.assign({}, BROWSER_WINDOW_OPTIONS);

        // browserWindowOptions.width = options.width;
        // browserWindowOptions.height = options.height;

        // Create the browser window.
        let window = new BrowserWindow(browserWindowOptions);
        window.setMenu(null);

        window.webContents.on('new-window', (e) => {
            e.preventDefault();
        });

        window.webContents.on('will-navigate', (e) => {
            e.preventDefault();
        });

        window.on('close', (e) => {
            e.preventDefault();
            window.hide();
        });

        switch (options.resource.type) {
            case ResourceType.FILE:
                window.loadFile(options.resource.value);
                break;
            case ResourceType.URL:
                window.loadURL(options.resource.value, {});
                break;
        }

        return new Promise<DialogWindow>(resolve => {
            window.once('ready-to-show', () => {
                let dialogWindow = new DialogWindow(window);
                resolve(dialogWindow);
            });

        })

    }

}

export enum ResourceType {
    FILE,
    URL
}

export class Resource {

    public readonly type: ResourceType;
    public readonly value: string;

    constructor(type: ResourceType, value: string) {
        this.type = type;
        this.value = value;
    }

}

export class DialogWindowOptions {

    public readonly resource: Resource;

    public readonly width: number = 800;

    public readonly height: number = 600;

    constructor(resource: Resource, width?: number, height?: number) {
        this.resource = resource;

        if(width)
            this.width = width;

        if(height)
            this.height = height;

    }

}
