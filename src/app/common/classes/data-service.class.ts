import { plural } from 'pluralize';
import { CollectionReference, Firestore, collection, DocumentData, DocumentSnapshot, DocumentReference, setDoc, query, doc } from '@angular/fire/firestore';
import { from, map, throwError } from 'rxjs';
import { NotFoundError } from '../errors/not-found.error';
import { getDocs } from 'firebase/firestore';

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

  public async upsert(entity: T) {
    const document = entity.id ? this.doc(this.path, entity.id) : doc(this.collection)
    await setDoc(document, entity, { merge: true })
    return { ...entity, id: document.id }
  }

  public async getAll() {
    return (await getDocs<T>(query<T>(this.collection))).docs.map(d => ({ id: d.id , ...d.data() }))
  }

  protected fromDocument(input: Promise<DocumentSnapshot<T>>, identifier?: string, value?: string) {
    return from(input).pipe(
      map(data => {
        if (data.exists()) return { id: data.id, ...data.data() }
        else throw throwError(() => new NotFoundError(this.entity, identifier, value))
      })
    )
  }

  protected doc(path: string, ...pathSegments: string[]) {
    return doc(this.firestore, path, ...pathSegments) as DocumentReference<T>
  }

  protected get path(): string {
    return plural(this.entity.toLowerCase())
  }

}
