export class MenuItem{

    name: string = '';
    icon: string = '';
    route: string = '';
    menuindex: number;


    constructor(name: string, icon: string, route: string, menuindex: number) {
        this.name = name;
        this.icon = icon;
        this.route = route;
        this.menuindex = menuindex;  
    }
}   

