// frontend/src/wails.d.ts

interface WailsApp {
    SaveAsset(amount: number): Promise<void>;
    FetchLatestAsset(): Promise<number>;
}

interface Window {
    app: WailsApp;
}
