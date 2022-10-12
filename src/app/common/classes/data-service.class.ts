import { plural } from 'pluralize';
import { CollectionReference, Firestore, collection, doc, DocumentData, DocumentSnapshot, DocumentReference } from '@angular/fire/firestore';
import { from, map, throwError } from 'rxjs';
import { NotFoundError } from '../errors/not-found.error';

export class DataService<T = DocumentData> {
  protected collection: CollectionReference
  protected entity: string

  constructor(
    entity: string,
    protected readonly firestore: Firestore
  ) {
    this.entity = `${entity[0].toUpperCase()}${entity.slice(1).toLowerCase()}`
    this.collection = collection(this.firestore, this.path)
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
