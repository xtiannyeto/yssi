import { Stores } from '../../../both/collections/stores.collection';
import { Store } from '../../../both/models/store.model';

export function loadStores() {

    Stores.collection._ensureIndex({'location.coords': '2dsphere'});
    if (Stores.find().cursor.count() === 0) {
        const stores: Store[] = [
            {
                name: "Wallys Shop"
                , description: "Vente de chaussures pour femmes"
                , activities: []
                , createDate: new Date()
                , images: []
                , location: {
                    name: 'Ngoa ekele',
                    address: '',
                    coords: {
                        type: 'Point',
                        coordinates: [Math.floor(Math.random() * 16) + 5, Math.floor(Math.random() * 16) + 5]
                    }
                },
            }
            , {
                name: "Mami Nyanga Plus "
                , description: "Beignétariat de tata Rosa"
                , activities: []
                , createDate: new Date()
                , images: []
                , location: {
                    name: 'Mvog Ada',
                    address: '',
                    coords: {
                        type: 'Point',
                        coordinates: [Math.floor(Math.random() * 16) + 5, Math.floor(Math.random() * 16) + 5]
                    }
                },
            }
            , {
                name: "Mécano presto"
                , description: "Mécanicien à domicile pour toute vos pannes"
                , activities: []
                , createDate: new Date()
                , images: []
                , location: {
                    name: 'Pont Emana',
                    address: '',
                    coords: {
                        type: 'Point',
                        coordinates: [Math.floor(Math.random() * 16) + 5, Math.floor(Math.random() * 16) + 5]
                    }
                },
            }
            , {
                name: "Coiffure étoile"
                , description: "Coiffeur de Star, a pour client Samuel Eto'O tootot"
                , createDate: new Date()
                , activities: []
                , images: []
                , location: {
                    name: 'Chapelle Obili',
                    address: '',
                    coords: {
                        type: 'Point',
                        coordinates: [Math.floor(Math.random() * 16) + 5, Math.floor(Math.random() * 16) + 5]
                    }
                },
            }
        ];
        for (var i = 0; i < 27; i++) {
            Stores.insert({
                name: Fake.sentence(8),
                description: Fake.sentence(15),
                activities: [],
                createDate: new Date(),
                images: [],
                location: {
                    name: Fake.sentence(5),
                    address: Fake.sentence(10),
                    coords: {
                        type: 'Point',
                        coordinates: [Math.floor(Math.random() * 16) + 5, Math.floor(Math.random() * 16) + 5]
                    }
                },
            });
        }
        stores.forEach((store: Store) => Stores.insert(store));
    }
}
