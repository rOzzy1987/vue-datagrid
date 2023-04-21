interface IDownloader {
    download(content: string| Blob, fileName: string): Promise<void>;
}

interface IDownloaderImpl extends IDownloader {

}

class WebDownloaderImpl implements IDownloaderImpl {
    public async download(content: string | Blob, fileName: string): Promise<void> {
        const element = document.createElement('a');
        
        const uri = this.getUri(content);
        element.setAttribute('href', uri);
        element.setAttribute('download', fileName);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    private getUri(content: string | Blob) {
        return content.constructor.name == 'Blob'
            ? window.URL.createObjectURL(content as Blob)
            : 'data:text/plain;charset=utf-8,' + encodeURIComponent(content as string);
    }
}

abstract class DownloaderBase {
    private _impl: IDownloaderImpl | null = null;
    protected async getImpl(): Promise<IDownloaderImpl> {
        if (this._impl == null)
            this._impl =  new WebDownloaderImpl()
        return this._impl;
    } 
}
export default class Downloader extends DownloaderBase implements IDownloader {
    public async download(content: string | Blob, fileName: string){
        (await this.getImpl()).download(content, fileName);
    }

}
