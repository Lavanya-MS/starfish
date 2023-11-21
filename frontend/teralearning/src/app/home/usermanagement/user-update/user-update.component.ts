import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClearFormDialogComponent } from 'src/app/dialogBoxs/clear-form-dialog/clear-form-dialog.component';
import { SuccessDialogComponent } from 'src/app/dialogBoxs/success-dialog/success-dialog.component';
import { StreamService } from 'src/app/service/stream.service';
import { UserService } from 'src/app/service/user.service';
import { Stream } from 'src/model/stream.model';
import { AccountStatus, UserTypeEnum, user } from 'src/model/user.model';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.scss']
})
export class UserUpdateComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: user, private dialog: MatDialog, private streamService:StreamService,private dialogRef: MatDialogRef<UserUpdateComponent>, private snackBar: MatSnackBar, private formBuilder: FormBuilder, private userService: UserService) { }
  userForm!: FormGroup;
  public readonly userTypes = UserTypeEnum;
  public readonly userStatus = AccountStatus;
  submitted: boolean = false;
  @Input() updateData!: any;
  streamList: Stream[] = [];

  ngOnInit(): void {
    this.BuildForm();
    this.getAllStreams();
  }

  BuildForm() {
    this.userForm = this.formBuilder.group({
      firstName: [this.data?.firstName, [Validators.required, Validators.pattern('^([^0-9]*)$')]],
      lastName: [this.data?.lastName, [Validators.required, Validators.pattern('^([^0-9]*)$')]],
      stream: [this.data.stream?.streamName, [Validators.required]],
      phoneNumber: [this.data?.phoneNumber, [Validators.required, Validators.pattern(/^\+\d{12}$/)]],
      userStatus: [this.data?.userStatus, [Validators.required]],
      userType: [this.data?.userType, [Validators.required]]

    })
  }
  
  
  updateUser() {
    this.submitted = true;
    this.data.stream.streamName = this.userForm.get('stream')?.value
    if (this.userForm.invalid) {
      return;
    }

    let userData: user = {
      id: this.data.id,
      firstName: this.userForm.get('firstName')?.value,
      lastName: this.userForm.get('lastName')?.value,
      userStatus: this.userForm.get('userStatus')?.value,
      userType: this.userForm.get('userType')?.value,
      modifiedDate: this.data.modifiedDate,
      email: this.data.email,
      phoneNumber: this.userForm.get('phoneNumber')?.value,
      category: this.data.category,
      stream: this.data.stream,
      password: this.data.password,
      createdDate: this.data.createdDate

    }
    console.log("userData" + JSON.stringify(userData))
    console.log("data" + JSON.stringify(this.data));
    if (userData != this.data) {
      this.userService.updateUser(userData).subscribe(data => {
        this.dialogRef.close();

        this.dialog.open(SuccessDialogComponent, {
          data: "Successfully updated !"

        })
        // this.userForm.reset()

      }, err => {
        this.snackBar.open(err.error.text, '', { duration: 3000 })
        console.log(err)
      })
      if (this.userForm.get('userStatus')?.value == 102) {
        console.log('User Suspended');
        this.userService.deleteUser(userData.id).subscribe(data =>
          console.log(data), err => {
            console.log(err)
          });
      }
    } else {
      this.snackBar.open("No changes!", '', { duration: 3000 });
    }

    console.log("Updated value", this.userForm.value)

  }

  getPreviousValue() {
    this.BuildForm();

  }

  getAllStreams() {
    this.streamService.getStreamList().subscribe(data => {
      this.streamList = data;
    })
  }

  cancelDetails() {
    const dialogRef = this.dialog.open(ClearFormDialogComponent)
      .afterClosed().subscribe(data => {
        if (data.shouldClearForm) {
          this.getPreviousValue();
        }
      });
  }
}
