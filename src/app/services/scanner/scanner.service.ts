import { Injectable } from '@angular/core'
import { BarcodeScanner } from '@capacitor-community/barcode-scanner'
import { BehaviorSubject, Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ScannerService {
  public scanning$: Observable<boolean>
  private _scanning: BehaviorSubject<boolean>

  public constructor() {
    this._scanning = new BehaviorSubject(false)
    this.scanning$ = this._scanning.asObservable()
  }

  public async scan(): Promise<string> {
    this._scanning.next(true)
    await BarcodeScanner.checkPermission({ force: true })
    document.querySelector('body').classList.add('scanner-active')
    BarcodeScanner.hideBackground()
    const result = await BarcodeScanner.startScan()
    this._scanning.next(false)
    document.querySelector('body').classList.remove('scanner-active')
    if (!result.hasContent) return
    return result.content
  }

  public async stopScanning(): Promise<void> {
    await BarcodeScanner.stopScan()
    this._scanning.next(false)
    document.querySelector('body').classList.remove('scanner-active')
  }
}
