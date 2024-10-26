import { Component } from '@angular/core'; 
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.css']
})
export class CrudComponent {
  dropdownOptions: string[] = ['Option 1', 'Option 2', 'Option 3'];
  selectedOption: string = '';
  otherOption: string = '';

  onDropdownInput(event: Event) {
    const inputText = (event.target as HTMLInputElement).value;

    // Check if the typed option is not in the dropdownOptions
    if (this.dropdownOptions.indexOf(inputText) === -1) {
      // Update the dropdownOptions array with the new option
      this.dropdownOptions.push(inputText);
    }
  }

  InventoryArray: any[] = [];
  isResultLoaded = false;
  isUpdateFormActive = false;

  id: string = "";
  productName: string = "";
  productDescription: string = "";
  unitPrice: string = "";
  stockLocation: any = "";
  quantityInStock: any = "";
  vendor: string = "";
  currentInventoryID = "";
  selectedForm: any;
  otherValue: any;

  constructor(private http: HttpClient) {
    this.getAllInventory();
  }

  ngOnInit(): void { }

  getAllInventory() {
    this.http.get("http://localhost:3300/inventory/")
      .subscribe((resultData: any) => {
        this.isResultLoaded = true;
        this.InventoryArray = resultData;
        console.log(resultData);
      });
  }

  register() {
    let bodyData = {
      "Product_Name": this.productName,
      "Product_Description": this.productDescription,
      "Unit_Price": this.unitPrice,
      "Stock_Location": this.stockLocation,
      "Quantity_In_Stock": this.quantityInStock,
      "Vendor": this.vendor
    };

    this.http.post("http://localhost:3300/inventory", bodyData).subscribe((resultData: any) => {
      console.log(resultData);
      this.getAllInventory();
    });
    alert("Inventory Registered Successfully");
  }

  setUpdate(data: any) {
    this.id = data.Id;
    this.productName = data['Product Name']; // Match backend field names
    this.productDescription = data['Product Description'];
    this.unitPrice = data['Unit Price'];
    this.stockLocation = data['Stock Location'];
    this.quantityInStock = data['Quantity In Stock'];
    this.vendor = data['Vendor'];

    this.currentInventoryID = data.Id; // Store the current inventory ID for updates
  }

  UpdateRecords() {
    let bodyData = {
      "Product_Name": this.productName,
      "Product_Description": this.productDescription,
      "Unit_Price": this.unitPrice,
      "Stock_Location": this.stockLocation,
      "Quantity_In_Stock": this.quantityInStock,
      "Vendor": this.vendor
    };

    this.http.put("http://localhost:3300/inventory/" + this.currentInventoryID, bodyData).subscribe((resultData: any) => {
      console.log(resultData);
      this.getAllInventory();
    });
    alert("Inventory Updated Successfully");
    this.clear() ;
  }

  onStockLocationChange(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    if (selectedValue) {
      this.stockLocation = selectedValue; // Update the stockLocation with the selected option
    }
  }

  save() {
    if (this.currentInventoryID === '') {
      window.location.reload();
      this.register(); // If no current ID, register a new entry
    } else {
      window.location.reload();
      this.UpdateRecords(); // If there is an ID, update the existing entry
    }
  }

  setDelete(data: any) {
    alert("Inventory Deleted");

    window.location.reload();
    this.http.delete("http://localhost:3300/inventory/" + data.Id).subscribe((resultData: any) => {
      console.log(resultData);
      this.getAllInventory();
    });
  }

  clear() {
    this.id = "";
    this.productName = "";
    this.productDescription = "";
    this.unitPrice = "";
    this.stockLocation = "";
    this.quantityInStock = "";
    this.vendor = "";
  }
}