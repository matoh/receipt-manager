import { Component, OnInit } from '@angular/core';
import { Receipt } from '../../classes/receipt';
import { ReceiptStorageService } from '../../services/receipt-storage/receipt-storage.service';
import { FileStorageService } from '../../services/file-storage/file-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-receipt-form',
  templateUrl: './receipt-form.component.html',
  styleUrls: ['./receipt-form.component.css']
})
export class ReceiptFormComponent implements OnInit {

  receipt: Receipt;
  selectedFiles: FileList;

  constructor(
    private receiptStorageService: ReceiptStorageService,
    private fileStorageService: FileStorageService,
    private router: Router
  ) {
    fileStorageService.fileWasStored.subscribe(fileObject => this.updateReceiptFiles(fileObject));
  }

  ngOnInit() {
    const actualDate = new Date;
    this.receipt = new Receipt('', 'xxx', 'fff', actualDate, actualDate, []);
  }

  onSubmit() {
    const receiptKey = this.receiptStorageService.store(this.receipt);
    this.receiptStorageService.attachReceiptId(receiptKey);

    // // Using a juggling-check(==), you can test both null and undefined in one hit:
    if (this.selectedFiles != null) {
      this.fileStorageService.storeFiles(receiptKey, this.selectedFiles);
    } else {
      // Redirect to receipt list
      this.router.navigate(['list']);
    }
  }

  // TODO: Use interface to define object
  updateReceiptFiles(fileObject: any) {
    const receiptKey = fileObject.receiptKey;
    delete fileObject.receiptKey;

    this.receipt.files.push(fileObject);
    // All files were already uploaded to file storage,
    // if yes then attach files to the already created receipt
    // if (this.receipt.files != null && this.selectedFiles.length === this.receipt.files.length) {
    if (typeof this.receipt.files !== 'undefined' && this.selectedFiles.length === this.receipt.files.length) {
      this.receiptStorageService.updateFiles(receiptKey, this.receipt.files);

      // Redirect to receipt list
      this.router.navigate(['list']);
    }
  }
}
