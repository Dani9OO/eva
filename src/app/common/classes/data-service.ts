import { plural } from 'pluralize'
import {
  CollectionReference,
  Firestore,
  collection,
  DocumentData,
  DocumentReference,
  setDoc,
  doc,
  writeBatch,
  getDocs,
  deleteDoc,
  getDoc
} from '@angular/fire/firestore'
import { from, map, Observable } from 'rxjs'
import { take } from 'rxjs/operators'
export class DataService<T extends { id?: string } = DocumentData> {
  protected collection: CollectionReference<T>
  protected entity: string

  public constructor(
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
    const e = { ...entity }
    if (e.id === undefined) delete e.id
    const document = entity.id ? this.doc(this.path, entity.id) : doc(this.collection)
    return from(setDoc(document, e, { merge: true })).pipe(
      map(() => ({ ...entity, id: document.id }))
    )
  }

  public upsertMany(entities: T[]): Observable<T[]> {
    const batch = writeBatch(this.firestore)
    const result: T[] = []
    entities.forEach(entity => {
      const document = entity.id ? this.doc(this.path, entity.id) : doc(this.collection)
      batch.set(document, entity, { merge: true })
      result.push({ id: document.id, ...entity })
    })
    return from(batch.commit()).pipe(map(() => result))
  }

  public getAll(): Observable<T[]> {
    return from(getDocs(this.collection)).pipe(
      take(1),
      map(result => result.docs.map(document => ({ id: document.id, ...document.data() })))
    )
  }

  public findById(id: string): Observable<T> {
    return from(getDoc(this.doc(this.path, id))).pipe(
      take(1),
      map(result => ({ ...result.data(), id }))
    )
  }

  public delete(entity: T): void {
    deleteDoc(this.doc(this.path, entity.id))
  }

  protected doc(path: string, ...pathSegments: string[]): DocumentReference<T> {
    return doc(this.firestore, path, ...pathSegments) as DocumentReference<T>
  }
}
