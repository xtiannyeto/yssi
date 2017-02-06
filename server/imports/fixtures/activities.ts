
import { Activities } from '../../../both/collections/activities.collection';
import { Activity } from '../../../both/models/activity.model';

export function loadActivities() {

    if (Activities.find().cursor.count() === 0) {

const activities: Activity[] = [
    {
        id: 1,
        label: "Emploi"
    },
    {
        id: 2,
        label: "Vehicule"
    },
    {
        id: 3,
        label: "Immobilier"
    },
    {
        id: 4,
        label: "Multimedia"
    },
    {
        id: 5,
        label: "Services"
    },
    {
        id: 6,
        label: "Maison"
    },
    {
        id: 7,
        label: "Loisir"
    },
    {
        id: 8,
        label: "Vacances"
    },
    {
        id: 9,
        label: "Pharmarcie"
    },
    {
        id: 10,
        label: "Informatique"
    }
];

 activities.forEach((activity : Activity) => Activities.insert(activity));
    }
}
