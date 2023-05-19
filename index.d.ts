export{}
declare global{
    interface Window{
        NativeListener?: any;
        fbAsyncInit: () => void;
    }
}