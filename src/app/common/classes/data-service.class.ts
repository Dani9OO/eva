import { plural } from 'pluralize'
import {
  CollectionReference,
  Firestore,
  collection,
  DocumentData,
  DocumentReference,
  setDoc,
  doc,
  collectionData
} from '@angular/fire/firestore'
import { from, map, Observable } from 'rxjs'

export class DataService<T extends { id?: string } = DocumentData> {
  protected collection: CollectionReference<T>
  protected entity: string

  constructor(
    entity: string,
    protected readonly firestore: Firestore
  ) {
    this.entity = `${entity[0].toUpperCase()}${entity.slice(1).toLowerCase()}`
    this.collection = collection(this.firestore, this.path) as CollectionReference<T>
  }

  protected get path(): string {
    return plural(this.entity.toLowerCase())
  }

  public upsert(entity: T): Observable<T> {
    const document = entity.id ? this.doc(this.path, entity.id) : doc(this.collection)
    return from(setDoc(document, entity, { merge: true })).pipe(
      map(() => ({ ...entity, id: document.id }))
    )
  }

  public getAll(): Observable<T[]> {
    return collectionData(this.collection, { idField: 'id' })
  }

  protected doc(path: string, ...pathSegments: string[]): DocumentReference<T> {
    return doc(this.firestore, path, ...pathSegments) as DocumentReference<T>
  }

}
