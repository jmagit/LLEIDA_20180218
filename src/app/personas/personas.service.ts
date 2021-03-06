import { Injectable } from '@angular/core';
import { ModoCRUD } from '../code-base/tipos';
import { NotificationService } from '../app-common/notification.service';
import { RESTDAOService } from '../code-base/dao';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PersonasDaoService extends RESTDAOService<any, any> {
  constructor(http: HttpClient) {
    super(http, 'personas');
  }
}
@Injectable()
export class PersonasViewModelDAOService {
  protected modo: ModoCRUD = 'list';
  protected listado: Array<any> = null;
  protected elemento: any = {};
  protected idOriginal: any = null;
  protected urlList = '/personas';

  constructor(protected notify: NotificationService,
    protected dao: PersonasDaoService, private router: Router) { }

  public get Listado() { return this.listado; }
  public get Modo() { return this.modo; }
  public get Elemento() { return this.elemento; }

  public list() {
    this.dao.query().subscribe(
      data => {
        this.listado = data;
        this.modo = 'list';
      },
      err => this.notify.add(err.message)
    );
  }
  public add() {
    this.elemento = {};
    this.modo = 'add';
  }
  public edit(key: any) {
    this.dao.get(key).subscribe(
      data => {
        this.elemento = data;
        this.idOriginal = key;
        this.modo = 'edit';
      },
      err => this.notify.add(err.message)
    );
  }
  public view(key: any) {
    this.dao.get(key).subscribe(
      data => {
        this.elemento = data;
        this.modo = 'view';
      },
      err => this.notify.add(err.message)
    );
  }
  public delete(key: any) {
    if ( !window.confirm('¿Seguro?')) { return; }
    this.dao.remove(key).subscribe(
      data => this.list(),
      err => this.notify.add(err.message)
    );
  }

  public cancel() {
    this.elemento = {};
    this.idOriginal = null;
    // this.list();
    this.router.navigateByUrl(this.urlList);
  }
  public send() {
    switch (this.modo) {
      case 'add':
        this.dao.add(this.elemento).subscribe(
          data => this.cancel(),
          err => this.notify.add(err.message)
        );
        break;
      case 'edit':
      this.dao.change(this.idOriginal, this.elemento).subscribe(
        data => this.cancel(),
        err => this.notify.add(err.message)
      );
      break;
      case 'view':
        this.cancel();
        break;
    }
  }
}

@Injectable()
export class PersonasViewModelService {
  protected modo: ModoCRUD = 'list';
  protected listado: Array<any> = null;
  protected elemento: any = {};
  protected idOriginal: any = null;
  protected pk = 'id';

  constructor(protected notify: NotificationService) { }

  public get Listado() { return this.listado; }
  public get Modo() { return this.modo; }
  public get Elemento() { return this.elemento; }

  public list() {
    if (this.listado == null) {
      this.listado = [
        {id: 1, nombre: 'Carmelo', apellidos: 'Coton', edad: 34},
        {id: 2, nombre: 'Pepito', apellidos: 'Grillo', edad: 150},
        {id: 3, nombre: 'Pedro', apellidos: 'Pica Piedra', edad: 55},
        {id: 4, nombre: 'Pablo', apellidos: 'Marmol', edad: 49},
      ];
    }
    this.modo = 'list';
  }
  public add() {
    this.elemento = {};
    this.modo = 'add';
  }
  public edit(key: any) {
    // tslint:disable-next-line:triple-equals
    const rslt = this.listado.find(item => item[this.pk] == key );
    if (rslt) {
      this.elemento = Object.assign({}, rslt);
      this.idOriginal = key;
      this.modo = 'edit';
    } else {
      this.notify.add('Elemento no encontrado');
    }
  }
  public view(key: any) {
    // tslint:disable-next-line:triple-equals
    const rslt = this.listado.find(item => item[this.pk] == key );
    if (rslt) {
      this.elemento = Object.assign({}, rslt);
      this.modo = 'view';
    } else {
      this.notify.add('Elemento no encontrado');
    }
  }
  public delete(key: any) {
    if ( !window.confirm('¿Seguro?')) { return; }
    // tslint:disable-next-line:triple-equals
    const indice = this.listado.findIndex(item => item[this.pk] == key );
    if (indice >= 0) {
      this.listado.splice(indice, 1);
      this.list();
    } else {
      this.notify.add('Elemento no encontrado');
    }
  }

  public cancel() {
    this.elemento = {};
    this.idOriginal = null;
    this.list();
  }
  public send() {
    switch (this.modo) {
      case 'add':
        this.listado.push(this.elemento);
        this.cancel();
        break;
      case 'edit':
        const indice = this.listado.findIndex(item => item[this.pk] == this.idOriginal );
        if (indice >= 0) {
          this.listado[indice] = this.elemento;
          this.cancel();
        } else {
          this.notify.add('Elemento no encontrado');
        }
        break;
      case 'view':
        this.cancel();
        break;
    }
  }
}
