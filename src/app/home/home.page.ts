import { Component, ViewChild } from '@angular/core';
import { ToastController, Platform, IonList } from '@ionic/angular';
import { StorageService, Item } from '../services/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  items: Item[] = [];
  newItem: Item = <Item>{};

  @ViewChild('mylist') mylist: IonList;

  constructor(private storageService: StorageService, private plt: Platform, private toastController: ToastController) {

    this.plt.ready().then(() => {
      this.loadItems();
    });
  }

  addItem() {
    this.newItem.modified = Date.now();
    this.newItem.id = Date.now();
    this.storageService.addItem(this.newItem).then(item => {
      this.newItem = <item>{};
      this.showToast('Item added!');
      this.loadItems();
    });
  }

  loadItems() {
    this.storageService.getItems().then(items => {
      this.items = items;
    });
  }

  updateItems(item: Item) {
    item.title = `UPDATED: ${item.title}`;
    item.modified = Date.now();

    this.storageService.updateItem(item).then(item => {
      this.showToast('Item updated');
      this.mylist.closeSlidingItems();
      this.loadItems();
    });

  }
 
  deleteItems(item: Item) {
    this.storageService.deleteItem(item.id).then(item => {
      this.showToast('Item removed');
      this.mylist.closeSlidingItems();
      this.loadItems();
    });
  }

  async showToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1000,
      position: 'middle',
    });
    toast.present();
  }

}
