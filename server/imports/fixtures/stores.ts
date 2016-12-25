import { Stores } from '../../../both/collections/stores.collection';
import { Store } from '../../../both/models/store.model';
 
export function loadStores() {

  if (Stores.find().cursor.count() === 0) {
    const stores : Store[] = [
         { 
            name: "Wallys Shop"
            , description: "Vente de chaussures pour femmes"
            ,location: {
                name: 'Ngoa ekele'
            },
        }
        ,{
             name: "Mami Nyanga Plus "
             , description: "Beignétariat de tata Rosa"
             ,location: {
                name: 'Mvog Ada'
            }, 
        }
        ,{ 
            name: "Mécano presto"
            , description: "Mécanicien à domicile pour toute vos pannes"
            ,location: {
                name: 'Pont Emana'
            },
        }
        ,{ 
            name: "Coiffure étoile"
            , description: "Coiffeur de Star, a pour client Samuel Eto'O tootot"
            ,location: {
                name: 'Chapelle Obili'
            }, 
        }
    ];
    for (var i = 0; i < 27; i++) {
        Stores.insert({
            name: Fake.sentence(15),
            description: Fake.sentence(50),
            location: {
                name: Fake.sentence(10)
            },
        });
    }
    stores.forEach((store : Store) => Stores.insert(store));
  }
}
