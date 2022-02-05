import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { GlobalErrorDialogComponent } from "src/commons/components/global-error-dialog/global-error-dialog.component";

@Injectable({
    providedIn: 'root',
})
export class ErrorDialogService {
    public isDialogOpen: Boolean = false;
    constructor(public dialog: MatDialog) { }

    openDialog(message: string): void {
        if (this.isDialogOpen) {
            return;
        }
        this.isDialogOpen = true;
        const dialogRef = this.dialog.open(GlobalErrorDialogComponent, {
            width: '600px',
            data: { message: message },
            panelClass: 'my-dialog',
            maxHeight: '80%'
        });

        dialogRef.afterClosed().subscribe(result => {
            this.isDialogOpen = false;
        });
    }
}