import { Stores } from '../../../both/collections/stores.collection';
import { Store } from '../../../both/models/store.model';
 
export function loadStores() {

  if (Stores.find().cursor.count() === 0) {
    const stores : Store[] = [
         { 
            name: "Wallys Shop"
            , description: "Vente de chaussures pour femmes"
            ,activities: []
            ,images: []
            ,location: {
                name: 'Ngoa ekele',
                address:'',
                lat: Math.floor(Math.random() * 16) + 5,
                lng: Math.floor(Math.random() * 16) + 5
            },
        }
        ,{
             name: "Mami Nyanga Plus "
             , description: "Beignétariat de tata Rosa"
             ,activities: []
            ,images: []
             ,location: {
                name: 'Mvog Ada',
                address:'',
                lat: Math.floor(Math.random() * 16) + 5,
                lng: Math.floor(Math.random() * 16) + 5
            }, 
        }
        ,{ 
            name: "Mécano presto"
            , description: "Mécanicien à domicile pour toute vos pannes"
            ,activities: []
            ,images: []
            ,location: {
                name: 'Pont Emana',
                address:'',
                lat: Math.floor(Math.random() * 16) + 5,
                lng: Math.floor(Math.random() * 16) + 5
            },
        }
        ,{ 
            name: "Coiffure étoile"
            , description: "Coiffeur de Star, a pour client Samuel Eto'O tootot"
            ,activities: []
            ,images: []
            ,location: {
                name: 'Chapelle Obili',
                address:'',
                lat: Math.floor(Math.random() * 16) + 5,
                lng: Math.floor(Math.random() * 16) + 5
            }, 
        }
    ];
    for (var i = 0; i < 27; i++) {
        Stores.insert({
            name: Fake.sentence(8),
            description: Fake.sentence(15),
            activities: [],
            images: [],
            location: {
                name: Fake.sentence(5),
                address: Fake.sentence(10),
                lat: Math.floor(Math.random() * 16) + 5,
                lng: Math.floor(Math.random() * 16) + 5
            },
        });
    }
    stores.forEach((store : Store) => Stores.insert(store));
  }
}
